
import React from 'react';
import { ArrowLeft, CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
import { ServiceItem, SubService } from '../types';

interface ServiceDetailProps {
  service: ServiceItem;
  onBack: () => void;
  onSubServiceClick: (sub: SubService) => void;
  onBookClick: () => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onBack, onSubServiceClick, onBookClick }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Header with Back Button */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-medical-600 transition-colors mb-4 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Torna ai servizi
        </button>
        
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{service.title}</h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
          {service.detailedDescription || service.description}
        </p>
      </div>

      {/* Sub-Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {service.subServices?.map((sub, idx) => (
          <div 
            key={idx} 
            onClick={() => onSubServiceClick(sub)}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-pointer"
          >
             {/* Decorative top border */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-medical-400 to-medical-600"></div>
             
             <div className="flex justify-between items-start mb-3">
                <div className="bg-medical-50 p-2 rounded-lg group-hover:bg-medical-600 transition-colors">
                   {service.title === "Gravidanza" ? (
                       <CheckCircle2 className="h-6 w-6 text-medical-600 group-hover:text-white" />
                   ) : (
                       <Calendar className="h-6 w-6 text-medical-600 group-hover:text-white" />
                   )}
                </div>
                {sub.price && (
                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                      {sub.price}
                   </span>
                )}
             </div>

             <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-medical-700 transition-colors">{sub.title}</h3>
             <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                {sub.description}
             </p>

             <div className="flex items-center text-medical-600 font-medium text-sm mt-auto">
                Scopri di più <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
             </div>
          </div>
        ))}
      </div>

      {/* Quick Action Footer */}
      <div className="bg-slate-100 rounded-2xl p-6 text-center">
         <p className="text-slate-600 text-sm mb-3">Hai già deciso? Prenota subito il tuo appuntamento.</p>
         <button 
           onClick={onBookClick}
           className="bg-medical-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-medical-700 transition-colors"
         >
           Prenota Online
         </button>
      </div>

    </div>
  );
};

export default ServiceDetail;
