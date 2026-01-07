
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ShieldCheck, MapPin, CheckCircle2, Award } from 'lucide-react';
import { REVIEWS } from '../constants';

export function ReviewsSection() {
  return (
    <section id="reviews" className="scroll-mt-28 py-24 bg-slate-50/50 rounded-[3.5rem] border border-slate-100/50 my-16 overflow-hidden relative">
      {/* Background Decor Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-medical-50/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-100 shadow-sm">
            <ShieldCheck size={14} />
            Pazienti Verificati
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6">
            L'Esperienza delle Famiglie
          </h2>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            La fiducia dei nostri pazienti è il riconoscimento più prezioso della nostra dedizione alla genetica clinica.
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden"
            >
              {/* Floating Quote Icon Decoration */}
              <div className="absolute top-8 right-10 text-slate-50 group-hover:text-medical-50/60 transition-colors duration-500 pointer-events-none">
                <Quote size={80} fill="currentColor" strokeWidth={0} />
              </div>
              
              {/* Rating Stars */}
              <div className="flex gap-1 mb-8 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400 transition-transform group-hover:scale-110" style={{ transitionDelay: `${i * 50}ms` }} />
                ))}
              </div>

              {/* Review Body */}
              <div className="relative z-10 flex-grow">
                <p className="text-slate-700 leading-relaxed mb-10 text-lg md:text-xl font-medium italic">
                  "{review.text}"
                </p>
              </div>

              {/* Author Info Section */}
              <div className="relative z-10 pt-8 border-t border-slate-50 mt-auto">
                <div className="flex items-center gap-4">
                  {/* Avatar Initials */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-medical-50 to-medical-100 flex items-center justify-center font-black text-medical-700 text-xl shadow-inner border border-medical-200/50">
                    {review.author.charAt(0)}
                  </div>
                  
                  {/* Name and Credentials */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                       <h4 className="font-black text-slate-900 text-base tracking-tight">{review.author}</h4>
                       {/* Fix: removed title prop which caused error as it is not part of LucideProps */}
                       <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="flex flex-col gap-0.5 mt-0.5">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{review.date}</p>
                       <div className="flex items-center gap-1.5 text-[10px] text-medical-600 font-black uppercase tracking-widest">
                          <MapPin size={10} />
                          <span>Paziente dello Studio</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Trust Indicator / Statistics Footer */}
        <div className="mt-20 text-center">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex flex-col md:flex-row items-center gap-6 px-10 py-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30"
           >
              {/* Satisfaction Metric */}
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-3">
                    {[...Array(5)].map((_, i) => (
                       <div key={i} className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center text-[11px] font-black shadow-sm ${
                         i === 0 ? 'bg-medical-600 text-white' : i === 1 ? 'bg-blue-600 text-white' : i === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                       }`}>
                          {i === 4 ? '+200' : String.fromCharCode(65 + i)}
                       </div>
                    ))}
                 </div>
                 <div className="text-left leading-none">
                    <div className="text-slate-900 text-xl font-black tracking-tight">4.9 / 5.0</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mt-1 font-black">Valutazione Media</div>
                 </div>
              </div>

              {/* Vertical Divider (Desktop only) */}
              <div className="hidden md:block h-10 w-px bg-slate-100"></div>

              {/* Clinical Excellence Badge */}
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                    <Award size={24} />
                 </div>
                 <div className="text-left leading-none">
                    <div className="text-slate-900 text-sm font-black uppercase tracking-widest">Eccellenza Clinica</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-1 tracking-widest uppercase">Protocolli Validati</div>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
}
