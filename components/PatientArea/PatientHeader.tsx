
import React from 'react';
import { Bell, Search, Menu, LogOut, HelpCircle } from 'lucide-react';
import { PatientProfile } from '../../types';

interface PatientHeaderProps {
  patient: PatientProfile;
  onLogout: () => void;
  toggleSidebar: () => void;
  title: string;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ patient, onLogout, toggleSidebar, title }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-6 md:px-8 transition-all duration-300">
      
      {/* LEFT: Title & Toggle */}
      <div className="flex items-center gap-4 min-w-0">
        <button onClick={toggleSidebar} className="lg:hidden p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
          <Menu size={22} />
        </button>
        <div className="truncate">
          <h2 className="text-xl font-black text-slate-800 tracking-tight truncate">{title}</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden md:block">Fascicolo Sanitario Elettronico</p>
        </div>
      </div>

      {/* RIGHT: Actions & Profile */}
      <div className="flex items-center gap-3 md:gap-5 shrink-0">
        
        {/* Search Bar (Responsive) */}
        <div className="hidden lg:flex items-center bg-slate-50/80 px-4 py-2.5 rounded-2xl border border-slate-200 focus-within:border-medical-400 focus-within:ring-2 focus-within:ring-medical-100 focus-within:bg-white transition-all w-56 focus-within:w-72">
           <Search size={16} className="text-slate-400 mr-2.5" />
           <input type="text" placeholder="Cerca nel fascicolo..." className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 w-full placeholder:text-slate-400" />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1.5">
            <button className="relative p-2.5 text-slate-400 hover:text-medical-600 hover:bg-slate-50 rounded-xl transition-all">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="hidden md:block p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <HelpCircle size={20} />
            </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200 hidden md:block mx-1"></div>

        {/* Profile */}
        <div className="flex items-center gap-3 group">
            <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800 leading-none">{patient.registry.firstName}</p>
                <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-widest">ID: {patient.id.substring(0,4)}</p>
            </div>
            
            <div className="relative cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center text-white shadow-lg shadow-medical-500/20 group-hover:scale-105 transition-transform duration-300 ring-2 ring-white">
                    <span className="font-bold">{patient.registry.firstName.charAt(0)}{patient.registry.lastName.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            
            <button 
                onClick={onLogout}
                className="ml-1 p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Esci"
            >
                <LogOut size={18} />
            </button>
        </div>

      </div>
    </header>
  );
};
