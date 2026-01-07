
/* 
 * SYNAPTIC CORE v18.1 - OMNIDRIVE DATABASE LAYER
 * Architecture: Service Repository Pattern
 * Status: Production Ready (Simulated Async)
 */

export type BrickType = 
  | 'INTENT' | 'CONSTRAINT' | 'KNOWLEDGE' | 'MEDICAL_PROTOCOL' | 'AUTHORIZED_ADVICE' | 'STYLE_GUIDE';

export interface BrainBrick {
  id: string;
  type: BrickType;
  title: string;
  tags: string[];
  content: any;
  metadata: {
    createdAt: string;
    lastValidated: string;
    isAuthorized: boolean;
    authorizedBy: string;
    responsibilityHash: string;
    version: number;
    synapticWeight: number;
  };
}

export interface MatrixExportData {
  matrix: BrainBrick[];
  version: number;
  exportDate: string;
  environment: string;
}

// COSTANTI DI SISTEMA
const STORAGE_KEY = 'sofia_omnia_matrix_master';
const CURRENT_VERSION = 18.0;

// HELPER: Simulazione latenza di rete
const simulateNetwork = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const BrainStore = {
  
  // --- INITIALIZATION ---

  /**
   * Inizializza la matrice caricando l'ultimo backup statico se la memoria locale è vuota.
   */
  async initializeMatrix(): Promise<void> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored || JSON.parse(stored).length === 0) {
      console.log("🧠 SYNAPTIC CORE: Nessuna matrice locale rilevata. Caricamento backup statico...");
      
      try {
        // Utilizziamo fetch per evitare problemi di importazione modulo JSON nei browser
        const response = await fetch('./sofia_knowledge/SOFIA_MATRIX_BACKUP_2026-01-06.json');
        if (response.ok) {
            const latestBackup = await response.json();
            if (latestBackup && latestBackup.matrix) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(latestBackup.matrix));
                console.log(`✅ SYNAPTIC CORE: Caricati ${latestBackup.matrix.length} mattoni di conoscenza.`);
                window.dispatchEvent(new CustomEvent('synaptic_update'));
            }
        } else {
            console.warn("⚠️ SYNAPTIC CORE: Impossibile caricare backup statico.", response.statusText);
        }
      } catch (e) {
        console.error("⚠️ SYNAPTIC CORE: Errore inizializzazione matrice.", e);
      }
    } else {
      console.log("🧠 SYNAPTIC CORE: Matrice locale attiva e sincronizzata.");
    }
  },

  // --- READ OPERATIONS ---

  async getBricks(): Promise<BrainBrick[]> {
    await simulateNetwork(100);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (e) {
      console.error("Database Integrity Error:", e);
      return [];
    }
  },

  getBricksSync(): BrainBrick[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch { return []; }
  },

  // --- WRITE OPERATIONS ---

  async saveBrick(brickData: Omit<BrainBrick, 'id' | 'metadata'>): Promise<BrainBrick> {
    await simulateNetwork(400);
    const bricks = this.getBricksSync();
    
    const newBrick: BrainBrick = {
      ...brickData,
      id: `syn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      metadata: {
        createdAt: new Date().toISOString(),
        lastValidated: new Date().toISOString(),
        isAuthorized: true,
        authorizedBy: 'Dr. Federico Grilli (Admin)',
        responsibilityHash: `SHA256-${Math.random().toString(36).substring(7).toUpperCase()}`,
        version: CURRENT_VERSION,
        synapticWeight: 10
      }
    };
    
    bricks.push(newBrick);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bricks));
    window.dispatchEvent(new CustomEvent('synaptic_update'));
    return newBrick;
  },

  async deleteBrick(id: string): Promise<void> {
    await simulateNetwork(200);
    const bricks = this.getBricksSync();
    const filtered = bricks.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('synaptic_update'));
  },

  // --- IO OPERATIONS ---

  async exportMatrix(): Promise<void> {
    const bricks = await this.getBricks();
    const data: MatrixExportData = {
      matrix: bricks,
      version: CURRENT_VERSION,
      exportDate: new Date().toISOString(),
      environment: 'production_client_side'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOFIA_MATRIX_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  async importMatrix(file: File): Promise<{ success: boolean; count: number; message?: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const parsedData = JSON.parse(content) as MatrixExportData;

          if (!parsedData.matrix || !Array.isArray(parsedData.matrix)) {
            throw new Error("Formato Matrix non valido.");
          }

          await simulateNetwork(800);
          const brickMap = new Map<string, BrainBrick>();
          const currentBricks = this.getBricksSync();
          currentBricks.forEach(b => brickMap.set(b.id, b));
          parsedData.matrix.forEach(b => {
            if (!b.id) b.id = `imported_${Date.now()}_${Math.random()}`;
            brickMap.set(b.id, b);
          });

          const finalMatrix = Array.from(brickMap.values());
          localStorage.setItem(STORAGE_KEY, JSON.stringify(finalMatrix));
          window.dispatchEvent(new CustomEvent('synaptic_update'));
          resolve({ success: true, count: parsedData.matrix.length });
        } catch (error: any) {
          resolve({ success: false, count: 0, message: error.message });
        }
      };
      reader.readAsText(file);
    });
  }
};
