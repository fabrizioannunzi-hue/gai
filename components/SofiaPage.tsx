
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, Sparkles, Mic, Database, 
  ShieldCheck, Globe, ArrowLeft, 
  MessageSquare, FileText, 
  CreditCard, Activity, UploadCloud, Stethoscope,
  Instagram, Facebook, Mail, MessageCircle, Bot
} from 'lucide-react';

interface SofiaPageProps {
  onBack: () => void;
  onOpenVoice: () => void;
}

const SofiaPage: React.FC<SofiaPageProps> = ({ onBack, onOpenVoice }) => {
  const features = [
    {
      icon: Activity,
      title: "Cartella Clinica AI",
      desc: "Analisi automatica dei trend vitali e storicizzazione sicura di allergie e patologie."
    },
    {
      icon: UploadCloud,
      title: "Vision Analysis",
      desc: "Carica i tuoi referti: l'AI li analizza in tempo reale estraendo i valori critici per il medico."
    },
    {
      icon: CreditCard,
      title: "Gestione Pagamenti",
      desc: "Visualizza lo storico transazioni e scarica le fatture fiscali in un click."
    },
    {
      icon: FileText,
      title: "Refertazione Rapida",
      desc: "Referti generati con supporto AI per la massima precisione e velocità di consegna."
    },
    {
      icon: Stethoscope,
      title: "Triage Intelligente",
      desc: "Sofia valuta i sintomi preliminari e suggerisce la tipologia di visita più adatta."
    },
    {
      icon: MessageSquare,
      title: "Canale Sicuro",
      desc: "Comunicazione criptata end-to-end diretta con il Dott. Grilli."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-900"
    >
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-medical-600 transition-colors text-xs font-bold uppercase tracking-widest group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Torna allo Studio
          </button>
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-tr from-purple-600 to-blue-600 p-2 rounded-lg shadow-lg shadow-purple-500/20">
                <BrainCircuit size={18} className="text-white" />
             </div>
             <span className="font-bold text-sm tracking-tight uppercase text-slate-800">Galattico <span className="text-purple-600">Agents</span></span>
          </div>
          <div className="w-32 hidden md:block"></div> 
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-50 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 shadow-sm">
              <Sparkles size={12} /> Galattico AI System
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-8 text-slate-900">
              Due Intelligenze.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400">Copertura Totale.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
              Un ecosistema integrato dove l'AI vocale e l'AI testuale lavorano in sinergia per gestire ogni punto di contatto con il paziente, dal sito web ai social media.
            </p>
          </motion.div>
        </div>
      </header>

      {/* --- THE TWINS SECTION (MARCO & SOFIA) --- */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
            {/* SOFIA PROFILE */}
            <motion.div 
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[3rem] p-8 md:p-12 border border-purple-100 shadow-2xl shadow-purple-100 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Mic size={100} className="text-purple-600" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-40 h-40 rounded-full p-1.5 bg-gradient-to-tr from-purple-500 to-indigo-500 mb-6 shadow-xl">
                        <img 
                            src="https://i.ibb.co/svrs9b0B/unnamed-10.jpg" 
                            alt="Sofia AI" 
                            className="w-full h-full object-cover rounded-full border-4 border-white"
                        />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-1">Sofia</h2>
                    <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                        Voice & Web Specialist
                    </span>
                    
                    <p className="text-slate-600 font-medium leading-relaxed mb-8">
                        L'interfaccia <strong>Empatica e Vocale</strong> residente sul sito. 
                        Gestisce il triage in tempo reale, la prenotazione vocale e il supporto emotivo immediato per i pazienti che navigano il portale.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100">
                            <Globe size={14} className="text-purple-500" /> Web Chat
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100">
                            <Mic size={14} className="text-purple-500" /> Live Voice
                        </div>
                    </div>

                    <button onClick={onOpenVoice} className="mt-8 w-full py-4 bg-purple-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg flex items-center justify-center gap-2">
                        <Mic size={16} /> Parla con Sofia
                    </button>
                </div>
            </motion.div>

            {/* MARCO PROFILE */}
            <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden group text-white"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Bot size={100} className="text-teal-400" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-40 h-40 rounded-full p-1.5 bg-gradient-to-tr from-teal-400 to-emerald-500 mb-6 shadow-xl shadow-teal-900/50">
                        {/* Placeholder for Marco.jpg - Using a professional male AI avatar */}
                        <img 
                            src="https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5068.jpg" 
                            alt="Marco AI" 
                            className="w-full h-full object-cover object-top rounded-full border-4 border-slate-800"
                        />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-1">Marco</h2>
                    <span className="px-4 py-1 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                        Social & Text Manager
                    </span>
                    
                    <p className="text-slate-300 font-medium leading-relaxed mb-8">
                        L'agente <strong>Omnicanale Asincrono</strong>. 
                        Marco vive sui social network e nella casella email. Risponde ai DM di Instagram, commenti Facebook e gestisce la corrispondenza amministrativa complessa.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-xs font-bold text-slate-200 border border-white/5">
                            <Mail size={14} className="text-teal-400" /> Email
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-xs font-bold text-slate-200 border border-white/5">
                            <Instagram size={14} className="text-pink-400" /> Instagram
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-xs font-bold text-slate-200 border border-white/5">
                            <Facebook size={14} className="text-blue-400" /> Facebook
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-xs font-bold text-slate-200 border border-white/5">
                            <MessageCircle size={14} className="text-green-400" /> WhatsApp
                        </div>
                    </div>

                    <div className="mt-8 w-full py-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 cursor-default">
                        <Activity size={14} className="animate-pulse text-teal-400" /> Attivo sui Social Media
                    </div>
                </div>
            </motion.div>

        </div>
      </section>

      {/* --- ECOSYSTEM FEATURES --- */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <span className="text-medical-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Funzionalità Condivise</span>
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Un Cervello, Due Voci</h2>
               <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                  Entrambi gli agenti condividono la stessa "Synaptic Matrix" (memoria centrale), garantendo coerenza clinica su ogni canale.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {features.map((feat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group"
                  >
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-md mb-6 group-hover:scale-110 transition-transform group-hover:text-purple-600">
                        <feat.icon size={28} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                     <p className="text-slate-500 text-sm leading-relaxed font-medium">{feat.desc}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* --- HOW IT WORKS (TRAINING) --- */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
         {/* Decor */}
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-900/20 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"></div>

         <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
               <div className="lg:w-1/2">
                  <div className="inline-flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-widest mb-6">
                     <Database size={14} /> Synaptic Matrix Core
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                     Come imparano? <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">Apprendimento Organico.</span>
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                     A differenza delle AI tradizionali programmate con codice statico, Sofia e Marco utilizzano un approccio basato sulla voce del medico e sull'analisi dei documenti.
                  </p>
                  
                  <div className="space-y-6">
                     {[
                        { title: "1. Ascolto Attivo", desc: "Il Dott. Grilli spiega protocolli e procedure parlando naturalmente con Sofia." },
                        { title: "2. Codifica Neurale", desc: "Il sistema estrae i concetti chiave e crea 'Mattoni di Memoria' condivisi tra i due agenti." },
                        { title: "3. Distribuzione", desc: "Sofia applica la conoscenza vocalmente, Marco la usa per rispondere alle mail e ai DM." }
                     ].map((step, i) => (
                        <div key={i} className="flex gap-4">
                           <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0 border border-slate-700">
                              {i + 1}
                           </div>
                           <div>
                              <h4 className="font-bold text-lg mb-1 text-slate-200">{step.title}</h4>
                              <p className="text-slate-400 text-sm">{step.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="lg:w-1/2 w-full">
                  <div className="relative aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] border border-white/10 p-8 flex items-center justify-center overflow-hidden shadow-2xl">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                     <div className="relative z-10 w-full h-full flex items-center justify-center">
                         
                         {/* Connecting Lines Animation */}
                         <motion.div 
                            animate={{ opacity: [0.3, 0.6, 0.3] }} 
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-2 bg-gradient-to-r from-teal-500/20 to-purple-500/20 blur-xl"
                         ></motion.div>

                         {/* Avatars Orbiting */}
                         <div className="relative w-64 h-64">
                            <motion.div 
                                animate={{ rotate: 360 }} 
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
                                className="absolute inset-0 rounded-full border border-slate-700 border-dashed"
                            >
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-teal-500 rounded-full shadow-lg shadow-teal-500/50"></div>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                            </motion.div>
                            
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <Database size={48} className="text-white mx-auto mb-2 opacity-50" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Shared<br/>Memory</p>
                                </div>
                            </div>
                         </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- GALATTICO AI FOOTER --- */}
      <section className="py-24 bg-white border-t border-slate-100 text-center">
         <div className="max-w-4xl mx-auto px-6">
            <div className="inline-block p-4 bg-slate-50 rounded-3xl mb-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 px-2">
                    <span className="font-black text-slate-900 tracking-tighter text-2xl">GALATTICO</span>
                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-xs font-bold">AI</span>
                </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Powered by <span className="text-purple-600">Galattico AI Ltd</span></h2>
            <p className="text-slate-500 leading-relaxed mb-10 text-lg max-w-2xl mx-auto">
               Siamo una realtà pionieristica specializzata nello sviluppo di <strong>Identità Digitali Avanzate</strong> per professionisti. 
               La nostra missione è umanizzare la tecnologia, creando interfacce AI che comprendono e comunicano con empatia.
            </p>
            
            <div className="flex justify-center gap-8">
               <a href="https://www.galattico.ai" target="_blank" rel="noreferrer" className="text-slate-900 font-bold border-b-2 border-purple-500 hover:text-purple-600 transition-colors pb-0.5 text-sm uppercase tracking-widest">
                  Visita il sito ufficiale
               </a>
               <a href="mailto:hello@galattico.ai" className="text-slate-900 font-bold border-b-2 border-blue-500 hover:text-blue-600 transition-colors pb-0.5 text-sm uppercase tracking-widest">
                  Contattaci
               </a>
            </div>
            
            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-slate-400 font-mono uppercase tracking-widest">
                <span>London, UK</span>
                <span className="hidden md:block">•</span>
                <span>Milano, IT</span>
                <span className="hidden md:block">•</span>
                <span>© {new Date().getFullYear()} Galattico AI Ltd.</span>
            </div>
         </div>
      </section>
    </motion.div>
  );
};

export default SofiaPage;
