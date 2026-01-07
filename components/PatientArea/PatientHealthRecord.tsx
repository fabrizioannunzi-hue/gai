
import React, { useState } from 'react';
import { PatientProfile } from '../../types';
import { Pill, AlertTriangle, Activity, Edit2, Check, X, Plus } from 'lucide-react';
import { PatientManager } from '../../services/appointmentManager';

interface PatientHealthRecordProps {
  patient: PatientProfile;
}

export const PatientHealthRecord: React.FC<PatientHealthRecordProps> = ({ patient }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(patient.clinical || { allergies: [], medications: [], conditions: [] });
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const handleSave = () => {
      PatientManager.updateMedicalRecord(patient.id, data);
      setIsEditing(false);
  };

  const addAllergy = () => {
      if(newAllergy) {
          setData({...data, allergies: [...(data.allergies || []), newAllergy]});
          setNewAllergy('');
      }
  };

  const addCondition = () => {
      if(newCondition) {
          setData({...data, conditions: [...(data.conditions || []), newCondition]});
          setNewCondition('');
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cartella Clinica Digitale</h2>
                <p className="text-slate-500 text-sm font-medium">Dati anamnestici e terapia farmacologica.</p>
            </div>
            {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold text-xs uppercase tracking-widest transition-colors">
                    <Edit2 size={16} /> Modifica
                </button>
            ) : (
                <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-100">Annulla</button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-medical-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-medical-700 shadow-lg">
                        <Check size={16} /> Salva
                    </button>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* ALLERGIES */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5"><AlertTriangle size={100} /></div>
                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><AlertTriangle size={20} /></div>
                    Allergie & Intolleranze
                </h3>
                
                <div className="space-y-3">
                    {(data.allergies || []).map((a, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-900 font-bold text-sm">
                            {a}
                            {isEditing && <button onClick={() => setData({...data, allergies: data.allergies.filter((_, idx) => idx !== i)})}><X size={14}/></button>}
                        </div>
                    ))}
                    {isEditing && (
                        <div className="flex gap-2 mt-4">
                            <input 
                                value={newAllergy} 
                                onChange={e => setNewAllergy(e.target.value)} 
                                placeholder="Nuova allergia..." 
                                className="flex-1 px-4 py-2 bg-slate-50 rounded-xl text-sm border-none outline-none"
                            />
                            <button onClick={addAllergy} className="p-2 bg-slate-900 text-white rounded-xl"><Plus size={16}/></button>
                        </div>
                    )}
                    {(!data.allergies || data.allergies.length === 0) && !isEditing && (
                        <p className="text-slate-400 text-sm italic">Nessuna allergia segnalata.</p>
                    )}
                </div>
            </div>

            {/* CONDITIONS */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5"><Activity size={100} /></div>
                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Activity size={20} /></div>
                    Patologie Pregresse
                </h3>
                
                <div className="space-y-3">
                    {(data.conditions || []).map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 font-bold text-sm">
                            {c}
                            {isEditing && <button onClick={() => setData({...data, conditions: data.conditions.filter((_, idx) => idx !== i)})}><X size={14}/></button>}
                        </div>
                    ))}
                    {isEditing && (
                        <div className="flex gap-2 mt-4">
                            <input 
                                value={newCondition} 
                                onChange={e => setNewCondition(e.target.value)} 
                                placeholder="Nuova patologia..." 
                                className="flex-1 px-4 py-2 bg-slate-50 rounded-xl text-sm border-none outline-none"
                            />
                            <button onClick={addCondition} className="p-2 bg-slate-900 text-white rounded-xl"><Plus size={16}/></button>
                        </div>
                    )}
                    {(!data.conditions || data.conditions.length === 0) && !isEditing && (
                        <p className="text-slate-400 text-sm italic">Nessuna patologia rilevante.</p>
                    )}
                </div>
            </div>

            {/* MEDICATIONS */}
            <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Pill size={20} /></div>
                    Terapie in Corso
                </h3>
                {/* Mocked for UI demo - logic similar to above */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-emerald-900">Acido Folico</p>
                            <p className="text-xs text-emerald-600">400mcg - 1 cp/die</p>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white px-2 py-1 rounded text-emerald-600">Attivo</span>
                    </div>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl text-center text-slate-400 text-xs font-medium">
                    L'aggiornamento delle terapie deve essere validato dal medico.
                </div>
            </div>

        </div>
    </div>
  );
};
