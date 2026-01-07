import React, { useState, useRef } from 'react';
import { BrainBrick, BrickType, BrainStore } from '../../services/brainStore';
import { Trash2, Database, Zap, Shield, Book, Palette, Activity, ShieldCheck, CheckCircle2, Download, Upload, FileJson, Search, Grid3x3, List, Edit, Copy, Plus, TrendingUp, Calendar, Hash, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KnowledgeProcessor } from '../../services/knowledgeProcessor';

const typeIcons: Record<BrickType, any> = {
  INTENT: Zap,
  CONSTRAINT: Shield,
  KNOWLEDGE: Book,
  MEDICAL_PROTOCOL: Activity,
  AUTHORIZED_ADVICE: ShieldCheck,
  STYLE_GUIDE: Palette,
  DIAGNOSTIC: Activity,
  THERAPEUTIC: ShieldCheck,
  PROTOCOL: FileJson
};

const typeColors: Record<BrickType, string> = {
  INTENT: 'bg-amber-500',
  CONSTRAINT: 'bg-red-500',
  KNOWLEDGE: 'bg-blue-500',
  MEDICAL_PROTOCOL: 'bg-emerald-500',
  AUTHORIZED_ADVICE: 'bg-medical-600',
  STYLE_GUIDE: 'bg-slate-700',
  DIAGNOSTIC: 'bg-purple-500',
  THERAPEUTIC: 'bg-teal-500',
  PROTOCOL: 'bg-indigo-500'
};

type ViewMode = 'grid' | 'list';
type SortMode = 'recent' | 'weight' | 'title' | 'type';

export const BrickManager: React.FC<{ bricks: BrainBrick[], onRefresh: () => void }> = ({ bricks, onRefresh }) => {
  const [filter, setFilter] = useState<BrickType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [editingBrick, setEditingBrick] = useState<BrainBrick | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleBrickInputRef = useRef<HTMLInputElement>(null);

  const sortBricks = (bricksToSort: BrainBrick[]) => {
    switch(sortMode) {
      case 'recent':
        return [...bricksToSort].sort((a, b) => (b.metadata.lastAccessed || 0) - (a.metadata.lastAccessed || 0));
      case 'weight':
        return [...bricksToSort].sort((a, b) => (b.metadata.synapticWeight || 0) - (a.metadata.synapticWeight || 0));
      case 'title':
        return [...bricksToSort].sort((a, b) => a.title.localeCompare(b.title));
      case 'type':
        return [...bricksToSort].sort((a, b) => a.type.localeCompare(b.type));
      default:
        return bricksToSort;
    }
  };

  const filteredBricks = sortBricks(
    bricks
      .filter(b => filter === 'ALL' || b.type === filter)
      .filter(b =>
        searchQuery === '' ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.content.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
  );

  const handleDelete = async (id: string) => {
    if(confirm('Sei sicuro di voler eliminare questo nodo di memoria?')) {
        await BrainStore.deleteBrick(id);
        onRefresh();
    }
  };

  const handleDuplicate = async (brick: BrainBrick) => {
    const newBrick: BrainBrick = {
      ...brick,
      id: crypto.randomUUID(),
      title: `${brick.title} (Copia)`,
      metadata: {
        ...brick.metadata,
        createdAt: Date.now(),
        lastAccessed: Date.now(),
        version: 1.0
      }
    };
    await BrainStore.addBrick(newBrick);
    onRefresh();
  };

  const handleSaveBrick = async (brick: BrainBrick) => {
    await BrainStore.updateBrick(brick.id, brick);
    setEditingBrick(null);
    onRefresh();
  };

  const handleCreateBrick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newBrick: BrainBrick = {
      id: crypto.randomUUID(),
      type: formData.get('type') as BrickType,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
      metadata: {
        synapticWeight: parseInt(formData.get('weight') as string) || 5,
        isAuthorized: formData.get('authorized') === 'on',
        version: 1.0,
        createdAt: Date.now(),
        lastAccessed: Date.now(),
        accessCount: 0
      }
    };

    await BrainStore.addBrick(newBrick);
    setIsCreating(false);
    onRefresh();
  };

  const handleExportMatrix = async () => {
    try {
      const jsonData = await KnowledgeProcessor.exportMatrix();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sofia-matrix-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      alert('Matrice esportata con successo!');
    } catch (error) {
      console.error('Error exporting matrix:', error);
      alert('Errore durante l\'esportazione');
    }
  };

  const handleImportMatrix = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = await KnowledgeProcessor.importMatrix(text);
      alert(`Importazione completata!\n${result.bricksImported} mattoni importati\n${result.sourcesImported} fonti importate`);
      onRefresh();
    } catch (error) {
      console.error('Error importing matrix:', error);
      alert('Errore durante l\'importazione');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportBrick = async (brickId: string) => {
    try {
      const jsonData = await KnowledgeProcessor.exportBrick(brickId);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `brick-${brickId.substring(0, 8)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting brick:', error);
      alert('Errore durante l\'esportazione del mattone');
    }
  };

  const handleImportBrick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await KnowledgeProcessor.importBrick(text);
      alert('Mattone importato con successo!');
      onRefresh();
    } catch (error) {
      console.error('Error importing brick:', error);
      alert('Errore durante l\'importazione del mattone');
    }

    if (singleBrickInputRef.current) {
      singleBrickInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cerca mattoni per titolo, contenuto o tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-medical-600 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-medical-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Vista Griglia"
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-medical-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Vista Elenco"
              >
                <List size={18} />
              </button>
            </div>

            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-medical-600 focus:outline-none"
            >
              <option value="recent">Più recenti</option>
              <option value="weight">Peso sinaptico</option>
              <option value="title">Titolo A-Z</option>
              <option value="type">Tipo</option>
            </select>

            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-medical-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-medical-700 transition-all shadow-lg"
            >
              <Plus size={16} />
              Nuovo
            </button>

            <input type="file" ref={fileInputRef} onChange={handleImportMatrix} accept=".json" className="hidden" />
            <input type="file" ref={singleBrickInputRef} onChange={handleImportBrick} accept=".json" className="hidden" />

            <button
              onClick={handleExportMatrix}
              className="px-4 py-2 bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
              title="Esporta Matrice Completa"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Esporta</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg"
              title="Importa Matrice"
            >
              <Upload size={16} />
              <span className="hidden sm:inline">Importa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Totale</div>
          <div className="text-3xl font-black text-slate-900">{bricks.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Visualizzati</div>
          <div className="text-3xl font-black text-medical-600">{filteredBricks.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Knowledge</div>
          <div className="text-3xl font-black text-blue-600">{bricks.filter(b => b.type === 'KNOWLEDGE').length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Protocolli</div>
          <div className="text-3xl font-black text-emerald-600">{bricks.filter(b => b.type === 'PROTOCOL' || b.type === 'MEDICAL_PROTOCOL').length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Validati</div>
          <div className="text-3xl font-black text-teal-600">{bricks.filter(b => b.metadata.isAuthorized).length}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-4 scrollbar-hide">
         <button onClick={() => setFilter('ALL')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${filter === 'ALL' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>Tutti ({bricks.length})</button>
         {(Object.keys(typeIcons) as BrickType[]).map(type => {
           const count = bricks.filter(b => b.type === type).length;
           if (count === 0) return null;
           return (
             <button key={type} onClick={() => setFilter(type)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${filter === type ? 'bg-medical-600 text-white border-medical-600 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
               {type.replace('_', ' ')} ({count})
             </button>
           );
         })}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(isCreating || editingBrick) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setIsCreating(false); setEditingBrick(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-black text-slate-900 mb-6">
                {isCreating ? 'Crea Nuovo Mattone' : 'Modifica Mattone'}
              </h3>

              <form onSubmit={isCreating ? handleCreateBrick : (e) => { e.preventDefault(); editingBrick && handleSaveBrick(editingBrick); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Tipo</label>
                    <select
                      name="type"
                      defaultValue={editingBrick?.type || 'KNOWLEDGE'}
                      onChange={(e) => editingBrick && setEditingBrick({...editingBrick, type: e.target.value as BrickType})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                      required
                    >
                      {Object.keys(typeIcons).map(type => (
                        <option key={type} value={type}>{type.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Titolo</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingBrick?.title || ''}
                      onChange={(e) => editingBrick && setEditingBrick({...editingBrick, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Contenuto</label>
                    <textarea
                      name="content"
                      defaultValue={editingBrick ? (typeof editingBrick.content === 'string' ? editingBrick.content : JSON.stringify(editingBrick.content, null, 2)) : ''}
                      onChange={(e) => editingBrick && setEditingBrick({...editingBrick, content: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none font-mono text-sm"
                      rows={8}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Tags (separati da virgola)</label>
                    <input
                      type="text"
                      name="tags"
                      defaultValue={editingBrick?.tags.join(', ') || ''}
                      onChange={(e) => editingBrick && setEditingBrick({...editingBrick, tags: e.target.value.split(',').map(t => t.trim())})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Peso Sinaptico (0-10)</label>
                      <input
                        type="number"
                        name="weight"
                        min="0"
                        max="10"
                        defaultValue={editingBrick?.metadata.synapticWeight || 5}
                        onChange={(e) => editingBrick && setEditingBrick({...editingBrick, metadata: {...editingBrick.metadata, synapticWeight: parseInt(e.target.value)}})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-600 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="authorized"
                          defaultChecked={editingBrick?.metadata.isAuthorized || false}
                          onChange={(e) => editingBrick && setEditingBrick({...editingBrick, metadata: {...editingBrick.metadata, isAuthorized: e.target.checked}})}
                          className="w-5 h-5 rounded border-slate-300 text-medical-600 focus:ring-medical-600"
                        />
                        <span className="text-sm font-bold text-slate-700">Validato</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 transition-all shadow-lg"
                  >
                    {isCreating ? 'Crea' : 'Salva'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsCreating(false); setEditingBrick(null); }}
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

      {/* Content Area - Grid View */}
      {viewMode === 'grid' && (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBricks.map((brick) => {
              const Icon = typeIcons[brick.type] || Database;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={brick.id}
                  className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-medical-100 transition-all duration-500 flex flex-col group h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Icon size={120} />
                  </div>

                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`p-4 rounded-2xl ${typeColors[brick.type]} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Peso Sinaptico</span>
                      <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className={`h-1.5 w-1.5 rounded-full ${i < (brick.metadata.synapticWeight) ? 'bg-amber-400' : 'bg-slate-100'}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex-grow">
                      <h4 className="text-xl font-black text-slate-900 mb-2 leading-tight">{brick.title}</h4>
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-50 px-2 py-1 rounded text-slate-500 border border-slate-100">v{brick.metadata.version || 1.0}</span>
                          {brick.metadata.isAuthorized && (
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                  <CheckCircle2 size={10} /> Validato
                              </span>
                          )}
                          {brick.tags.length > 0 && (
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-50 px-2 py-1 rounded text-blue-600 border border-blue-100">
                              <Tag size={10} className="inline mr-1" />{brick.tags.length}
                            </span>
                          )}
                      </div>

                      <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-100 font-mono text-[11px] text-slate-600 leading-relaxed italic mb-4 shadow-inner max-h-40 overflow-y-auto">
                          {typeof brick.content === 'string' ? brick.content : JSON.stringify(brick.content, null, 2)}
                      </div>

                      {brick.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {brick.tags.map((tag, i) => (
                            <span key={i} className="text-[9px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto relative z-10">
                    <div className="flex flex-col">
                      <span className="text-[7px] font-black uppercase text-slate-300 tracking-widest">Hash ID</span>
                      <span className="text-[9px] font-bold text-slate-400 font-mono">{brick.id.substring(0, 12)}...</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingBrick(brick)}
                        className="p-2.5 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                        title="Modifica"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(brick)}
                        className="p-2.5 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all active:scale-90"
                        title="Duplica"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => handleExportBrick(brick.id)}
                        className="p-2.5 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all active:scale-90"
                        title="Esporta"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(brick.id)}
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                        title="Elimina"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}

      {/* Content Area - List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredBricks.map((brick) => {
              const Icon = typeIcons[brick.type] || Database;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={brick.id}
                  className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-medical-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-6">
                    <div className={`p-3 rounded-xl ${typeColors[brick.type]} text-white shadow-md flex-shrink-0`}>
                      <Icon size={20} />
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-grow min-w-0">
                          <h4 className="text-lg font-black text-slate-900 mb-1 truncate">{brick.title}</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-50 px-2 py-1 rounded text-slate-500">
                              {brick.type.replace('_', ' ')}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-50 px-2 py-1 rounded text-slate-500">
                              v{brick.metadata.version || 1.0}
                            </span>
                            {brick.metadata.isAuthorized && (
                              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                <CheckCircle2 size={10} /> Validato
                              </span>
                            )}
                            <span className="text-[9px] font-bold text-slate-400">
                              <Hash size={10} className="inline" /> {brick.id.substring(0, 8)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="text-right">
                            <div className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">Peso</div>
                            <div className="flex gap-0.5">
                              {[...Array(10)].map((_, i) => (
                                <div key={i} className={`h-1 w-1 rounded-full ${i < brick.metadata.synapticWeight ? 'bg-amber-400' : 'bg-slate-100'}`} />
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingBrick(brick)}
                              className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                              title="Modifica"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDuplicate(brick)}
                              className="p-2 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                              title="Duplica"
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              onClick={() => handleExportBrick(brick.id)}
                              className="p-2 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                              title="Esporta"
                            >
                              <Download size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(brick.id)}
                              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Elimina"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 font-mono text-[10px] text-slate-600 mb-3 max-h-20 overflow-hidden relative">
                        {typeof brick.content === 'string' ? brick.content.substring(0, 200) : JSON.stringify(brick.content).substring(0, 200)}
                        {(typeof brick.content === 'string' ? brick.content.length : JSON.stringify(brick.content).length) > 200 && (
                          <span className="text-slate-400">...</span>
                        )}
                      </div>

                      {brick.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {brick.tags.map((tag, i) => (
                            <span key={i} className="text-[8px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {filteredBricks.length === 0 && (
        <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
           <Database size={40} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nessun mattone presente in questa categoria.</p>
        </div>
      )}
    </div>
  );
};
