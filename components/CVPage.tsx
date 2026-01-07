
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, GraduationCap, Briefcase, Award, 
  FileText, BookOpen, Microscope, Globe, 
  CheckCircle2, Mail, MapPin, Linkedin, Printer,
  Download, ExternalLink, ShieldCheck, HeartPulse
} from 'lucide-react';
import { CONTACT_INFO } from '../constants';

interface CVPageProps {
  onBack: () => void;
}

const CVPage: React.FC<CVPageProps> = ({ onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto px-4 py-8 md:py-16 print:p-0"
    >
      {/* Back & Print Buttons - Hidden on Print */}
      <div className="flex justify-between items-center mb-10 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-medical-600 transition-colors group font-medium"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Torna al sito
        </button>
        
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-all font-semibold text-sm shadow-sm"
        >
          <Printer size={18} />
          Stampa / Salva PDF
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-16 mb-12 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-medical-50 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2 print:hidden"></div>
        
        <div className="relative z-10 w-48 h-48 md:w-56 md:h-56 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white shrink-0 group">
          <img 
            src="https://i.ibb.co/21TWPZKb/7e4296d8-4997-4dec-ad42-313e228709eb.jpg" 
            alt="Dr. Federico Grilli" 
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        <div className="relative z-10 flex-grow">
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-2 tracking-tight">Federico Grilli</h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
               <p className="text-xl md:text-2xl text-medical-600 font-bold uppercase tracking-widest">Medico Genetista</p>
               <span className="h-2 w-2 rounded-full bg-slate-300 hidden md:block"></span>
               <p className="text-slate-500 font-medium">Specialista in Genetica Medica</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center justify-center md:justify-start gap-3 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
               <MapPin size={18} className="text-medical-500" />
               <span className="text-sm font-medium">Milano, Italia</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
               <Mail size={18} className="text-medical-500" />
               <span className="text-sm font-medium">{CONTACT_INFO.doctor.email}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {["Oncogenetica", "Genetica Riproduttiva", "Malattie Rare", "Diagnosi Prenatale"].map(tag => (
              <span key={tag} className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main CV Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Education & Experience (Span 8) */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Esperienza Professionale */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-medical-600 text-white rounded-2xl shadow-lg shadow-medical-600/20">
                <Briefcase size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">Esperienza</h2>
                <div className="h-1 w-12 bg-medical-200 rounded-full mt-1"></div>
              </div>
            </div>
            
            <div className="space-y-12 border-l-2 border-slate-100 ml-6 pl-10 relative">
              {[
                {
                  period: "2020 - PRESENTE",
                  role: "Medico Specialista in Genetica Medica",
                  company: "Libera Professione & Centri Specialistici",
                  desc: "Attività di consulenza genetica focalizzata sulla medicina riproduttiva e oncogenetica. Gestione dell'intero iter diagnostico: dal colloquio pre-test all'interpretazione di test genomici complessi (NGS, Esoma)."
                },
                {
                  period: "2016 - 2020",
                  role: "Specialista in Formazione",
                  company: "Fondazione IRCCS Ca' Granda - Ospedale Maggiore Policlinico",
                  desc: "Percorso di specializzazione presso il servizio di Genetica Medica dell'Università di Milano. Attività di reparto e di laboratorio, con particolare focus sulla diagnosi sindromologica pediatrica."
                },
                {
                  period: "2014 - 2016",
                  role: "Medico di Continuità Assistenziale",
                  company: "ATS Milano / Regione Lombardia",
                  desc: "Gestione clinica e terapeutica in regime di urgenza territoriale, consolidando competenze nella valutazione sistemica del paziente."
                }
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[51px] top-1 w-5 h-5 rounded-full bg-white border-4 border-medical-600 group-hover:scale-125 transition-transform"></div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-xs font-black text-medical-600 mb-2 block tracking-widest">{item.period}</span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{item.role}</h3>
                    <h4 className="text-slate-500 font-semibold mb-4 flex items-center gap-2">
                       {item.company}
                       <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-slate-600 leading-relaxed font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Formazione */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-600/20">
                <GraduationCap size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">Formazione</h2>
                <div className="h-1 w-12 bg-purple-200 rounded-full mt-1"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-purple-200 transition-colors">
                <div className="bg-purple-50 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                  <Award size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Specializzazione</h3>
                <p className="text-slate-600 font-semibold mb-4">Genetica Medica</p>
                <div className="space-y-2 text-sm text-slate-500">
                  <p className="flex items-center gap-2 font-medium"><CheckCircle2 size={14} className="text-purple-500" /> Università di Milano</p>
                  <p className="flex items-center gap-2 font-medium"><CheckCircle2 size={14} className="text-purple-500" /> Voto: 70/70 e Lode</p>
                  <p className="flex items-center gap-2 font-medium"><CheckCircle2 size={14} className="text-purple-500" /> Anno: 2020</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-purple-200 transition-colors">
                <div className="bg-purple-50 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                  <BookOpen size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Laurea Magistrale</h3>
                <p className="text-slate-600 font-semibold mb-4">Medicina e Chirurgia</p>
                <div className="space-y-2 text-sm text-slate-500">
                  <p className="flex items-center gap-2 font-medium"><CheckCircle2 size={14} className="text-purple-500" /> Università di Perugia</p>
                  <p className="flex items-center gap-2 font-medium"><CheckCircle2 size={14} className="text-purple-500" /> Iscritto all'OMCeO Milano</p>
                  <p className="flex items-center gap-2 font-medium"><CheckCircle2 size={14} className="text-purple-500" /> Anno: 2013</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Skills & Details (Span 4) */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Focus Clinico Section */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white shadow-2xl">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest">
              <HeartPulse size={24} className="text-medical-400" />
              Focus Clinico
            </h2>
            <div className="space-y-6">
              {[
                { title: "Consulenza Prenatale", desc: "NIPT, DNA fetale e diagnosi invasiva." },
                { title: "Infertilità di Coppia", desc: "Indagine fattori genetici e supporto PMA." },
                { title: "Malattie Rare", desc: "Inquadramento sindromologico pediatrico." },
                { title: "Oncogenetica", desc: "Valutazione rischio tumori eredo-familiari." }
              ].map((focus, i) => (
                <div key={i} className="group cursor-default">
                  <h4 className="font-bold text-medical-400 mb-1 group-hover:translate-x-1 transition-transform">{focus.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{focus.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Competenze Tecniche */}
          <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-widest">
              <Microscope size={24} className="text-medical-600" />
              Expertise
            </h2>
            <div className="space-y-6">
              {[
                { label: "Analisi NGS & Esoma", level: "95%" },
                { label: "Counseling Genetico", level: "98%" },
                { label: "Bioinformatica Clinica", level: "85%" },
                { label: "Genetica Forense", level: "70%" }
              ].map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2 text-slate-400 tracking-tighter">
                    <span>{skill.label}</span>
                    <span className="text-medical-600">{skill.level}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: skill.level }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.1 }}
                      className="h-full bg-medical-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Lingue & Certificazioni */}
          <section className="bg-medical-50 rounded-[2.5rem] p-10 border border-medical-100">
            <h2 className="text-xl font-black text-medical-900 mb-8 flex items-center gap-3 uppercase tracking-widest">
              <Globe size={24} />
              Lingue
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-medical-200">
                <span className="font-bold text-slate-800">Italiano</span>
                <span className="text-xs font-black text-medical-600 uppercase">Madrelingua</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-medical-200">
                <span className="font-bold text-slate-800">Inglese</span>
                <span className="text-xs font-black text-medical-600 uppercase">C1 Professional</span>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-medical-200">
               <h3 className="font-black text-medical-900 mb-6 uppercase text-sm tracking-widest">Affiliazioni</h3>
               <ul className="space-y-3">
                 {[
                   "Socio SIGU (Soc. It. Genetica Umana)",
                   "Membro ESHG (European Soc. Human Genetics)",
                   "Accreditamento EuroGentest"
                 ].map(item => (
                   <li key={item} className="flex items-start gap-2 text-sm text-medical-800 font-medium">
                     <ShieldCheck size={16} className="mt-0.5 shrink-0 text-medical-600" />
                     {item}
                   </li>
                 ))}
               </ul>
            </div>
          </section>

        </div>
      </div>

      {/* Footer Signature */}
      <div className="mt-24 text-center border-t border-slate-100 pt-12">
        <p className="text-slate-400 text-sm font-light italic mb-8">
          "Ogni diagnosi genetica è l'inizio di un percorso di cura consapevole, 
          dove la tecnologia incontra la centralità della persona."
        </p>
        <div className="inline-flex flex-col items-center">
           <div className="h-1 w-12 bg-medical-500 rounded-full mb-3"></div>
           <p className="font-bold text-slate-900 text-lg uppercase tracking-tighter">Dr. Federico Grilli</p>
        </div>
      </div>

    </motion.div>
  );
};

export default CVPage;
