import React, { useState, useEffect } from 'react';
import { PatientService, AppointmentService, DocumentService, FinanceService } from '../services/appointmentManager';
import { PatientProfile, CrmAppointment, ClinicalDocument, Transaction } from '../types';
import { User, AlertCircle, Loader2, CheckSquare, BrainCircuit } from 'lucide-react';
import { DocumentUpload } from './DocumentUpload';
import { motion, AnimatePresence } from 'framer-motion';

// Modular Components
import { PatientHeader } from './PatientArea/PatientHeader';
import { PatientSidebar } from './PatientArea/PatientSidebar';
import { PatientDashboard } from './PatientArea/PatientDashboard';
import { PatientDocuments } from './PatientArea/PatientDocuments';
import { PatientAppointments } from './PatientArea/PatientAppointments';
import { PatientSettings } from './PatientArea/PatientSettings';
import { PatientBooking } from './PatientArea/PatientBooking';
import { PatientHealthRecord } from './PatientArea/PatientHealthRecord';
import { PatientMessages } from './PatientArea/PatientMessages';
import { PatientPayments } from './PatientArea/PatientPayments';

interface PatientAreaProps {
  onBack: () => void;
}

type TabType = 'dashboard' | 'documents' | 'appointments' | 'new_appointment' | 'profile' | 'privacy' | 'clinical_record' | 'messages' | 'payments';

const PatientArea: React.FC<PatientAreaProps> = ({ onBack }) => {
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Auth & Reg State
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginForm, setLoginForm] = useState({ lastName: '', phone: '' });
  const [regForm, setRegForm] = useState({ firstName: '', lastName: '', phone: '', email: '', fiscalCode: '' });
  const [consents, setConsents] = useState({ privacy: false, terms: false, ai: false });
  const [error, setError] = useState('');

  // Data State
  const [appointments, setAppointments] = useState<CrmAppointment[]>([]);
  const [documents, setDocuments] = useState<ClinicalDocument[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (patient) {
        setIsLoading(true);
        // Simulate network fetch
        setTimeout(() => {
            refreshData();
            setIsLoading(false);
        }, 800);
    }
  }, [patient]);

  const refreshData = () => {
    if (!patient) return;
    setAppointments(AppointmentService.getByPatientId(patient.id));
    setDocuments(DocumentService.getByPatientId(patient.id));
    setTransactions(FinanceService.getByPatientId(patient.id));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const p = PatientService.login(loginForm.lastName, loginForm.phone);
    if (p) { setPatient(p); setError(''); } 
    else setError('Credenziali non valide. Verifica Cognome e Telefono.');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.lastName || !regForm.phone || !regForm.fiscalCode) {
        setError("Compila i campi obbligatori."); return;
    }
    
    // Legal Check
    if (!consents.privacy || !consents.terms) {
        setError("Devi accettare Privacy Policy e Termini per registrarti."); 
        return;
    }

    const p = PatientService.create(regForm, {
      privacyAccepted: consents.privacy,
      termsAccepted: consents.terms,
      aiProcessingAccepted: consents.ai,
      acceptedAt: new Date().toISOString()
    });
    
    setPatient(p);
    setIsRegistering(false);
  };

  const getPageTitle = () => {
      switch(activeTab) {
          case 'dashboard': return 'Panoramica';
          case 'documents': return 'Documentazione & Referti';
          case 'appointments': return 'Le tue Visite';
          case 'new_appointment': return 'Prenotazione Online';
          case 'profile': return 'Profilo Personale';
          case 'privacy': return 'Privacy';
          case 'clinical_record': return 'Cartella Clinica';
          case 'messages': return 'Messaggi Sicuri';
          case 'payments': return 'Fatture & Pagamenti';
          default: return 'Area Paziente';
      }
  };

  // --- LOGIN VIEW ---
  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
           <div className="bg-medical-600 p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 rotate-12 translate-x-10 -translate-y-10"><User size={150}/></div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight relative z-10 mb-2">Area Pazienti</h2>
              <p className="text-medical-100 text-sm font-medium relative z-10">Accesso Sicuro Fascicolo Sanitario</p>
           </div>
           <div className="p-8">
              <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
                 <button onClick={() => setIsRegistering(false)} className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${!isRegistering ? 'bg-white text-medical-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Accedi</button>
                 <button onClick={() => setIsRegistering(true)} className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${isRegistering ? 'bg-white text-medical-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Registrati</button>
              </div>
              {error && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-4 flex gap-2 font-bold"><AlertCircle size={14}/> {error}</div>}
              
              {!isRegistering ? (
                 <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider ml-1">Cognome</label>
                        <input type="text" value={loginForm.lastName} onChange={e=>setLoginForm({...loginForm, lastName:e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 outline-none font-bold text-slate-800" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider ml-1">Telefono</label>
                        <input type="tel" value={loginForm.phone} onChange={e=>setLoginForm({...loginForm, phone:e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 outline-none font-bold text-slate-800" />
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg active:scale-95 mt-4">Entra nel Fascicolo</button>
                 </form>
              ) : (
                 <form onSubmit={handleRegister} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                       <input type="text" placeholder="Nome *" value={regForm.firstName} onChange={e=>setRegForm({...regForm, firstName:e.target.value})} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                       <input type="text" placeholder="Cognome *" value={regForm.lastName} onChange={e=>setRegForm({...regForm, lastName:e.target.value})} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                    </div>
                    <input type="text" placeholder="Codice Fiscale *" value={regForm.fiscalCode} onChange={e=>setRegForm({...regForm, fiscalCode:e.target.value.toUpperCase()})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm uppercase font-medium" />
                    <input type="tel" placeholder="Telefono *" value={regForm.phone} onChange={e=>setRegForm({...regForm, phone:e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                    <input type="email" placeholder="Email (opzionale)" value={regForm.email} onChange={e=>setRegForm({...regForm, email:e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                    
                    {/* CONSENSI LEGALI */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                                <input type="checkbox" className="peer sr-only" checked={consents.privacy} onChange={e => setConsents({...consents, privacy: e.target.checked})} />
                                <div className={`w-5 h-5 rounded border-2 transition-all ${consents.privacy ? 'bg-medical-600 border-medical-600' : 'border-slate-300 bg-white'}`}></div>
                                {consents.privacy && <CheckSquare size={14} className="text-white absolute pointer-events-none" />}
                            </div>
                            <span className="text-[10px] text-slate-500 leading-snug">
                                Ho letto l'<span className="font-bold underline text-medical-700">Informativa Privacy</span> e acconsento al trattamento dei dati sanitari (GDPR 2016/679).
                            </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                                <input type="checkbox" className="peer sr-only" checked={consents.terms} onChange={e => setConsents({...consents, terms: e.target.checked})} />
                                <div className={`w-5 h-5 rounded border-2 transition-all ${consents.terms ? 'bg-medical-600 border-medical-600' : 'border-slate-300 bg-white'}`}></div>
                                {consents.terms && <CheckSquare size={14} className="text-white absolute pointer-events-none" />}
                            </div>
                            <span className="text-[10px] text-slate-500 leading-snug">
                                Accetto i <span className="font-bold underline text-medical-700">Termini e Condizioni</span> del servizio.
                            </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                                <input type="checkbox" className="peer sr-only" checked={consents.ai} onChange={e => setConsents({...consents, ai: e.target.checked})} />
                                <div className={`w-5 h-5 rounded border-2 transition-all ${consents.ai ? 'bg-purple-600 border-purple-600' : 'border-slate-300 bg-white'}`}></div>
                                {consents.ai && <BrainCircuit size={14} className="text-white absolute pointer-events-none" />}
                            </div>
                            <span className="text-[10px] text-slate-500 leading-snug">
                                (Opzionale) Acconsento all'uso dell'assistente AI "Sofia" per la gestione vocale degli appuntamenti e il triage.
                            </span>
                        </label>
                    </div>

                    <button type="submit" className="w-full bg-medical-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-medical-700 transition-all shadow-lg active:scale-95 mt-4">Crea Account</button>
                 </form>
              )}
              <button onClick={onBack} className="w-full mt-6 text-slate-400 text-xs hover:text-slate-600 font-bold uppercase tracking-wide">Torna al sito</button>
           </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans selection:bg-medical-100">
       
       {/* Sidebar Navigation */}
       <PatientSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
       />

       {/* Main Content Area */}
       <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
          
          <PatientHeader 
             patient={patient} 
             onLogout={() => { setPatient(null); onBack(); }} 
             toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
             title={getPageTitle()}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
             <div className="max-w-7xl mx-auto pb-20">

                {/* MODAL UPLOAD */}
                <AnimatePresence>
                    {showUploadModal && (
                    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-xl">
                            <DocumentUpload patientId={patient.id} onUploadSuccess={() => { setShowUploadModal(false); refreshData(); }} onCancel={() => setShowUploadModal(false)} />
                        </div>
                    </div>
                    )}
                </AnimatePresence>

                {/* DYNAMIC CONTENT VIEW */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-[50vh] text-slate-400"
                        >
                            <Loader2 size={40} className="animate-spin mb-4 text-medical-600" />
                            <p className="text-xs font-bold uppercase tracking-widest">Sincronizzazione Cartella Clinica...</p>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'dashboard' && (
                                <PatientDashboard 
                                    patient={patient} 
                                    appointments={appointments} 
                                    documents={documents} 
                                    onNavigate={setActiveTab} 
                                />
                            )}

                            {activeTab === 'documents' && (
                                <PatientDocuments 
                                    documents={documents} 
                                    onUploadClick={() => setShowUploadModal(true)} 
                                />
                            )}

                            {activeTab === 'appointments' && (
                                <PatientAppointments 
                                    appointments={appointments} 
                                    onBookNew={() => setActiveTab('new_appointment')}
                                />
                            )}

                            {activeTab === 'new_appointment' && (
                                <PatientBooking />
                            )}

                            {activeTab === 'clinical_record' && (
                                <PatientHealthRecord patient={patient} />
                            )}

                            {activeTab === 'messages' && (
                                <PatientMessages />
                            )}

                            {activeTab === 'payments' && (
                                <PatientPayments transactions={transactions} />
                            )}

                            {(activeTab === 'profile' || activeTab === 'privacy') && (
                                <PatientSettings patient={patient} activeSection={activeTab} />
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
          </main>
       </div>
    </div>
  );
};

export default PatientArea;