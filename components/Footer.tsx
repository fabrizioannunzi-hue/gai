
import React from 'react';
import { Mail, Linkedin, Award, MapPin, ChevronRight, GraduationCap, FileText, Lock, Phone, Orbit, AlertTriangle } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onPatientClick: () => void;
  onAdminClick: () => void;
  onCVClick: () => void;
  onBookClick: () => void;
  onPrivacyClick: () => void;
  onCookieClick: () => void;
  onTermsClick: () => void;
  onSofiaClick?: () => void;
}

export function Footer({ 
  onNavigate, onPatientClick, onAdminClick, onCVClick, onBookClick, onPrivacyClick, onCookieClick, onTermsClick, onSofiaClick
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contacts" className="bg-white text-slate-500 border-t border-slate-100 scroll-mt-28 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        
        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* COL 1: Brand & Desc */}
          <div className="space-y-6">
            <div>
               <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tight">Alessandro Bianchi</h3>
               <p className="text-medical-600 text-[10px] font-bold uppercase tracking-[0.2em]">Studio Dentistico</p>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed font-medium text-justify">
              Tecnologia digitale, chirurgia mininvasiva e attenzione all'estetica del sorriso. Il nostro obiettivo è la salute della tua bocca in un ambiente sereno e accogliente.
            </p>
            <div className="flex gap-4 pt-2">
               <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-medical-600 hover:bg-medical-50 transition-all">
                  <Linkedin size={18} />
               </a>
               <button 
                  onClick={onAdminClick} 
                  className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-medical-600 hover:bg-medical-100 transition-all"
                  title="Accesso Staff"
               >
                  <Lock size={18} />
               </button>
            </div>
          </div>

          {/* COL 2: Qualifiche */}
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest">Qualifiche</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                 <GraduationCap className="shrink-0 text-medical-600 mt-0.5" size={16} />
                 <div>
                    <span className="font-bold text-slate-700 block leading-tight">Laurea in Odontoiatria</span>
                    <span className="text-slate-400 text-xs italic">Università degli Studi di Milano</span>
                 </div>
              </li>
              <li className="flex gap-3">
                 <Award className="shrink-0 text-medical-600 mt-0.5" size={16} />
                 <div>
                    <span className="font-bold text-slate-700 block leading-tight">Master Implantologia</span>
                    <span className="text-slate-400 text-xs italic">New York University</span>
                 </div>
              </li>
            </ul>
            <button onClick={onCVClick} className="flex items-center gap-2 text-xs font-bold text-medical-600 hover:text-medical-800 transition-colors uppercase tracking-wider group pt-2">
               <FileText size={14} />
               Visualizza Curriculum
               <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* COL 3: Navigazione */}
          <div className="space-y-6 lg:pl-8">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest">Esplora</h3>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { id: 'services', label: 'Trattamenti' },
                { id: 'studio', label: 'Tecnologie & Studio' },
                { id: 'about', label: 'Il Dottore' },
                { id: 'sofia', label: 'AI Assistant Sofia', action: onSofiaClick },
                { id: 'patient', label: 'Portale Pazienti', action: onPatientClick },
              ].map((link) => (
                <li key={link.id}>
                  <button 
                    onClick={() => link.action ? link.action() : onNavigate(link.id)} 
                    className="text-slate-500 hover:text-medical-600 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-medical-600 transition-colors" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 4: Contatti & AI */}
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest">Contatti</h3>
            <div className="space-y-4 text-sm font-medium">
               <div className="flex gap-3">
                  <MapPin className="shrink-0 text-medical-600 mt-0.5" size={16} />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 mb-0.5">{CONTACT_INFO.clinic.name}</span>
                    <span className="text-slate-500 leading-snug">{CONTACT_INFO.clinic.address.street}<br/>{CONTACT_INFO.clinic.address.city}</span>
                  </div>
               </div>
               <div className="flex gap-3 items-center">
                  <Mail className="shrink-0 text-medical-600" size={16} />
                  <a href={`mailto:${CONTACT_INFO.doctor.email}`} className="text-slate-500 hover:text-medical-600 transition-colors">{CONTACT_INFO.doctor.email}</a>
               </div>
               
               {/* AI Status Indicator */}
               <div className="flex gap-3 pt-4 border-t border-slate-100 mt-2">
                  <div className="relative mt-0.5">
                    <Phone className="shrink-0 text-purple-600" size={16} />
                    <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  </div>
                  <div>
                     <span className="block font-bold text-slate-800 text-xs">Assistente Sofia AI</span>
                     <span className="text-slate-400 text-[10px] leading-tight block mt-0.5">Triage Odontoiatrico H24</span>
                  </div>
               </div>
            </div>
          </div>

        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t border-slate-100 pt-10">
           
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8">
              <div className="text-slate-400 text-[10px] font-medium leading-relaxed">
                 <p className="font-bold text-slate-600 uppercase tracking-widest text-xs mb-1">© {currentYear} Studio Bianchi</p>
                 <p>P.IVA 11287400011 • Direttore Sanitario Dr. Alessandro Bianchi</p>
              </div>
              
              <div className="flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                 <button onClick={onPrivacyClick} className="hover:text-medical-600 transition-colors border-b border-transparent hover:border-medical-600 pb-0.5">Privacy Policy</button>
                 <button onClick={onCookieClick} className="hover:text-medical-600 transition-colors border-b border-transparent hover:border-medical-600 pb-0.5">Cookie Policy</button>
                 <button onClick={onTermsClick} className="hover:text-medical-600 transition-colors border-b border-transparent hover:border-medical-600 pb-0.5">Termini</button>
              </div>
           </div>
           
           {/* PROFESSIONAL DISCLAIMER */}
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 text-[10px] leading-relaxed text-slate-500 text-justify relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-300"></div>
              <div className="flex gap-3 mb-2">
                 <AlertTriangle size={14} className="text-slate-400 shrink-0" />
                 <span className="font-bold text-slate-700 uppercase tracking-widest">Avvertenze Mediche</span>
              </div>
              <p>
                Le informazioni fornite dall’assistente AI “Sofia” hanno scopo informativo e di supporto amministrativo. 
                Non costituiscono diagnosi odontoiatrica né sostituiscono la visita clinica. 
                In caso di dolore acuto, emorragia o gonfiore importante, recarsi al Pronto Soccorso o contattare il 112.
              </p>
           </div>

           {/* GALATTICO FOOTER */}
           <div className="mt-12 flex justify-center opacity-70 hover:opacity-100 transition-opacity">
                <a href="https://www.galattico.ai" target="_blank" rel="noreferrer" className="flex items-center gap-3 group cursor-pointer no-underline">
                    <div className="p-1.5 bg-slate-900 rounded-full border border-indigo-500/30 shadow-lg shadow-indigo-500/10 group-hover:shadow-indigo-500/30 transition-all">
                        <Orbit size={12} className="text-indigo-400 group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">
                            Powered by Galattico AI
                        </span>
                    </div>
                </a>
           </div>

        </div>
      </div>
    </footer>
  );
}
