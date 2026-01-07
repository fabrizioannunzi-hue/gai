
import React, { useState } from 'react';
import { ClinicalDocument } from '../../types';
import { FileText, Upload, Plus, Search, FileCheck, Download, Filter, FileImage, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PatientDocumentsProps {
  documents: ClinicalDocument[];
  onUploadClick: () => void;
}

export const PatientDocuments: React.FC<PatientDocumentsProps> = ({ documents, onUploadClick }) => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [search, setSearch] = useState('');

  const doctorDocs = documents.filter(d => d.uploaderRole === 'DOCTOR');
  const patientDocs = documents.filter(d => d.uploaderRole === 'PATIENT');

  const currentDocs = activeTab === 'received' ? doctorDocs : patientDocs;
  const filteredDocs = currentDocs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase()));

  const handleDownload = (doc: ClinicalDocument) => {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const getFileIcon = (title: string) => {
      if (title.endsWith('.pdf')) return <FileText size={24} className="text-red-500" />;
      if (title.endsWith('.jpg') || title.endsWith('.png')) return <FileImage size={24} className="text-blue-500" />;
      return <File size={24} className="text-slate-500" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'PDF Document';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Archivio Documentale</h2>
                <p className="text-slate-500 font-medium text-sm">Gestisci referti, analisi e documentazione clinica.</p>
            </div>
            {activeTab === 'sent' && (
                <button onClick={onUploadClick} className="bg-medical-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-medical-500/30 hover:bg-medical-700 transition-all active:scale-95 flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                    <Plus size={16} /> Carica Nuovo
                </button>
            )}
        </div>

        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="flex bg-slate-50 p-1 rounded-xl w-full md:w-auto">
                <button 
                    onClick={() => setActiveTab('received')}
                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'received' ? 'bg-white text-medical-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Referti Medici <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[9px]">{doctorDocs.length}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('sent')}
                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'sent' ? 'bg-white text-medical-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    I Miei Uploads <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[9px]">{patientDocs.length}</span>
                </button>
            </div>

            <div className="flex-1 flex items-center gap-2 px-4 border-l border-slate-100">
                <Search size={16} className="text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Filtra per nome o categoria..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400" 
                />
            </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Documento</th>
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Categoria</th>
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Data</th>
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filteredDocs.length > 0 ? (
                                filteredDocs.map((doc, i) => (
                                    <motion.tr 
                                        key={doc.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                                                    {getFileIcon(doc.title)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm mb-0.5">{doc.title}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{formatFileSize(doc.fileSize)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                                                {doc.category}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-sm font-medium text-slate-600 font-mono">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button 
                                                onClick={() => handleDownload(doc)}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 text-slate-400 hover:text-medical-600 hover:border-medical-200 hover:bg-white transition-all shadow-sm active:scale-95"
                                                title="Scarica"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                            <FileText size={32} />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nessun documento trovato</p>
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
