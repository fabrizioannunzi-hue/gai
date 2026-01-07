
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Phone, MessageSquare, X, BrainCircuit, Activity, ChevronDown, PhoneOff, Minimize2, Maximize2 } from 'lucide-react';
import { Message, Role } from '../types';
import { INITIAL_MESSAGE } from '../constants';
import { sendMessageToGemini } from '../services/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { buildMasterPrompt } from '../services/aiPromptService';

const SOFIA_AVATAR = "https://i.ibb.co/svrs9b0B/unnamed-10.jpg";

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

interface ChatInterfaceProps {
  onOpenBooking?: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onOpenBooking, isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<Message[]>([{ role: Role.MODEL, text: INITIAL_MESSAGE }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice State
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'speaking'>('idle');
  
  // UI State
  const [isMinimizedCall, setIsMinimizedCall] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (isOpen && !isMinimizedCall) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, [messages, isLoading, isOpen, isMinimizedCall]);

  const handleToggleOpen = () => {
    if (isOpen) {
        if (isVoiceActive) {
            setIsOpen(false);
            setIsMinimizedCall(true);
        } else {
            setIsOpen(false);
            stopVoiceSession();
        }
    } else {
        if (isVoiceActive) setIsMinimizedCall(false);
        setIsOpen(true);
    }
  };

  const handleMainButtonClick = () => {
    if (isOpen) {
        handleToggleOpen();
    } else {
        startVoiceSession(true);
    }
  };

  const handleTextChatClick = () => {
      setIsOpen(true);
  };

  const stopVoiceSession = async () => {
    if (audioSourceRef.current) {
        try { audioSourceRef.current.stop(); } catch(e) {}
        audioSourceRef.current = null;
    }
    if (sessionRef.current) { 
        try { await sessionRef.current.close(); } catch(e) {} 
    }
    if (audioContextRef.current) { 
        try { audioContextRef.current.close(); } catch(e) {} 
    }
    
    setIsVoiceActive(false);
    setIsMinimizedCall(false);
    setVoiceStatus('idle');
    sessionRef.current = null;
    audioContextRef.current = null;
  };

  const startVoiceSession = async (autoGreet: boolean = false) => {
    if (!isOpen) setIsOpen(true);
    if (isVoiceActive) return;
    
    setIsVoiceActive(true);
    setVoiceStatus('listening');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;
      
      const outCtx = new AudioContext({ sampleRate: 24000 });
      let nextStartTime = 0;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: buildMasterPrompt(false),
          inputAudioTranscription: {},
          tools: [{ functionDeclarations: [{ name: "openBookingCalendar", description: "Apre il calendario di prenotazione." }] }]
        },
        callbacks: {
          onopen: () => {
            const source = audioCtx.createMediaStreamSource(stream);
            const processor = audioCtx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              if (!sessionRef.current) return;
              const inputData = e.inputBuffer.getChannelData(0);
              
              // VAD Semplificato - Soglia aumentata
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              
              if (rms > 0.08 && audioSourceRef.current) {
                 try { 
                   audioSourceRef.current.stop(); 
                   audioSourceRef.current = null;
                   setVoiceStatus('listening');
                 } catch(e) {}
              }

              const pcm = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) pcm[i] = inputData[i] * 32768;
              
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: encode(new Uint8Array(pcm.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
            };
            
            source.connect(processor); 
            processor.connect(audioCtx.destination);

            if (autoGreet) {
              sessionPromise.then(s => s.sendRealtimeInput({ text: "Ciao, buonasera Sofia." }));
            }
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.inputTranscription?.text) {
                const text = msg.serverContent.inputTranscription.text;
                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last && last.role === Role.USER) return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                    return [...prev, { role: Role.USER, text }];
                });
            }
            
            if (msg.toolCall) {
              for (const fc of msg.toolCall.functionCalls) {
                if (fc.name === 'openBookingCalendar') { 
                  await sessionPromise.then(s => s.sendToolResponse({ 
                    functionResponses: { id: fc.id, name: fc.name, response: { result: "ok, calendario aperto" } } 
                  }));
                  
                  // Minimiziamo solo la chat, l'audio continua
                  setIsOpen(false);
                  setIsMinimizedCall(true);
                  onOpenBooking?.();
                  return;
                }
              }
            }

            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              setVoiceStatus('speaking');
              const raw = decode(audioData as string);
              const dataInt16 = new Int16Array(raw.buffer);
              const buffer = outCtx.createBuffer(1, dataInt16.length, 24000);
              const ch = buffer.getChannelData(0);
              for (let i = 0; i < dataInt16.length; i++) ch[i] = dataInt16[i] / 32768.0;
              
              const src = outCtx.createBufferSource();
              src.buffer = buffer; 
              src.connect(outCtx.destination);
              
              audioSourceRef.current = src; 

              nextStartTime = Math.max(nextStartTime, outCtx.currentTime);
              src.start(nextStartTime); 
              nextStartTime += buffer.duration;
              
              src.onended = () => {
                  if (audioSourceRef.current === src) {
                    setVoiceStatus('listening');
                    audioSourceRef.current = null;
                  }
              };
            }
          }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) { 
        console.error("Voice Error", e);
        stopVoiceSession(); 
    }
  };

  const handleSendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue(''); setIsLoading(true);
    setMessages(prev => [...prev, { role: Role.USER, text }]);
    try {
      const resp = await sendMessageToGemini(messages, text);
      if (resp.triggerCalendar) { onOpenBooking?.(); setIsOpen(false); }
      setMessages(prev => [...prev, { role: Role.MODEL, text: resp.text }]);
    } catch (e) { setMessages(prev => [...prev, { role: Role.MODEL, text: "Sincronia temporaneamente instabile.", isError: true }]); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
      
      {/* MINI CALL WIDGET (When minimized but active) */}
      <AnimatePresence>
        {isVoiceActive && isMinimizedCall && !isOpen && (
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.8 }}
                className="pointer-events-auto bg-slate-900 text-white p-3 pr-5 rounded-full shadow-2xl flex items-center gap-4 mb-4 border border-slate-700 backdrop-blur-md"
            >
                <div className="relative">
                    <img src={SOFIA_AVATAR} alt="Sofia" className="w-10 h-10 rounded-full object-cover border-2 border-slate-700" />
                    {voiceStatus === 'speaking' && (
                        <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                    )}
                </div>
                <div className="flex flex-col mr-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Chiamata attiva</span>
                    <span className="text-xs font-bold">{voiceStatus === 'speaking' ? 'Sofia parla...' : 'In ascolto'}</span>
                </div>
                <div className="flex gap-2 border-l border-white/10 pl-4">
                    <button onClick={() => { setIsOpen(true); setIsMinimizedCall(false); }} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Maximize2 size={16} />
                    </button>
                    <button onClick={stopVoiceSession} className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors">
                        <PhoneOff size={16} />
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                width: isVoiceActive ? 320 : 400, // Larghezza Desktop ridotta in chiamata
                height: isVoiceActive ? 420 : 600, // Altezza Desktop ridotta in chiamata
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`
                pointer-events-auto bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col mb-4 origin-bottom-right
                w-[95vw] md:w-auto
                ${isVoiceActive ? 'h-[420px]' : 'h-[80vh] md:h-[600px]'}
            `}
          >
            {/* Header */}
            <div className={`bg-slate-800 flex items-center justify-between shrink-0 transition-all ${isVoiceActive ? 'p-4' : 'p-5'}`}>
               <div className="flex items-center gap-3">
                  <div className="relative">
                     <img src={SOFIA_AVATAR} alt="Sofia AI" className="w-10 h-10 rounded-full object-cover border-2 border-white/10" />
                     {isVoiceActive && (
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-800 ${voiceStatus === 'speaking' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                     )}
                  </div>
                  <div>
                     <h3 className="text-white font-bold text-sm tracking-wide leading-none">Sofia H</h3>
                     {!isVoiceActive && <p className="text-[10px] text-slate-400 font-medium mt-1">Assistente avanzata per gli studi medici</p>}
                  </div>
               </div>
               <div className="flex gap-2">
                 <button onClick={handleToggleOpen} className="p-2 rounded-lg bg-white/10 text-slate-400 hover:text-white">
                    {isVoiceActive ? <Minimize2 size={16} /> : <ChevronDown size={18} />}
                 </button>
               </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/30 flex flex-col scroll-smooth relative">
               
               {/* Call Overlay UI */}
               {isVoiceActive ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white z-10">
                        {/* Visualizer Circle with Avatar */}
                        <div className={`
                            relative rounded-full flex items-center justify-center mb-6 transition-all duration-500
                            ${voiceStatus === 'speaking' 
                                ? 'w-32 h-32 ring-4 ring-emerald-100 shadow-xl shadow-emerald-100' 
                                : 'w-28 h-28'
                            }
                        `}>
                            {voiceStatus === 'speaking' && (
                                <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-20"></div>
                            )}
                            <img 
                                src={SOFIA_AVATAR} 
                                alt="Sofia Speaking" 
                                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                            {voiceStatus === 'speaking' ? 'Sofia parla...' : 'Ti ascolto'}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">
                             Connessione Sicura
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3 w-full">
                             <button onClick={() => { setIsOpen(false); setIsMinimizedCall(true); }} className="px-4 py-3 bg-slate-100 rounded-xl text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors">
                                Nascondi
                             </button>
                             <button onClick={stopVoiceSession} className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                                <PhoneOff size={14} /> Chiudi
                             </button>
                        </div>
                   </div>
               ) : (
                   /* Chat Messages */
                   <div className="p-5 space-y-4 flex flex-col">
                       {messages.map((msg, idx) => (
                          <motion.div key={idx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`flex w-full ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}>
                             <div className={`
                                 px-4 py-3 w-fit max-w-[85%] rounded-[1.2rem] text-sm leading-relaxed shadow-sm 
                                 break-words whitespace-pre-wrap
                                 ${msg.role === Role.USER 
                                    ? 'bg-medical-600 text-white rounded-tr-none' 
                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none italic'
                                 }
                             `}>
                                {msg.text}
                             </div>
                          </motion.div>
                       ))}
                       <div ref={messagesEndRef} />
                   </div>
               )}
            </div>

            {/* Input Area (Only if not in voice mode) */}
            {!isVoiceActive && (
               <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border border-slate-200">
                     <input value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Chiedi a Sofia..." className="flex-1 bg-transparent border-none text-sm px-4 py-2 outline-none text-slate-800 font-medium" />
                     <button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} className="p-2 bg-slate-800 rounded-full text-white hover:bg-medical-600 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                     </button>
                  </div>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex flex-col items-center gap-4 pointer-events-auto">
        
        {/* SECONDARY BUTTON: Text Chat (Visible when closed) */}
        <AnimatePresence>
            {!isOpen && !isMinimizedCall && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 10 }}
                    onClick={handleTextChatClick}
                    className="w-12 h-12 bg-white text-medical-600 rounded-full shadow-lg border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all mb-2"
                    title="Scrivi un messaggio"
                >
                    <MessageSquare size={20} />
                </motion.button>
            )}
        </AnimatePresence>

        {/* MAIN BUTTON: Voice Call / Close */}
        {!isMinimizedCall && (
            <motion.button
              layout
              onClick={handleMainButtonClick}
              className={`h-16 w-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 overflow-hidden ${isOpen ? 'bg-slate-800' : 'bg-white'}`}
            >
               {isOpen ? (
                   <X size={24} className="text-white" />
               ) : (
                   <Phone size={28} className="text-slate-800" />
               )}
               {!isOpen && messages.length > 1 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
               )}
            </motion.button>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
