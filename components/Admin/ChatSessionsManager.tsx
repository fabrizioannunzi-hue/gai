import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Download, Search, Calendar, User, TrendingUp, X, Eye, Trash2,
  RefreshCw, Globe, Monitor, Smartphone, Clock, MapPin, Activity, Smile, Meh,
  Frown, CheckCircle, PlayCircle, XCircle, BarChart3, FileText, Zap, Users
} from 'lucide-react';
import { ChatSession, ChatMessage } from '../../types';
import { supabaseRepositories } from '../../lib/supabase-repositories';
import { AIActionsService } from '../../services/aiActionsService';

type TabType = 'chat' | 'details';

const sourceIcons = {
  widget: Globe,
  iframe: Monitor,
  mobile: Smartphone,
  direct: MessageSquare
};

const statusConfig = {
  ongoing: { label: 'Ongoing', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: PlayCircle },
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle },
  abandoned: { label: 'Abandoned', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: XCircle }
};

const sentimentConfig = {
  positive: { label: 'Positive', color: 'text-emerald-600', icon: Smile, bg: 'bg-emerald-50' },
  neutral: { label: 'Neutral', color: 'text-slate-600', icon: Meh, bg: 'bg-slate-50' },
  negative: { label: 'Negative', color: 'text-red-600', icon: Frown, bg: 'bg-red-50' },
  mixed: { label: 'Mixed', color: 'text-amber-600', icon: Activity, bg: 'bg-amber-50' }
};

const ChatSessionsManager: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([]);
  const [sessionAnalytics, setSessionAnalytics] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchTerm]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await supabaseRepositories.chatSessions.getAll();
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = [...sessions];

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.topics?.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredSessions(filtered);
  };

  const loadSessionDetails = async (session: any) => {
    setSelectedSession(session);
    setActiveTab('chat');

    try {
      const [messages, analytics] = await Promise.all([
        supabaseRepositories.chatMessages.getBySessionId(session.id),
        AIActionsService.getSessionAnalytics(session.id)
      ]);

      setSessionMessages(messages);
      setSessionAnalytics(analytics);
    } catch (error) {
      console.error('Error loading session details:', error);
      setSessionMessages([]);
      setSessionAnalytics(null);
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Oggi';
    if (diffDays === 1) return 'Ieri';
    if (diffDays < 7) return `${diffDays} giorni fa`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} settimane fa`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} mesi fa`;
    return date.toLocaleDateString('it-IT');
  };

  const getFirstMessage = (session: any) => {
    return session.session_summary || 'Conversazione con SOFIA';
  };

  const exportSession = (format: 'json' | 'txt') => {
    if (!selectedSession) return;

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      const exportData = {
        session: selectedSession,
        messages: sessionMessages,
        analytics: sessionAnalytics
      };
      content = JSON.stringify(exportData, null, 2);
      filename = `chat-session-${selectedSession.id}.json`;
      mimeType = 'application/json';
    } else {
      const lines = [
        `SESSIONE CHAT - ${selectedSession.id}`,
        `Paziente: ${selectedSession.patient_name || 'Anonimo'}`,
        `Source: ${selectedSession.source || 'N/A'}`,
        `Status: ${selectedSession.status || 'N/A'}`,
        `Country: ${selectedSession.country || 'N/A'}`,
        `Inizio: ${new Date(selectedSession.session_start).toLocaleString('it-IT')}`,
        `Fine: ${selectedSession.session_end ? new Date(selectedSession.session_end).toLocaleString('it-IT') : 'In corso'}`,
        `Ultima attività: ${selectedSession.last_activity ? new Date(selectedSession.last_activity).toLocaleString('it-IT') : 'N/A'}`,
        `Messaggi totali: ${selectedSession.total_messages}`,
        `Sentiment: ${selectedSession.sentiment || 'Non analizzato'}`,
        `Topics: ${selectedSession.topics?.join(', ') || 'Nessuno'}`,
        '',
        '='.repeat(80),
        '',
        ...sessionMessages.map(msg => {
          const role = msg.role === 'user' ? 'UTENTE' : 'SOFIA';
          const time = new Date(msg.timestamp).toLocaleTimeString('it-IT');
          return `[${time}] ${role}:\n${msg.content}\n`;
        })
      ];
      content = lines.join('\n');
      filename = `chat-session-${selectedSession.id}.txt`;
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const deleteSession = async () => {
    if (!selectedSession) return;

    try {
      await supabaseRepositories.chatSessions.delete(selectedSession.id);
      setSessions(prev => prev.filter(s => s.id !== selectedSession.id));
      setSelectedSession(null);
      setSessionMessages([]);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Errore durante l\'eliminazione della sessione');
    }
  };

  const stats = {
    total: sessions.length,
    ongoing: sessions.filter(s => s.status === 'ongoing').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    avgMessages: sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + (s.total_messages || 0), 0) / sessions.length)
      : 0
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare size={20} className="text-medical-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Totale</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <PlayCircle size={20} className="text-blue-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">In Corso</span>
          </div>
          <div className="text-3xl font-black text-blue-600">{stats.ongoing}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={20} className="text-emerald-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Completate</span>
          </div>
          <div className="text-3xl font-black text-emerald-600">{stats.completed}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 size={20} className="text-amber-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Media Msg</span>
          </div>
          <div className="text-3xl font-black text-amber-600">{stats.avgMessages}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sessions List */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">Chat logs</h3>
              <button
                onClick={loadSessions}
                className="p-2 hover:bg-white rounded-xl transition-all"
                title="Aggiorna"
              >
                <RefreshCw size={16} className="text-slate-600" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cerca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:border-medical-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-600 mx-auto mb-3"></div>
                Caricamento...
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <MessageSquare size={48} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-bold">Nessuna sessione trovata</p>
              </div>
            ) : (
              filteredSessions.map((session) => {
                const isSelected = selectedSession?.id === session.id;
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-all ${
                      isSelected ? 'bg-medical-50 border-l-4 border-l-medical-600' : ''
                    }`}
                    onClick={() => loadSessionDetails(session)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate mb-1">
                          {getFirstMessage(session)}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">
                          {session.patient_name || 'Utente Anonimo'}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                        {formatRelativeTime(session.last_activity || session.session_start)}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Details Panel */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-100 overflow-hidden">
          {!selectedSession ? (
            <div className="h-[600px] flex items-center justify-center">
              <div className="text-center text-slate-400">
                <Eye size={64} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-bold">Seleziona una sessione</p>
                <p className="text-sm">Scegli una conversazione per visualizzare i dettagli</p>
              </div>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="border-b border-slate-100 bg-slate-50/30">
                <div className="flex items-center px-6">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-4 font-bold text-sm border-b-2 transition-all ${
                      activeTab === 'chat'
                        ? 'border-medical-600 text-medical-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-4 py-4 font-bold text-sm border-b-2 transition-all ${
                      activeTab === 'details'
                        ? 'border-medical-600 text-medical-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Details
                  </button>
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() => exportSession('txt')}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                      title="Esporta TXT"
                    >
                      <Download size={16} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="p-2 hover:bg-red-50 rounded-xl transition-all"
                      title="Elimina"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="max-h-[600px] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === 'chat' ? (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-6 space-y-4"
                    >
                      {sessionMessages.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                          <MessageSquare size={48} className="mx-auto mb-3 opacity-20" />
                          <p className="font-bold">Nessun messaggio</p>
                        </div>
                      ) : (
                        sessionMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-4 rounded-2xl ${
                              msg.role === 'user'
                                ? 'bg-medical-50 ml-12 border border-medical-100'
                                : 'bg-slate-50 mr-12 border border-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                msg.role === 'user' ? 'text-medical-600' : 'text-slate-600'
                              }`}>
                                {msg.role === 'user' ? 'Utente' : 'SOFIA'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(msg.timestamp).toLocaleTimeString('it-IT')}
                              </span>
                            </div>
                            <p className="text-sm text-slate-900 whitespace-pre-wrap leading-relaxed">
                              {msg.content}
                            </p>
                            {msg.tokens_used && (
                              <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                                <Zap size={10} />
                                {msg.tokens_used} tokens
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-6"
                    >
                      <div className="space-y-6">
                        {/* General Details */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FileText size={14} />
                            General Details
                          </h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-slate-50">
                              <span className="text-sm text-slate-600">Source:</span>
                              <div className="flex items-center gap-2">
                                {React.createElement(sourceIcons[selectedSession.source as keyof typeof sourceIcons] || Globe, { size: 14, className: 'text-slate-400' })}
                                <span className="text-sm font-bold text-slate-900">
                                  {selectedSession.source || 'Widget or Iframe'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-50">
                              <span className="text-sm text-slate-600">Status:</span>
                              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                                statusConfig[selectedSession.status as keyof typeof statusConfig]?.color || 'bg-slate-50 text-slate-600'
                              }`}>
                                {statusConfig[selectedSession.status as keyof typeof statusConfig]?.label || 'Ongoing'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-50">
                              <span className="text-sm text-slate-600">Sentiment:</span>
                              <div className="flex items-center gap-2">
                                {selectedSession.sentiment && sentimentConfig[selectedSession.sentiment as keyof typeof sentimentConfig] ? (
                                  <>
                                    {React.createElement(
                                      sentimentConfig[selectedSession.sentiment as keyof typeof sentimentConfig].icon,
                                      { size: 16, className: sentimentConfig[selectedSession.sentiment as keyof typeof sentimentConfig].color }
                                    )}
                                    <span className={`text-sm font-bold ${
                                      sentimentConfig[selectedSession.sentiment as keyof typeof sentimentConfig].color
                                    }`}>
                                      {sentimentConfig[selectedSession.sentiment as keyof typeof sentimentConfig].label}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm text-slate-400">Not analyzed</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-50">
                              <span className="text-sm text-slate-600">Messages:</span>
                              <span className="text-sm font-black text-slate-900">
                                {selectedSession.total_messages}
                              </span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-50">
                              <span className="text-sm text-slate-600">Country:</span>
                              <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-900">
                                  {selectedSession.country || 'Italy'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-50">
                              <span className="text-sm text-slate-600">Created:</span>
                              <span className="text-sm text-slate-900">
                                {new Date(selectedSession.session_start).toLocaleString('it-IT')}
                              </span>
                            </div>

                            <div className="flex items-center justify-between py-3">
                              <span className="text-sm text-slate-600">Last activity:</span>
                              <span className="text-sm text-slate-900">
                                {formatRelativeTime(selectedSession.last_activity || selectedSession.session_start)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Analytics */}
                        {sessionAnalytics && (
                          <div className="pt-6 border-t border-slate-100">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Activity size={14} />
                              Analytics
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              {sessionAnalytics.tokens_used > 0 && (
                                <div className="bg-slate-50 p-4 rounded-xl">
                                  <div className="text-xs text-slate-500 mb-1">Tokens Used</div>
                                  <div className="text-xl font-black text-slate-900">
                                    {sessionAnalytics.tokens_used}
                                  </div>
                                </div>
                              )}
                              {sessionAnalytics.response_time_avg > 0 && (
                                <div className="bg-slate-50 p-4 rounded-xl">
                                  <div className="text-xs text-slate-500 mb-1">Avg Response</div>
                                  <div className="text-xl font-black text-slate-900">
                                    {(sessionAnalytics.response_time_avg / 1000).toFixed(1)}s
                                  </div>
                                </div>
                              )}
                            </div>

                            {sessionAnalytics.key_topics && sessionAnalytics.key_topics.length > 0 && (
                              <div className="mt-4">
                                <div className="text-xs text-slate-500 mb-2">Topics</div>
                                <div className="flex flex-wrap gap-2">
                                  {sessionAnalytics.key_topics.map((topic: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-3 py-1 bg-medical-50 text-medical-600 rounded-full border border-medical-100"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-black text-slate-900 mb-4">
                Conferma Eliminazione
              </h3>
              <p className="text-slate-600 mb-6">
                Sei sicuro di voler eliminare questa sessione? Questa azione non può essere annullata.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Annulla
                </button>
                <button
                  onClick={deleteSession}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg"
                >
                  Elimina
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatSessionsManager;
