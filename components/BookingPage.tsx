import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  ShieldCheck,
  MapPin,
  Globe,
  Info,
  Sparkles,
  Clock,
} from "lucide-react";
import { CONTACT_INFO } from "../constants";

interface BookingPageProps {
  onBack: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ onBack }) => {
  useEffect(() => {
    // carica lo script Calendly solo se non già presente
    const scriptSrc = "https://assets.calendly.com/assets/external/widget.js";
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-slate-50 flex flex-col"
    >
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-medical-600 font-bold text-sm"
          >
            <div className="bg-slate-100 p-2 rounded-xl">
              <ArrowLeft size={18} />
            </div>
            TORNA AL SITO
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
              Connessione Protetta
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row">
        {/* SIDEBAR */}
        <aside className="lg:w-1/3 bg-white border-r border-slate-200 p-8 overflow-y-auto">
          <div className="max-w-md mx-auto">
            <div className="mb-10">
              <div className="w-16 h-16 bg-medical-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <Calendar size={32} />
              </div>

              <h1 className="text-3xl font-black text-slate-900 leading-tight mb-4">
                Pianifica la tua <br /> Consulenza
              </h1>

              <p className="text-slate-500">
                Seleziona il servizio e scegli la data più comoda per te.
                Riceverai conferma immediata via email.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-2xl border">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                  Informazioni Studio
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white rounded-xl text-medical-600">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {CONTACT_INFO.clinic.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {CONTACT_INFO.clinic.address.street}, Milano
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white rounded-xl text-medical-600">
                      <Globe size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Modalità Visita
                      </p>
                      <p className="text-xs text-slate-500">
                        In studio o telemedicina
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-medical-900 rounded-2xl text-white relative">
                <div className="absolute top-0 right-0 opacity-10 p-4">
                  <Info size={60} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sparkles size={14} /> Nota per i pazienti
                </h3>
                <p className="text-xs leading-relaxed">
                  In caso di disdetta avvisare con almeno 24 ore di anticipo.
                  Per urgenze non prenotabili online contattare la segreteria.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* CALENDLY */}
        <section className="lg:w-2/3 bg-slate-50">
          <div className="relative w-full h-[800px] lg:h-full">
            {/* Calendly inline widget */}
            <div
              className="calendly-inline-widget w-full h-full"
              data-url="https://calendly.com/grilli-fed/new-meeting?"
              style={{ minWidth: "320px", height: "100%" }}
            />

            {/* hint mobile */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden pointer-events-none">
              <div className="bg-slate-900/80 text-white px-4 py-2 rounded-full text-[10px] font-bold flex items-center gap-2">
                <Clock size={12} />
                Scorri per vedere tutti gli orari
              </div>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
};
