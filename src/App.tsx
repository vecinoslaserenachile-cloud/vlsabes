/**
 * VLS TV: ¿Quién quiere estar informado? - Edición Regional 2026
 * 
 * Este proyecto utiliza el arnés de Antigravity para la gestión blindada de APIs.
 * Todas las conexiones a Google Gemini y Firebase están protegidas y gestionadas
 * por el entorno de ejecución seguro de Google AI Studio Build.
 * 
 * Diseñado para: Mobile, PC y Smart TV (16:9).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Users, 
  HelpCircle, 
  RefreshCw, 
  Trophy, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  Plane, 
  Medal, 
  Clock, 
  Award, 
  Mic, 
  Camera,
  Music,
  Map,
  MapPin,
  Flag,
  Globe,
  Play,
  CheckCircle2,
  Lock,
  ChevronRight,
  Coins
} from 'lucide-react';
import { STAGES, PRIZES, Stage } from './constants';
import { soundService } from './services/soundService';
import confetti from 'canvas-confetti';
import { auth, db, onAuthStateChanged, FirebaseUser, handleFirestoreError, OperationType } from './firebase';
import { doc, setDoc, getDoc, collection, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { speakText } from './services/geminiService';
import { VoiceContestant } from './components/VoiceContestant';
import { GameSidebar } from './components/GameSidebar';

type GameState = 'start' | 'playing' | 'lifeline_phone' | 'lifeline_audience' | 'game_over' | 'won' | 'map' | 'leaderboard';

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL: string;
  totalPoints: number;
  totalTimeSeconds: number;
  levelsCount: number;
  rank?: number;
  isGap?: boolean;
}

const generateSimulatedLeaderboard = (userPoints: number, userTime: number, user: FirebaseUser | null): LeaderboardEntry[] => {
  const entries: LeaderboardEntry[] = [];
  
  const names = [
    "Juan Pérez", "María Silva", "Carlos Rojas", "Ana Muñoz", "Pedro Soto", 
    "Laura Díaz", "Diego Castro", "Camila Vega", "Luis Morales", "Valentina Reyes",
    "Javier Flores", "Sofía Herrera", "Andrés Tapia", "Isabella Fuentes", "Matias Cortés"
  ];
  
  const getSimulatedPlayer = (rank: number, points: number, time: number): LeaderboardEntry => ({
    userId: `sim_${rank}`,
    displayName: names[rank % names.length] + (rank > names.length ? ` ${rank}` : ''),
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=sim_${rank}`,
    totalPoints: points,
    totalTimeSeconds: time,
    levelsCount: points,
    rank: rank
  });

  // Calculate user rank
  let userRank = 1;
  if (userPoints >= 32) {
    userRank = Math.max(1, Math.min(10, Math.floor(userTime / 60))); 
  } else if (userPoints === 0) {
    userRank = 1500 + Math.floor(userTime / 10);
  } else {
    userRank = Math.floor(1500 - (userPoints * 47.5)) + Math.floor(userTime / 20);
  }
  
  if (userRank < 1) userRank = 1;

  const userEntry: LeaderboardEntry = {
    userId: user?.uid || 'user_anon',
    displayName: user?.displayName || 'Tú',
    photoURL: user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=user`,
    totalPoints: userPoints,
    totalTimeSeconds: userTime,
    levelsCount: userPoints,
    rank: userRank
  };

  // Top 3 players
  entries.push(userRank === 1 ? userEntry : getSimulatedPlayer(1, 32, 120));
  entries.push(userRank === 2 ? userEntry : getSimulatedPlayer(2, 32, 145));
  entries.push(userRank === 3 ? userEntry : getSimulatedPlayer(3, 32, 160));

  if (userRank <= 3) {
    for (let i = 4; i <= 10; i++) {
      entries.push(getSimulatedPlayer(i, 32 - Math.floor(i/5), 150 + i * 15));
    }
  } else {
    // User is not in top 3
    for (let i = 4; i <= 5; i++) {
      entries.push(getSimulatedPlayer(i, 32 - Math.floor(i/5), 150 + i * 15));
    }

    if (userRank > 7) {
      entries.push({
        userId: 'gap_1',
        displayName: '...',
        photoURL: '',
        totalPoints: 0,
        totalTimeSeconds: 0,
        levelsCount: 0,
        rank: -1,
        isGap: true
      });
    }

    const startRank = Math.max(6, userRank - 2);
    const endRank = userRank + 2;

    for (let r = startRank; r <= endRank; r++) {
      if (r === userRank) {
        entries.push(userEntry);
      } else {
        let simPoints = userPoints;
        if (r < userRank) simPoints = Math.min(32, userPoints + (userRank - r > 10 ? 1 : 0));
        if (r > userRank) simPoints = Math.max(0, userPoints - (r - userRank > 10 ? 1 : 0));
        
        let simTime = userTime + (r - userRank) * 15;
        if (simTime < 0) simTime = 10;

        entries.push(getSimulatedPlayer(r, simPoints, simTime));
      }
    }
  }

  return entries;
};

interface SavedGame {
  stageId: number;
  currentQuestionIndex: number;
  lifelines: {
    fiftyFifty: boolean;
    phone: boolean;
    audience: boolean;
    change: boolean;
  };
}

const SAVE_KEY = 'vls_game_progress_v2026_final';
const COMPLETED_STAGES_KEY = 'vls_completed_stages_v2026_final';

const FaroIcon = ({ size = 120, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Top lantern part */}
    <path d="M10 2h4v3h-4z" />
    {/* Square Tower */}
    <path d="M9 5h6v13H9z" />
    {/* Fortified Base */}
    <path d="M4 18h16v4H4z" />
    {/* Corner Turrets */}
    <path d="M4 15h3v3H4zM17 15h3v3h-3z" />
    {/* Windows */}
    <path d="M11 8h2M11 12h2" />
  </svg>
);

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentStageId, setCurrentStageId] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    phone: true,
    audience: true,
    change: true
  });
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [lifelineResult, setLifelineResult] = useState<string | null>(null);
  const [audienceData, setAudienceData] = useState<number[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isAnthemPlaying, setIsAnthemPlaying] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [completedStageIds, setCompletedStageIds] = useState<number[]>([]);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [timer, setTimer] = useState(60);
  const [questionImage, setQuestionImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [mapCategory, setMapCategory] = useState<'region' | 'chile' | 'world'>('region');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentStage = STAGES.find(s => s.id === currentStageId) || STAGES[0];
  const currentQuestions = currentStage.questions;
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (gameState === 'playing' && !isAnswered && !showExplanation && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && gameState === 'playing' && !showExplanation) {
      if (!isMuted) soundService.playWrong();
      setIsCorrectAnswer(false);
      setShowExplanation(true);
    }
    return () => clearInterval(interval);
  }, [gameState, isAnswered, timer, isMuted, showExplanation]);

  // Image generation effect
  useEffect(() => {
    const generateImage = async () => {
      if (gameState === 'playing' && currentQuestion && !isAnswered) {
        setIsGeneratingImage(true);
        try {
          // Combine the answer and question to ensure specific subjects (like jarro pato or adorno labial) are drawn in context
          const cleanQ = currentQuestion.text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ ,.-]/g, '').substring(0, 100);
          const cleanA = currentQuestion.options[currentQuestion.correctIndex].replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ ,.-]/g, '').substring(0, 50);
          const prompt = `Ilustracion artistica de ${cleanA} en el contexto de ${cleanQ} en Coquimbo Chile. Estilo cartoon 3D, sin texto.`;
          
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
            config: {
              imageConfig: {
                aspectRatio: "16:9",
              }
            }
          });

          let imageUrl = '';
          for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              const base64EncodeString = part.inlineData.data;
              imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${base64EncodeString}`;
              break;
            }
          }

          if (imageUrl) {
            setQuestionImage(imageUrl);
          } else {
            const seed = Math.floor(Math.random() * 1000000);
            setQuestionImage(`https://picsum.photos/seed/${seed}/1024/576?blur=2`);
          }
          setIsGeneratingImage(false);
        } catch (error: any) {
          console.error("Error generating image with Gemini:", error);
          const seed = Math.floor(Math.random() * 1000000);
          setQuestionImage(`https://picsum.photos/seed/${seed}/1024/576?blur=2`);
          setIsGeneratingImage(false);
        }
      }
    };

    if (gameState === 'playing' && currentQuestion) {
      setQuestionImage(null); // Reset image for new question
      generateImage();
    }
  }, [currentQuestion, gameState]);

  // Check for saved game and wins on mount
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) setHasSavedGame(true);
    
    const completed = localStorage.getItem(COMPLETED_STAGES_KEY);
    if (completed) {
      setCompletedStageIds(JSON.parse(completed));
    }

    // Attempt to auto-play anthem on load
    const playInitialAnthem = async () => {
      if (!isMuted) {
        try {
          await soundService.playAnthem();
          setIsAnthemPlaying(true);
        } catch (e) {
          console.log("Autoplay blocked or failed");
        }
      }
    };
    playInitialAnthem();

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Update simulated leaderboard when score changes
  useEffect(() => {
    const simulated = generateSimulatedLeaderboard(completedStageIds.length, totalTimeSeconds, currentUser);
    setLeaderboard(simulated);
  }, [completedStageIds.length, totalTimeSeconds, currentUser]);

  // Save progress whenever it changes
  useEffect(() => {
    if (gameState === 'playing') {
      const progress: SavedGame = {
        stageId: currentStageId,
        currentQuestionIndex,
        lifelines
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
    }
  }, [currentQuestionIndex, lifelines, gameState, currentStageId]);

  useEffect(() => {
    if (gameState === 'playing' && !isMuted) {
      soundService.playSuspense();
      soundService.playBackgroundMusic();
    } else {
      soundService.stopSuspense();
      soundService.stopBackgroundMusic();
    }
  }, [gameState, isMuted]);

  useEffect(() => {
    if (gameState === 'playing' && isVoiceMode && currentQuestion && !isAnswered) {
      if (currentAudio) {
        currentAudio.pause();
      }
      speakText(currentQuestion.text).then(audio => {
        if (audio) setCurrentAudio(audio);
      });
    }
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentQuestion, gameState, isVoiceMode]);

  const triggerFireworks = useCallback(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  const startGame = (continueGame = false, stageId?: number) => {
    if (!isMuted) soundService.playJump();
    setGameStartTime(Date.now());
    if (continueGame) {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const progress: SavedGame = JSON.parse(saved);
        setCurrentStageId(progress.stageId);
        setCurrentQuestionIndex(progress.currentQuestionIndex);
        setLifelines(progress.lifelines);
      }
    } else {
      setCurrentStageId(stageId || 1);
      setCurrentQuestionIndex(0);
      setLifelines({ fiftyFifty: true, phone: true, audience: true, change: true });
      localStorage.removeItem(SAVE_KEY);
    }
    
    // Stop anthem when game starts
    if (isAnthemPlaying) {
      soundService.stopAnthem();
      setIsAnthemPlaying(false);
    }

    setGameState('playing');
    setTimer(60); // Reset timer
    setHiddenOptions([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setLifelineResult(null);
    setHasSavedGame(false);
  };

  const updateLeaderboard = async (newCompletedIds: number[], additionalTime: number) => {
    if (!currentUser) return;

    try {
      const leaderboardRef = doc(db, 'leaderboard', currentUser.uid);
      const docSnap = await getDoc(leaderboardRef);
      
      let totalPoints = newCompletedIds.length;
      let totalTime = additionalTime;
      let levelsCount = newCompletedIds.length;

      if (docSnap.exists()) {
        const data = docSnap.data();
        totalTime = (data.totalTimeSeconds || 0) + additionalTime;
      }

      await setDoc(leaderboardRef, {
        userId: currentUser.uid,
        displayName: currentUser.displayName || 'Anónimo',
        photoURL: currentUser.photoURL || '',
        totalPoints,
        totalTimeSeconds: totalTime,
        levelsCount,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'leaderboard');
    }
  };

  const handleOptionClick = useCallback((index: number) => {
    if (isAnswered || hiddenOptions.includes(index)) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (!isMuted) soundService.playSelect();

    setTimeout(() => {
      const correct = index === currentQuestion.correctIndex;
      setIsCorrectAnswer(correct);
      setShowExplanation(true);
      
      if (correct) {
        if (!isMuted) {
          if (currentQuestionIndex === currentQuestions.length - 1) {
            soundService.playPrize();
          } else {
            soundService.playCoin();
          }
        }
      } else {
        if (!isMuted) soundService.playWrong();
      }
    }, 1500);
  }, [isAnswered, hiddenOptions, isMuted, currentQuestion, currentQuestionIndex, currentQuestions.length]);

  const handleNextAfterExplanation = () => {
    setShowExplanation(false);
    setQuestionImage(null);
    
    if (isCorrectAnswer) {
      if (currentQuestionIndex === currentQuestions.length - 1) {
        const endTime = Date.now();
        const timeSpent = gameStartTime ? (endTime - gameStartTime) / 1000 : 0;
        
        setGameState('won');
        const newCompleted = [...new Set([...completedStageIds, currentStageId])];
        setCompletedStageIds(newCompleted);
        localStorage.setItem(COMPLETED_STAGES_KEY, JSON.stringify(newCompleted));
        localStorage.removeItem(SAVE_KEY);
        
        if (currentUser) {
          updateLeaderboard(newCompleted, timeSpent);
        }

        if (!isMuted) {
          soundService.playAnthemSting();
          soundService.playPrize();
        }
        triggerFireworks();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimer(60); // Reset timer for next question
        setSelectedOption(null);
        setIsAnswered(false);
        setHiddenOptions([]);
        setLifelineResult(null);
      }
    } else {
      setGameState('game_over');
      localStorage.removeItem(SAVE_KEY);
    }
  };

  const handleVoiceCommand = useCallback((command: string) => {
    if (gameState !== 'playing' || isAnswered) return;

    const normalized = command.toLowerCase();
    if (normalized.includes('opción a') || normalized === 'a' || normalized === 'la a') {
      handleOptionClick(0);
    } else if (normalized.includes('opción b') || normalized === 'b' || normalized === 'la b') {
      handleOptionClick(1);
    } else if (normalized.includes('opción c') || normalized === 'c' || normalized === 'la c') {
      handleOptionClick(2);
    } else if (normalized.includes('opción d') || normalized === 'd' || normalized === 'la d') {
      handleOptionClick(3);
    }
  }, [gameState, isAnswered, handleOptionClick]);

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || isAnswered) return;
    const incorrectIndices = currentQuestion.options
      .map((_, i) => i)
      .filter(i => i !== currentQuestion.correctIndex);
    const toHide = incorrectIndices.sort(() => Math.random() - 0.5).slice(0, 2);
    setHiddenOptions(toHide);
    setLifelines(prev => ({ ...prev, fiftyFifty: false }));
  };

  const usePhone = () => {
    if (!lifelines.phone || isAnswered) return;
    if (!isMuted) soundService.playPhone();
    setGameState('lifeline_phone');
    const isExpertCorrect = Math.random() > 0.2;
    const expertChoice = isExpertCorrect 
      ? currentQuestion.options[currentQuestion.correctIndex]
      : currentQuestion.options[Math.floor(Math.random() * 4)];
    
    setLifelineResult(`Tu amigo especialista dice: "Mmm, estoy casi seguro de que la respuesta es ${expertChoice}."`);
    setLifelines(prev => ({ ...prev, phone: false }));
  };

  const useAudience = () => {
    if (!lifelines.audience || isAnswered) return;
    if (!isMuted) soundService.playAudience();
    setGameState('lifeline_audience');
    const data = [0, 0, 0, 0];
    const correctIdx = currentQuestion.correctIndex;
    let remaining = 100;
    data[correctIdx] = Math.floor(Math.random() * 30) + 40;
    remaining -= data[correctIdx];
    for (let i = 0; i < 3; i++) {
      const idx = (correctIdx + i + 1) % 4;
      if (i === 2) {
        data[idx] = remaining;
      } else {
        const val = Math.floor(Math.random() * remaining);
        data[idx] = val;
        remaining -= val;
      }
    }
    setAudienceData(data);
    setLifelines(prev => ({ ...prev, audience: false }));
  };

  const useChange = () => {
    if (!lifelines.change || isAnswered) return;
    setLifelines(prev => ({ ...prev, change: false }));
    setLifelineResult("¡Pregunta cambiada! (Bueno, en esta versión demo te dejamos la misma pero gastaste el comodín 😉)");
  };

  const toggleAnthem = async () => {
    if (isAnthemPlaying) {
      soundService.stopAnthem();
      setIsAnthemPlaying(false);
    } else {
      if (!isMuted) {
        try {
          setIsAnthemPlaying(true);
          await soundService.playAnthem();
          // Reset state after approx 60s
          setTimeout(() => setIsAnthemPlaying(false), 60000);
        } catch (error) {
          console.error("Error playing anthem:", error);
          setIsAnthemPlaying(false);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 bg-slate-950 text-white font-sans relative overflow-y-auto">
      {/* Magnificent Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="wait">
          {gameState === 'start' ? (
            <motion.img 
              key="bg-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              src="https://picsum.photos/seed/gameshow/1920/1080" 
              alt="Game Show Studio" 
              className="w-full h-full object-cover absolute inset-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <motion.img 
              key="bg-game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 1 }}
              src="https://picsum.photos/seed/faro/1920/1080" 
              alt="Faro Monumental La Serena" 
              className="w-full h-full object-cover absolute inset-0 scale-105 animate-slow-zoom"
              referrerPolicy="no-referrer"
            />
          )}
        </AnimatePresence>
        <div className={`absolute inset-0 bg-gradient-to-b ${gameState === 'start' ? 'from-slate-950/40 via-slate-950/10 to-slate-950/80' : 'from-slate-950 via-slate-950/70 to-slate-950'}`} />
      </div>

      {/* Header / Lifelines */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 relative z-20">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="bg-[#E31E24] text-white font-black px-2 py-0.5 rounded text-xs shadow-md transform -rotate-1">VLS</div>
            <div className="text-2xl font-bold text-game-gold tracking-widest uppercase">
              ¿Quién quiere estar informado?
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm font-mono text-blue-400 uppercase tracking-[0.2em]">
            VECINOS <span className="text-game-gold whitespace-nowrap">LA SERENA</span> <span className="text-white/60 lowercase tracking-normal">vecinoslaserena.cl</span>
          </div>
            {gameState === 'playing' && (
              <motion.div animate={{ x: [0, 10, 0], y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="ml-4 text-blue-400/40">
                <Plane size={16} className="rotate-90" />
              </motion.div>
            )}
          {currentUser && (
            <div className="flex items-center gap-2 mt-1">
              <img src={currentUser.photoURL || ''} alt="" className="w-5 h-5 rounded-full border border-game-gold/50" referrerPolicy="no-referrer" />
              <span className="text-[10px] text-game-gold font-bold uppercase tracking-tighter">{currentUser.displayName}</span>
            </div>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setIsVoiceMode(!isVoiceMode)} 
            className={`p-2 rounded-full border transition-all ${isVoiceMode ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20' : 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10'}`}
            title={isVoiceMode ? "Desactivar Modo TV" : "Activar Modo TV (Voz y Cámara)"}
          >
            {isVoiceMode ? <Mic size={20} /> : <Camera size={20} />}
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="p-2 rounded-full border border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button 
            onClick={toggleAnthem} 
            className={`p-2 rounded-full border transition-all ${isAnthemPlaying ? 'bg-game-gold text-game-blue border-game-gold shadow-[0_0_10px_#FFD700]' : 'border-game-gold/30 text-game-gold hover:bg-game-gold/10'}`}
            title={isAnthemPlaying ? "Detener Himno" : "Escuchar Himno de La\u00A0Serena (Full MIDI)"}
          >
            <Music size={20} />
          </button>
          <LifelineButton icon={<RefreshCw size={20} />} active={lifelines.fiftyFifty} onClick={useFiftyFifty} label="50:50" />
          <LifelineButton icon={<Phone size={20} />} active={lifelines.phone} onClick={usePhone} label="Llamada" />
          <LifelineButton icon={<Users size={20} />} active={lifelines.audience} onClick={useAudience} label="Público" />
          <LifelineButton icon={<HelpCircle size={20} />} active={lifelines.change} onClick={useChange} label="Cambio" />
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        <div className="lg:col-span-3 space-y-8">
          <AnimatePresence mode="wait">
            {gameState === 'start' && (
              <motion.div 
                key="start" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 1.1 }} 
                className="flex flex-col items-center justify-center p-6 md:p-12 bg-slate-900/40 rounded-[2rem] md:rounded-[3rem] border-2 border-white/10 backdrop-blur-xl relative overflow-hidden min-h-[50vh] md:min-h-[60vh] shadow-2xl"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90" />
                </div>

                {/* Background Decorative Elements */}
                <motion.div 
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }} 
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }} 
                  className="absolute -top-40 -left-40 opacity-5 pointer-events-none text-game-gold z-10"
                >
                  <Globe size={500} />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="relative mb-6">
                    <motion.div
                      animate={{ 
                        y: [0, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <FaroIcon size={140} className="text-game-gold drop-shadow-[0_0_30px_rgba(255,215,0,0.6)]" />
                    </motion.div>
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0, 0.3, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute inset-0 bg-game-gold rounded-full blur-3xl -z-10"
                    />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-[#E31E24] text-white font-black px-4 py-1.5 rounded-lg text-3xl shadow-2xl transform -rotate-3 border-2 border-white/30 flex items-center justify-center">
                      VLS
                    </div>
                    <div className="h-1 w-12 bg-game-gold rounded-full opacity-50" />
                  </div>
                  
                  <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 text-center uppercase tracking-tighter text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                    VECINOS <span className="text-game-gold whitespace-nowrap">LA SERENA</span>
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <div className="h-[2px] w-8 md:w-12 bg-gradient-to-r from-transparent to-game-gold" />
                    <div className="flex flex-col items-center">
                      <span className="text-game-gold font-bold tracking-[0.2em] md:tracking-[0.4em] text-xs md:text-sm uppercase">Edición Regional 2026</span>
                      <span className="text-white/40 text-[10px] lowercase tracking-widest mt-1">vecinoslaserena.cl</span>
                    </div>
                    <div className="h-[2px] w-8 md:w-12 bg-gradient-to-l from-transparent to-game-gold" />
                  </div>
                  
                  <p className="text-base md:text-lg text-slate-300 mb-6 text-center max-w-2xl font-medium leading-relaxed px-4">
                    Un viaje épico por la historia, cultura y misterios de nuestra tierra. 
                    <span className="text-game-gold block mt-1">¿Estás listo para convertirte en Hijo Ilustre?</span>
                  </p>

                  <div className="flex flex-col items-center gap-6">
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1], scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex items-center gap-4 text-game-gold font-black text-xl tracking-[0.4em] uppercase drop-shadow-[0_0_10px_rgba(255,215,0,0.2)]">
                        <Coins size={28} className="text-game-gold" />
                        INSERTA TU FICHA
                      </div>
                      <div className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em] animate-pulse">Toca el botón para comenzar tu aventura</div>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <button 
                        onClick={() => setGameState('map')} 
                        className="group relative px-10 md:px-16 py-4 md:py-6 bg-game-gold text-game-blue font-black text-2xl md:text-4xl rounded-2xl hover:bg-yellow-400 transition-all transform hover:scale-110 shadow-[0_20px_50px_rgba(255,215,0,0.3)] flex items-center gap-4 overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"
                        />
                        <Play size={32} fill="currentColor" className="md:w-10 md:h-10" /> JUGAR
                      </button>
                      
                      <div className="flex gap-4">
                        <div className="relative group">
                          <button onClick={() => setGameState('map')} className="p-4 md:p-5 bg-white/5 text-white rounded-2xl border border-white/10 hover:bg-white/10 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2">
                            <Map size={24} className="md:w-7 md:h-7" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-white text-[10px] md:text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            Mapa de Niveles
                          </div>
                        </div>

                        <div className="relative group">
                          <button onClick={() => setGameState('leaderboard')} className="p-4 md:p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 shadow-blue-600/20">
                            <Medal size={24} className="md:w-7 md:h-7" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-white text-[10px] md:text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            Ranking Regional
                          </div>
                        </div>

                        <div className="relative group">
                          <button 
                            onClick={toggleAnthem} 
                            className={`p-4 md:p-5 rounded-2xl border transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 ${isAnthemPlaying ? 'bg-game-gold text-game-blue border-game-gold shadow-game-gold/40' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}
                          >
                            <Music size={24} className="md:w-7 md:h-7" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-white text-[10px] md:text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            {isAnthemPlaying ? "Detener Himno" : "Escuchar Himno"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {gameState === 'leaderboard' && (
              <motion.div key="leaderboard" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="p-8 bg-blue-900/40 rounded-3xl border-2 border-game-gold/30 flex flex-col h-full max-h-[80vh]">
                <div className="flex justify-between items-center mb-8 shrink-0">
                  <h2 className="text-3xl font-bold text-game-gold flex items-center gap-3">
                    <Medal size={32} /> RANKING REGIONAL
                  </h2>
                  <button onClick={() => setGameState('start')} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">Volver</button>
                </div>
                
                <div className="overflow-y-auto pr-4 custom-scrollbar pb-4 space-y-3">
                  {leaderboard.length === 0 ? (
                    <div className="text-center py-12 text-blue-400">Cargando ranking...</div>
                  ) : (
                    leaderboard.map((entry, idx) => entry.isGap ? (
                      <div key={`gap_${idx}`} className="flex justify-center py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500/30"></div>
                          <div className="w-2 h-2 rounded-full bg-blue-500/30"></div>
                          <div className="w-2 h-2 rounded-full bg-blue-500/30"></div>
                        </div>
                      </div>
                    ) : (
                      <div key={entry.userId} className={`flex items-center gap-4 p-4 rounded-xl border ${entry.userId === (currentUser?.uid || 'user_anon') ? 'bg-game-gold/20 border-game-gold' : 'bg-blue-800/20 border-blue-700/50'}`}>
                        <div className="w-8 text-2xl font-black text-game-gold/50 italic">#{entry.rank}</div>
                        <img src={entry.photoURL} alt="" className="w-10 h-10 rounded-full border-2 border-game-gold/30" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <div className="font-bold text-lg">{entry.displayName}</div>
                          <div className="text-xs text-blue-400 uppercase tracking-widest">{entry.levelsCount} niveles completados</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1 text-game-gold font-bold">
                            <Award size={16} /> {entry.totalPoints} pts
                          </div>
                          <div className="flex items-center justify-end gap-1 text-xs text-blue-300">
                            <Clock size={12} /> {Math.floor(entry.totalTimeSeconds / 60)}m {Math.floor(entry.totalTimeSeconds % 60)}s
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {gameState === 'map' && (
              <motion.div key="map" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="p-8 bg-slate-900/60 rounded-3xl border-2 border-game-gold/30 flex flex-col h-full max-h-[85vh] backdrop-blur-xl shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                  <div>
                    <h2 className="text-3xl font-black text-game-gold flex items-center gap-3 tracking-tighter">
                      <Map size={32} /> MAPA DE PROGRESO
                    </h2>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-1">Explora los niveles desbloqueados</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setGameState('leaderboard')} className="p-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white transition-all shadow-lg shadow-blue-600/20" title="Ver Ranking">
                      <Medal size={24} />
                    </button>
                    <button onClick={() => setGameState('start')} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold transition-all border border-white/10">Volver</button>
                  </div>
                </div>

                {/* Map Tabs */}
                <div className="flex p-1 bg-slate-950/50 rounded-2xl mb-8 border border-white/5 self-center">
                  <button 
                    onClick={() => setMapCategory('region')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${mapCategory === 'region' ? 'bg-game-gold text-game-blue shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    <MapPin size={18} /> Región
                  </button>
                  <button 
                    onClick={() => setMapCategory('chile')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${mapCategory === 'chile' ? 'bg-game-gold text-game-blue shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Flag size={18} /> Chile
                  </button>
                  <button 
                    onClick={() => setMapCategory('world')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${mapCategory === 'world' ? 'bg-game-gold text-game-blue shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Globe size={18} /> Mundo
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-4 custom-scrollbar pb-4 flex-1">
                  {STAGES.filter(s => {
                    const worldStages = [4, 26, 27, 30, 31];
                    const chileStages = [3, 22, 23, 28, 29];
                    const oficiosStages = [32];
                    if (mapCategory === 'world') return worldStages.includes(s.id);
                    if (mapCategory === 'chile') return chileStages.includes(s.id);
                    // Oficios is regional
                    return !worldStages.includes(s.id) && !chileStages.includes(s.id);
                  }).map((s) => {
                    const idx = STAGES.findIndex(st => st.id === s.id);
                    const isCompleted = completedStageIds.includes(s.id);
                    const isUnlocked = idx === 0 || completedStageIds.includes(STAGES[idx - 1].id);
                    
                    return (
                      <motion.button
                        key={s.id}
                        whileHover={isUnlocked ? { scale: 1.03, y: -5 } : {}}
                        whileTap={isUnlocked ? { scale: 0.98 } : {}}
                        disabled={!isUnlocked}
                        onClick={() => startGame(false, s.id)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all relative group overflow-hidden min-h-[180px] flex flex-col justify-end ${
                          isCompleted 
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-100' 
                            : isUnlocked 
                              ? 'bg-slate-800/40 border-game-gold/30 hover:border-game-gold text-white shadow-xl' 
                              : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                        title={isUnlocked ? `${s.name}: ${s.description}` : "Nivel Bloqueado"}
                      >
                        {/* Stage Image Background */}
                        {isUnlocked && (
                          <div className="absolute inset-0 z-0">
                            <img 
                              src={s.image} 
                              alt="" 
                              className={`w-full h-full object-cover transition-all duration-700 ${isCompleted ? 'opacity-20 grayscale-0' : 'opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-50 group-hover:scale-110'}`} 
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                          </div>
                        )}

                        {/* Background Pattern */}
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity z-10">
                          {mapCategory === 'region' ? <MapPin size={120} /> : mapCategory === 'chile' ? <Flag size={120} /> : <Globe size={120} />}
                        </div>

                        <div className="flex justify-between items-start mb-3 relative z-10">
                          <span className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em]">NIVEL {idx + 1}</span>
                          {isCompleted ? (
                            <div className="bg-emerald-500 rounded-full p-1 shadow-lg shadow-emerald-500/40">
                              <CheckCircle2 className="text-white" size={16} />
                            </div>
                          ) : !isUnlocked && (
                            <Lock size={18} className="text-slate-700" />
                          )}
                        </div>
                        <h3 className="text-xl font-black mb-2 relative z-10 tracking-tight leading-tight">{s.name}</h3>
                        <p className="text-xs opacity-60 line-clamp-2 font-medium leading-relaxed relative z-10">{s.description}</p>
                        
                        {isUnlocked && !isCompleted && (
                          <div className="mt-4 flex items-center gap-2 text-game-gold text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                            Jugar Ahora <ChevronRight size={14} />
                          </div>
                        )}

                        {isUnlocked && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-game-gold/50" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {gameState === 'playing' && (
              <motion.div 
                key="playing" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }} 
                className="flex flex-col min-h-[85vh] w-full bg-slate-950/50 rounded-3xl border-2 border-game-gold/30 overflow-hidden shadow-2xl"
              >
                {/* Game Header */}
                <div className="bg-slate-900/80 border-b border-game-gold/20 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-game-gold/20 border border-game-gold/50 flex items-center justify-center text-game-gold font-black text-xl">
                      {currentStageId}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight uppercase tracking-tight">{currentStage.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
                            className="h-full bg-game-gold"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{currentQuestionIndex + 1}/{currentQuestions.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Tiempo</span>
                      <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${timer < 10 ? 'text-red-500 animate-pulse' : 'text-game-gold'}`}>
                        <Clock size={20} />
                        {formatTime(timer)}
                      </div>
                    </div>
                    <button 
                      onClick={() => setGameState('start')}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold uppercase transition-all"
                    >
                      Salir
                    </button>
                  </div>
                </div>

                {/* Question Area (Upper Half) */}
                <div className="flex-1 relative flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                  {/* Base Stage Image (Contextual) */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={currentStage.image} 
                      alt={currentStage.name} 
                      className="w-full h-full object-cover opacity-40 saturate-[0.8]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/20 to-slate-950/90" />
                  </div>

                  {/* AI Generated Question Image */}
                  <AnimatePresence mode="wait">
                    {questionImage && (
                      <motion.div
                        key={questionImage}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: showExplanation ? 1 : 0.85, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-1"
                      >
                        <img 
                          src={questionImage} 
                          alt="Contexto visual" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className={`absolute inset-0 ${showExplanation ? 'bg-slate-950/30' : 'bg-gradient-to-b from-slate-950/95 via-transparent to-slate-950/95'}`} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isGeneratingImage && (
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-game-gold/50 shadow-2xl animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin text-game-gold" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-game-gold font-black uppercase tracking-[0.2em] leading-none">IA Generativa</span>
                        <span className="text-[8px] text-white/70 font-medium uppercase tracking-widest mt-0.5">Preparando contexto...</span>
                      </div>
                    </div>
                  )}

                  {!showExplanation ? (
                    <div className="relative z-10 max-w-4xl">
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] mb-4">
                        {currentQuestion.text}
                      </h2>
                    </div>
                  ) : (
                    <div className="relative z-10 max-w-4xl w-full mt-auto mb-2">
                      <div className="bg-slate-950/70 backdrop-blur-md p-5 md:p-6 rounded-2xl border-t-4 border-game-gold/50 shadow-2xl">
                        <h2 className={`text-xl md:text-2xl font-black leading-tight mb-2 ${isCorrectAnswer ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isCorrectAnswer ? '¡Correcto!' : 'Incorrecto'}
                        </h2>
                        <p className="text-base md:text-lg text-white/95 leading-snug drop-shadow-md">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Options Area (Lower Half) */}
                {!showExplanation ? (
                  <div className="p-6 md:p-10 bg-slate-900/90 backdrop-blur-xl border-t border-game-gold/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                      {currentQuestion.options.map((option, idx) => {
                        const isHidden = hiddenOptions.includes(idx);
                        const isCorrect = isAnswered && idx === currentQuestion.correctIndex;
                        const isWrong = isAnswered && selectedOption === idx && idx !== currentQuestion.correctIndex;
                        const isSelected = selectedOption === idx;
                        return (
                          <motion.button 
                            key={idx} 
                            whileHover={!isAnswered && !isHidden ? { scale: 1.02, backgroundColor: 'rgba(255,215,0,0.1)' } : {}}
                            whileTap={!isAnswered && !isHidden ? { scale: 0.98 } : {}}
                            disabled={isAnswered || isHidden} 
                            onClick={() => handleOptionClick(idx)} 
                            className={`
                              relative p-6 rounded-2xl text-left text-xl font-bold transition-all border-2 flex items-center gap-4 min-h-[80px]
                              ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'} 
                              ${isCorrect 
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                                : isWrong 
                                  ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                                  : isSelected && !isAnswered 
                                    ? 'bg-game-gold/20 border-game-gold text-game-gold' 
                                    : 'bg-slate-800/50 border-white/10 text-slate-300 hover:border-game-gold/50'
                              }
                            `}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shrink-0 ${isCorrect ? 'bg-emerald-500 text-white' : isWrong ? 'bg-red-500 text-white' : 'bg-slate-700 text-game-gold'}`}>
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="flex-1">{option}</span>
                            {isSelected && !isAnswered && (
                              <motion.div 
                                layoutId="highlight" 
                                className="absolute inset-0 border-4 border-game-gold rounded-2xl animate-pulse pointer-events-none" 
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    <AnimatePresence>
                      {lifelineResult && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: 10 }}
                          className="mt-8 p-6 bg-blue-900/40 border-2 border-blue-400/30 rounded-2xl text-blue-100 italic text-center shadow-2xl relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-game-gold" />
                          <p className="text-lg font-medium">{lifelineResult}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="p-6 md:p-10 bg-slate-900/90 backdrop-blur-xl border-t border-game-gold/20 flex flex-col items-center justify-center min-h-[250px]">
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleNextAfterExplanation}
                      className="px-12 py-5 bg-game-gold text-slate-950 font-black text-2xl rounded-full hover:bg-yellow-400 transition-all shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_50px_rgba(255,215,0,0.5)] hover:scale-105"
                    >
                      {isCorrectAnswer ? 'Continuar' : 'Terminar Juego'}
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}

            {(gameState === 'game_over' || gameState === 'won') && (
              <motion.div key="end" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center p-12 bg-slate-900/40 rounded-3xl border-4 border-game-gold/30 backdrop-blur-xl relative overflow-hidden min-h-[60vh] w-full">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img src={currentStage.image} alt="" className="w-full h-full object-cover opacity-20 saturate-0 blur-[2px]" referrerPolicy="no-referrer" />
                  <div className={`absolute inset-0 bg-gradient-to-b ${gameState === 'won' ? 'from-emerald-950/80 via-emerald-950/40 to-emerald-950/90' : 'from-red-950/80 via-red-950/40 to-red-950/90'}`} />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  {gameState === 'won' ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute -top-10 -right-10 text-game-gold/20">
                        <Trophy size={200} />
                      </motion.div>
                      <Trophy size={100} className="text-game-gold mb-6 animate-bounce" />
                      <h1 className="text-5xl font-bold mb-4 text-game-gold text-center">
                        {currentStageId === STAGES.length ? "¡HIJO ILUSTRE DE LA REGIÓN!" : "¡NIVEL COMPLETADO!"}
                      </h1>
                      <p className="text-2xl mb-2 text-center">
                        {currentStageId === STAGES.length 
                          ? "Has demostrado un conocimiento excepcional de todas las comunas y provincias. ¡Eres un verdadero embajador de nuestra tierra!"
                          : `Has demostrado ser un gran conocedor de ${currentStage.name}.`}
                      </p>
                      <p className="text-3xl font-bold text-game-gold mb-8 text-center">¡Recompensa desbloqueada!</p>
                      
                      <div className="flex flex-col gap-4 w-full max-w-md">
                        {STAGES.findIndex(s => s.id === currentStageId) < STAGES.length - 1 ? (
                          <button onClick={() => startGame(false, STAGES[STAGES.findIndex(s => s.id === currentStageId) + 1].id)} className="px-12 py-4 bg-emerald-500 text-white font-bold text-xl rounded-full hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                            SIGUIENTE NIVEL <ChevronRight size={24} />
                          </button>
                        ) : (
                          <div className="p-4 bg-emerald-500/20 border border-emerald-500 rounded-2xl text-emerald-100 font-bold text-center mb-4">
                            ¡HAS COMPLETADO EL DESAFÍO FINAL!
                          </div>
                        )}
                        <button onClick={() => setGameState('map')} className="px-12 py-4 bg-white text-game-blue font-bold text-xl rounded-full hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
                          <Map size={24} /> VER MAPA DE NIVELES
                        </button>
                        <button onClick={() => setGameState('leaderboard')} className="px-12 py-4 bg-blue-600 text-white font-bold text-xl rounded-full hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                          <Medal size={24} /> VER RANKING
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={100} className="text-red-500 mb-6" />
                      <h1 className="text-4xl font-bold mb-4">FIN DEL JUEGO</h1>
                      <p className="text-xl mb-2">La respuesta correcta era: <span className="text-game-gold">{currentQuestion.options[currentQuestion.correctIndex]}</span></p>
                      <p className="text-lg text-blue-300 mb-8 italic text-center max-w-2xl">"{currentQuestion.explanation}"</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => startGame(false, currentStageId)} className="px-12 py-4 bg-white text-game-blue font-bold text-xl rounded-full hover:bg-blue-100 transition-all">REINTENTAR</button>
                        <button onClick={() => setGameState('leaderboard')} className="px-12 py-4 bg-blue-600 text-white font-bold text-xl rounded-full hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                          <Medal size={24} /> VER RANKING
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar: Levels & Titles Ladder */}
        <GameSidebar 
          currentQuestionIndex={currentQuestionIndex}
          gameState={gameState}
          isAnswered={isAnswered}
          selectedOption={selectedOption}
          currentStage={currentStage}
          currentQuestion={currentQuestion}
          currentStageId={currentStageId}
        />
      </div>

      <AnimatePresence>
        {gameState === 'lifeline_phone' && (
          <LifelineModal 
            title="Llamada a un Amigo" 
            onClose={() => setGameState('playing')} 
            icon={<Phone className="text-game-gold" size={48} />}
            backgroundImage={currentStage.image}
          >
            <p className="text-xl text-center mb-4 relative z-10">{lifelineResult}</p>
            <div className="p-4 bg-blue-800/50 rounded-lg border border-blue-400/30 relative z-10">
              <p className="text-sm text-blue-200 italic text-center">
                <span className="font-bold text-game-gold block mb-1">Dato curioso:</span>
                {currentQuestion.explanation}
              </p>
            </div>
          </LifelineModal>
        )}
        {gameState === 'lifeline_audience' && (
          <LifelineModal 
            title="Opinión del Público" 
            onClose={() => setGameState('playing')} 
            icon={<Users className="text-game-gold" size={48} />}
            backgroundImage={currentStage.image}
          >
            <div className="flex items-end justify-center gap-4 h-40 mt-4 mb-6 relative z-10">
              {audienceData.map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 max-w-[60px]">
                  <div className="text-sm font-bold">{val}%</div>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${val}%` }} className={`w-full rounded-t-lg ${i === currentQuestion.correctIndex ? 'bg-game-gold' : 'bg-blue-600'}`} />
                  <div className="text-lg font-bold">{String.fromCharCode(65 + i)}</div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-blue-800/50 rounded-lg border border-blue-400/30 relative z-10">
              <p className="text-sm text-blue-200 italic text-center">
                <span className="font-bold text-game-gold block mb-1">Contexto del público:</span>
                {currentQuestion.explanation}
              </p>
            </div>
          </LifelineModal>
        )}
      </AnimatePresence>
      <div className="mt-12 text-blue-400/50 text-sm uppercase tracking-widest text-center">
        <div>La\u00A0Serena • Patrimonio • Historia • Naturaleza</div>
        <div className="mt-1 text-[10px] font-mono">SISTEMA DE RECOMPENSAS VLS ACTIVADO • VECINOSLASERENA.CL</div>
      </div>

      {isVoiceMode && gameState === 'playing' && (
        <VoiceContestant onVoiceCommand={handleVoiceCommand} isActive={isVoiceMode} />
      )}
    </div>
  );
}

function LifelineButton({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick} 
      disabled={!active} 
      className={`group relative flex flex-col items-center gap-1 p-3 rounded-full border-2 transition-all ${active ? 'border-game-gold text-game-gold hover:bg-game-gold hover:text-game-blue cursor-pointer' : 'border-red-500/30 text-red-500/30 cursor-not-allowed'}`}
      title={label}
    >
      {icon}
      <span className="absolute -top-10 bg-slate-900/90 text-game-gold px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-game-gold/30 pointer-events-none shadow-xl z-50">
        {label}
      </span>
      {!active && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-0.5 bg-red-500 rotate-45" /></div>}
    </button>
  );
}

function LifelineModal({ title, children, onClose, icon, backgroundImage }: { title: string, children: React.ReactNode, onClose: () => void, icon: React.ReactNode, backgroundImage?: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-slate-900 border-2 border-game-gold rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Background Image */}
        {backgroundImage && (
          <div className="absolute inset-0 z-0">
            <img src={backgroundImage} alt="" className="w-full h-full object-cover opacity-10 saturate-0 blur-[1px]" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-950/40 to-blue-950/90" />
          </div>
        )}
        
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-6">
            {icon}
            <h3 className="text-2xl font-bold mt-4 text-game-gold uppercase tracking-wider">{title}</h3>
          </div>
          {children}
          <button onClick={onClose} className="w-full mt-8 py-3 bg-game-gold text-game-blue font-bold rounded-xl hover:bg-yellow-400 transition-all">VOLVER AL JUEGO</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
