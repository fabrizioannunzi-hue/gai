
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, Scale, UserCheck, Cookie, Info, Mail, Gavel, FileCheck, ShieldAlert, Server, BrainCircuit, Globe, UploadCloud, FileText, Database } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

interface LegalPageProps {
  type: 'privacy' | 'cookie' | 'terms';
  onBack: () => void;
}

const LegalPage: React.FC<LegalPageProps> = ({ type, onBack }) => {
  const isPrivacy = type === 'privacy';
  const isCookie = type === 'cookie';
  const isTerms = type === 'terms';

  const getTitle = () => {
    if (isPrivacy) return 'Informativa Privacy & Ruoli GDPR';
    if (isCookie) return 'Cookie Policy & Local Storage';
    return 'Termini di Servizio & Disclaimer AI';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8 font-sans selection:bg-medical-100">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-medical-600 font-black text-xs uppercase tracking-widest mb-12 transition-colors group">
          <div className="bg-white p-2 rounded-xl shadow-sm group-hover:bg-medical-50 transition-colors border border-slate-100"><ArrowLeft size={16} /></div> Torna al sito
        </button>

        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-12 text-white relative overflow-hidden">
             <div className="relative z-10">
                <span className="text-medical-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Area Legale & Compliance</span>
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">{getTitle()}</h1>
             </div>
          </div>

          <div className="p-8 md:p-12 space-y-12 text-slate-600 leading-relaxed text-sm md:text-base">
            
            {isPrivacy && (
              <>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-sm text-blue-900">
                  <strong className="block mb-2 text-blue-700 uppercase tracking-widest text-xs">Definizione Ruoli (Art. 28 GDPR)</strong>
                  <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Titolare del Trattamento (Controller):</strong> Dr. Federico Grilli / Studio Medico. Decide finalità e mezzi.</li>
                      <li><strong>Responsabile del Trattamento (Processor):</strong> Piattaforma Software. Elabora i dati per conto del titolare.</li>
                  </ul>
                </div>

                <section className="space-y-4">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-3"><Database className="text-medical-600" size={24} /> Data Retention Policy</h2>
                  <p>I dati sanitari vengono conservati per il tempo strettamente necessario alle finalità di cura o per obblighi di legge (es. 10 anni per fini fiscali/assicurativi). L'utente può richiedere l'export dei propri dati in formato standard (CSV/XML) in qualsiasi momento (Portabilità).</p>
                </section>
              </>
            )}

            {isTerms && (
              <>
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-sm text-red-900 flex items-start gap-4">
                  <ShieldAlert className="shrink-0 text-red-600" size={24} />
                  <div>
                    <strong className="block mb-1 text-red-700 uppercase tracking-widest text-xs">Disclaimer AI Fondamentale</strong>
                    Il sistema di Intelligenza Artificiale "Sofia" è un mero <strong>strumento di supporto</strong> amministrativo e di bozza.
                    <strong>NON</strong> emette diagnosi, <strong>NON</strong> prescrive terapie autonomamente.
                    Ogni documento generato dall'AI deve essere esplicitamente validato e firmato dal medico Titolare prima di avere validità clinica.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LegalPage;
