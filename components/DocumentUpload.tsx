
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, FileCheck, X, Loader2, AlertCircle, FileText, CheckCircle2, UploadCloud, CheckSquare, ShieldCheck } from 'lucide-react';
import { PatientManager } from '../services/appointmentManager';

interface DocumentUploadProps {
  patientId: string;
  onUploadSuccess: () => void;
  onCancel: () => void;
}

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ patientId, onUploadSuccess, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('Referto');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Legal Acceptance State
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setErrorMessage("Formato non supportato. Carica PDF, JPG, PNG o WebP.");
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setErrorMessage("Il file supera i 5MB consentiti.");
      return;
    }
    setFile(selectedFile);
    setErrorMessage('');
    setUploadStatus('idle');
    setTermsAccepted(false); // Reset terms on new file
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const startUpload = async () => {
    if (!file) return;
    if (!termsAccepted) {
        setErrorMessage("Devi accettare i termini per procedere.");
        return;
    }

    setUploadStatus('uploading');
    let currentProgress = 0;
    
    // Simulate upload progress UI
    const interval = setInterval(() => {
      currentProgress += Math.random() * 20;
      if (currentProgress > 90) clearInterval(interval);
      else setProgress(currentProgress);
    }, 200);

    try {
        // Actual upload process
        await PatientManager.addDocument(patientId, file, docType);
        
        clearInterval(interval);
        setProgress(100);
        
        setTimeout(() => {
          setUploadStatus('success');
          setTimeout(() => {
            onUploadSuccess();
          }, 1500);
        }, 500);
    } catch (e) {
        clearInterval(interval);
        setUploadStatus('error');
        setErrorMessage("Errore durante l'upload. Riprova.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden"
    >
      <div className="p-8 md:p-10">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-medical-50 text-medical-600 rounded-2xl">
                 <UploadCloud size={24} />
              </div>
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Caricamento Documenti</h3>
                 <p className="text-xs text-slate-500 font-medium">I file verranno criptati e archiviati.</p>
              </div>
           </div>
           <button onClick={onCancel} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
              <X size={20} />
           </button>
        </div>

        {uploadStatus === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12 flex flex-col items-center text-center"
          >
             <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={40} className="animate-bounce-slow" />
             </div>
             <h4 className="text-2xl font-black text-slate-900 mb-2">Caricamento Completato!</h4>
             <p className="text-slate-500">Il documento è stato aggiunto con successo al tuo profilo.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            
            {/* DRAG AND DROP AREA */}
            {!file ? (
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
                  isDragging ? 'border-medical-500 bg-medical-50/50 scale-[0.98]' : 'border-slate-200 hover:border-medical-300 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                />
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragging ? 'bg-medical-500 text-white scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-medical-600'}`}>
                   <FileUp size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">Seleziona o trascina il file</h4>
                <p className="text-sm text-slate-400 font-medium">PDF, JPG, PNG o WebP (Max 5MB)</p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white rounded-xl shadow-sm text-medical-600">
                      <FileText size={24} />
                   </div>
                   <div className="max-w-[200px] md:max-w-xs overflow-hidden">
                      <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                   </div>
                </div>
                {uploadStatus === 'idle' && (
                  <button onClick={() => setFile(null)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* ERROR MESSAGE */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm font-medium"
                >
                  <AlertCircle size={16} /> {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* FORM FIELDS */}
            {file && (uploadStatus === 'idle' || uploadStatus === 'error') && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Tipo Documento</label>
                   <div className="grid grid-cols-2 gap-2">
                      {['Referto', 'Analisi', 'Ecografia', 'Altro'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setDocType(type)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                            docType === type ? 'bg-medical-600 border-medical-600 text-white shadow-lg shadow-medical-500/20' : 'bg-white border-slate-100 text-slate-500 hover:border-medical-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                   </div>
                </div>

                {/* LEGAL ACCEPTANCE BOX */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                            <input type="checkbox" className="peer sr-only" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
                            <div className={`w-5 h-5 rounded border-2 transition-all ${termsAccepted ? 'bg-medical-600 border-medical-600' : 'border-slate-300 bg-white'}`}></div>
                            {termsAccepted && <CheckSquare size={14} className="text-white absolute pointer-events-none" />}
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-slate-700 font-bold leading-snug">
                                Dichiaro di essere il legittimo titolare del documento.
                            </p>
                            <p className="text-[10px] text-slate-500 leading-relaxed text-justify">
                                Autorizzo il caricamento nel Fascicolo Sanitario e l'eventuale elaborazione tramite sistemi di Intelligenza Artificiale a supporto della diagnosi medica, sollevando lo studio da responsabilità su contenuti illeciti o non veritieri.
                            </p>
                        </div>
                    </label>
                </div>
                
                <button 
                  onClick={startUpload}
                  disabled={!termsAccepted}
                  className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${termsAccepted ? 'bg-slate-900 hover:bg-black text-white active:scale-[0.98]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  <span>Inizia Caricamento</span>
                  {termsAccepted ? <ArrowRight size={20} /> : <ShieldCheck size={20} />}
                </button>
              </motion.div>
            )}

            {/* UPLOADING STATE */}
            {uploadStatus === 'uploading' && (
              <div className="py-6 space-y-4">
                 <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                       <Loader2 size={16} className="text-medical-600 animate-spin" />
                       <span className="text-sm font-bold text-slate-700">Caricamento in corso...</span>
                    </div>
                    <span className="text-xs font-black text-medical-600">{Math.round(progress)}%</span>
                 </div>
                 <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-medical-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                 </div>
                 <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-black">Crittografia End-to-End attiva</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ArrowRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
);
