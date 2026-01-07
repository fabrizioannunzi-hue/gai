
import React, { useEffect } from 'react';
import { Calendar, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const PatientBooking: React.FC = () => {
  useEffect(() => {
    const scriptSrc = "https://assets.calendly.com/assets/external/widget.js";
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Card */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-medical-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-medical-500/30">
                <Calendar size={32} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900 leading-none mb-2">Prenota Nuova Visita</h2>
                <p className="text-slate-500 font-medium">Seleziona data e orario direttamente dal calendario.</p>
            </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
              Priorità Paziente Attiva
            </span>
        </div>
      </div>

      {/* Calendly Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden h-[700px] relative">
         <div 
            className="calendly-inline-widget w-full h-full" 
            data-url="https://calendly.com/grilli-fed/new-meeting?hide_landing_page_details=1&hide_gdpr_banner=1" 
            style={{ minWidth: '320px', height: '100%' }} 
         />
      </div>
    </div>
  );
};
