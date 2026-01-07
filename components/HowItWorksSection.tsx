
import React from 'react';
import { motion } from 'framer-motion';
import { Users, FolderOpen, Stethoscope, ClipboardList, MailCheck, Sparkles, Calendar } from 'lucide-react';

interface HowItWorksProps {
  onAction?: (context: string) => void;
  onBookClick?: () => void;
}

const steps = [
  {
    icon: Users,
    title: 'Info e Prenotazione',
    description: "Verifica le disponibilità in tempo reale e prenota la tua visita in pochi click tramite il nostro calendario.",
    step: '01',
    actionLabel: 'Apri Calendario',
    isBooking: true,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50 text-blue-600',
    borderColor: 'border-blue-100'
  },
  {
    icon: FolderOpen,
    title: 'Documentazione',
    description: "Carica referti precedenti o test genetici già eseguiti. L'upload avviene su server criptati sicuri.",
    step: '02',
    actionLabel: 'Area Pazienti',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50 text-purple-600',
    borderColor: 'border-purple-100'
  },
  {
    icon: Stethoscope,
    title: 'La Visita',
    description: "Il Dr. Grilli ricostruisce la storia familiare ed esamina il paziente. Scegli tra telemedicina o visita in studio.",
    step: '03',
    actionLabel: 'Modalità Visita',
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50 text-emerald-600',
    borderColor: 'border-emerald-100'
  },
  {
    icon: ClipboardList,
    title: 'Test e Analisi',
    description: "Se necessario, verranno prescritti test specifici (es. Esoma, CGH Array, NIPT) con relativi consensi informati.",
    step: '04',
    actionLabel: 'Info Test',
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50 text-amber-600',
    borderColor: 'border-amber-100'
  },
  {
    icon: MailCheck,
    title: 'Refertazione',
    description: "Riceverai un referto dettagliato e una nuova consulenza per discutere i risultati e le implicazioni.",
    step: '05',
    actionLabel: 'Tempi Referti',
    color: 'bg-sky-500',
    lightColor: 'bg-sky-50 text-sky-600',
    borderColor: 'border-sky-100'
  },
];

export function HowItWorksSection({ onAction, onBookClick }: HowItWorksProps) {
  return (
    <section id="process" className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-medical-600 font-bold text-sm tracking-[0.2em] uppercase mb-3 block">Il Percorso Clinico</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Semplice, Chiaro, <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-600 to-purple-600">Guidato.</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
              Dalla prima richiesta alla diagnosi finale. Ogni passaggio è studiato per garantirti velocità e chiarezza.
            </p>
          </motion.div>
        </div>

        {/* Timeline Grid */}
        <div className="relative">
           {/* Connecting Line (Desktop) */}
           <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-200 via-medical-200 to-slate-200 -translate-x-1/2 rounded-full"></div>

           <div className="space-y-12 lg:space-y-0">
              {steps.map((step, index) => {
                 const isEven = index % 2 === 0;
                 return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.7, delay: index * 0.1 }}
                      className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${isEven ? '' : 'lg:flex-row-reverse'}`}
                    >
                       <div className="w-full lg:w-[calc(50%-32px)]">
                          <div className={`bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden ${step.borderColor}`}>
                             <div className="absolute -right-4 -top-4 text-8xl font-black text-slate-50 group-hover:text-slate-100 transition-colors select-none z-0">
                                {step.step}
                             </div>

                             <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                   <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center text-white shadow-lg`}>
                                      <step.icon size={28} />
                                   </div>
                                   
                                   <button 
                                      onClick={() => step.isBooking && onBookClick && onBookClick()}
                                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all duration-300 border border-transparent hover:border-current hover:bg-white ${step.lightColor}`}
                                   >
                                      {step.isBooking ? <Calendar size={12} /> : <Sparkles size={12} />}
                                      {step.actionLabel}
                                   </button>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm font-medium">
                                   {step.description}
                                </p>
                             </div>
                          </div>
                       </div>

                       <div className="hidden lg:flex w-16 h-16 rounded-full bg-white border-4 border-slate-50 shadow-lg items-center justify-center relative z-10 flex-shrink-0">
                          <div className={`w-4 h-4 rounded-full ${step.color}`}></div>
                       </div>

                       <div className="hidden lg:block w-full lg:w-[calc(50%-32px)]"></div>
                    </motion.div>
                 );
              })}
           </div>
        </div>
      </div>
    </section>
  );
}
