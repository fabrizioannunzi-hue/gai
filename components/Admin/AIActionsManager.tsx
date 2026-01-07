import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Zap, Globe, Link, Wrench, Workflow, Eye, Edit,
  Trash2, ToggleLeft, ToggleRight, ExternalLink, Settings, BarChart3, Save, X
} from 'lucide-react';
import { AIActionsService, AIAction } from '../../services/aiActionsService';

const actionTypeIcons = {
  custom: Zap,
  web_search: Globe,
  integration: Link,
  tool: Wrench,
  workflow: Workflow
};

const actionTypeColors = {
  custom: 'bg-amber-500',
  web_search: 'bg-blue-500',
  integration: 'bg-emerald-500',
  tool: 'bg-purple-500',
  workflow: 'bg-pink-500'
};

export const AIActionsManager: React.FC = () => {
  const [actions, setActions] = useState<AIAction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingAction, setEditingAction] = useState<AIAction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      setLoading(true);
      const data = await AIActionsService.getAllActions();
      setActions(data);
    } catch (error) {
      console.error('Error loading actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActions = actions.filter(action =>
    searchQuery === '' ||
    action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const actionData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      action_type: formData.get('action_type') as AIAction['action_type'],
      integration_name: formData.get('integration_name') as string || undefined,
      configuration: JSON.parse(formData.get('configuration') as string || '{}'),
      is_enabled: formData.get('is_enabled') === 'on'
    };

    try {
      if (editingAction) {
        await AIActionsService.updateAction(editingAction.id, actionData);
      } else {
        await AIActionsService.createAction(actionData);
      }
      setIsCreating(false);
      setEditingAction(null);
      loadActions();
    } catch (error) {
      console.error('Error saving action:', error);
      alert('Errore nel salvataggio dell\'azione');
    }
  };

  const handleToggleEnabled = async (action: AIAction) => {
    try {
      await AIActionsService.updateAction(action.id, { is_enabled: !action.is_enabled });
      loadActions();
    } catch (error) {
      console.error('Error toggling action:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa azione?')) return;

    try {
      await AIActionsService.deleteAction(id);
      loadActions();
    } catch (error) {
      console.error('Error deleting action:', error);
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
          <h2 className="text-3xl font-black text-slate-900">AI Actions</h2>
          <p className="text-slate-500 mt-2">Configura le azioni che l'AI può eseguire</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 bg-medical-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-medical-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          Crea Action
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Cerca azioni per nome o descrizione..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-medical-600 focus:outline-none bg-white"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Totale</div>
          <div className="text-3xl font-black text-slate-900">{actions.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Attive</div>
          <div className="text-3xl font-black text-emerald-600">
            {actions.filter(a => a.is_enabled).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Web Search</div>
          <div className="text-3xl font-black text-blue-600">
            {actions.filter(a => a.action_type === 'web_search').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Integrazioni</div>
          <div className="text-3xl font-black text-emerald-600">
            {actions.filter(a => a.action_type === 'integration').length}
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredActions.map((action) => {
            const Icon = actionTypeIcons[action.action_type] || Zap;
            const colorClass = actionTypeColors[action.action_type] || 'bg-slate-500';

            return (
              <motion.div
                key={action.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${colorClass} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon size={24} />
                    </div>
                    <button
                      onClick={() => handleToggleEnabled(action)}
                      className={`p-2 rounded-lg transition-all ${
                        action.is_enabled
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-slate-400 bg-slate-100'
                      }`}
                    >
                      {action.is_enabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-2">{action.name}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {action.description || 'Nessuna descrizione'}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-50 px-2 py-1 rounded text-slate-500 border border-slate-100">
                      {action.action_type}
                    </span>
                    {action.integration_name && (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-50 px-2 py-1 rounded text-blue-600 border border-blue-100">
                        {action.integration_name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <BarChart3 size={14} />
                      {action.usage_count} utilizzi
                    </span>
                    {action.last_used_at && (
                      <span>{new Date(action.last_used_at).toLocaleDateString('it-IT')}</span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setEditingAction(action)}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all flex items-center justify-center gap-1"
                    >
                      <Edit size={14} />
                      Modifica
                    </button>
                    <button
                      onClick={() => handleDelete(action.id)}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredActions.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
          <Zap size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
            Nessuna azione trovata
          </p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(isCreating || editingAction) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setIsCreating(false); setEditingAction(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-900">
                  {editingAction ? 'Modifica Action' : 'Crea Nuova Action'}
                </h3>
                <button
                  onClick={() => { setIsCreating(false); setEditingAction(null); }}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingAction?.name || ''}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                    Descrizione
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingAction?.description || ''}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                      Tipo
                    </label>
                    <select
                      name="action_type"
                      defaultValue={editingAction?.action_type || 'custom'}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                      required
                    >
                      <option value="custom">Custom</option>
                      <option value="web_search">Web Search</option>
                      <option value="integration">Integration</option>
                      <option value="tool">Tool</option>
                      <option value="workflow">Workflow</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                      Integrazione
                    </label>
                    <input
                      type="text"
                      name="integration_name"
                      defaultValue={editingAction?.integration_name || ''}
                      placeholder="es. stripe, calendly"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                    Configurazione (JSON)
                  </label>
                  <textarea
                    name="configuration"
                    defaultValue={JSON.stringify(editingAction?.configuration || {}, null, 2)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none font-mono text-sm"
                    rows={5}
                    placeholder='{"key": "value"}'
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="is_enabled"
                    id="is_enabled"
                    defaultChecked={editingAction?.is_enabled ?? true}
                    className="w-5 h-5 rounded border-slate-300 text-medical-600 focus:ring-medical-600"
                  />
                  <label htmlFor="is_enabled" className="text-sm font-bold text-slate-700">
                    Abilita azione
                  </label>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    {editingAction ? 'Salva Modifiche' : 'Crea Action'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsCreating(false); setEditingAction(null); }}
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
