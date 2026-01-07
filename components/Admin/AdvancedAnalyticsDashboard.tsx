import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, MessageCircle, Smile, Meh, Frown,
  Clock, Zap, Target, Users, BarChart3, Activity, Brain, Tag
} from 'lucide-react';
import { AIActionsService } from '../../services/aiActionsService';

interface AnalyticsSummary {
  totalSessions: number;
  avgSentiment: number;
  sentimentDistribution: Record<string, number>;
  topTopics: { topic: string; count: number }[];
  avgTokensUsed: number;
  avgResponseTime: number;
}

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await AIActionsService.getAnalyticsSummary();
      setSummary(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  const sentimentPercentages = {
    positive: summary.totalSessions > 0 ? (summary.sentimentDistribution.positive / summary.totalSessions) * 100 : 0,
    neutral: summary.totalSessions > 0 ? (summary.sentimentDistribution.neutral / summary.totalSessions) * 100 : 0,
    negative: summary.totalSessions > 0 ? (summary.sentimentDistribution.negative / summary.totalSessions) * 100 : 0,
    mixed: summary.totalSessions > 0 ? (summary.sentimentDistribution.mixed / summary.totalSessions) * 100 : 0
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-emerald-600';
    if (score < -0.3) return 'text-red-600';
    return 'text-slate-600';
  };

  const getSentimentIcon = (score: number) => {
    if (score > 0.3) return Smile;
    if (score < -0.3) return Frown;
    return Meh;
  };

  const SentimentIcon = getSentimentIcon(summary.avgSentiment);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Analytics Dashboard</h2>
          <p className="text-slate-500 mt-2">Panoramica completa delle performance AI</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm focus:border-medical-600 focus:outline-none"
        >
          <option value="7d">Ultimi 7 giorni</option>
          <option value="30d">Ultimi 30 giorni</option>
          <option value="90d">Ultimi 90 giorni</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-medical-500 to-medical-600 rounded-3xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <MessageCircle size={24} />
            </div>
            <TrendingUp size={20} className="opacity-50" />
          </div>
          <div className="text-4xl font-black mb-2">{summary.totalSessions}</div>
          <div className="text-sm opacity-90">Conversazioni Totali</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-gradient-to-br ${
            summary.avgSentiment > 0.3 ? 'from-emerald-500 to-emerald-600' :
            summary.avgSentiment < -0.3 ? 'from-red-500 to-red-600' :
            'from-slate-500 to-slate-600'
          } rounded-3xl p-6 text-white shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <SentimentIcon size={24} />
            </div>
            <Activity size={20} className="opacity-50" />
          </div>
          <div className="text-4xl font-black mb-2">{(summary.avgSentiment * 100).toFixed(0)}%</div>
          <div className="text-sm opacity-90">Sentiment Medio</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Zap size={24} />
            </div>
            <BarChart3 size={20} className="opacity-50" />
          </div>
          <div className="text-4xl font-black mb-2">{Math.round(summary.avgTokensUsed)}</div>
          <div className="text-sm opacity-90">Token Medi per Chat</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Clock size={24} />
            </div>
            <Target size={20} className="opacity-50" />
          </div>
          <div className="text-4xl font-black mb-2">{(summary.avgResponseTime / 1000).toFixed(1)}s</div>
          <div className="text-sm opacity-90">Tempo Risposta Medio</div>
        </motion.div>
      </div>

      {/* Sentiment Distribution */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <Activity size={24} className="text-medical-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Distribuzione Sentiment</h3>
            <p className="text-sm text-slate-500">Analisi del tono delle conversazioni</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-100">
            <div className="flex items-center justify-between mb-3">
              <Smile size={24} className="text-emerald-600" />
              <span className="text-2xl font-black text-emerald-600">
                {sentimentPercentages.positive.toFixed(0)}%
              </span>
            </div>
            <div className="text-sm font-bold text-emerald-900 mb-1">Positivo</div>
            <div className="text-xs text-emerald-600">{summary.sentimentDistribution.positive} conversazioni</div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <Meh size={24} className="text-slate-600" />
              <span className="text-2xl font-black text-slate-600">
                {sentimentPercentages.neutral.toFixed(0)}%
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 mb-1">Neutrale</div>
            <div className="text-xs text-slate-600">{summary.sentimentDistribution.neutral} conversazioni</div>
          </div>

          <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-100">
            <div className="flex items-center justify-between mb-3">
              <Frown size={24} className="text-red-600" />
              <span className="text-2xl font-black text-red-600">
                {sentimentPercentages.negative.toFixed(0)}%
              </span>
            </div>
            <div className="text-sm font-bold text-red-900 mb-1">Negativo</div>
            <div className="text-xs text-red-600">{summary.sentimentDistribution.negative} conversazioni</div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-100">
            <div className="flex items-center justify-between mb-3">
              <Activity size={24} className="text-amber-600" />
              <span className="text-2xl font-black text-amber-600">
                {sentimentPercentages.mixed.toFixed(0)}%
              </span>
            </div>
            <div className="text-sm font-bold text-amber-900 mb-1">Misto</div>
            <div className="text-xs text-amber-600">{summary.sentimentDistribution.mixed} conversazioni</div>
          </div>
        </div>

        {/* Sentiment Bar */}
        <div className="mt-6">
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500"
              style={{ width: `${sentimentPercentages.positive}%` }}
            />
            <div
              className="bg-slate-400"
              style={{ width: `${sentimentPercentages.neutral}%` }}
            />
            <div
              className="bg-red-500"
              style={{ width: `${sentimentPercentages.negative}%` }}
            />
            <div
              className="bg-amber-500"
              style={{ width: `${sentimentPercentages.mixed}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top Topics */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <Brain size={24} className="text-medical-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Topic Principali</h3>
            <p className="text-sm text-slate-500">Argomenti più discussi nelle conversazioni</p>
          </div>
        </div>

        {summary.topTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summary.topTopics.map((topic, index) => {
              const percentage = summary.totalSessions > 0 ? (topic.count / summary.totalSessions) * 100 : 0;
              return (
                <div key={index} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-medical-600" />
                      <span className="font-bold text-slate-900">{topic.topic}</span>
                    </div>
                    <span className="text-sm font-black text-medical-600">
                      {topic.count}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-medical-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    {percentage.toFixed(1)}% delle conversazioni
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Brain size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-bold">Nessun topic disponibile</p>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-xl text-white">
              <Zap size={20} />
            </div>
            <div className="text-sm font-bold text-blue-900">Efficienza Token</div>
          </div>
          <div className="text-3xl font-black text-blue-600 mb-2">
            {summary.avgTokensUsed > 0 ? (10000 / summary.avgTokensUsed).toFixed(1) : 0}x
          </div>
          <div className="text-xs text-blue-700">Conversazioni per 10k token</div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500 rounded-xl text-white">
              <Target size={20} />
            </div>
            <div className="text-sm font-bold text-emerald-900">Quality Score</div>
          </div>
          <div className="text-3xl font-black text-emerald-600 mb-2">
            {((summary.avgSentiment + 1) * 50).toFixed(0)}%
          </div>
          <div className="text-xs text-emerald-700">Basato su sentiment e feedback</div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-500 rounded-xl text-white">
              <Clock size={20} />
            </div>
            <div className="text-sm font-bold text-amber-900">Velocità</div>
          </div>
          <div className="text-3xl font-black text-amber-600 mb-2">
            {summary.avgResponseTime < 3000 ? 'Ottima' : summary.avgResponseTime < 5000 ? 'Buona' : 'Lenta'}
          </div>
          <div className="text-xs text-amber-700">
            {(summary.avgResponseTime / 1000).toFixed(2)}s tempo medio risposta
          </div>
        </div>
      </div>
    </div>
  );
};
