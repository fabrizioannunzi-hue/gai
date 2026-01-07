
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Award, HeartPulse, GraduationCap, Smile } from 'lucide-react';

interface AboutSectionProps {
  onCVClick?: () => void;
}

export function AboutSection({ onCVClick }: AboutSectionProps) {
  return (
    <section id="about" className="scroll-mt-28 py-24 md:py-40 bg-white relative overflow-hidden">
      
      {/* --- BACKGROUND SUBTLETY --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-[0.03] pointer-events-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* --- CENTERED PHOTO COMPOSITION --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mb-16"
        >
          <div className="relative z-10 w-56 h-56 md:w-80 md:h-80 rounded-full p-1.5 bg-gradient-to-tr from-medical-100 via-medical-500 to-medical-200 shadow-2xl shadow-medical-500/20">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-slate-100 group">
              <img
                src="https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg?w=1380&t=st=1709825453~exp=1709826053~hmac=..."
                alt="Dr. Alessandro Bianchi"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>

          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-2xl shadow-lg border border-slate-100 hidden md:flex items-center gap-3 z-20"
          >
            <div className="w-8 h-8 rounded-lg bg-medical-50 flex items-center justify-center text-medical-600">
              <Smile size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-800">Smile Designer</span>
          </motion.div>
        </motion.div>

        {/* --- CENTERED TEXT CONTENT --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center w-full"
        >
          <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full mb-8">
            <Award size={14} className="text-medical-600" />
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Profilo Professionale</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter leading-tight mb-8">
            Il Dottore
          </h2>

          <div className="max-w-2xl mx-auto space-y-8 text-lg md:text-xl text-slate-600 leading-relaxed font-light">
            <p>
              Sono un <strong className="font-semibold text-slate-900 border-b-2 border-medical-200">medico odontoiatra</strong> con una visione moderna della cura del sorriso: mininvasività, estetica e tecnologia digitale.
            </p>
            <p>
              Dopo la Laurea con Lode all'<strong className="font-semibold text-slate-900">Università di Milano</strong>, ho perfezionato le mie competenze con Master in <strong className="font-semibold text-slate-900">Implantologia Avanzata</strong> e corsi di aggiornamento internazionale in Estetica Dentale.
            </p>
            <p>
              Credo che ogni paziente meriti non solo cure eccellenti, ma un'esperienza <span className="text-medical-700 bg-medical-50 px-2 py-0.5 rounded-lg font-medium">senza ansia</span>. Per questo investo costantemente in tecnologie come lo scanner intraorale e la sedazione cosciente.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-16">
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-medical-300 transition-colors group">
              <GraduationCap className="text-medical-600 group-hover:scale-110 transition-transform" size={20} />
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none mb-1">Formazione</p>
                <p className="text-sm font-bold text-slate-800">UniMi & New York Univ.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-medical-300 transition-colors group">
              <HeartPulse className="text-medical-600 group-hover:scale-110 transition-transform" size={20} />
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none mb-1">Focus</p>
                <p className="text-sm font-bold text-slate-800">Chirurgia & Estetica</p>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onCVClick}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-2xl bg-slate-800 text-white hover:bg-slate-900 transition-all font-bold shadow-xl active:scale-95"
            >
              <FileText size={20} className="text-medical-400" />
              Curriculum Vitae
            </button>
          </div>

        </motion.div>
      </div>

      <div className="flex justify-center mt-20">
         <div className="w-1 h-12 bg-gradient-to-b from-medical-200 to-transparent rounded-full opacity-50"></div>
      </div>
    </section>
  );
}
