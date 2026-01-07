
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Building2, Clock, ShieldCheck, ArrowRight, Save, Activity } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    clinicName: 'Bianchi Dental Studio',
    piva: '',
    director: 'Dr. Alessandro Bianchi',
    address: 'Corso Buenos Aires 15, Milano',
    hours: '09:00 - 19:00',
    gdprDpo: '',
    softwareRole: 'RESPONSABILE_TRATTAMENTO'
  });

  const nextStep = () => setStep(step + 1);

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-center">
           <div>
              <h2 className="text-2xl font-black text-slate-900">Setup Studio</h2>
              <p className="text-slate-500 text-sm">Configurazione iniziale del sistema (1-2 min)</p>
           </div>
           <div className="flex gap-2">
              {[1,2,3].map(i => (
                 <div key={i} className={`w-3 h-3 rounded-full ${step >= i ? 'bg-medical-600' : 'bg-slate-200'}`} />
              ))}
           </div>
        </div>

        {/* Content */}
        <div className="p-8">
           {step === 1 && (
              <div className="space-y-6">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Building2 size={24}/></div>
                    <div>
                       <h3 className="text-lg font-bold text-slate-900">Dati Struttura</h3>
                       <p className="text-sm text-slate-500">Definisci l'identità legale dello studio.</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-400">Nome Studio / Ragione Sociale</label>
                        <input type="text" value={data.clinicName} onChange={e => setData({...data, clinicName: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-medical-500" />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-400">P.IVA / Codice Fiscale</label>
                        <input type="text" value={data.piva} onChange={e => setData({...data, piva: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-medical-500" placeholder="IT00000000000" />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-400">Direttore Sanitario</label>
                        <input type="text" value={data.director} onChange={e => setData({...data, director: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-medical-500" />
                    </div>
                 </div>
                 <button onClick={nextStep} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all">
                    Continua <ArrowRight size={18} />
                 </button>
              </div>
           )}

           {step === 2 && (
              <div className="space-y-6">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><ShieldCheck size={24}/></div>
                    <div>
                       <h3 className="text-lg font-bold text-slate-900">Compliance GDPR</h3>
                       <p className="text-sm text-slate-500">Definizione ruoli privacy.</p>
                    </div>
                 </div>
                 <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs text-amber-800 mb-4">
                    <strong>Nota Legale:</strong> Il software agisce come "Responsabile del Trattamento" (Data Processor). Lo studio è il "Titolare" (Data Controller).
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-400">Email DPO (Responsabile Privacy)</label>
                        <input type="email" value={data.gdprDpo} onChange={e => setData({...data, gdprDpo: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-medical-500" placeholder="privacy@studio.it" />
                    </div>
                    <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-800">Registro Trattamenti</p>
                            <p className="text-xs text-slate-500">Attiva log automatico accessi</p>
                        </div>
                        <div className="w-10 h-6 bg-medical-600 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                    </div>
                 </div>
                 <button onClick={nextStep} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all">
                    Continua <ArrowRight size={18} />
                 </button>
              </div>
           )}

           {step === 3 && (
              <div className="space-y-6 text-center">
                 <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity size={40} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900">Tutto Pronto!</h3>
                 <p className="text-slate-500">Il sistema è configurato e pronto all'uso. Puoi modificare questi dati in qualsiasi momento dalle impostazioni.</p>
                 
                 <div className="bg-slate-50 p-4 rounded-xl text-left space-y-2 text-xs text-slate-600 font-mono">
                    <p>✓ Anagrafica Studio: Configurato</p>
                    <p>✓ Ruoli GDPR: Definiti</p>
                    <p>✓ Database Locale: Inizializzato</p>
                 </div>

                 <button onClick={onComplete} className="w-full py-4 bg-medical-600 text-white rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-medical-700 transition-all shadow-lg shadow-medical-500/30">
                    <Save size={18} /> Vai alla Dashboard
                 </button>
              </div>
           )}
        </div>
      </motion.div>
    </div>
  );
};
