import React, { useState, useEffect } from 'react';
import { Upload, Database, CheckCircle, XCircle, AlertTriangle, Download } from 'lucide-react';
import { migrationManager, MigrationStats, LocalStorageData } from '../../lib/migration-utils';

export const MigrationWizard: React.FC = () => {
  const [step, setStep] = useState<'scan' | 'review' | 'migrate' | 'complete'>('scan');
  const [localData, setLocalData] = useState<LocalStorageData | null>(null);
  const [dryRunStats, setDryRunStats] = useState<MigrationStats | null>(null);
  const [migrationStats, setMigrationStats] = useState<MigrationStats | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);

    try {
      const data = await migrationManager.scanLocalStorage();
      setLocalData(data);

      const stats = await migrationManager.migrateToSupabase(data, true);
      setDryRunStats(stats);

      setStep('review');
    } catch (e: any) {
      setError(e.message || 'Failed to scan localStorage');
    } finally {
      setIsScanning(false);
    }
  };

  const handleMigrate = async () => {
    if (!localData) return;

    setIsMigrating(true);
    setError(null);

    try {
      const stats = await migrationManager.migrateToSupabase(localData, false);
      setMigrationStats(stats);
      setStep('complete');
    } catch (e: any) {
      setError(e.message || 'Migration failed');
    } finally {
      setIsMigrating(false);
    }
  };

  const handleArchive = () => {
    migrationManager.archiveLocalStorage();
    alert('localStorage data archived successfully');
  };

  const downloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      localData,
      dryRunStats,
      migrationStats
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStats = (stats: MigrationStats) => {
    const categories = [
      { key: 'patients', label: 'Patients' },
      { key: 'appointments', label: 'Appointments' },
      { key: 'documents', label: 'Documents' },
      { key: 'transactions', label: 'Transactions' },
      { key: 'messages', label: 'Messages' },
      { key: 'metrics', label: 'Metrics' },
      { key: 'brainBricks', label: 'Brain Bricks' }
    ];

    return (
      <div className="space-y-3">
        {categories.map(({ key, label }) => {
          const stat = stats[key as keyof MigrationStats];
          return (
            <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="font-bold text-slate-800">{label}</div>
                <div className="text-sm text-slate-600">
                  Total: {stat.total} | Inserted: {stat.inserted} | Updated: {stat.updated} | Failed: {stat.failed}
                </div>
              </div>
              {stat.failed > 0 ? (
                <XCircle className="text-red-500" size={24} />
              ) : stat.total > 0 ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <AlertTriangle className="text-gray-400" size={24} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Database size={32} className="text-medical-600" />
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Data Migration Wizard</h2>
          <p className="text-slate-600">Migrate localStorage data to Supabase</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <XCircle className="text-red-500 flex-shrink-0" size={20} />
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {step === 'scan' && (
        <div className="text-center py-12">
          <Upload size={64} className="text-medical-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-slate-800 mb-4">Scan localStorage</h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Click the button below to scan your browser's localStorage for existing data that can be migrated to Supabase.
          </p>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="px-8 py-3 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 disabled:opacity-50 transition-all"
          >
            {isScanning ? 'Scanning...' : 'Scan localStorage'}
          </button>
        </div>
      )}

      {step === 'review' && dryRunStats && (
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4">Review Migration Plan</h3>
          <p className="text-slate-600 mb-6">
            Review the data found in localStorage. No data will be modified yet.
          </p>

          {renderStats(dryRunStats)}

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setStep('scan')}
              className="px-6 py-3 bg-slate-200 text-slate-800 rounded-xl font-bold hover:bg-slate-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleMigrate}
              disabled={isMigrating}
              className="flex-1 px-6 py-3 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 disabled:opacity-50 transition-all"
            >
              {isMigrating ? 'Migrating...' : 'Start Migration'}
            </button>
          </div>
        </div>
      )}

      {step === 'complete' && migrationStats && (
        <div>
          <div className="text-center mb-8">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Migration Complete!</h3>
            <p className="text-slate-600">Your data has been successfully migrated to Supabase.</p>
          </div>

          {renderStats(migrationStats)}

          <div className="flex gap-4 mt-8">
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-800 rounded-xl font-bold hover:bg-slate-300 transition-all"
            >
              <Download size={20} />
              Download Report
            </button>
            <button
              onClick={handleArchive}
              className="flex-1 px-6 py-3 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 transition-all"
            >
              Archive localStorage
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
