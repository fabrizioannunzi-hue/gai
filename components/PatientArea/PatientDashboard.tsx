
import React from 'react';
import { PatientProfile, CrmAppointment, ClinicalDocument } from '../../types';
import { FileCheck, Calendar, Clock, ChevronRight, Activity, Plus, FileText, ArrowUpRight, AlertCircle, Heart, Droplets, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

interface PatientDashboardProps {
  patient: PatientProfile;
  appointments: CrmAppointment[];
  documents: ClinicalDocument[];
  onNavigate: (tab: any) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ patient, appointments, documents, onNavigate }) => {
  const doctorDocs = documents.filter(d => d.uploaderRole === 'DOCTOR');
  const nextAppt = appointments.find(a => new Date(a.date) >= new Date() && a.status !== 'CANCELLED');
  const pastAppts = appointments.filter(a => a.status === 'COMPLETED');

  // Greeting logic
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buongiorno' : hour < 18 ? 'Buon pomeriggio' : 'Buonasera';

  // Mock Health Data for Demo
  const vitals = [
      { label: 'Pressione', value: '120/80', unit: 'mmHg', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50', trend: '+1%' },
      { label: 'Battito', value: '72', unit: 'bpm', icon: Heart, color: 'text-red-500', bg: 'bg-red-50', trend: 'Stable' },
      { label: 'Peso', value: '74.5', unit: 'kg', icon: Scale, color: 'text-indigo-500', bg: 'bg-indigo-50', trend: '-0.5kg' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">{greeting}, {patient.registry.firstName}</h1>
           <p className="text-slate-500 font-medium">Ecco il riepilogo clinico aggiornato.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => onNavigate('new_appointment')} className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 flex items-center gap-2">
              <Plus size={16} /> Nuova Visita
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* NEXT APPOINTMENT */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-medical-200 transition-colors">
                <div className="absolute top-0 right-0 w-64 h-64 bg-medical-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="flex items-center gap-2 text-medical-600 font-bold text-xs uppercase tracking-widest mb-6">
                    <Clock size={14} /> 
                    {nextAppt ? 'Prossima Visita' : 'Agenda'}
                </div>

                {nextAppt ? (
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
                        <div className="bg-slate-50 rounded-2xl p-4 min-w-[100px] text-center border border-slate-100">
                            <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{new Date(nextAppt.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="block text-4xl font-black text-slate-900 leading-none">{new Date(nextAppt.date).getDate()}</span>
                        </div>
                        <div className="flex-1">
                             <h3 className="text-2xl font-bold text-slate-900 mb-2">{nextAppt.serviceType}</h3>
                             <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                                 <span className="flex items-center gap-1"><Clock size={14}/> {nextAppt.time}</span>
                                 <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                 <span className="flex items-center gap-1 uppercase text-xs font-bold tracking-wider">{nextAppt.mode}</span>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <p className="text-slate-500 text-lg mb-6">Nessuna visita programmata. Ricorda di effettuare i controlli periodici.</p>
                        <button onClick={() => onNavigate('new_appointment')} className="text-medical-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                            Prenota ora <ArrowUpRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* VITALS SECTION (NEW) */}
            <div className="grid grid-cols-3 gap-4">
                {vitals.map((v, i) => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 rounded-xl ${v.bg} ${v.color} flex items-center justify-center mb-3`}>
                            <v.icon size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{v.label}</span>
                        <div className="text-xl font-black text-slate-900 mt-1">{v.value} <span className="text-xs font-medium text-slate-400">{v.unit}</span></div>
                    </div>
                ))}
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 gap-6">
                <motion.div whileHover={{ y: -4 }} onClick={() => onNavigate('documents')} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm cursor-pointer hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><FileCheck size={24}/></div>
                    </div>
                    <div className="text-4xl font-black text-slate-900 mb-1">{doctorDocs.length}</div>
                    <div className="text-sm font-bold text-slate-500">Referti</div>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} onClick={() => onNavigate('appointments')} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm cursor-pointer hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Activity size={24}/></div>
                    </div>
                    <div className="text-4xl font-black text-slate-900 mb-1">{pastAppts.length}</div>
                    <div className="text-sm font-bold text-slate-500">Visite Fatte</div>
                </motion.div>
            </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-20"><Activity size={80} /></div>
                <h3 className="text-lg font-bold mb-4 relative z-10">AI Health Insights</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 relative z-10">
                    Basato sui tuoi ultimi referti, i parametri rientrano nella norma. Ricorda il follow-up tra 3 mesi.
                </p>
                <div className="flex gap-2 relative z-10">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">Stabile</span>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold uppercase tracking-widest">Ottimale</span>
                </div>
            </div>

            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex-1">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-medical-500 animate-pulse"></div>
                    Timeline
                </h3>
                <div className="space-y-6">
                    {documents.slice(0, 3).map((doc) => (
                        <div key={doc.id} className="relative pl-6 pb-2 border-l border-slate-200 last:border-0">
                            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-slate-50"></div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                <span className="text-[10px] text-slate-400 block mb-1">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                                <h4 className="font-bold text-slate-800 text-sm">{doc.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
