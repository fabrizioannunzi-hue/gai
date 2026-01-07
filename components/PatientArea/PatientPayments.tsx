
import React from 'react';
import { Transaction } from '../../types';
import { CreditCard, Download, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PatientPaymentsProps {
  transactions: Transaction[];
}

export const PatientPayments: React.FC<PatientPaymentsProps> = ({ transactions }) => {
  const downloadInvoice = (id: string) => {
    alert(`Download Fattura #${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black text-slate-900">Transazioni</h3>
                    <p className="text-slate-500 text-sm font-medium">Storico pagamenti e fatture.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                     <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Totale speso: </span>
                     <span className="text-medical-600 font-black">€ {transactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2)}</span>
                </div>
            </div>

            {transactions.length === 0 ? (
                <div className="p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <CreditCard size={40} />
                    </div>
                    <p className="text-slate-400 font-medium">Nessuna transazione registrata.</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {transactions.map((t, i) => (
                        <motion.div 
                            key={t.id} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className={`p-4 rounded-2xl shrink-0 ${t.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {t.status === 'PAID' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{t.description}</h4>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                                        <span className="font-mono">{t.date.split('T')[0]}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span className="font-mono">ID: {t.id.substring(0,8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between w-full md:w-auto gap-8">
                                <div className="text-right">
                                    <div className="font-black text-slate-900 text-xl">€ {t.amount.toFixed(2)}</div>
                                    <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${t.status === 'PAID' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                        {t.status === 'PAID' ? 'Saldato' : 'In attesa'}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => downloadInvoice(t.id)}
                                    className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-medical-600 hover:border-medical-200 hover:bg-white transition-all shadow-sm active:scale-95"
                                    title="Scarica Fattura"
                                >
                                    <Download size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};
