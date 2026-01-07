
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Microscope } from 'lucide-react';

export function StudioSection() {
  return (
    <section id="studio" className="scroll-mt-28 py-20 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-medical-50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-100 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-slate-100 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <Microscope size={14} className="text-medical-600" />
            <span className="text-slate-600 font-bold text-[10px] uppercase tracking-[0.2em]">Tecnologia & Comfort</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Lo Studio
          </h2>
        </motion.div>

        {/* --- SINGLE TEXT CONTAINER --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-xl shadow-slate-200/40 relative"
        >
           {/* Decorative Quote Icon */}
           <div className="absolute top-8 left-8 text-medical-50">
              <Quote size={80} fill="currentColor" />
           </div>

           <div className="relative z-10 text-lg md:text-xl text-slate-600 leading-relaxed font-light text-justify md:text-left space-y-6">
              <p>
                Il nostro studio nasce con l'idea di rivoluzionare l'esperienza dal dentista: da momento di stress a percorso di benessere. Crediamo che un sorriso sano sia il primo passo per stare bene con se stessi.
              </p>
              <p>
                Abbiamo investito nelle migliori tecnologie disponibili: dalla <strong>TAC Cone Beam</strong> a bassissimo dosaggio per diagnosi immediate, agli <strong>scanner intraorali</strong> che eliminano il fastidio delle impronte tradizionali. L'ambiente è studiato per rilassare, con cromoterapia e musica diffusa.
              </p>
              <p>
                L'igiene e la sterilizzazione seguono protocolli ospedalieri rigorosi. Ogni strumento è tracciato e sigillato. La sicurezza del paziente è la nostra priorità assoluta, insieme alla trasparenza dei piani di cura e dei preventivi.
              </p>
              <p className="font-medium text-slate-800 border-l-4 border-medical-500 pl-4">
                Lo studio si avvale di strumenti di Intelligenza Artificiale per la gestione delle urgenze e delle prenotazioni. L’AI assistant (Sofia) è disponibile 24/7 per rispondere alle tue domande su trattamenti e post-operatorio.
              </p>
           </div>
        </motion.div>

      </div>
    </section>
  );
}
