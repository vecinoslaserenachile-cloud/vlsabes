import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Camera, CameraOff, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceContestantProps {
  onVoiceCommand: (command: string) => void;
  isActive: boolean;
}

export const VoiceContestant: React.FC<VoiceContestantProps> = ({ onVoiceCommand, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 },
          audio: false 
        });
        setStream(userStream);
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }

    if (isActive) {
      setupCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition && isActive) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'es-CL';

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase().trim();
        console.log("Comando de voz:", command);
        onVoiceCommand(command);
      };

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        console.error("Error en reconocimiento de voz:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isActive, onVoiceCommand]);

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative group"
      >
        {/* Camera Feed */}
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-game-gold shadow-2xl bg-blue-900/80 relative">
          {stream ? (
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-400">
              <Video size={48} className="animate-pulse" />
            </div>
          )}
          
          {/* Mic Indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-2 right-2 bg-red-500 p-2 rounded-full shadow-lg border-2 border-white animate-pulse"
              >
                <Mic size={16} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Label */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-game-blue border border-game-gold px-3 py-1 rounded-full text-[10px] font-bold text-game-gold whitespace-nowrap uppercase tracking-widest shadow-lg">
          {isListening ? "Escuchando..." : "Cámara Activa"}
        </div>
      </motion.div>
    </div>
  );
};
