
import React from 'react';
import { CrmAppointment } from '../../types';
import { Calendar, Clock, MapPin, Video, AlertCircle, ArrowRight, CheckCircle2, MoreHorizontal } from 'lucide-react';

interface PatientAppointmentsProps {
  appointments: CrmAppointment[];
  onBookNew?: () => void;
}

export const PatientAppointments: React.FC<PatientAppointmentsProps> = ({ appointments, onBookNew }) => {
  const upcoming = appointments.filter(a => new Date(a.date) >= new Date() && a.status !== 'CANCELLED');
  const past = appointments.filter(a => new Date(a.date) < new Date() || a.status === 'CANCELLED');

  // Added key to props to fix TS error
  const ApptCard = ({ appt, isPast = false }: { appt: CrmAppointment, isPast?: boolean, key?: React.Key }) => {
     const dateObj = new Date(appt.date);
     return (
        <div className={`group p-6 rounded-[2rem] border transition-all duration-300 ${isPast ? 'bg-slate-50 border-slate-100 opacity-70 hover:opacity-100' : 'bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-medical-200 hover:-translate-y-1'}`}>
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                
                {/* DATE BADGE */}
                <div className={`shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center border ${isPast ? 'bg-white border-slate-200 text-slate-400' : 'bg-medical-50 border-medical-100 text-medical-700'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">{dateObj.toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-3xl font-black leading-none mt-1">{dateObj.getDate()}</span>
                    <span className="text-[10px] font-bold opacity-60 mt-1">{dateObj.getFullYear()}</span>
                </div>

                {/* INFO */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h4 className={`text-lg font-bold ${isPast ? 'text-slate-600' : 'text-slate-900'}`}>{appt.serviceType}</h4>
                        {appt.status === 'CONFIRMED' && !isPast && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-md border border-emerald-200">Confermato</span>
                        )}
                        {appt.status === 'CANCELLED' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-widest rounded-md border border-red-200">Annullato</span>
                        )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <Clock size={14} className={isPast ? 'text-slate-400' : 'text-medical-600'} />
                            {appt.time}
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            {appt.mode === 'ONLINE' ? <Video size={14} className="text-purple-500"/> : <MapPin size={14} className="text-red-500"/>}
                            <span className="uppercase text-xs font-bold tracking-wide">{appt.mode}</span>
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="w-full md:w-auto flex items-center justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                     {!isPast ? (
                         <>
                            <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors shadow-lg active:scale-95">
                                Gestisci
                            </button>
                         </>
                     ) : (
                        <button className="p-2 text-slate-300 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                     )}
                </div>
            </div>
        </div>
     );
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        
        {/* HEADER & NEW BUTTON */}
        <div className="flex justify-between items-end mb-8">
             <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Le tue Visite</h2>
                <p className="text-slate-500 font-medium text-sm">Gestisci i tuoi appuntamenti futuri e consulta lo storico.</p>
             </div>
             {onBookNew && (
                <button onClick={onBookNew} className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 flex items-center gap-2">
                    <ArrowRight size={16} /> Prenota
                </button>
             )}
        </div>

        {/* UPCOMING */}
        <section>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 rounded-full bg-medical-500"></div>
                <h3 className="text-lg font-black text-slate-900">In Programma</h3>
            </div>
            
            {upcoming.length > 0 ? (
                <div className="space-y-4">
                    {upcoming.map(a => <ApptCard key={a.id} appt={a} />)}
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] p-12 border border-slate-200 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300 rotate-3">
                        <Calendar size={40} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Nessun appuntamento imminente</h4>
                    <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">
                        Al momento non hai visite confermate. Se necessiti di un consulto, puoi prenotare in autonomia.
                    </p>
                    {onBookNew && (
                        <button onClick={onBookNew} className="bg-medical-600 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-medical-700 transition-all flex items-center gap-3 mx-auto shadow-xl shadow-medical-500/30">
                            Prenota Nuova Visita <ArrowRight size={18} />
                        </button>
                    )}
                </div>
            )}
        </section>

        {/* PAST */}
        {past.length > 0 && (
            <section className="opacity-80 hover:opacity-100 transition-opacity duration-500">
                 <div className="flex items-center gap-3 mb-6 mt-12">
                    <div className="w-2 h-8 rounded-full bg-slate-200"></div>
                    <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Storico Visite</h3>
                </div>
                <div className="space-y-4">
                     {past.map(a => <ApptCard key={a.id} appt={a} isPast />)}
                </div>
            </section>
        )}

    </div>
  );
};
