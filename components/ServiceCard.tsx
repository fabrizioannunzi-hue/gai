
import React from 'react';
import { Baby, Dna, Stethoscope, FileText, LucideIcon, ArrowRight, Sparkles, Anchor, Smile } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServiceCardProps {
  service: ServiceItem;
  onClick?: (service: ServiceItem) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Baby,
  Dna,
  Stethoscope,
  FileText,
  Sparkles,
  Anchor,
  Smile
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const Icon = iconMap[service.iconName] || FileText;

  return (
    <div 
      onClick={() => onClick && onClick(service)}
      className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-medical-200 transition-all duration-200 group cursor-pointer flex flex-col h-full"
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="bg-medical-50 p-3 rounded-lg group-hover:bg-medical-600 transition-colors duration-300">
          <Icon className="h-6 w-6 text-medical-600 group-hover:text-white transition-colors duration-300" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-lg group-hover:text-medical-700 transition-colors">{service.title}</h3>
        </div>
      </div>
      
      <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-grow">
        {service.description}
      </p>

      <div className="flex items-center text-sm font-medium text-medical-600 group-hover:text-medical-800 transition-colors mt-auto">
         Scopri tariffe e dettagli <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default ServiceCard;
