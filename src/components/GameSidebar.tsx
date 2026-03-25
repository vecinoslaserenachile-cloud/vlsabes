import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Activity, Info, CheckCircle2, Zap, Radio, Tv, Signal, MessageSquare, User } from 'lucide-react';
import { PRIZES, QUESTION_PRIZES } from '../constants';

interface GameSidebarProps {
  currentQuestionIndex: number;
  gameState: string;
  isAnswered: boolean;
  selectedOption: number | null;
  currentStage: any;
  currentQuestion: any;
  currentStageId: number;
}

export const GameSidebar: React.FC<GameSidebarProps> = ({
  currentQuestionIndex,
  gameState,
  isAnswered,
  selectedOption,
  currentStage,
  currentQuestion,
  currentStageId
}) => {
  const [commentary, setCommentary] = useState<string>("Esperando respuesta...");
  const [hostMessage, setHostMessage] = useState<string>("¡Bienvenidos a Vecinos La\u00A0Serena VLS!");

  const stagePrize = PRIZES[currentStageId - 1] || PRIZES[0];

  useEffect(() => {
    if (gameState !== 'playing') {
      setCommentary("Sistema en espera...");
      setHostMessage("Prepárate para el próximo desafío.");
      return;
    }

    if (isAnswered) {
      if (selectedOption === currentQuestion.correctIndex) {
        setCommentary("¡RESPUESTA CORRECTA! Analizando datos regionales...");
        setHostMessage("¡Impresionante! Conoces muy bien nuestra zona.");
      } else {
        setCommentary("ERROR DETECTADO. Procesando resultado...");
        setHostMessage("Oh, qué lástima. Esa no era la respuesta.");
      }
    } else {
      setCommentary(`Nivel: ${currentStage.name}. Pregunta ${currentQuestionIndex + 1} de 10.`);
      const messages = [
        "Tómate tu tiempo, la respuesta está en tu memoria.",
        "¿Será la opción que estás pensando?",
        "Recuerda que puedes usar tus comodines.",
        "¡El público está expectante!",
        "La\u00A0Serena tiene muchos secretos, ¿conoces este?"
      ];
      setHostMessage(messages[currentQuestionIndex % messages.length]);
    }
  }, [isAnswered, selectedOption, currentQuestion, currentStage, currentQuestionIndex, gameState]);

  return (
    <div className="hidden lg:flex flex-col gap-4 h-full max-h-[85vh]">
      {/* TV Broadcast Header */}
      <div className="bg-blue-900/40 rounded-xl p-3 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tv size={16} className="text-blue-400" />
          <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Broadcast VLS-TV</span>
        </div>
        <div className="flex items-center gap-1">
          <Signal size={12} className="text-emerald-400 animate-pulse" />
          <span className="text-[8px] text-emerald-400 font-mono">HD LIVE</span>
        </div>
      </div>

      {/* Host / Commentary Panel */}
      <div className="bg-blue-950/80 rounded-2xl border-2 border-blue-500/30 p-4 shadow-2xl relative overflow-hidden flex flex-col gap-3">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20 overflow-hidden">
          <motion.div 
            animate={{ x: ['-100%', '100%'] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-1/3 h-full bg-blue-400 shadow-[0_0_10px_#60a5fa]"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-800 border border-game-gold/50 flex items-center justify-center shrink-0">
            <User size={20} className="text-game-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-game-gold uppercase">Anfitrión Virtual</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[8px] text-red-400 font-mono">REC</span>
              </div>
            </div>
            <div className="bg-black/40 rounded-lg p-2 border border-blue-500/20">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={hostMessage}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[10px] font-medium text-blue-100 leading-tight"
                >
                  "{hostMessage}"
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="bg-black/60 rounded-lg p-3 border border-blue-500/20 min-h-[60px] flex flex-col justify-center relative">
          <div className="absolute top-1 right-2">
            <Activity size={10} className="text-blue-500/50" />
          </div>
          <AnimatePresence mode="wait">
            <motion.p 
              key={commentary}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-[11px] font-mono text-blue-300 leading-relaxed"
            >
              {`> ${commentary}`}
            </motion.p>
          </AnimatePresence>
        </div>

        {isAnswered && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-start gap-2 p-2 bg-blue-900/40 rounded border border-blue-400/20"
          >
            <Info size={12} className="text-game-gold shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-100 italic leading-tight">
              {currentQuestion.explanation}
            </p>
          </motion.div>
        )}
      </div>

      {/* Prize Ladder */}
      <div className="flex-1 bg-blue-950/50 rounded-2xl border border-blue-800/50 p-4 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-game-gold" />
            <span className="text-[10px] font-bold text-game-gold uppercase tracking-widest">Escalafón</span>
          </div>
          <div className="text-[10px] font-black text-game-gold uppercase bg-game-gold/10 px-2 py-1 rounded border border-game-gold/30">
            {stagePrize.title}
          </div>
        </div>

        <div className="space-y-1">
          {[...QUESTION_PRIZES].reverse().map((prize, idx) => {
            const actualIdx = 9 - idx;
            const isCurrent = actualIdx === currentQuestionIndex && gameState === 'playing';
            const isPast = actualIdx < currentQuestionIndex;
            const isSafePoint = actualIdx === 4 || actualIdx === 9;
            
            return (
              <motion.div 
                key={idx} 
                animate={isCurrent ? { x: [0, 5, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`group relative flex flex-col px-3 py-2 rounded-xl transition-all duration-300 ${
                  isCurrent 
                    ? 'bg-gradient-to-r from-game-gold to-yellow-600 text-game-blue font-bold scale-105 shadow-[0_0_20px_rgba(255,215,0,0.3)] z-10' 
                    : isPast 
                      ? 'text-game-gold opacity-40 grayscale-[0.5]' 
                      : 'text-blue-200 hover:bg-blue-900/30'
                } ${isSafePoint && !isCurrent ? 'border border-white/10 bg-white/5' : ''}`}
                title={`Nivel ${actualIdx + 1}: ${prize.reward}`}
              >
                {isCurrent && (
                  <motion.div 
                    layoutId="active-glow"
                    className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"
                  />
                )}
                
                <div className="flex justify-between items-center text-sm relative z-10">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 text-[10px] font-mono opacity-50 ${isCurrent ? 'text-blue-900' : ''}`}>
                      {actualIdx + 1}
                    </span>
                    <span className="truncate max-w-[140px]">{actualIdx === 9 ? stagePrize.title : `Pregunta ${actualIdx + 1}`}</span>
                  </div>
                  {isPast && <CheckCircle2 size={12} className="text-game-gold" />}
                  {isSafePoint && !isCurrent && !isPast && <Zap size={10} className="text-white/50" />}
                </div>
                
                <div className={`text-[9px] text-right font-mono mt-0.5 relative z-10 ${
                  isCurrent ? 'text-blue-900 font-black' : 'text-blue-400/80'
                }`}>
                  {prize.reward}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Ticker */}
      <div className="bg-black/40 rounded-xl p-2 border border-blue-500/10 overflow-hidden whitespace-nowrap">
        <motion.div 
          animate={{ x: [200, -400] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="text-[9px] font-mono text-blue-400 uppercase flex gap-8"
        >
          <span>• CONECTADO A VECINOSLASERENA.CL</span>
          <span>• SISTEMA DE PREMIOS ACTIVADO</span>
          <span>• TRANSMISIÓN EN VIVO DESDE EL FARO</span>
          <span>• PATRIMONIO DE <span className="whitespace-nowrap">LA SERENA</span></span>
        </motion.div>
      </div>
    </div>
  );
};
