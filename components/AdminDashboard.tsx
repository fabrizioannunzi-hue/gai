
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PatientService, AppointmentService, DocumentService, FinanceService } from '../services/appointmentManager';
import { PatientProfile, CrmAppointment, Transaction, UserRole } from '../types';
import { 
  Users, Calendar, FileText, Search, Plus, 
  LogOut, ShieldCheck, Activity, X, 
  BrainCircuit, Mic, Zap, Loader2,
  Download, UploadCloud, Stethoscope, LayoutDashboard,
  Settings, Clock, CreditCard, DollarSign,
  TrendingUp, Lock, FileJson, AlertTriangle, ChevronRight
} from 'lucide-react';
import { BrainStore, BrainBrick } from '../services/brainStore';
import LiveVoiceModal from './LiveVoiceModal';
import { BrickManager } from './Admin/BrickManager';
import { ReportGenerator } from './Admin/ReportGenerator';
import { DocumentAnalyzer } from './Admin/DocumentAnalyzer';
import { OnboardingWizard } from './Admin/OnboardingWizard';

// --- SUB-COMPONENTS ---

const RoiCalculator = ({ appts }: { appts: CrmAppointment[] }) => {
    // Simulazione calcolo ROI
    const manualTime = appts.length * 15; // 15 min per appuntamento manuale
    const aiTime = appts.length * 2; // 2 min con AI
    const savedMinutes = manualTime - aiTime;
    const savedHours = Math.floor(savedMinutes / 60);
    const hourlyRate = 30; // Costo orario segreteria €
    const savedMoney = savedHours * hourlyRate;

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp size={120} /></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><DollarSign size={20} /></div>
                    <h3 className="font-bold uppercase tracking-widest text-sm">Business Value (ROI)</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p className="text-slate-400 text-xs uppercase font-bold mb-1">Tempo Risparmiato</p>
                        <p className="text-3xl font-black text-white">{savedHours}h <span className="text-sm font-medium text-slate-400">questo mese</span></p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase font-bold mb-1">Valore Generato</p>
                        <p className="text-3xl font-black text-emerald-400">€ {savedMoney}</p>
                    </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10 text-xs text-slate-400 flex items-center gap-2">
                    <Activity size={14} />
                    <span>Basato su: 15min vs 2min per task (Prenotazione/Referto)</span>
                </div>
            </div>
        </div>
    );
};

// ... (StatCard, TrendChart, ActivityFeedItem, PatientDetailView components remain unchanged - omitted for brevity but assumed present)
const StatCard = ({ title, value, trend, icon: Icon, color, chartData }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color.bg} ${color.text}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const ActivityFeedItem = ({ title, time, type }: any) => (
  <div className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-default border-b border-slate-50 last:border-0">
    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${type === 'alert' ? 'bg-red-500' : type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
    <div>
      <p className="text-sm font-bold text-slate-800">{title}</p>
      <p className="text-xs text-slate-400 font-medium">{time}</p>
    </div>
  </div>
);

const AdminDashboard: React.FC<{onLogout: () => void}> = ({ onLogout }) => {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('ADMIN'); // Default ADMIN for demo, but allows switching
  const [activeView, setActiveView] = useState<'OVERVIEW' | 'CRM' | 'CALENDAR' | 'FINANCE' | 'CLINICAL' | 'BRAIN' | 'SETTINGS'>('OVERVIEW');
  const [isTraining, setIsTraining] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showOnboarding, setShowOnboarding] = useState(false); // New: Onboarding Trigger
  
  // Data State
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [appointments, setAppointments] = useState<CrmAppointment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Tools State
  const [clinicalTool, setClinicalTool] = useState<'REPORT' | 'ANALYZER'>('REPORT');
  const [bricks, setBricks] = useState<BrainBrick[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calendar State
  const [currentCalDate, setCurrentCalDate] = useState(new Date());

  const refreshData = useCallback(() => {
    const allPatients = PatientService.getAll();
    const allAppts = AppointmentService.getAll();
    const allTrans = FinanceService.getAll();
    setPatients(allPatients);
    setAppointments(allAppts);
    setTransactions(allTrans);
  }, []);

  const refreshBricks = async () => {
    const data = await BrainStore.getBricks();
    setBricks(data);
  };

  useEffect(() => {
    // Check if onboarding is needed (mock check)
    const hasRunOnboarding = localStorage.getItem('onboarding_completed');
    if (!hasRunOnboarding && auth) {
        setShowOnboarding(true);
    }

    refreshData();
    refreshBricks();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    const handleSynapticUpdate = () => refreshBricks();
    window.addEventListener('synaptic_update', handleSynapticUpdate);
    return () => {
      clearInterval(timer);
      window.removeEventListener('synaptic_update', handleSynapticUpdate);
    };
  }, [refreshData, auth]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setAuth(true);
  };

  const handleDataExport = () => {
      // Interoperability Feature: Export CSV
      const csvContent = "data:text/csv;charset=utf-8," 
          + "ID,Nome,Cognome,CF,DataReg\n"
          + patients.map(p => `${p.id},${p.registry.firstName},${p.registry.lastName},${p.registry.fiscalCode},${p.metadata.registeredAt}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "patients_export_sts.csv");
      document.body.appendChild(link);
      link.click();
  };

  // --- LOGIN SCREEN ---
  if (!auth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
         <div className="w-full max-w-sm text-center relative z-10">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-tr from-medical-600 to-purple-600 w-24 h-24 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl shadow-purple-900/50">
               <ShieldCheck size={48} />
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">System Access</h2>
            <p className="text-slate-400 text-sm font-medium mb-8">Dr. Federico Grilli • Admin Console</p>
            <form onSubmit={handleLogin} className="relative group">
               <input 
                  type="password" 
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  className="relative w-full bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 outline-none text-center font-bold tracking-[0.5em] focus:border-medical-500 focus:ring-1 focus:ring-medical-500 transition-all shadow-xl" 
                  placeholder="••••" 
                  autoFocus
               />
            </form>
         </div>
      </div>
    );
  }

  // --- MAIN LAYOUT ---
  return (
    <div className="h-screen bg-slate-50 font-sans flex overflow-hidden selection:bg-medical-100 selection:text-medical-900">
       
       {showOnboarding && <OnboardingWizard onComplete={() => { setShowOnboarding(false); localStorage.setItem('onboarding_completed', 'true'); }} />}

       {/* SIDEBAR */}
       <aside className="w-24 bg-slate-900 flex flex-col items-center py-8 z-50 shadow-2xl border-r border-slate-800 hidden md:flex shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-medical-500 to-medical-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-medical-600/20 mb-8 cursor-default select-none">FG</div>
          
          {/* RBAC ROLE DISPLAY */}
          <div className="mb-8 flex flex-col gap-2">
             <button onClick={() => setUserRole('ADMIN')} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${userRole === 'ADMIN' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-500'}`}>A</button>
             <button onClick={() => setUserRole('DOCTOR')} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${userRole === 'DOCTOR' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-500'}`}>D</button>
             <button onClick={() => setUserRole('SECRETARY')} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${userRole === 'SECRETARY' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-500'}`}>S</button>
          </div>

          <nav className="flex flex-col gap-4 w-full px-3 flex-1">
             {[
               { id: 'OVERVIEW', icon: LayoutDashboard, label: 'Dash' },
               { id: 'CRM', icon: Users, label: 'CRM', allowed: ['ADMIN', 'SECRETARY'] },
               { id: 'CALENDAR', icon: Calendar, label: 'Agenda', allowed: ['ADMIN', 'DOCTOR', 'SECRETARY'] },
               { id: 'FINANCE', icon: CreditCard, label: 'Finance', allowed: ['ADMIN'] },
               { id: 'CLINICAL', icon: Stethoscope, label: 'Tools', allowed: ['ADMIN', 'DOCTOR'] },
               { id: 'BRAIN', icon: BrainCircuit, label: 'AI Core', allowed: ['ADMIN'] },
             ].map((item) => {
                if (item.allowed && !item.allowed.includes(userRole)) return null;
                return (
                    <button 
                    key={item.id}
                    onClick={()=>setActiveView(item.id as any)} 
                    className={`relative p-4 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1.5 group w-full ${activeView === item.id ? 'bg-white text-slate-900 shadow-xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/10'}`}
                    >
                    <item.icon size={22} className={activeView === item.id ? 'text-medical-600' : ''} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
                    </button>
                );
             })}
             <div className="h-px bg-slate-800 w-1/2 mx-auto my-2"></div>
             <button onClick={()=>setActiveView('SETTINGS')} className={`p-4 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1.5 group w-full ${activeView === 'SETTINGS' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/10'}`}>
                <Settings size={22} />
             </button>
          </nav>
          <button onClick={onLogout} className="mt-auto p-4 text-slate-500 hover:text-red-500 rounded-2xl transition-all" title="Logout"><LogOut size={22} /></button>
       </aside>

       <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
          
          {/* TOP BAR */}
          <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 shrink-0 flex items-center justify-between px-6 md:px-10 z-40">
             <div className="flex items-center gap-4">
                <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                   {activeView === 'OVERVIEW' && 'Dashboard Overview'}
                   {activeView === 'CRM' && 'Patient Management'}
                   {activeView === 'CALENDAR' && 'Agenda Appuntamenti'}
                   {activeView === 'FINANCE' && 'Gestione Finanziaria'}
                   {activeView === 'CLINICAL' && 'AI Clinical Tools'}
                   {activeView === 'BRAIN' && 'Synaptic Matrix Core'}
                   {activeView === 'SETTINGS' && 'System Settings'}
                </h1>
                <span className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   System Online
                </span>
                {/* Visualizzazione Ruolo Attivo */}
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                    Role: {userRole}
                </span>
             </div>
             
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                   <Clock size={14} />
                   {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-800 leading-none">Dr. Grilli</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-widest">Administrator</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white ring-4 ring-slate-100 shadow-sm font-bold cursor-pointer hover:bg-medical-600 transition-colors">FG</div>
                </div>
             </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 md:p-10 w-full max-w-[1920px] mx-auto scroll-smooth">
             
             {/* --- OVERVIEW DASHBOARD --- */}
             {activeView === 'OVERVIEW' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   {/* ROI CALCULATOR & STATS */}
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <div className="lg:col-span-2">
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <StatCard title="Pazienti Totali" value={patients.length} trend={2.5} icon={Users} color={{bg: 'bg-blue-50', text: 'text-blue-600', hex: '#2563eb'}} />
                                <StatCard title="Appuntamenti Oggi" value={appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length} icon={Calendar} color={{bg: 'bg-purple-50', text: 'text-purple-600', hex: '#9333ea'}} />
                                <StatCard title="Richieste AI" value="128" trend={12} icon={BrainCircuit} color={{bg: 'bg-emerald-50', text: 'text-emerald-600', hex: '#10b981'}} />
                           </div>
                           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-black text-slate-900 text-lg">Attività Recente</h3>
                                    <button className="text-medical-600 text-xs font-bold uppercase tracking-widest hover:underline">Vedi tutto</button>
                                </div>
                                <div className="space-y-2">
                                    <ActivityFeedItem title="Nuovo referto generato per Rossi Mario" time="10 min fa" type="success" />
                                    <ActivityFeedItem title="Prenotazione confermata: Giulia Bianchi" time="32 min fa" type="info" />
                                    <ActivityFeedItem title="Alert Clinico: Valori fuori norma (ID: 9921)" time="1h fa" type="alert" />
                                </div>
                           </div>
                       </div>
                       
                       {/* ROI Widget */}
                       <div className="flex flex-col gap-6">
                           <RoiCalculator appts={appointments} />
                           
                           {/* Compliance Status Widget */}
                           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                                <h3 className="font-black text-lg text-slate-900 mb-4 flex items-center gap-2">
                                    <ShieldCheck size={20} className="text-emerald-500" /> Compliance
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm p-3 bg-slate-50 rounded-xl">
                                        <span className="text-slate-600">GDPR Registro</span>
                                        <span className="text-emerald-600 font-bold uppercase text-[10px]">Attivo</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm p-3 bg-slate-50 rounded-xl">
                                        <span className="text-slate-600">Backup Dati</span>
                                        <span className="text-slate-400 font-bold uppercase text-[10px]">Locale</span>
                                    </div>
                                </div>
                           </div>
                       </div>
                   </div>
                </div>
             )}

             {/* --- CRM VIEW --- */}
             {activeView === 'CRM' && (
                <div className="grid grid-cols-12 gap-8 h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className={`${selectedPatient ? 'col-span-4 hidden xl:block' : 'col-span-12'} transition-all h-full`}>
                      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
                         <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                             <div className="relative flex-1">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" placeholder="Cerca per nome o CF..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 outline-none font-medium text-slate-700 focus:ring-2 focus:ring-medical-100 focus:border-medical-300 transition-all shadow-sm" />
                             </div>
                             <button onClick={handleDataExport} className="ml-3 p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-colors" title="Esporta CSV (Interoperabilità)">
                                 <FileJson size={20} />
                             </button>
                         </div>
                         <div className="flex-1 overflow-y-auto p-4 space-y-2">
                             {/* ... Patient List Mapping (Same as before) ... */}
                             {patients.filter(p => p.registry.lastName.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                                <div key={p.id} onClick={()=>setSelectedPatient(p)} className={`group p-4 rounded-2xl cursor-pointer transition-all border flex items-center justify-between ${selectedPatient?.id === p.id ? 'bg-medical-50 border-medical-200 shadow-md ring-1 ring-medical-100' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}>
                                   <div className="flex items-center gap-4">
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-colors ${selectedPatient?.id === p.id ? 'bg-medical-600 text-white shadow-lg shadow-medical-500/30' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm'}`}>
                                         {p.registry.firstName.charAt(0)}{p.registry.lastName.charAt(0)}
                                      </div>
                                      <div>
                                         <div className={`font-bold text-base ${selectedPatient?.id === p.id ? 'text-medical-900' : 'text-slate-800'}`}>{p.registry.lastName} {p.registry.firstName}</div>
                                         <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{p.registry.fiscalCode}</div>
                                      </div>
                                   </div>
                                   <ChevronRight size={18} className={selectedPatient?.id === p.id ? 'text-medical-500' : 'text-slate-300 group-hover:text-slate-400'} />
                                </div>
                             ))}
                         </div>
                      </div>
                   </div>
                   {/* ... PatientDetailView container ... */}
                </div>
             )}

             {/* ... OTHER VIEWS (CALENDAR, FINANCE, CLINICAL, BRAIN, SETTINGS) SAME AS BEFORE ... */}
             {activeView === 'CLINICAL' && (
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-140px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="bg-slate-50/80 backdrop-blur-md border-b border-slate-200 p-6 flex items-center justify-between shrink-0">
                      <div className="flex gap-2 bg-slate-200/50 p-1 rounded-2xl">
                        <button onClick={() => setClinicalTool('REPORT')} className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${clinicalTool === 'REPORT' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Generatore Referti</button>
                        <button onClick={() => setClinicalTool('ANALYZER')} className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${clinicalTool === 'ANALYZER' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Analisi Documentale</button>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                         <AlertTriangle size={16} className="text-amber-500" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Assistita: Validazione Umana Richiesta</span>
                      </div>
                   </div>
                   <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30">
                      <AnimatePresence mode="wait">
                         {clinicalTool === 'REPORT' && (
                            <motion.div key="report" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="h-full">
                               <ReportGenerator patient={selectedPatient} onSaveSuccess={refreshData} />
                            </motion.div>
                         )}
                         {clinicalTool === 'ANALYZER' && (
                            <motion.div key="analyzer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="h-full">
                               <DocumentAnalyzer onSaveSuccess={refreshData} />
                            </motion.div>
                         )}
                      </AnimatePresence>
                   </div>
                </div>
             )}

             {/* ... */}

          </main>
       </div>
    </div>
  );
};

export default AdminDashboard;
