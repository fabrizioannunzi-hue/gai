
import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export const H1: React.FC<TextProps> = ({ children, className = "" }) => (
  <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.95] text-balance ${className}`}>
    {children}
  </h1>
);

export const H2: React.FC<TextProps> = ({ children, className = "" }) => (
  <h2 className={`text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[1.05] text-balance ${className}`}>
    {children}
  </h2>
);

export const H3: React.FC<TextProps> = ({ children, className = "" }) => (
  <h3 className={`text-xl md:text-2xl font-black text-slate-900 tracking-tight ${className}`}>
    {children}
  </h3>
);

export const Body: React.FC<TextProps> = ({ children, className = "" }) => (
  <p className={`text-base md:text-lg text-slate-500 leading-relaxed font-normal ${className}`}>
    {children}
  </p>
);

export const Caption: React.FC<TextProps> = ({ children, className = "" }) => (
  <span className={`text-[10px] font-black uppercase tracking-[0.4em] text-medical-600 ${className}`}>
    {children}
  </span>
);

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'medical' | 'slate' | 'emerald' }> = ({ children, variant = 'medical' }) => {
  const styles = {
    medical: "bg-medical-50 text-medical-600 border-medical-100",
    slate: "bg-slate-50 text-slate-500 border-slate-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[variant]}`}>
      {children}
    </span>
  );
};

export const Section: React.FC<TextProps & { id?: string }> = ({ children, className = "", id }) => (
  <section id={id} className={`py-24 md:py-40 scroll-mt-24 ${className}`}>
    {children}
  </section>
);
