
import React, { useState } from 'react';
import { PatientProfile } from '../../types';
import { AiClinicalService } from '../../services/aiClinicalService';
import { DocumentService } from '../../services/appointmentManager';
import { FileText, Wand2, Printer, Copy, Loader2, Save, Sparkles, Check, Download, Lock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReportGeneratorProps {
  patient: PatientProfile | null;
  onSaveSuccess?: () => void;
}

const TEMPLATES = [
  { label: 'Esito Negativo', text: "L'esame genetico non ha evidenziato varianti patogenetiche. Si consiglia follow-up clinico tra 12 mesi.", icon: '✓' },
  { label: 'Richiesta Esoma', text: "Visto il quadro clinico complesso e non conclusivo, si raccomanda l'esecuzione di analisi dell'Esoma (WES) in trio.", icon: '🧬' },
  { label: 'Consulenza Preconcezionale', text: "La coppia non presenta rischi aumentati rispetto alla popolazione generale. Si consiglia acido folico.", icon: '👶' }
];

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ patient, onSaveSuccess }) => {
  const [notes, setNotes] = useState('');
  const [visitType, setVisitType] = useState('Prima Visita Genetica');
  const [report, setReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isValidated, setIsValidated] = useState(false); // HITL Check
  const [isSaving, setIsSaving] = useState(false);
  
  const handleGenerate = async () => {
    if (!patient || !notes.trim()) return;
    setIsGenerating(true);
    setIsSaved(false);
    setIsValidated(false); // Reset validation on new generation
    try {
      const result = await AiClinicalService.generateReport(patient, notes, visitType);
      setReport(result);
    } catch (e) {
      alert("Errore durante la generazione.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleValidation = () => {
      setIsValidated(true);
  };

  const handleSave = async () => {
    if (!patient || !report || isSaving) return;
    if (!isValidated) {
        alert("Devi validare il referto prima di salvarlo.");
        return;
    }
    
    setIsSaving(true);
    try {
      await DocumentService.saveGeneratedDoc(
          patient.id,
          `Referto_${visitType.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}`,
          report,
          'REFERTO_MEDICO'
      );
      setIsSaved(true);
      if (onSaveSuccess) onSaveSuccess();
      setTimeout(() => setIsSaved(false), 4000);
    } catch (error) {
      alert('Errore durante il salvataggio del referto');
    } finally {
      setIsSaving(false);
    }
  };

  if (!patient) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-slate-400 p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-gradient-to-br from-slate-50 to-white">
        <div className="bg-slate-100 p-6 rounded-3xl mb-6"><FileText size={64} className="opacity-50" /></div>
        <p className="font-black uppercase tracking-widest text-sm text-center text-slate-600">Seleziona un paziente</p>
      </motion.div>
    );
  }

  return (
    <>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col gap-6 h-full">
        {/* INPUT SECTION */}
        <motion.div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><Wand2 size={20} className="text-medical-600" /> Input Clinico</h3>
          <div className="space-y-4 flex-1 flex flex-col overflow-y-auto">
            <select value={visitType} onChange={(e) => setVisitType(e.target.value)} className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl font-semibold text-sm outline-none focus:border-medical-500 focus:bg-white transition-all">
                <option>Prima Visita Genetica</option>
                <option>Visita di Controllo</option>
                <option>Consulenza Preconcezionale</option>
            </select>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Inserisci qui note cliniche..." className="flex-1 w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-mono text-sm outline-none focus:border-medical-500 focus:bg-white resize-none mb-3 transition-all min-h-[200px]" />
            <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map((t, i) => (
                    <button key={i} onClick={() => setNotes(prev => prev + (prev ? '\n\n' : '') + t.text)} className="p-2 bg-white border border-slate-200 rounded-xl text-center text-[10px] hover:border-medical-300 font-bold text-slate-600 hover:text-medical-700 transition-all">{t.label}</button>
                ))}
            </div>
            <button onClick={handleGenerate} disabled={isGenerating || !notes} className="w-full py-4 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:shadow-xl transition-all shadow-lg shadow-medical-500/30 flex items-center justify-center gap-2 disabled:opacity-50">
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Genera Bozza AI
            </button>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col h-full">
        {/* PREVIEW & VALIDATION SECTION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-slate-100">
             <div>
                <h4 className="font-black text-slate-900 text-lg flex items-center gap-2"><FileText size={20} className="text-medical-600" /> Bozza Referto</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Richiede validazione medica</p>
             </div>
             {isValidated && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-emerald-200"><Check size={12}/> Validato</span>}
          </div>

          <textarea 
            value={report} 
            onChange={(e) => { setReport(e.target.value); setIsValidated(false); }} 
            className={`flex-1 w-full bg-slate-50/50 p-6 rounded-2xl border-2 outline-none resize-none font-serif text-slate-700 leading-relaxed text-sm whitespace-pre-wrap transition-all ${isValidated ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100 focus:border-medical-300 focus:bg-white'}`}
            placeholder="Il referto generato apparirà qui..."
          />

          <AnimatePresence>
            {report && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 pt-4 border-t-2 border-slate-100 flex flex-wrap gap-3 justify-end items-center">
                {!isValidated ? (
                    <button onClick={handleValidation} className="px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200 w-full justify-center">
                        <ShieldCheck size={16} /> Valida Contenuto
                    </button>
                ) : (
                    <button onClick={handleSave} disabled={isSaving || isSaved} className={`px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg w-full justify-center ${isSaved ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}>
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : isSaved ? <Check size={14} /> : <Save size={14} />}
                        {isSaved ? 'Salvato' : 'Firma e Salva'}
                    </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
    </>
  );
};
