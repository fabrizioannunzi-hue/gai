import React from 'react';
import { User, FileText, Calendar, Activity, Settings, ShieldCheck, ChevronRight, MessageSquare, ClipboardList, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PatientSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const PatientSidebar: React.FC<PatientSidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const MENU_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: User, desc: 'Panoramica stato' },
    { id: 'clinical_record', label: 'Cartella Clinica', icon: ClipboardList, desc: 'Anamnesi e Farmaci' },
    { id: 'documents', label: 'Documenti', icon: FileText, desc: 'Referti e analisi' },
    { id: 'appointments', label: 'Appuntamenti', icon: Calendar, desc: 'Agenda visite' },
    { id: 'payments', label: 'Pagamenti', icon: CreditCard, desc: 'Fatture e scadenze' },
    { id: 'messages', label: 'Messaggi', icon: MessageSquare, desc: 'Contatta lo studio' },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
            />
        )}
      </AnimatePresence>

      <motion.aside 
        className={`fixed lg:sticky top-0 left-0 h-screen w-80 bg-slate-900 text-slate-300 z-[60] flex flex-col transition-transform duration-300 lg:translate-x-0 border-r border-slate-800 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand Header */}
        <div className="h-24 flex items-center px-8 border-b border-white/5 shrink-0 bg-slate-950/50">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-medical-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-medical-900/50">
                    <Activity size={20} />
                </div>
                <div>
                    <h1 className="font-bold text-white text-lg tracking-tight leading-none">Studio Grilli</h1>
                    <p className="text-[10px] text-medical-500 font-bold uppercase tracking-[0.2em] mt-1.5">Patient Portal</p>
                </div>
            </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
            <div className="px-4 mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Menu Principale</p>
            </div>
            {MENU_ITEMS.map(item => {
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => handleNav(item.id)}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                            isActive 
                            ? 'bg-medical-600/10 text-white' 
                            : 'hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-medical-500 rounded-r-full"></div>}
                        <item.icon size={20} className={`transition-colors ${isActive ? 'text-medical-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        <div className="text-left">
                            <span className="block font-bold">{item.label}</span>
                            <span className={`text-[10px] ${isActive ? 'text-medical-200/70' : 'text-slate-600'} group-hover:text-slate-500 transition-colors`}>{item.desc}</span>
                        </div>
                        {isActive && <ChevronRight size={16} className="ml-auto text-medical-500" />}
                    </button>
                );
            })}

            <div className="mt-8 px-4 mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Configurazione</p>
            </div>
            <button 
                onClick={() => handleNav('profile')}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'profile' ? 'text-white bg-white/5' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
                <Settings size={18} /> Account & Profilo
            </button>
            <button 
                onClick={() => handleNav('privacy')}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'privacy' ? 'text-white bg-white/5' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
                <ShieldCheck size={18} /> Privacy Center
            </button>
        </nav>

        {/* Secure Footer */}
        <div className="p-6 border-t border-white/5 bg-slate-950/30">
            <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-white/5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <div className="flex-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Connessione Sicura</p>
                    <p className="text-[9px] text-slate-600">AES-256 Encrypted</p>
                </div>
                <ShieldCheck size={14} className="text-emerald-500/50" />
            </div>
        </div>
      </motion.aside>
    </>
  );
};