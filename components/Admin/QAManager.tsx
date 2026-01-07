import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, HelpCircle, Save, X, Trash2, Edit, Tag, FileText,
  ChevronDown, ChevronUp, BarChart3, Link as LinkIcon, Star
} from 'lucide-react';
import { AIActionsService, QAPair } from '../../services/aiActionsService';

const categories = [
  'general', 'genetica', 'servizi', 'prenotazioni', 'contatti', 'privacy', 'altro'
];

export const QAManager: React.FC = () => {
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingQA, setEditingQA] = useState<QAPair | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQAPairs();
  }, []);

  const loadQAPairs = async () => {
    try {
      setLoading(true);
      const data = await AIActionsService.getAllQAPairs();
      setQaPairs(data);
    } catch (error) {
      console.error('Error loading Q&A pairs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQAPairs = qaPairs.filter(qa =>
    (selectedCategory === 'all' || qa.category === selectedCategory) &&
    (searchQuery === '' ||
      qa.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.questions.some(q => q.toLowerCase().includes(searchQuery.toLowerCase())) ||
      qa.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const questions = (formData.get('questions') as string)
      .split('\n')
      .map(q => q.trim())
      .filter(Boolean);

    const tags = (formData.get('tags') as string)
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const qaData = {
      category: formData.get('category') as string,
      title: formData.get('title') as string,
      questions,
      answer: formData.get('answer') as string,
      tags,
      source_ids: [],
      is_active: formData.get('is_active') === 'on',
      priority: parseInt(formData.get('priority') as string) || 5
    };

    try {
      if (editingQA) {
        await AIActionsService.updateQAPair(editingQA.id, qaData);
      } else {
        await AIActionsService.createQAPair(qaData);
      }
      setIsCreating(false);
      setEditingQA(null);
      loadQAPairs();
    } catch (error) {
      console.error('Error saving Q&A pair:', error);
      alert('Errore nel salvataggio della Q&A');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa Q&A?')) return;

    try {
      await AIActionsService.deleteQAPair(id);
      loadQAPairs();
    } catch (error) {
      console.error('Error deleting Q&A:', error);
      alert('Errore durante l\'eliminazione');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Q&A Knowledge Base</h2>
          <p className="text-slate-500 mt-2">Gestisci le domande e risposte predefinite per l'AI</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 bg-medical-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-medical-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          Aggiungi Q&A
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cerca domande, risposte o tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-medical-600 focus:outline-none bg-white"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 rounded-2xl border border-slate-200 focus:border-medical-600 focus:outline-none bg-white font-bold"
        >
          <option value="all">Tutte le categorie</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Totale Q&A</div>
          <div className="text-3xl font-black text-slate-900">{qaPairs.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Attive</div>
          <div className="text-3xl font-black text-emerald-600">
            {qaPairs.filter(qa => qa.is_active).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Categorie</div>
          <div className="text-3xl font-black text-blue-600">
            {new Set(qaPairs.map(qa => qa.category)).size}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Utilizzi Totali</div>
          <div className="text-3xl font-black text-amber-600">
            {qaPairs.reduce((sum, qa) => sum + qa.usage_count, 0)}
          </div>
        </div>
      </div>

      {/* Q&A List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredQAPairs.map((qa) => (
            <motion.div
              key={qa.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black text-slate-900">{qa.title}</h3>
                      {!qa.is_active && (
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-red-50 px-2 py-1 rounded text-red-600">
                          Disattivata
                        </span>
                      )}
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-50 px-2 py-1 rounded text-slate-500">
                        {qa.category}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < qa.priority / 2 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                          />
                        ))}
                      </div>
                    </div>

                    {qa.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {qa.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded flex items-center gap-1"
                          >
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {qa.questions.length > 0 && (
                      <div className="mb-3">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Domande associate ({qa.questions.length})
                        </div>
                        <div className="space-y-1">
                          {qa.questions.slice(0, expandedId === qa.id ? undefined : 2).map((q, i) => (
                            <div key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <HelpCircle size={14} className="mt-0.5 flex-shrink-0 text-slate-400" />
                              <span>{q}</span>
                            </div>
                          ))}
                          {qa.questions.length > 2 && expandedId !== qa.id && (
                            <button
                              onClick={() => setExpandedId(qa.id)}
                              className="text-xs text-medical-600 font-bold flex items-center gap-1 hover:gap-2 transition-all"
                            >
                              <ChevronDown size={14} />
                              Mostra altre {qa.questions.length - 2}
                            </button>
                          )}
                          {expandedId === qa.id && qa.questions.length > 2 && (
                            <button
                              onClick={() => setExpandedId(null)}
                              className="text-xs text-medical-600 font-bold flex items-center gap-1 hover:gap-2 transition-all"
                            >
                              <ChevronUp size={14} />
                              Mostra meno
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 mb-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Risposta</div>
                      <div className="text-sm text-slate-700 leading-relaxed">
                        {expandedId === qa.id ? qa.answer : `${qa.answer.substring(0, 200)}${qa.answer.length > 200 ? '...' : ''}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <BarChart3 size={14} />
                        {qa.usage_count} utilizzi
                      </span>
                      {qa.last_used_at && (
                        <span>Ultimo utilizzo: {new Date(qa.last_used_at).toLocaleDateString('it-IT')}</span>
                      )}
                      {qa.source_ids.length > 0 && (
                        <span className="flex items-center gap-1">
                          <LinkIcon size={14} />
                          {qa.source_ids.length} fonti
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setEditingQA(qa)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Modifica"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(qa.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Elimina"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredQAPairs.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
          <HelpCircle size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
            Nessuna Q&A trovata
          </p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(isCreating || editingQA) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setIsCreating(false); setEditingQA(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-900">
                  {editingQA ? 'Modifica Q&A' : 'Aggiungi Nuova Q&A'}
                </h3>
                <button
                  onClick={() => { setIsCreating(false); setEditingQA(null); }}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                      Categoria
                    </label>
                    <select
                      name="category"
                      defaultValue={editingQA?.category || 'general'}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                      Priorità (0-10)
                    </label>
                    <input
                      type="number"
                      name="priority"
                      min="0"
                      max="10"
                      defaultValue={editingQA?.priority || 5}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                    Titolo
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingQA?.title || ''}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                    Domande associate (una per riga)
                  </label>
                  <textarea
                    name="questions"
                    defaultValue={editingQA?.questions.join('\n') || ''}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                    rows={4}
                    placeholder="Come posso prenotare?&#10;Quali sono gli orari?"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                    Risposta
                  </label>
                  <textarea
                    name="answer"
                    defaultValue={editingQA?.answer || ''}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                    Tags (separati da virgola)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={editingQA?.tags.join(', ') || ''}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                    placeholder="genetica, prenotazione, test"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    defaultChecked={editingQA?.is_active ?? true}
                    className="w-5 h-5 rounded border-slate-300 text-medical-600 focus:ring-medical-600"
                  />
                  <label htmlFor="is_active" className="text-sm font-bold text-slate-700">
                    Attiva Q&A
                  </label>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    {editingQA ? 'Salva Modifiche' : 'Aggiungi Q&A'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsCreating(false); setEditingQA(null); }}
                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Annulla
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
