
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { MessageCircle, Calendar } from 'lucide-react';

interface HeroProps {
    onBookClick?: () => void;
    onSofiaClick?: () => void;
}

export function Hero({ onBookClick, onSofiaClick }: HeroProps) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <div className="relative h-screen min-h-[700px] flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            // Immagine dentistica: Studio moderno o sorriso luminoso
            backgroundImage: `url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop')`,
            backgroundPosition: 'center 40%', 
          }}
        />
        {/* High contrast dark overlay with Teal tint */}
        <div className="absolute inset-0 bg-slate-900/60" /> 
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-teal-900/20 to-transparent" />
      </div>

      {/* Centered Glass Card */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center h-full">
        <motion.div 
            className="max-w-2xl w-full bg-slate-900/40 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col gap-6"
            initial="hidden" 
            animate="visible" 
            transition={{ staggerChildren: 0.08 }}
        >
          <motion.div variants={itemVariants}>
             <span className="inline-block py-1 px-3 rounded-lg bg-teal-500/20 border border-teal-500/30 text-teal-300 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                Eccellenza Odontoiatrica
             </span>
             <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none mb-2">
                Alessandro <span className="text-medical-400">Bianchi</span>
             </h1>
             <p className="text-lg md:text-xl font-medium text-slate-300 tracking-wide uppercase">Medico Chirurgo Odontoiatra</p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
             <p className="text-slate-100 text-lg leading-relaxed font-light border-l-2 border-medical-500 pl-4">
                Tecnologia digitale e cura artigianale per il tuo sorriso. Dallo sbiancamento all'implantologia avanzata, ti guidiamo verso la tua migliore espressione. Parla con <strong>Sofia</strong>, la nostra AI, per info h24.
             </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3 my-2">
             {[
               "Implantologia Computer Guidata",
               "Ortodonzia Invisibile (Invisalign)",
               "Igiene & Sbiancamento Laser"
             ].map((feature, idx) => (
               <div key={idx} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-500/20 text-teal-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="text-slate-200 font-bold text-sm">{feature}</span>
               </div>
             ))}
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-2">
            <button 
              onClick={onSofiaClick}
              className="bg-medical-600 text-white px-6 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-medical-500 transition-all flex items-center gap-2 shadow-xl shadow-teal-900/20 active:scale-95"
            >
               <MessageCircle size={18} />
               Parla con Sofia
            </button>
            <button 
               onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
               className="bg-transparent text-white border border-white/30 px-6 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 active:scale-95"
            >
               <Calendar size={18} />
               Scopri i trattamenti
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full z-20 text-white leading-none">
         <svg viewBox="0 0 1440 100" className="w-full h-auto fill-current block">
            <path d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
         </svg>
      </div>
    </div>
  );
}
