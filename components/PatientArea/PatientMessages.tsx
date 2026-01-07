
import React, { useState } from 'react';
import { Send, Lock, MessageSquare } from 'lucide-react';

export const PatientMessages: React.FC = () => {
  const [messages, setMessages] = useState([
      { id: 1, sender: 'DOCTOR', text: 'Benvenuta nel portale. I referti della visita sono pronti.', date: '10 Gen 2024' },
      { id: 2, sender: 'PATIENT', text: 'Grazie dottore, li ho appena scaricati.', date: '11 Gen 2024' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
      if(!input.trim()) return;
      setMessages([...messages, { id: Date.now(), sender: 'PATIENT', text: input, date: 'Oggi' }]);
      setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="bg-medical-600 p-2 rounded-xl text-white"><MessageSquare size={20}/></div>
                <div>
                    <h3 className="font-black text-slate-800">Canale Diretto</h3>
                    <p className="text-xs text-slate-500 font-medium">Comunicazioni criptate end-to-end</p>
                </div>
            </div>
            <Lock size={16} className="text-emerald-500" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'PATIENT' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm font-medium ${m.sender === 'PATIENT' ? 'bg-medical-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
                        {m.text}
                        <div className={`text-[9px] mt-2 text-right opacity-70 ${m.sender === 'PATIENT' ? 'text-white' : 'text-slate-400'}`}>{m.date}</div>
                    </div>
                </div>
            ))}
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Scrivi un messaggio sicuro..."
                    className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-medium"
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} className="p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-colors">
                    <Send size={18} />
                </button>
            </div>
            <p className="text-center text-[9px] text-slate-400 mt-2 font-medium">Non usare per emergenze. Tempi di risposta: 24h.</p>
        </div>
    </div>
  );
};
