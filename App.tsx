
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import SubServiceCard from './components/SubServiceCard';
import SingleServiceDetail from './components/SingleServiceDetail';
import AdminDashboard from './components/AdminDashboard';
import PatientArea from './components/PatientArea';
import CVPage from './components/CVPage';
import SofiaPage from './components/SofiaPage';
import LiveVoiceModal from './components/LiveVoiceModal';
import LegalPage from './components/LegalPage';
import { BookingPage } from './components/BookingPage';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { StudioSection } from './components/StudioSection';
import { Footer } from './components/Footer';
import { SERVICES, FAQ_CATEGORIES } from './constants';
import { ServiceItem, SubService } from './types';
import { H2, Caption, Section } from './components/DesignSystem';
import { ChevronDown, HelpCircle, ArrowUp } from 'lucide-react';
import { BrainStore } from './services/brainStore';

const THEMES: Record<string, any> = {
  pink: { 
    title: 'text-pink-600', 
    iconBg: 'bg-pink-50', 
    iconColor: 'text-pink-500',
    hoverBorder: 'hover:border-pink-100', 
    buttonText: 'text-pink-500',
    underline: 'bg-pink-400'
  },
  orange: { 
    title: 'text-orange-600', 
    iconBg: 'bg-orange-50', 
    iconColor: 'text-orange-500',
    hoverBorder: 'hover:border-orange-100', 
    buttonText: 'text-orange-500',
    underline: 'bg-orange-400'
  },
  blue: { 
    title: 'text-medical-600', 
    iconBg: 'bg-medical-50', 
    iconColor: 'text-medical-600',
    hoverBorder: 'hover:border-medical-100', 
    buttonText: 'text-medical-600',
    underline: 'bg-medical-500'
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'admin' | 'patient' | 'service-detail' | 'single-service' | 'cv' | 'booking' | 'privacy' | 'cookie' | 'terms' | 'sofia'>('home');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedSubService, setSelectedSubService] = useState<SubService | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_CATEGORIES[0].faqs[0].question);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // INIZIALIZZAZIONE MATRICE SOFIA
  useEffect(() => {
    BrainStore.initializeMatrix();
  }, []);

  // RESET SCROLL ISTANTANEO
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 800);
      if (view !== 'home') return;
      const sections = ['top', 'services', 'studio', 'about', 'process'];
      const scrollPosition = window.scrollY + 120;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) setActiveSection(id);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  const handleNavigate = (sectionId: string) => {
    setView('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      else if (sectionId === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const handleSubServiceClick = (sub: SubService, parentService: ServiceItem) => {
    setSelectedSubService(sub);
    setSelectedService(parentService);
    setView('single-service');
  };

  const goToBookingPage = useCallback(() => {
    setView('booking');
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-medical-100 selection:text-medical-800">
      {view === 'home' && <motion.div className="fixed top-0 left-0 right-0 h-1 bg-medical-500 origin-left z-[100]" style={{ scaleX }} />}

      <AnimatePresence>
        {isVoiceMode && (
          <LiveVoiceModal 
            key="voice-modal"
            onClose={() => setIsVoiceMode(false)} 
            initialContext={undefined}
            onOpenCalendly={goToBookingPage}
          />
        )}
      </AnimatePresence>

      <ChatInterface isOpen={isChatOpen} setIsOpen={setIsChatOpen} onOpenBooking={goToBookingPage} />

      {/* Main Header excluded in specific views including 'patient' AND 'admin' */}
      {view !== 'cv' && view !== 'booking' && view !== 'privacy' && view !== 'cookie' && view !== 'terms' && view !== 'sofia' && view !== 'patient' && view !== 'admin' && (
          <Header onAdminClick={() => setView('admin')} onNavigate={handleNavigate} viewState={view as any} onBookClick={goToBookingPage} activeSection={activeSection} onPatientClick={() => setView('patient')} onSofiaClick={() => setView('sofia')} />
      )}

      <AnimatePresence mode="wait">
        {view === 'sofia' && <SofiaPage key="sofia" onBack={() => setView('home')} onOpenVoice={() => setIsChatOpen(true)} />}
        {view === 'booking' && <BookingPage key="booking" onBack={() => setView('home')} />}
        {view === 'admin' && <AdminDashboard key="admin" onLogout={() => setView('home')} />}
        {view === 'patient' && <PatientArea key="patient" onBack={() => setView('home')} />}
        {view === 'cv' && <CVPage key="cv" onBack={() => setView('home')} />}
        {view === 'privacy' && <LegalPage key="privacy" type="privacy" onBack={() => setView('home')} />}
        {view === 'cookie' && <LegalPage key="cookie" type="cookie" onBack={() => setView('home')} />}
        {view === 'terms' && <LegalPage key="terms" type="terms" onBack={() => setView('home')} />}

        {view === 'single-service' && selectedSubService && selectedService && (
          <motion.main key="single-service" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-7xl mx-auto px-4 py-32">
             <SingleServiceDetail subService={selectedSubService} categoryTitle={selectedService.title} onBack={() => setView('home')} onBookClick={goToBookingPage} />
          </motion.main>
        )}

        {view === 'home' && (
          <motion.main key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div id="top"><Hero onBookClick={goToBookingPage} /></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-0 max-w-5xl mx-auto">
                <Section id="services">
                  {SERVICES.map((service) => {
                    const theme = THEMES[service.theme || 'blue'];
                    return (
                      <div key={service.id} className="mb-24 last:mb-0">
                        <div className="flex flex-col items-start mb-12">
                          <h2 className={`text-4xl font-bold text-slate-800 relative ${theme.title}`}>
                            {service.title}
                            <span className={`absolute -bottom-3 left-0 w-32 h-2 rounded-full ${theme.underline}`}></span>
                          </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                           {service.subServices?.map((sub) => (
                             <SubServiceCard 
                               key={sub.id} 
                               subService={sub} 
                               onClick={(s) => handleSubServiceClick(s, service)} 
                               theme={theme} 
                             />
                           ))}
                        </div>
                      </div>
                    );
                  })}
                </Section>

                <StudioSection />
                <AboutSection onCVClick={() => setView('cv')} />
                <HowItWorksSection onBookClick={goToBookingPage} />
                
                <Section id="faq">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div><div className="flex items-center gap-3 mb-4"><Caption>Knowledge Base</Caption><HelpCircle size={16} className="text-medical-400" /></div><H2>Domande & Risposte</H2></div>
                  </div>
                  <div className="space-y-4">
                    {FAQ_CATEGORIES[0].faqs.map((faq) => (
                      <motion.div layout key={faq.question} className="bg-white border border-slate-100 rounded-[2.2rem] overflow-hidden">
                        <button onClick={() => setOpenFaqId(openFaqId === faq.question ? null : faq.question)} className="w-full flex items-center justify-between p-8 text-left group">
                          <span className="text-lg font-bold text-slate-700 group-hover:text-medical-600 transition-colors">{faq.question}</span>
                          <ChevronDown size={18} className={`transition-transform text-slate-300 ${openFaqId === faq.question ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaqId === faq.question && (
                          <div className="px-8 pb-8 text-slate-600 leading-relaxed italic">{faq.answer}</div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </Section>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {view === 'home' && <Footer onNavigate={handleNavigate} onPatientClick={() => setView('patient')} onAdminClick={() => setView('admin')} onCVClick={() => setView('cv')} onPrivacyClick={() => setView('privacy')} onCookieClick={() => setView('cookie')} onTermsClick={() => setView('terms')} onBookClick={goToBookingPage} onSofiaClick={() => setView('sofia')} />}

      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-10 left-10 z-[80] p-4 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 hover:bg-slate-800 hover:text-white transition-all active:scale-90">
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
