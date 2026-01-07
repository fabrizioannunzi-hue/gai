import React, { useState, useMemo } from 'react';
import { ClinicalDocument, PatientProfile } from '../../types';
import { FileText, Search, Download, Filter, Calendar, User, FolderOpen, Eye, Trash2, X, BrainCircuit, AlertCircle, FileCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiClinicalService } from '../../services/aiClinicalService';
import { documentStorage } from '../../lib/storage';

interface DocumentArchiveProps {
  documents: ClinicalDocument[];
  patients: PatientProfile[];
  onRefresh?: () => void;
}

export const DocumentArchive: React.FC<DocumentArchiveProps> = ({
  documents,
  patients,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPatient, setSelectedPatient] = useState<string>('ALL');
  const [selectedUploader, setSelectedUploader] = useState<string>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<ClinicalDocument | null>(null);
  const [analyzingDoc, setAnalyzingDoc] = useState<ClinicalDocument | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const categories = [
    'ALL',
    'ANALISI_LABORATORIO',
    'RADIOGRAFIA',
    'ECOGRAFIA',
    'REFERTO_SPECIALISTICO',
    'PRESCRIZIONE',
    'CONSENSO'
  ];

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
      const matchesPatient = selectedPatient === 'ALL' || doc.patientId === selectedPatient;
      const matchesUploader = selectedUploader === 'ALL' || doc.uploaderRole === selectedUploader;
      return matchesSearch && matchesCategory && matchesPatient && matchesUploader;
    });
  }, [documents, searchTerm, selectedCategory, selectedPatient, selectedUploader]);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.registry.lastName} ${patient.registry.firstName}` : 'Sconosciuto';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'ANALISI_LABORATORIO': 'Analisi Lab',
      'RADIOGRAFIA': 'Radiografia',
      'ECOGRAFIA': 'Ecografia',
      'REFERTO_SPECIALISTICO': 'Referto',
      'PRESCRIZIONE': 'Prescrizione',
      'CONSENSO': 'Consenso'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'ANALISI_LABORATORIO': 'bg-blue-50 text-blue-700 border-blue-200',
      'RADIOGRAFIA': 'bg-violet-50 text-violet-700 border-violet-200',
      'ECOGRAFIA': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'REFERTO_SPECIALISTICO': 'bg-amber-50 text-amber-700 border-amber-200',
      'PRESCRIZIONE': 'bg-pink-50 text-pink-700 border-pink-200',
      'CONSENSO': 'bg-slate-50 text-slate-700 border-slate-200'
    };
    return colors[category] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const handleAnalyzeDocument = async (doc: ClinicalDocument) => {
    setAnalyzingDoc(doc);
    setIsAnalyzing(true);
    setAiAnalysis(null);

    try {
      const storageKey = doc.storageKey || doc.fileUrl;

      if (!storageKey) {
        throw new Error('Documento non ha storage key valida');
      }

      if (storageKey.startsWith('http')) {
        throw new Error('URL non valido. Usa storage key.');
      }

      const signedUrl = await documentStorage.getSignedUrl(storageKey, 3600);
      const response = await fetch(signedUrl);

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const blob = await response.blob();
      const file = new File([blob], doc.title, { type: doc.mimeType || 'application/pdf' });

      const analysis = await AiClinicalService.analyzeDocument(file);
      setAiAnalysis(analysis);
    } catch (error: any) {
      console.error('Errore analisi documento:', error);
      alert(`Impossibile analizzare il documento: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadDocument = async (doc: ClinicalDocument, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    try {
      const storageKey = doc.storageKey || doc.fileUrl;

      if (!storageKey) {
        throw new Error('Documento non trovato');
      }

      if (storageKey.startsWith('http')) {
        window.open(storageKey, '_blank');
        return;
      }

      const signedUrl = await documentStorage.getSignedUrl(storageKey, 3600);
      const link = document.createElement('a');
      link.href = signedUrl;
      link.download = doc.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Errore download documento:', error);
      alert(`Impossibile scaricare il documento: ${error.message}`);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cerca per titolo documento..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 outline-none font-medium text-sm text-slate-700 focus:ring-2 focus:ring-medical-100 focus:border-medical-300 transition-all"
            />
          </div>

          <select
            value={selectedPatient}
            onChange={e => setSelectedPatient(e.target.value)}
            className="px-4 py-3 bg-white rounded-xl border border-slate-200 outline-none font-medium text-sm text-slate-700 focus:ring-2 focus:ring-medical-100 focus:border-medical-300 transition-all"
          >
            <option value="ALL">Tutti i pazienti</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.registry.lastName} {p.registry.firstName}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white rounded-xl border border-slate-200 outline-none font-medium text-sm text-slate-700 focus:ring-2 focus:ring-medical-100 focus:border-medical-300 transition-all"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'Tutte le categorie' : getCategoryLabel(cat)}
              </option>
            ))}
          </select>

          <select
            value={selectedUploader}
            onChange={e => setSelectedUploader(e.target.value)}
            className="px-4 py-3 bg-white rounded-xl border border-slate-200 outline-none font-medium text-sm text-slate-700 focus:ring-2 focus:ring-medical-100 focus:border-medical-300 transition-all"
          >
            <option value="ALL">Tutti i caricatori</option>
            <option value="PATIENT">Caricati da Pazienti</option>
            <option value="DOCTOR">Caricati da Medico</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            <span className="font-bold text-slate-900">{filteredDocuments.length}</span> documenti trovati
          </p>
          <div className="flex gap-2">
            {['ANALISI_LABORATORIO', 'RADIOGRAFIA', 'ECOGRAFIA', 'REFERTO_SPECIALISTICO'].map(cat => {
              const count = documents.filter(d => d.category === cat).length;
              return (
                <div
                  key={cat}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${getCategoryColor(cat)}`}
                >
                  {count} {getCategoryLabel(cat)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredDocuments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-slate-400"
            >
              <FolderOpen size={64} className="mb-4 opacity-30" />
              <p className="text-lg font-bold">Nessun documento trovato</p>
              <p className="text-sm mt-2">Prova a modificare i filtri di ricerca</p>
            </motion.div>
          ) : (
            filteredDocuments.map(doc => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-medical-300 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setSelectedDoc(doc)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${getCategoryColor(doc.category)}`}>
                      <FileText size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-slate-900 text-base truncate flex-1">
                          {doc.title}
                        </h4>
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border whitespace-nowrap ${getCategoryColor(doc.category)}`}>
                          {getCategoryLabel(doc.category)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <User size={12} className="text-slate-400" />
                          {getPatientName(doc.patientId)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-400" />
                          {new Date(doc.uploadDate).toLocaleDateString('it-IT', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        {doc.fileSize && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                          </>
                        )}
                        {doc.uploaderRole && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="uppercase font-bold text-[10px]">{doc.uploaderRole}</span>
                          </>
                        )}
                      </div>

                      {doc.notes && (
                        <p className="mt-2 text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {doc.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnalyzeDocument(doc);
                      }}
                      className="p-2 rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors group/ai relative"
                      title="Analizza con AI"
                    >
                      <BrainCircuit size={18} className="group-hover/ai:animate-pulse" />
                      <Sparkles size={10} className="absolute -top-0.5 -right-0.5 text-violet-400 opacity-0 group-hover/ai:opacity-100 transition-opacity" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoc(doc);
                      }}
                      className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Visualizza"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={(e) => handleDownloadDocument(doc, e)}
                      className="p-2 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                      title="Scarica"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-slate-900 p-6 text-white flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Documento Clinico
                  </p>
                  <h3 className="text-xl font-black mb-2">{selectedDoc.title}</h3>
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {getPatientName(selectedDoc.patientId)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(selectedDoc.uploadDate).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">
                      Categoria
                    </label>
                    <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold border ${getCategoryColor(selectedDoc.category)}`}>
                      {getCategoryLabel(selectedDoc.category)}
                    </span>
                  </div>

                  {selectedDoc.notes && (
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">
                        Note
                      </label>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-sm text-slate-700 leading-relaxed">{selectedDoc.notes}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">
                      Informazioni File
                    </label>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-sm">
                      {selectedDoc.fileSize && (
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Dimensione:</span>
                          <span className="font-bold text-slate-900">
                            {(selectedDoc.fileSize / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Caricato da:</span>
                        <span className="font-bold text-slate-900 uppercase text-xs">
                          {selectedDoc.uploaderRole || 'N/D'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Privacy:</span>
                        <span className="font-bold text-slate-900">
                          {selectedDoc.isPrivate ? 'Riservato' : 'Standard'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleDownloadDocument(selectedDoc)}
                      className="flex-1 py-3 bg-medical-600 text-white rounded-xl font-bold text-sm hover:bg-medical-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Scarica Documento
                    </button>
                    <button
                      onClick={() => handleAnalyzeDocument(selectedDoc)}
                      className="px-4 py-3 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-700 transition-colors flex items-center gap-2"
                      title="Analizza con AI"
                    >
                      <BrainCircuit size={18} />
                    </button>
                    <button className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {analyzingDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              if (!isAnalyzing) {
                setAnalyzingDoc(null);
                setAiAnalysis(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-violet-600 to-violet-800 p-6 text-white flex justify-between items-start">
                <div className="flex-1 flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <BrainCircuit size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-200 mb-1">
                      Analisi AI Documentale
                    </p>
                    <h3 className="text-xl font-black mb-2">{analyzingDoc.title}</h3>
                    <div className="flex items-center gap-3 text-xs font-medium text-violet-200">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {getPatientName(analyzingDoc.patientId)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(analyzingDoc.uploadDate).toLocaleDateString('it-IT')}
                      </span>
                      <span>•</span>
                      <span className="uppercase font-bold text-[10px] bg-white/20 px-2 py-0.5 rounded">
                        {analyzingDoc.uploaderRole}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!isAnalyzing) {
                      setAnalyzingDoc(null);
                      setAiAnalysis(null);
                    }
                  }}
                  disabled={isAnalyzing}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <BrainCircuit size={64} className="text-violet-600 animate-pulse" />
                      <div className="absolute inset-0 animate-spin">
                        <Sparkles size={24} className="text-violet-400 absolute -top-2 -right-2" />
                      </div>
                    </div>
                    <p className="text-lg font-bold text-slate-900 mt-6 mb-2">Analisi in corso...</p>
                    <p className="text-sm text-slate-500">L'AI sta esaminando il documento clinico</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
                      <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                        <FileCheck size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-black text-emerald-900 text-lg mb-1">Analisi Completata</h4>
                        <p className="text-sm text-emerald-700 font-medium">Il documento è stato analizzato con successo dall'AI</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {aiAnalysis.patientName && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">
                            Paziente Identificato
                          </label>
                          <p className="text-base font-bold text-slate-900">{aiAnalysis.patientName}</p>
                        </div>
                      )}
                      {aiAnalysis.documentType && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">
                            Tipo Documento
                          </label>
                          <p className="text-base font-bold text-slate-900">{aiAnalysis.documentType}</p>
                        </div>
                      )}
                      {aiAnalysis.date && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">
                            Data Documento
                          </label>
                          <p className="text-base font-bold text-slate-900">{aiAnalysis.date}</p>
                        </div>
                      )}
                      {aiAnalysis.facility && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">
                            Struttura
                          </label>
                          <p className="text-base font-bold text-slate-900">{aiAnalysis.facility}</p>
                        </div>
                      )}
                    </div>

                    {aiAnalysis.extractedData && Object.keys(aiAnalysis.extractedData).length > 0 && (
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block">
                          Dati Estratti
                        </label>
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                          {Object.entries(aiAnalysis.extractedData).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex justify-between items-start gap-4 pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                              <span className="text-sm font-bold text-slate-500 uppercase text-[10px] tracking-wider">{key}</span>
                              <span className="text-sm font-bold text-slate-900 text-right">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiAnalysis.findings && aiAnalysis.findings.length > 0 && (
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block">
                          Risultati Principali
                        </label>
                        <div className="space-y-2">
                          {aiAnalysis.findings.map((finding: string, index: number) => (
                            <div key={index} className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-black">
                                {index + 1}
                              </div>
                              <p className="text-sm font-medium text-blue-900 leading-relaxed">{finding}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiAnalysis.criticalFlags && aiAnalysis.criticalFlags.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shrink-0">
                            <AlertCircle size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black text-red-900 text-base mb-3">Segnalazioni Critiche</h4>
                            <ul className="space-y-2">
                              {aiAnalysis.criticalFlags.map((flag: string, index: number) => (
                                <li key={index} className="text-sm font-bold text-red-800 flex items-start gap-2">
                                  <span className="text-red-400 mt-0.5">•</span>
                                  <span>{flag}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {aiAnalysis.summary && (
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block">
                          Riepilogo Clinico
                        </label>
                        <div className="bg-slate-900 p-6 rounded-xl text-slate-100">
                          <p className="text-sm leading-relaxed font-medium">{aiAnalysis.summary}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <AlertCircle size={64} className="mb-4 opacity-30" />
                    <p className="text-lg font-bold">Analisi non disponibile</p>
                    <p className="text-sm mt-2">Si è verificato un errore durante l'analisi</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
