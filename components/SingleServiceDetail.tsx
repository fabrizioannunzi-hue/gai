
import React from 'react';
import { 
  ArrowLeft, CheckCircle2, MapPin, 
  Clock, FileText, AlertTriangle,
  Mail, Calendar, Sparkles, Anchor, Smile, ScanFace, Zap, Droplets
} from 'lucide-react';
import { SubService } from '../types';
import { motion } from 'framer-motion';

interface SingleServiceDetailProps {
  subService: SubService;
  categoryTitle: string;
  onBack: () => void;
  onBookClick: () => void;
  onAiClick?: () => void;
}

const SingleServiceDetail: React.FC<SingleServiceDetailProps> = ({ subService, categoryTitle, onBack, onBookClick, onAiClick }) => {
  
  const getIcon = (name: string | undefined) => {
    switch(name) {
      case 'Sparkles': return <Sparkles size={32} />;
      case 'Droplets': return <Droplets size={32} />;
      case 'Zap': return <Zap size={32} />;
      case 'Anchor': return <Anchor size={32} />;
      case 'Smile': return <Smile size={32} />;
      case 'ScanFace': return <ScanFace size={32} />;
      default: return <FileText size={32} />;
    }
  };

  const getThemeColor = (name: string | undefined) => {
    switch(name) {
      case 'Sparkles': case 'Droplets': case 'Zap': return 'bg-blue-500 text-white';
      case 'Anchor': return 'bg-orange-500 text-white';
      case 'Smile': case 'ScanFace': return 'bg-pink-500 text-white';
      default: return 'bg-medical-500 text-white';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto pb-20 px-4"
    >
      <div className="mb-12 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-500 hover:text-medical-600 transition-all font-bold text-sm"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span>Torna ai Servizi</span>
        </button>
        
        <button 
          onClick={onBookClick}
          className="hidden md:flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-medical-600 transition-all shadow-lg active:scale-95"
        >
          <Calendar size={16} />
          Prenota Ora
        </button>
      </div>

      <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 mb-12">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className={`w-20 h-20 shrink-0 rounded-[1.5rem] flex items-center justify-center shadow-lg ${getThemeColor(subService.iconName)}`}>
            {getIcon(subService.iconName)}
          </div>
          
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight mb-6">
              {subService.title}
            </h1>
            <div className="inline-block bg-[#00cca3] text-white px-6 py-2 rounded-full font-bold text-lg shadow-sm mb-8">
              {subService.price}
            </div>
            
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-wrap mb-12">
              {subService.fullDescription}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-medical-50 p-6 rounded-2xl flex items-center gap-4 border border-medical-100">
                <Clock className="text-medical-600" size={24} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Durata</p>
                  <p className="font-bold text-slate-800">{subService.duration || "Variabile"}</p>
                </div>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl flex items-center gap-4 border border-emerald-100">
                <MapPin className="text-emerald-600" size={24} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Modalità</p>
                  <p className="font-bold text-slate-800">{subService.mode || "In presenza"}</p>
                </div>
              </div>
              <div className="bg-purple-50 p-6 rounded-2xl flex items-center gap-4 border border-purple-100">
                <FileText className="text-purple-600" size={24} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Referto/Piano</p>
                  <p className="font-bold text-slate-800">{subService.reportTime || "Immediato"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {subService.requiresPresence && (
        <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 mb-8 flex items-start gap-4">
          <AlertTriangle className="text-amber-500 shrink-0" size={24} />
          <div>
            <h4 className="font-black text-amber-900 uppercase tracking-widest text-sm mb-1">Importante</h4>
            <p className="text-amber-800/80 text-sm font-medium">Questo è un trattamento clinico che richiede la presenza in studio. Non è effettuabile online.</p>
          </div>
        </div>
      )}

      {subService.preparatoryNotes && (
        <div className="bg-blue-50 rounded-[2.5rem] p-8 border border-blue-100 mb-12 flex items-start gap-4">
          <FileText className="text-blue-600 shrink-0" size={24} />
          <div>
            <h4 className="font-black text-blue-900 uppercase tracking-widest text-sm mb-2">Note Preparative</h4>
            <p className="text-blue-900/70 text-sm font-medium leading-relaxed whitespace-pre-wrap">{subService.preparatoryNotes}</p>
          </div>
        </div>
      )}

      {subService.includedList && (
        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm mb-16">
          <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <CheckCircle2 size={24} className="text-emerald-500" />
            Il Trattamento Include
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subService.includedList.map((item, i) => (
              <div key={i} className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4 group hover:bg-emerald-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-slate-700 font-bold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-medical-700 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden text-center md:text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Prenota il tuo sorriso</h2>
          <p className="text-medical-100 text-lg font-medium mb-10 max-w-2xl leading-relaxed">
            Contatta il nostro assistente virtuale Sofia o prenota direttamente online la tua visita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onBookClick}
              className="bg-white text-medical-700 px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Calendar size={18} />
              Prenota Ora
            </button>
            <button 
              onClick={() => window.location.href = `mailto:info@studiobianchidentista.it?subject=Richiesta informazioni: ${subService.title}`}
              className="bg-medical-600/50 text-white border border-white/20 px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-medical-600 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Mail size={18} />
              Invia Email
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SingleServiceDetail;
