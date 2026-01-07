
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Mic, Save, Minimize2, ShieldCheck, Sparkles, BrainCircuit, Activity,
  Bot, Loader2, User, CheckCircle2, AlertTriangle, Zap, Server, ChevronRight, PhoneOff
} from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Type } from '@google/genai';
import { BrainStore } from '../services/brainStore';
import { buildMasterPrompt } from '../services/aiPromptService';

const SOFIA_AVATAR = "https://i.ibb.co/svrs9b0B/unnamed-10.jpg";

// Audio Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) { binary += String.fromCharCode(bytes[i]); }
  return btoa(binary);
}
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) { bytes[i] = binaryString.charCodeAt(i); }
  return bytes;
}
async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(numChannels, dataInt16.length / numChannels, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++) { channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; }
  }
  return buffer;
}

export default function LiveVoiceModal({ 
  onClose, 
  isTrainingMode = false, 
  initialContext,
  onOpenCalendly 
}: { 
  onClose: () => void, 
  isTrainingMode?: boolean, 
  initialContext?: string | null,
  onOpenCalendly?: () => void,
  key?: React.Key
}) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [status, setStatus] = useState<'connecting' | 'listening' | 'speaking' | 'thinking'>('connecting');
  const [transcripts, setTranscripts] = useState<{role: 'user'|'bot', text: string}[]>([]);
  const [proposed, setProposed] = useState<any>(null);
  const [saveComplete, setSaveComplete] = useState(false);
  const [neuralLog, setNeuralLog] = useState<string[]>([]);
  
  const sessionRef = useRef<any>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nextStartTimeRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);

  const addLog = (msg: string) => setNeuralLog(prev => [msg, ...prev].slice(0, 3));

  // Auto-scroll effect
  useEffect(() => {
    if (scrollRef.current) {
        const scrollElement = scrollRef.current;
        scrollElement.scrollTo({
            top: scrollElement.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [transcripts, proposed]);

  const handleSave = () => {
    if (!proposed) return;
    addLog(`Sincronia in corso...`);
    BrainStore.saveBrick({
      type: proposed.type as any || 'AUTHORIZED_ADVICE',
      title: proposed.title,
      tags: proposed.tags || ['training_session'],
      content: proposed.content
    });
    setSaveComplete(true);
    addLog(`Firma certificata.`);
    setTimeout(() => {
      setProposed(null);
      setSaveComplete(false);
    }, 2500);
  };

  const forceKillSession = async () => {
    isClosingRef.current = true;
    if (audioSourceRef.current) {
        try { audioSourceRef.current.stop(); } catch(e) {}
        audioSourceRef.current = null;
    }
    if (inputCtxRef.current) try { await inputCtxRef.current.suspend(); } catch(e) {}
    if (outputCtxRef.current) try { await outputCtxRef.current.suspend(); } catch(e) {}
    if (sessionRef.current) {
        try { await sessionRef.current.close(); } catch(e) {}
        sessionRef.current = null;
    }
    if (inputCtxRef.current) try { inputCtxRef.current.close(); } catch(e) {}
    if (outputCtxRef.current) try { outputCtxRef.current.close(); } catch(e) {}
  };

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const inputCtx = new AudioContext({ sampleRate: 16000 });
    inputCtxRef.current = inputCtx;
    outputCtxRef.current = new AudioContext({ sampleRate: 24000 });

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const systemPrompt = buildMasterPrompt(isTrainingMode, initialContext || null);

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: systemPrompt,
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            tools: [{
              functionDeclarations: [
                {
                  name: "proposeSynapticBrick",
                  description: "Propone un nuovo mattone di memoria per SOFIA.",
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, enum: ['AUTHORIZED_ADVICE', 'CONSTRAINT', 'KNOWLEDGE', 'INTENT', 'MEDICAL_PROTOCOL'] },
                      title: { type: Type.STRING },
                      content: { type: Type.STRING },
                      tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["title", "content"]
                  }
                },
                {
                  name: "openBookingCalendar",
                  description: "Apre il widget di prenotazione.",
                  parameters: { type: Type.OBJECT, properties: {} }
                }
              ]
            }]
          },
          callbacks: {
            onopen: () => {
              if (isClosingRef.current) return;
              setStatus('listening');
              addLog("Link Neurale Stabilito.");
              const source = inputCtx.createMediaStreamSource(stream);
              const proc = inputCtx.createScriptProcessor(4096, 1, 1);
              
              proc.onaudioprocess = (e) => {
                if (isClosingRef.current) return;
                const inputData = e.inputBuffer.getChannelData(0);
                
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
                const rms = Math.sqrt(sum / inputData.length);
                
                // Soglia aumentata a 0.08 per evitare interruzioni per rumore di fondo
                if (rms > 0.08 && audioSourceRef.current) { 
                   try { 
                     audioSourceRef.current.stop(); 
                     audioSourceRef.current = null;
                     setStatus('listening');
                   } catch(e) {}
                }

                const pcm = new Int16Array(inputData.map(v => v * 32768));
                sessionPromise.then(s => {
                    if (!isClosingRef.current) {
                        s.sendRealtimeInput({ media: { data: encode(new Uint8Array(pcm.buffer)), mimeType: 'audio/pcm;rate=16000' } });
                    }
                });
              };
              source.connect(proc); proc.connect(inputCtx.destination);
            },
            onmessage: async (msg: LiveServerMessage) => {
              if (isClosingRef.current) return;

              if (msg.serverContent?.inputTranscription?.text) {
                const text = msg.serverContent.inputTranscription.text;
                setTranscripts(prev => {
                    const last = prev[prev.length - 1];
                    if (last && last.role === 'user') return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                    return [...prev, { role: 'user', text }];
                });
              }
              if (msg.serverContent?.outputTranscription?.text) {
                const text = msg.serverContent.outputTranscription.text;
                setTranscripts(prev => {
                    const last = prev[prev.length - 1];
                    if (last && last.role === 'bot') return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                    return [...prev, { role: 'bot', text }];
                });
              }

              if (msg.toolCall) {
                setStatus('thinking');
                for (const fc of msg.toolCall.functionCalls) {
                  if (fc.name === 'proposeSynapticBrick') {
                    setProposed(fc.args);
                    addLog(`Matrice rilevata.`);
                    sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: "Memorizzazione pronta." } } }));
                  }
                  
                  if (fc.name === 'openBookingCalendar') {
                    addLog("Calendar Request...");
                    // Just acknowledge and open, DO NOT kill session
                    sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: "OK" } } }));
                    
                    setIsMinimized(true); // Minimize instead of close
                    if (onOpenCalendly) onOpenCalendly();
                  }
                }
              }

              const audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (audio && !isClosingRef.current) {
                setStatus('speaking');
                const buf = await decodeAudioData(decode(audio as string), outputCtxRef.current!, 24000, 1);
                const src = outputCtxRef.current!.createBufferSource();
                src.buffer = buf; 
                src.connect(outputCtxRef.current!.destination);
                audioSourceRef.current = src;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtxRef.current!.currentTime);
                src.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buf.duration;
                src.onended = () => {
                    if (audioSourceRef.current === src) {
                        setStatus('listening');
                        audioSourceRef.current = null;
                    }
                };
              }
            }
          }
        });
        sessionRef.current = await sessionPromise;
      } catch (e) { console.error(e); addLog("Sync Error."); }
    };
    init();
    
    return () => { forceKillSession(); };
  }, [isTrainingMode, initialContext]);

  return (
    <motion.div drag dragMomentum={false} className={`fixed bottom-8 right-8 z-[9999] transition-all duration-500 ${isMinimized ? 'w-20 h-20' : 'w-[400px] md:w-[500px]'}`}>
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.button key="mini" onClick={() => setIsMinimized(false)} className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden border-2 border-white">
            <div className={`absolute inset-0 rounded-full ${status === 'speaking' ? 'bg-medical-500 animate-pulse' : 'bg-slate-800'}`} />
            <img src={SOFIA_AVATAR} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity relative z-10" alt="Sofia" />
          </motion.button>
        ) : (
          <motion.div key="expanded" className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[700px] h-[600px]">
            <div className="bg-slate-800 p-6 flex justify-between items-center cursor-move border-b border-white/5 shrink-0">
              <div className="flex items-center gap-4">
                <img src={SOFIA_AVATAR} className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" alt="Sofia" />
                <div>
                  <h4 className="text-white font-bold text-sm leading-none">Sofia H</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-widest">Assistente avanzata per gli studi medici</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsMinimized(true)} className="text-slate-400 hover:text-white transition-colors"><Minimize2 size={16} /></button>
                <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>
              </div>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 flex flex-col scroll-smooth">
              
              {/* Visualizer Area when connecting or empty */}
              {transcripts.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center opacity-80 min-h-[200px]">
                      <div className="relative w-32 h-32 mb-6">
                          {status === 'speaking' && (
                              <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></div>
                          )}
                          <img src={SOFIA_AVATAR} className="relative w-full h-full rounded-full object-cover border-4 border-white shadow-xl z-10" alt="Sofia Speaking" />
                          <div className={`absolute -bottom-2 -right-2 p-2 rounded-full border-2 border-white z-20 ${status === 'listening' ? 'bg-emerald-500' : 'bg-medical-500'}`}>
                              {status === 'listening' ? <Mic size={16} className="text-white"/> : <Activity size={16} className="text-white animate-pulse"/>}
                          </div>
                      </div>
                      <p className="text-slate-500 text-sm font-bold animate-pulse">
                          {status === 'connecting' ? 'Stabilisco connessione...' : status === 'listening' ? 'Ti ascolto...' : 'Sofia parla...'}
                      </p>
                  </div>
              )}

              <div className="flex flex-col gap-4 w-full pb-4">
                {transcripts.map((t, i) => (
                  <div key={i} className={`flex w-full ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`
                        relative px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm 
                        max-w-[85%] w-fit break-words whitespace-pre-wrap
                        ${t.role === 'user' 
                          ? 'bg-white text-slate-700 border border-slate-200 rounded-tr-sm' 
                          : 'bg-slate-800 text-slate-50 font-medium rounded-tl-sm shadow-md'
                        }
                    `}>
                      {t.text}
                    </div>
                  </div>
                ))}
              </div>

              {proposed && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded-[2.5rem] border-2 border-emerald-500 shadow-2xl relative overflow-hidden shrink-0 my-4">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={80} /></div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase mb-4">
                    <Sparkles size={14} /> Nuova Conoscenza Rilevata
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg mb-2">{proposed.title}</h4>
                  <div className="text-xs text-slate-500 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 italic leading-relaxed whitespace-pre-wrap">
                    "{proposed.content}"
                  </div>
                  <button onClick={handleSave} disabled={saveComplete} className={`w-full py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${saveComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 active:scale-95'}`}>
                    {saveComplete ? <CheckCircle2 size={18} /> : <Zap size={18} />}
                    {saveComplete ? 'MEMORIZZATO' : 'CONFERMA BRICK'}
                  </button>
                </motion.div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${status === 'listening' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                   <span className="text-[10px] font-bold uppercase text-slate-400">Audio Secure Channel</span>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
