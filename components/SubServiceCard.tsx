
import React from 'react';
import { 
  Sparkles, Anchor, Smile, ScanFace, Scissors, Droplets, Zap,
  ArrowRight, FileText
} from 'lucide-react';
import { SubService } from '../types';
import { motion } from 'framer-motion';

interface SubServiceCardProps {
  subService: SubService;
  onClick: (subService: SubService) => void;
  theme: {
    iconBg: string;
    iconColor: string;
    buttonText: string;
    hoverBorder: string;
  };
}

// DENTAL ICON MAPPING
const iconMap: Record<string, any> = {
  Sparkles, // Igiene/Estetica
  Droplets, // Igiene (acqua/pulizia)
  Zap,      // Sbiancamento (energia/bianco)
  Anchor,   // Impianti (radice solida)
  Scissors, // Chirurgia/Estrazioni
  Smile,    // Ortodonzia
  ScanFace, // Invisalign/Scanner 3D
  FileText  // Default
};

const SubServiceCard: React.FC<SubServiceCardProps> = ({ subService, onClick, theme }) => {
  const Icon = iconMap[subService.iconName || 'FileText'];

  return (
    <motion.div 
      layout
      whileHover={{ y: -5 }}
      onClick={() => onClick(subService)}
      className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full relative group"
    >
      <div className="absolute top-8 right-8 bg-[#00cca3] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-widest">
        {subService.price}
      </div>
      
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${theme.iconBg} ${theme.iconColor}`}>
        {Icon ? <Icon size={28} /> : <FileText size={28} />}
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-4 leading-tight pr-12">
        {subService.title}
      </h3>
      
      <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-4 flex-grow font-medium">
        {subService.description}
      </p>

      <div className={`flex items-center gap-2 text-xs font-bold ${theme.buttonText} mt-auto uppercase tracking-widest group-hover:underline decoration-2 underline-offset-8`}>
        <span>Scopri di più</span>
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
};

export default SubServiceCard;
