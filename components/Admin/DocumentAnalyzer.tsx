
import React, { useState, useRef, useEffect } from 'react';
import { AiClinicalService } from '../../services/aiClinicalService';
import { DocumentService } from '../../services/appointmentManager';
import { UploadCloud, FileSearch, CheckCircle2, AlertTriangle, FileText, X, Loader2, ArrowRight, BrainCircuit, Save, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PatientService } from '../../services/appointmentManager';
import { PatientProfile } from '../../types';

interface DocumentAnalyzerProps {
    onSaveSuccess?: () => void;
}

export const DocumentAnalyzer: React.FC<DocumentAnalyzerProps> = ({ onSaveSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(''); 
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    PatientService.getAll().then(setPatients);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysis(null);
      setIsSaved(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    try {
      const result = await AiClinicalService.analyzeDocument(file);
      setAnalysis(result);
      if (result.patientName) {
         const match = patients.find(p =>
             result.patientName.toLowerCase().includes(p.registry.lastName.toLowerCase())
         );
         if (match) setSelectedPatientId(match.id);
      }
    } catch (e) {
      alert("Impossibile analizzare il documento. Riprova.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToRecord = async () => {
      if (!analysis || !selectedPatientId) {
          alert("Seleziona un paziente per salvare l'analisi.");
          return;
      }

      const content = JSON.stringify(analysis, null, 2);
      await DocumentService.saveGeneratedDoc(
          selectedPatientId,
          `Analisi AI: ${analysis.documentType || 'Documento'}`,
          content,
          'ANALISI_LABORATORIO'
      );

      setIsSaved(true);
      if (onSaveSuccess) onSaveSuccess();
      setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="text-center mb-10">
         <h2 className="text-3xl font-black text-slate-900 mb-2">Analisi Documentale AI</h2>
         <p className="text-slate-500 font-medium">Carica referti o esami. L'AI estrarrà i dati strutturati e segnalerà criticità.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
           <div 
             onClick={() => fileInputRef.current?.click()}
             className={`border-2 border-dashed rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${file ? 'border-medical-500 bg-medical-50/30' : 'border-slate-200 hover:border-medical-300 hover:bg-slate-50'}`}
           >
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.jpg,.png,.jpeg" onChange={handleFileChange} />
              
              {file ? (
                <div className="relative">
                   <FileText size={48} className="text-medical-600 mb-4 mx-auto" />
                   <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                      <p className="font-bold text-slate-800 text-sm truncate max-w-[200px]">{file.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black">{(file.size/1024/1024).toFixed(2)} MB</p>
                   </div>
                   <button 
                     onClick={(e) => { e.stopPropagation(); setFile(null); setAnalysis(null); }}
                     className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                   >
                     <X size={14} />
                   </button>
                </div>
              ) : (
                <>
                   <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                      <UploadCloud size={32} />
                   </div>
                   <h4 className="font-bold text-slate-800">Clicca per caricare</h4>
                   <p className="text-xs text-slate-400 mt-1">PDF o Immagini (Referti, Esami)</p>
                </>
              )}
           </div>

           <button 
             onClick={handleAnalyze}
             disabled={!file || isAnalyzing}
             className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
           >
             {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
             Avvia Analisi
           </button>
        </div>

        <div className="relative min-h-[400px]">
           <AnimatePresence mode="wait">
             {analysis ? (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col"
               >
                 <div className="bg-slate-900 p-6 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-emerald-500 rounded-lg text-white">
                          <FileSearch size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento Rilevato</p>
                          <p className="text-white font-bold">{analysis.documentType || 'Sconosciuto'}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</p>
                       <p className="text-white font-bold font-mono">{analysis.date || 'N/D'}</p>
                    </div>
                 </div>

                 <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[500px]">
                    <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">Paziente Rilevato</label>
                       <p className="text-lg font-bold text-slate-800">{analysis.patientName || 'Non identificato'}</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block flex items-center gap-2"><FileText size={12}/> Sintesi Clinica</label>
                       <p className="text-sm text-slate-600 leading-relaxed font-medium">"{analysis.summary}"</p>
                    </div>

                    <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block flex items-center gap-2">
                          <AlertTriangle size={12} className={analysis.criticalValues?.length ? 'text-amber-500' : 'text-slate-300'}/> Valori Critici / Note
                       </label>
                       {analysis.criticalValues && analysis.criticalValues.length > 0 ? (
                         <div className="space-y-2">
                            {analysis.criticalValues.map((val: string, i: number) => (
                               <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm font-bold">
                                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                  {val}
                               </div>
                            ))}
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-sm font-bold">
                            <CheckCircle2 size={16} /> Nessun valore critico rilevato.
                         </div>
                       )}
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">Azione Suggerita</label>
                       <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-800">{analysis.suggestedAction}</p>
                       </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-200">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Salva in Cartella</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select 
                                    value={selectedPatientId}
                                    onChange={(e) => setSelectedPatientId(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-medical-500"
                                >
                                    <option value="">Seleziona Paziente...</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.registry.lastName} {p.registry.firstName}</option>
                                    ))}
                                </select>
                            </div>
                            <button 
                                onClick={handleSaveToRecord}
                                disabled={!selectedPatientId || isSaved}
                                className={`px-4 rounded-xl font-bold flex items-center justify-center transition-all ${isSaved ? 'bg-emerald-100 text-emerald-600' : 'bg-medical-600 text-white hover:bg-medical-700'}`}
                            >
                                {isSaved ? <CheckCircle2 size={20} /> : <Save size={20} />}
                            </button>
                        </div>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8 border border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
                  {isAnalyzing ? (
                    <>
                       <Loader2 size={48} className="text-medical-600 animate-spin mb-4" />
                       <p className="text-slate-500 font-bold animate-pulse">Analisi Vision in corso...</p>
                    </>
                  ) : (
                    <>
                       <FileSearch size={48} className="mb-4 opacity-50" />
                       <p className="font-bold uppercase tracking-widest text-xs">I risultati appariranno qui</p>
                    </>
                  )}
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
