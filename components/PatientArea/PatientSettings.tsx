
import React from 'react';
import { PatientProfile } from '../../types';
import { User, Shield, Mail, Phone, MapPin, Key, Lock, Bell } from 'lucide-react';

interface PatientSettingsProps {
  patient: PatientProfile;
  activeSection: 'profile' | 'privacy';
}

export const PatientSettings: React.FC<PatientSettingsProps> = ({ patient, activeSection }) => {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {activeSection === 'profile' && (
            <div className="space-y-8">
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-6 mb-8 border-b border-slate-100 pb-8">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-medical-500/20">
                            {patient.registry.firstName.charAt(0)}{patient.registry.lastName.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">{patient.registry.firstName} {patient.registry.lastName}</h2>
                            <p className="text-slate-500 font-medium">Paziente ID: <span className="font-mono text-slate-400 uppercase">{patient.id.substring(0,8)}</span></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Codice Fiscale</label>
                            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-600 font-mono font-bold">
                                <Shield size={18} className="text-slate-400" />
                                {patient.registry.fiscalCode}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Email</label>
                            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 text-slate-800 font-medium">
                                <Mail size={18} className="text-medical-600" />
                                {patient.registry.email || "Non inserita"}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Telefono</label>
                            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 text-slate-800 font-medium">
                                <Phone size={18} className="text-medical-600" />
                                {patient.registry.phone}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Indirizzo</label>
                            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 text-slate-800 font-medium">
                                <MapPin size={18} className="text-medical-600" />
                                {patient.registry.address || "Non inserito"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                     <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Key size={18}/> Credenziali</h3>
                            <p className="text-slate-400 text-xs">Modifica la password di accesso.</p>
                        </div>
                        <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                            Modifica
                        </button>
                     </div>
                </div>
            </div>
        )}

        {activeSection === 'privacy' && (
             <div className="space-y-6">
                 <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <Lock size={24} className="text-medical-600" /> Consensi e Privacy
                    </h2>
                    
                    <div className="space-y-4">
                        {[
                            { title: "Trattamento Dati Sanitari", desc: "Consenso obbligatorio per l'erogazione delle prestazioni mediche.", active: true, locked: true },
                            { title: "Fascicolo Sanitario Elettronico", desc: "Archiviazione digitale referti e storia clinica.", active: true, locked: false },
                            { title: "Notifiche Appuntamenti", desc: "Ricezione promemoria via Email/SMS.", active: true, locked: false },
                            { title: "Condivisione Ricerca", desc: "Uso anonimizzato dei dati per fini statistici.", active: false, locked: false },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div>
                                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                                </div>
                                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${item.active ? 'bg-medical-600' : 'bg-slate-300'} ${item.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${item.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             </div>
        )}

    </div>
  );
};
