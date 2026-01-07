import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Link as LinkIcon, FileText, Database, Trash2, Eye, EyeOff,
  RefreshCw, Zap, CheckCircle2, AlertCircle, Clock, ExternalLink,
  Download, Search, Filter, Plus, X
} from 'lucide-react';
import { supabaseRepositories } from '../../lib/supabase-repositories';
import { KnowledgeSource, KnowledgeSourceStats } from '../../types/knowledgeBase';
import { KnowledgeProcessor } from '../../services/knowledgeProcessor';
import { BrickType } from '../../services/brainStore';

type Tab = 'all' | 'files' | 'urls' | 'snippets' | 'stats';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  archived: 'bg-gray-100 text-gray-800 border-gray-200'
};

const statusIcons = {
  pending: Clock,
  processing: RefreshCw,
  completed: CheckCircle2,
  error: AlertCircle,
  archived: Database
};

export const KnowledgeBaseManager: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [stats, setStats] = useState<KnowledgeSourceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'file' | 'url' | 'snippet'>('snippet');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
    url: '',
    tags: [] as string[],
    file: null as File | null
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allSources, statsData] = await Promise.all([
        supabaseRepositories.knowledgeSources.getAll(),
        supabaseRepositories.knowledgeSources.getStats()
      ]);
      setSources(allSources);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading knowledge base:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;

    try {
      await KnowledgeProcessor.uploadFile(
        formData.file,
        formData.title || formData.file.name,
        formData.description,
        formData.category
      );
      resetForm();
      setShowAddModal(false);
      await loadData();
      onRefresh();
      alert('File caricato e elaborato con successo!');
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      alert(`Errore: ${errorMessage}`);
    }
  };

  const handleCreateSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content || !formData.title) return;

    try {
      await KnowledgeProcessor.createSnippet(
        formData.title,
        formData.content,
        formData.description,
        formData.category,
        formData.tags
      );
      resetForm();
      setShowAddModal(false);
      await loadData();
      onRefresh();
      alert('Snippet creato con successo!');
    } catch (error) {
      console.error('Error creating snippet:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      alert(`Errore: ${errorMessage}`);
    }
  };

  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url || !formData.title) return;

    try {
      await KnowledgeProcessor.createUrlSource(
        formData.url,
        formData.title,
        formData.description,
        formData.category
      );
      resetForm();
      setShowAddModal(false);
      await loadData();
      onRefresh();
      alert('URL aggiunto e contenuto scaricato con successo!');
    } catch (error) {
      console.error('Error creating URL source:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      alert(`Errore: ${errorMessage}`);
    }
  };

  const handleGenerateBricks = async (sourceId: string) => {
    const useAI = confirm('Vuoi usare l\'AI per categorizzare automaticamente i mattoni?\n\nSì = Categorizzazione AI intelligente (primi 5 mattoni)\nNo = Generazione standard');

    try {
      const bricks = await KnowledgeProcessor.generateBricksFromSource(sourceId, useAI);
      await loadData();
      onRefresh();
      alert(`${bricks.length} mattoni generati con successo!${useAI ? ' (con categorizzazione AI)' : ''}`);
    } catch (error) {
      console.error('Error generating bricks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      alert(`Errore durante la generazione: ${errorMessage}`);
    }
  };

  const handleToggleActive = async (source: KnowledgeSource) => {
    try {
      if (source.isActive) {
        await KnowledgeProcessor.deactivateSource(source.id);
      } else {
        await KnowledgeProcessor.activateSource(source.id);
      }
      await loadData();
    } catch (error) {
      console.error('Error toggling source:', error);
    }
  };

  const handleDelete = async (sourceId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa fonte? Verranno eliminati anche tutti i mattoni generati.')) return;

    try {
      await KnowledgeProcessor.deleteSource(sourceId);
      await loadData();
      onRefresh();
    } catch (error) {
      console.error('Error deleting source:', error);
      alert('Errore durante l\'eliminazione');
    }
  };

  const handleRefreshUrl = async (sourceId: string) => {
    try {
      await KnowledgeProcessor.refreshUrl(sourceId);
      await loadData();
      alert('URL aggiornato con successo!');
    } catch (error) {
      console.error('Error refreshing URL:', error);
      alert('Errore durante l\'aggiornamento dell\'URL');
    }
  };

  const handleProcessSource = async (source: KnowledgeSource) => {
    const confirmed = confirm(`Vuoi elaborare "${source.title}"?`);
    if (!confirmed) return;

    try {
      if (source.type === 'file') {
        await KnowledgeProcessor.extractTextFromFile(source.id);
      } else if (source.type === 'url') {
        await KnowledgeProcessor.scrapeUrl(source.id);
      }
      await loadData();
      alert('Fonte elaborata con successo!');
    } catch (error) {
      console.error('Error processing source:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      alert(`Errore durante l'elaborazione: ${errorMessage}`);
      await loadData();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      content: '',
      url: '',
      tags: [],
      file: null
    });
    setShowAddModal(false);
  };

  const filteredSources = sources.filter(source => {
    if (activeTab !== 'all' && activeTab !== 'stats') {
      if (activeTab === 'files' && source.type !== 'file') return false;
      if (activeTab === 'urls' && source.type !== 'url') return false;
      if (activeTab === 'snippets' && source.type !== 'snippet') return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        source.title.toLowerCase().includes(query) ||
        source.description?.toLowerCase().includes(query) ||
        source.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="animate-spin text-medical-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Database size={32} className="text-medical-600" />
          <div>
            <h2 className="text-2xl font-black text-slate-900">Knowledge Base</h2>
            <p className="text-sm text-slate-500">Gestisci le fonti di conoscenza di SOFIA</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-medical-600 text-white rounded-2xl font-bold hover:bg-medical-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Aggiungi Fonte
        </button>
      </div>

      {stats && activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Totale Fonti</div>
            <div className="text-4xl font-black text-slate-900">{stats.totalSources}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Fonti Attive</div>
            <div className="text-4xl font-black text-emerald-600">{stats.activeSources}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Mattoni Generati</div>
            <div className="text-4xl font-black text-medical-600">{stats.totalBricksGenerated}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Storage Utilizzato</div>
            <div className="text-4xl font-black text-blue-600">{(stats.totalStorageUsed / 1024 / 1024).toFixed(2)} MB</div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {(['all', 'files', 'urls', 'snippets', 'stats'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
              activeTab === tab
                ? 'bg-medical-600 text-white border-medical-600 shadow-lg'
                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
            }`}
          >
            {tab === 'all' && `Tutte (${sources.length})`}
            {tab === 'files' && `File (${sources.filter(s => s.type === 'file').length})`}
            {tab === 'urls' && `URL (${sources.filter(s => s.type === 'url').length})`}
            {tab === 'snippets' && `Snippets (${sources.filter(s => s.type === 'snippet').length})`}
            {tab === 'stats' && 'Statistiche'}
          </button>
        ))}
      </div>

      {activeTab !== 'stats' && (
        <>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cerca nelle fonti..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-medical-600 focus:outline-none"
            />
          </div>

          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSources.map(source => {
                const StatusIcon = statusIcons[source.status];
                return (
                  <motion.div
                    key={source.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {source.type === 'file' && <Upload size={24} className="text-blue-600" />}
                        {source.type === 'url' && <LinkIcon size={24} className="text-emerald-600" />}
                        {source.type === 'snippet' && <FileText size={24} className="text-purple-600" />}
                        <div>
                          <h3 className="font-black text-slate-900">{source.title}</h3>
                          <p className="text-xs text-slate-500">{source.description}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[source.status]} flex items-center gap-1`}>
                        <StatusIcon size={12} />
                        {source.status}
                      </div>
                    </div>

                    {source.status === 'error' && source.processingError && (
                      <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-4 text-xs text-red-700 flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-bold mb-1">Errore durante l'elaborazione:</div>
                          <div>{source.processingError}</div>
                        </div>
                      </div>
                    )}

                    {source.processedContent && source.status === 'completed' && (
                      <div className="bg-slate-50 p-4 rounded-xl mb-4 text-xs text-slate-600 line-clamp-3 font-mono">
                        {source.processedContent}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {source.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Zap size={14} />
                        {source.generatedBrickIds.length} mattoni
                      </div>

                      <div className="flex items-center gap-2">
                        {(source.status === 'pending' || source.status === 'error') && source.type !== 'snippet' && (
                          <button
                            onClick={() => handleProcessSource(source)}
                            className="p-2 hover:bg-yellow-50 rounded-xl transition-all"
                            title="Elabora Ora"
                          >
                            <RefreshCw size={16} className="text-yellow-600" />
                          </button>
                        )}

                        {source.type === 'url' && source.status === 'completed' && (
                          <button
                            onClick={() => handleRefreshUrl(source.id)}
                            className="p-2 hover:bg-blue-50 rounded-xl transition-all"
                            title="Aggiorna URL"
                          >
                            <RefreshCw size={16} className="text-blue-600" />
                          </button>
                        )}

                        {source.status === 'completed' && source.generatedBrickIds.length === 0 && (
                          <button
                            onClick={() => handleGenerateBricks(source.id)}
                            className="p-2 hover:bg-medical-50 rounded-xl transition-all"
                            title="Genera Mattoni"
                          >
                            <Zap size={16} className="text-medical-600" />
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleActive(source)}
                          className={`p-2 rounded-xl transition-all ${
                            source.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                          }`}
                          title={source.isActive ? 'Disattiva' : 'Attiva'}
                        >
                          {source.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>

                        <button
                          onClick={() => handleDelete(source.id)}
                          className="p-2 hover:bg-red-50 rounded-xl transition-all"
                          title="Elimina"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>

          {filteredSources.length === 0 && (
            <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
              <Database size={40} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                Nessuna fonte trovata
              </p>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-900">Aggiungi Nuova Fonte</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex gap-2 mb-6">
                {(['snippet', 'file', 'url'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setAddType(type)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                      addType === type
                        ? 'bg-medical-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'snippet' && 'Snippet di Testo'}
                    {type === 'file' && 'Carica File'}
                    {type === 'url' && 'URL Esterno'}
                  </button>
                ))}
              </div>

              <form onSubmit={addType === 'snippet' ? handleCreateSnippet : addType === 'file' ? handleFileUpload : handleCreateUrl} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Titolo *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                    placeholder="Inserisci un titolo descrittivo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Descrizione</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                    placeholder="Descrizione breve"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Categoria</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                    placeholder="Es: Genetica Medica, Procedura, FAQ"
                  />
                </div>

                {addType === 'snippet' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contenuto *</label>
                    <textarea
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none font-mono text-sm"
                      placeholder="Inserisci il contenuto testuale..."
                    />
                  </div>
                )}

                {addType === 'file' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">File *</label>
                    <input
                      type="file"
                      required
                      onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                      accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <p className="text-xs text-slate-500 mt-2">Formati supportati: PDF, TXT, DOC, DOCX, JPG, PNG</p>
                  </div>
                )}

                {addType === 'url' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">URL *</label>
                    <input
                      type="url"
                      required
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                      placeholder="https://esempio.com/articolo"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 transition-all"
                  >
                    Aggiungi Fonte
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
