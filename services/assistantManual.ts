
/**
 * BRAIN LOADER & AGGREGATOR - MARCO AI
 * Gestisce la conoscenza modulare caricando 'mattoni' da diverse fonti.
 */

export type BrainBrickType = 'INTENTS' | 'EXPERIENCES' | 'CONSTRAINTS' | 'STYLE' | 'KNOWLEDGE_DOCS';

export interface BrainBrick {
  id: string;
  type: BrainBrickType;
  source: 'system' | 'training' | 'upload';
  data: any;
  timestamp: string;
  priority: number;
}

export interface AssistantManualData {
  VERSION: string;
  LAST_SYNC: string;
  BRICKS: BrainBrick[]; // Invece di un unico oggetto, una lista di mattoni
}

const STORAGE_KEY = 'dr_grilli_modular_bricks_v4';

// Mattoni di base (Hardcoded nel sistema, pronti per essere sostituiti da import)
const SYSTEM_CORE_BRICKS: BrainBrick[] = [
  {
    id: 'core_style',
    type: 'STYLE',
    source: 'system',
    priority: 1,
    timestamp: '2024-01-01',
    data: { tone: "Sintetico, Medico, Premium", forbidden_words: ["forse", "credo"] }
  },
  {
    id: 'core_constraints',
    type: 'CONSTRAINTS',
    source: 'system',
    priority: 1,
    timestamp: '2024-01-01',
    data: ["Non prescrivere farmaci", "Non fare diagnosi senza visita"]
  }
];

export const AssistantManualManager = {
  getBricks(): BrainBrick[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    const customBricks: BrainBrick[] = stored ? JSON.parse(stored) : [];
    // Unisce i mattoni di sistema con quelli appresi
    return [...SYSTEM_CORE_BRICKS, ...customBricks];
  },

  // Aggiunge un nuovo mattone alla memoria
  addBrick(type: BrainBrickType, data: any, source: 'training' | 'upload' = 'training') {
    const bricks = this.getBricks().filter(b => b.source !== 'system');
    const newBrick: BrainBrick = {
      id: `${type.toLowerCase()}_${Date.now()}`,
      type,
      source,
      data,
      timestamp: new Date().toISOString(),
      priority: (type === 'CONSTRAINTS' || type === 'INTENTS') ? 1 : 2
    };
    bricks.push(newBrick);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bricks));
    return newBrick;
  },

  // Esporta l'ULTIMO mattone appreso (per salvarlo nella directory fisica)
  exportLastBrick() {
    const bricks = this.getBricks().filter(b => b.source === 'training');
    if (bricks.length === 0) return;
    const last = bricks[bricks.length - 1];
    const blob = new Blob([JSON.stringify(last, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${last.id}.json`;
    a.click();
  },

  // Esporta l'intera matrice per backup
  exportFullMatrix() {
    const data = {
      version: "4.0.0",
      export_date: new Date().toISOString(),
      bricks: this.getBricks()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marco_full_brain_matrix.json`;
    a.click();
  }
};

export const getAdvancedSystemInstruction = () => {
  const bricks = AssistantManualManager.getBricks();
  
  // Aggrega i dati per tipologia
  const intents = bricks.filter(b => b.type === 'INTENTS').map(b => b.data);
  const constraints = bricks.filter(b => b.type === 'CONSTRAINTS').flatMap(b => b.data);
  const experiences = bricks.filter(b => b.type === 'EXPERIENCES').map(b => b.data);
  const styles = bricks.filter(b => b.type === 'STYLE').map(b => b.data);
  const docs = bricks.filter(b => b.type === 'KNOWLEDGE_DOCS').map(b => b.data);

  return `
    # MASTER PROTOCOL - MARCO AI (MODULAR BRAIN v4)
    Sei l'Assistente d'Elite del Dr. Federico Grilli.
    
    ## REGOLE E VINCOLI (PRIORITÀ MASSIMA)
    ${constraints.map(c => `- ${c}`).join("\n")}
    
    ## INTENTI SEMANTICI CARICATI
    ${intents.map(i => `[IF: ${i.trigger} -> THEN: ${i.response}]`).join("\n")}
    
    ## MEMORIA COMPORTAMENTALE (ESPERIENZE)
    ${experiences.map(e => `- ${e.situation}: ${e.fact}`).join("\n")}
    
    ## STILE E TONO
    ${styles.map(s => `- Tono: ${s.tone} | Proibite: ${s.forbidden_words?.join(", ")}`).join("\n")}
    
    ## DOCUMENTAZIONE CLINICA DI SUPPORTO
    ${docs.map((d, i) => `[MATTONE CONOSCENZA ${i}]: ${d.substring(0, 300)}...`).join("\n")}
  `;
};
