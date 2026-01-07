import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, FileText, Pill,
  AlertTriangle, Activity, Clock, Users, Heart, ChevronDown, ChevronUp,
  Plus, Trash2, Download, Eye
} from 'lucide-react';
import { PatientProfile } from '../../types';
import { supabaseRepositories } from '../../lib/supabase-repositories';

interface PatientDetailViewProps {
  patient: PatientProfile;
  onClose: () => void;
  onUpdate?: (patient: PatientProfile) => void;
}

type Tab = 'overview' | 'registry' | 'clinical' | 'documents' | 'history';

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient: initialPatient, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [patient, setPatient] = useState(initialPatient);
  const [isEditingRegistry, setIsEditingRegistry] = useState(false);
  const [isEditingClinical, setIsEditingClinical] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [registryData, setRegistryData] = useState(patient.registry);
  const [clinicalData, setClinicalData] = useState(patient.clinical || {
    allergies: [],
    medications: [],
    conditions: [],
    familyHistory: [],
    chronicConditions: []
  });

  const tabs = [
    { id: 'overview', label: 'Panoramica', icon: Activity },
    { id: 'registry', label: 'Anagrafica', icon: User },
    { id: 'clinical', label: 'Clinica', icon: Heart },
    { id: 'documents', label: 'Documenti', icon: FileText },
    { id: 'history', label: 'Cronologia', icon: Clock }
  ];

  const saveRegistry = async () => {
    setIsSaving(true);
    try {
      await supabaseRepositories.patients.update(patient.id, { registry: registryData });
      setPatient({ ...patient, registry: registryData });
      setIsEditingRegistry(false);
      if (onUpdate) onUpdate({ ...patient, registry: registryData });
    } catch (error) {
      console.error('Error saving registry:', error);
      alert('Errore durante il salvataggio');
    } finally {
      setIsSaving(false);
    }
  };

  const saveClinical = async () => {
    setIsSaving(true);
    try {
      await supabaseRepositories.patients.update(patient.id, { clinical: clinicalData });
      setPatient({ ...patient, clinical: clinicalData });
      setIsEditingClinical(false);
      if (onUpdate) onUpdate({ ...patient, clinical: clinicalData });
    } catch (error) {
      console.error('Error saving clinical:', error);
      alert('Errore durante il salvataggio');
    } finally {
      setIsSaving(false);
    }
  };

  const addClinicalItem = (field: string, value: string) => {
    if (!value.trim()) return;
    setClinicalData({
      ...clinicalData,
      [field]: [...(clinicalData[field] || []), value]
    });
  };

  const removeClinicalItem = (field: string, index: number) => {
    setClinicalData({
      ...clinicalData,
      [field]: (clinicalData[field] || []).filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl my-8"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-medical-600 to-medical-700 p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black">
                  {patient.registry.firstName} {patient.registry.lastName}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  CF: {patient.registry.fiscalCode} • ID: {patient.id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/10 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <Mail size={16} className="mb-2 opacity-80" />
              <div className="text-xs opacity-80">Email</div>
              <div className="text-sm font-bold truncate">{patient.registry.email}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <Phone size={16} className="mb-2 opacity-80" />
              <div className="text-xs opacity-80">Telefono</div>
              <div className="text-sm font-bold">{patient.registry.phone}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <Calendar size={16} className="mb-2 opacity-80" />
              <div className="text-xs opacity-80">Data di Nascita</div>
              <div className="text-sm font-bold">{patient.registry.birthDate}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`px-4 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-medical-600 text-medical-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[calc(90vh-300px)] overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                    <AlertTriangle size={24} className="text-red-600 mb-3" />
                    <div className="text-sm text-red-600 mb-1">Allergie</div>
                    <div className="text-3xl font-black text-red-900">
                      {clinicalData.allergies?.length || 0}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <Pill size={24} className="text-blue-600 mb-3" />
                    <div className="text-sm text-blue-600 mb-1">Farmaci</div>
                    <div className="text-3xl font-black text-blue-900">
                      {clinicalData.medications?.filter((m: any) => m.active).length || 0}
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <Activity size={24} className="text-emerald-600 mb-3" />
                    <div className="text-sm text-emerald-600 mb-1">Condizioni</div>
                    <div className="text-3xl font-black text-emerald-900">
                      {(clinicalData.conditions?.length || 0) + (clinicalData.chronicConditions?.length || 0)}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="text-lg font-black text-slate-900 mb-4">Riepilogo Clinico</h3>
                  <div className="space-y-4">
                    {clinicalData.allergies && clinicalData.allergies.length > 0 && (
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                          Allergie Attive
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {clinicalData.allergies.map((a: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-bold">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {clinicalData.medications && clinicalData.medications.filter((m: any) => m.active).length > 0 && (
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                          Terapie in Corso
                        </div>
                        <div className="space-y-2">
                          {clinicalData.medications.filter((m: any) => m.active).slice(0, 3).map((med: any, i: number) => (
                            <div key={i} className="text-sm text-slate-700">
                              <span className="font-bold">{med.name}</span> - {med.dosage} - {med.frequency}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* REGISTRY */}
            {activeTab === 'registry' && (
              <motion.div
                key="registry"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-slate-900">Dati Anagrafici</h3>
                  {!isEditingRegistry ? (
                    <button
                      onClick={() => setIsEditingRegistry(true)}
                      className="px-4 py-2 bg-medical-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-medical-700 transition-all"
                    >
                      <Edit2 size={16} />
                      Modifica
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsEditingRegistry(false);
                          setRegistryData(patient.registry);
                        }}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                      >
                        Annulla
                      </button>
                      <button
                        onClick={saveRegistry}
                        disabled={isSaving}
                        className="px-4 py-2 bg-medical-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-medical-700 transition-all disabled:opacity-50"
                      >
                        <Save size={16} />
                        {isSaving ? 'Salvataggio...' : 'Salva'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                      Nome
                    </label>
                    {isEditingRegistry ? (
                      <input
                        type="text"
                        value={registryData.firstName}
                        onChange={(e) => setRegistryData({ ...registryData, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900">
                        {registryData.firstName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                      Cognome
                    </label>
                    {isEditingRegistry ? (
                      <input
                        type="text"
                        value={registryData.lastName}
                        onChange={(e) => setRegistryData({ ...registryData, lastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900">
                        {registryData.lastName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                      Codice Fiscale
                    </label>
                    <div className="px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900">
                      {registryData.fiscalCode}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                      Data di Nascita
                    </label>
                    {isEditingRegistry ? (
                      <input
                        type="date"
                        value={registryData.birthDate}
                        onChange={(e) => setRegistryData({ ...registryData, birthDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900">
                        {registryData.birthDate}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                      Email
                    </label>
                    {isEditingRegistry ? (
                      <input
                        type="email"
                        value={registryData.email}
                        onChange={(e) => setRegistryData({ ...registryData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900">
                        {registryData.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                      Telefono
                    </label>
                    {isEditingRegistry ? (
                      <input
                        type="tel"
                        value={registryData.phone}
                        onChange={(e) => setRegistryData({ ...registryData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900">
                        {registryData.phone}
                      </div>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                      Indirizzo
                    </label>
                    {isEditingRegistry ? (
                      <input
                        type="text"
                        value={registryData.address || ''}
                        onChange={(e) => setRegistryData({ ...registryData, address: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900">
                        {registryData.address || 'Non specificato'}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CLINICAL */}
            {activeTab === 'clinical' && (
              <motion.div
                key="clinical"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-slate-900">Dati Clinici</h3>
                  {!isEditingClinical ? (
                    <button
                      onClick={() => setIsEditingClinical(true)}
                      className="px-4 py-2 bg-medical-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-medical-700 transition-all"
                    >
                      <Edit2 size={16} />
                      Modifica
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsEditingClinical(false);
                          setClinicalData(patient.clinical || clinicalData);
                        }}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                      >
                        Annulla
                      </button>
                      <button
                        onClick={saveClinical}
                        disabled={isSaving}
                        className="px-4 py-2 bg-medical-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-medical-700 transition-all disabled:opacity-50"
                      >
                        <Save size={16} />
                        {isSaving ? 'Salvataggio...' : 'Salva'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Allergies */}
                <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                  <h4 className="font-black text-lg text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} />
                    Allergie
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {clinicalData.allergies?.map((a: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl">
                        <span className="font-bold text-red-900">{a}</span>
                        {isEditingClinical && (
                          <button
                            onClick={() => removeClinicalItem('allergies', i)}
                            className="p-1 hover:bg-red-50 rounded transition-all"
                          >
                            <X size={14} className="text-red-600" />
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditingClinical && (
                      <input
                        type="text"
                        placeholder="Nuova allergia"
                        className="p-3 border-2 border-dashed border-red-200 rounded-xl text-sm focus:outline-none focus:border-red-400"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addClinicalItem('allergies', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Conditions */}
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h4 className="font-black text-lg text-blue-900 mb-4 flex items-center gap-2">
                    <Activity size={20} />
                    Patologie
                  </h4>
                  <div className="space-y-2">
                    {clinicalData.conditions?.map((c: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl">
                        <span className="text-sm text-blue-900">{c}</span>
                        {isEditingClinical && (
                          <button
                            onClick={() => removeClinicalItem('conditions', i)}
                            className="p-1 hover:bg-blue-50 rounded transition-all"
                          >
                            <X size={14} className="text-blue-600" />
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditingClinical && (
                      <input
                        type="text"
                        placeholder="Nuova patologia"
                        className="w-full p-3 border-2 border-dashed border-blue-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addClinicalItem('conditions', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* DOCUMENTS */}
            {activeTab === 'documents' && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-400 mb-2">Documenti</h3>
                <p className="text-sm text-slate-400">
                  I documenti del paziente sono gestiti nella sezione dedicata
                </p>
              </motion.div>
            )}

            {/* HISTORY */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-black text-slate-900 mb-6">Cronologia Modifiche</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-slate-400" />
                      <div>
                        <div className="text-sm font-bold text-slate-900">Paziente creato</div>
                        <div className="text-xs text-slate-400">
                          {patient.created_at ? new Date(patient.created_at).toLocaleString('it-IT') : 'Data non disponibile'}
                        </div>
                      </div>
                    </div>
                  </div>
                  {patient.updated_at && patient.updated_at !== patient.created_at && (
                    <div className="bg-white rounded-2xl border border-slate-100 p-4">
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-slate-400" />
                        <div>
                          <div className="text-sm font-bold text-slate-900">Ultimo aggiornamento</div>
                          <div className="text-xs text-slate-400">
                            {new Date(patient.updated_at).toLocaleString('it-IT')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
