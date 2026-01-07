
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home, Briefcase, Building2, User, Mail, 
  ChevronDown, Dna, Lock, Activity,
  Baby, Stethoscope, ChevronRight, Sparkles, BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onAdminClick: () => void;
  onNavigate: (sectionId: string) => void;
  viewState: 'home' | 'admin' | 'patient' | 'booking' | 'cv' | 'single-service' | 'sofia';
  onBookClick?: () => void;
  onPatientClick: () => void;
  onSofiaClick?: () => void;
  activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick, onNavigate, viewState, onBookClick, onPatientClick, onSofiaClick, activeSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
  };

  const NAV_ITEMS = [
    { id: 'top', label: 'Home', icon: Home },
    { id: 'services', label: 'Servizi', icon: Briefcase, hasDropdown: true },
    { id: 'studio', label: 'Lo Studio', icon: Building2 },
    { id: 'about', label: 'Profilo', icon: User },
    { id: 'process', label: 'Percorso', icon: Activity },
  ];

  const isHome = viewState === 'home';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-3' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => handleNavClick('top')}
          >
            <div className={`p-2 rounded-xl transition-all duration-500 shadow-lg ${
              scrolled ? 'bg-medical-600 scale-90' : 'bg-slate-800 scale-100'
            }`}>
              <Dna className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                Federico Grilli
              </h1>
              <span className="text-[9px] text-medical-600 font-bold uppercase tracking-widest mt-1">Genetica Medica</span>
            </div>
          </div>

          {isHome && (
            <nav className="hidden xl:flex items-center space-x-2">
              {NAV_ITEMS.map((item) => (
                 <div 
                   key={item.id} 
                   className="relative"
                   onMouseEnter={() => item.hasDropdown && setIsServicesOpen(true)}
                   onMouseLeave={() => item.hasDropdown && setIsServicesOpen(false)}
                 >
                   <button 
                     onClick={() => handleNavClick(item.id)}
                     className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 rounded-xl flex items-center gap-2 ${
                       activeSection === item.id
                         ? 'text-medical-600 bg-medical-50' 
                         : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                     }`}
                   >
                     <span>{item.label}</span>
                     {item.hasDropdown && (
                        <ChevronDown size={12} className={`transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                     )}
                   </button>

                   {/* --- DROPDOWN MENU --- */}
                   {item.hasDropdown && (
                     <AnimatePresence>
                        {isServicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-80"
                          >
                             <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-2 overflow-hidden">
                                <button 
                                  onClick={() => handleNavClick('services')}
                                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all text-left group/item"
                                >
                                   <div className="bg-pink-50 p-2.5 rounded-xl text-pink-600 group-hover/item:bg-pink-600 group-hover/item:text-white transition-all">
                                      <Baby size={20} />
                                   </div>
                                   <div>
                                      <p className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Gravidanza</p>
                                      <p className="text-[10px] text-slate-400 font-medium">NIPT e Preconcezionale</p>
                                   </div>
                                </button>

                                <button 
                                  onClick={() => handleNavClick('services')}
                                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all text-left group/item"
                                >
                                   <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600 group-hover/item:bg-orange-600 group-hover/item:text-white transition-all">
                                      <Stethoscope size={20} />
                                   </div>
                                   <div>
                                      <p className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Pediatria</p>
                                      <p className="text-[10px] text-slate-400 font-medium">Malattie Rare</p>
                                   </div>
                                </button>
                             </div>
                          </motion.div>
                        )}
                     </AnimatePresence>
                   )}
                 </div>
              ))}
            </nav>
          )}
          
          <div className="flex items-center gap-2">
            <button 
               onClick={onAdminClick}
               className="p-2 text-slate-300 hover:text-medical-600 transition-colors"
               title="Area Riservata Medico"
            >
                <Lock size={16} />
            </button>

            <button 
               onClick={onPatientClick}
               className={`hidden md:flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-xl ${
                 scrolled ? 'text-slate-500 hover:text-slate-800' : 'text-slate-600 bg-white/50'
               }`}
            >
                <span>Pazienti</span>
            </button>

            {onBookClick && (
                <button
                  onClick={onBookClick}
                  className="bg-slate-800 hover:bg-medical-600 text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
                >
                  Prenota
                </button>
            )}

            <button className="xl:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
               {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE NAV --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[70] bg-white xl:hidden flex flex-col pt-24 px-6"
          >
            <nav className="flex flex-col space-y-2">
              {NAV_ITEMS.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition-all"
                >
                  <span className="text-lg font-bold text-slate-800 uppercase tracking-tight">{item.label}</span>
                  <ChevronRight size={18} className="text-slate-300" />
                </button>
              ))}
              <div className="mt-8 pt-8 border-t border-slate-100">
                <button onClick={onPatientClick} className="w-full p-5 rounded-2xl bg-slate-800 text-white font-bold uppercase text-xs tracking-widest">
                  Area Pazienti
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
