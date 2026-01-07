
import { PatientProfile, CrmAppointment, ClinicalDocument, Transaction, DocumentCategory, SecureMessage, HealthMetric } from '../types';

// --- MOCK DATABASE STORAGE KEYS ---
const DB_PATIENTS = 'crm_patients_v1';
const DB_APPOINTMENTS = 'crm_appointments_v1';
const DB_DOCUMENTS = 'crm_documents_v1';
const DB_TRANSACTIONS = 'crm_transactions_v1';
const DB_MESSAGES = 'crm_messages_v1';
const DB_METRICS = 'crm_metrics_v1';

// --- HELPERS ---
const generateId = () => Math.random().toString(36).substr(2, 9);
const now = () => new Date().toISOString();

// Helper to convert File to Base64 for persistence demo
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// --- DATA ACCESS LAYER (DAL) ---

export const PatientService = {
  getAll: (): PatientProfile[] => {
    try {
      return JSON.parse(localStorage.getItem(DB_PATIENTS) || '[]');
    } catch { return []; }
  },

  getById: (id: string): PatientProfile | undefined => {
    return PatientService.getAll().find(p => p.id === id);
  },

  login: (lastName: string, phone: string): PatientProfile | undefined => {
    const patients = PatientService.getAll();
    return patients.find(p => 
      p.registry.lastName.toLowerCase().trim() === lastName.toLowerCase().trim() &&
      p.registry.phone.replace(/\s/g, '') === phone.replace(/\s/g, '')
    );
  },

  create: (data: PatientProfile['registry'], consents?: PatientProfile['metadata']['consents']): PatientProfile => {
    const patients = PatientService.getAll();
    const existing = patients.find(p => p.registry.fiscalCode === data.fiscalCode);
    if (existing) return existing;

    const newPatient: PatientProfile = {
      id: generateId(),
      registry: data,
      clinical: { allergies: [], medications: [], conditions: [] },
      metadata: { 
        registeredAt: now(),
        consents: consents || { 
          privacyAccepted: false, 
          termsAccepted: false, 
          aiProcessingAccepted: false, 
          acceptedAt: now() 
        }
      },
      created_at: now(),
      updated_at: now()
    };
    
    patients.push(newPatient);
    localStorage.setItem(DB_PATIENTS, JSON.stringify(patients));
    return newPatient;
  },

  update: (id: string, partial: Partial<PatientProfile>) => {
    const patients = PatientService.getAll();
    const idx = patients.findIndex(p => p.id === id);
    if (idx >= 0) {
      patients[idx] = { ...patients[idx], ...partial, updated_at: now() };
      localStorage.setItem(DB_PATIENTS, JSON.stringify(patients));
    }
  },
  
  updateClinical: (id: string, clinicalData: any) => {
      const patients = PatientService.getAll();
      const idx = patients.findIndex(p => p.id === id);
      if (idx >= 0) {
          patients[idx].clinical = { ...patients[idx].clinical, ...clinicalData };
          patients[idx].updated_at = now();
          localStorage.setItem(DB_PATIENTS, JSON.stringify(patients));
      }
  }
};

export const AppointmentService = {
  getAll: (): CrmAppointment[] => {
    try {
      return JSON.parse(localStorage.getItem(DB_APPOINTMENTS) || '[]');
    } catch { return []; }
  },

  getByPatientId: (patientId: string): CrmAppointment[] => {
    return AppointmentService.getAll().filter(a => a.patientId === patientId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  create: (appt: Omit<CrmAppointment, 'id' | 'createdAt' | 'status'>): CrmAppointment => {
    const list = AppointmentService.getAll();
    const newAppt: CrmAppointment = {
      id: generateId(),
      ...appt,
      status: 'CONFIRMED',
      createdAt: now()
    };
    list.push(newAppt);
    localStorage.setItem(DB_APPOINTMENTS, JSON.stringify(list));
    return newAppt;
  },

  cancel: (id: string) => {
    const list = AppointmentService.getAll();
    const idx = list.findIndex(a => a.id === id);
    if (idx >= 0) {
      list[idx].status = 'CANCELLED';
      localStorage.setItem(DB_APPOINTMENTS, JSON.stringify(list));
    }
  }
};

export const DocumentService = {
  getAll: (): ClinicalDocument[] => {
    try {
      return JSON.parse(localStorage.getItem(DB_DOCUMENTS) || '[]');
    } catch { return []; }
  },

  getByPatientId: (patientId: string): ClinicalDocument[] => {
    return DocumentService.getAll()
      .filter(d => d.patientId === patientId)
      .sort((a,b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  },

  saveGeneratedDoc: (
    patientId: string,
    title: string,
    content: string, 
    category: DocumentCategory
  ): ClinicalDocument => {
    const list = DocumentService.getAll();
    
    const base64Content = btoa(unescape(encodeURIComponent(content)));
    const dataUrl = `data:text/markdown;base64,${base64Content}`;

    const newDoc: ClinicalDocument = {
      id: generateId(),
      patientId,
      uploaderRole: 'DOCTOR',
      title: title.endsWith('.md') || title.endsWith('.txt') ? title : `${title}.md`,
      category,
      fileUrl: dataUrl, 
      uploadDate: now(),
      fileSize: content.length, // Approximate bytes
      notes: content.startsWith('{') ? 'Analisi AI Strutturata' : 'Referto Generato AI',
      isPrivate: false
    };
    list.push(newDoc);
    localStorage.setItem(DB_DOCUMENTS, JSON.stringify(list));
    return newDoc;
  },

  upload: async (
    patientId: string, 
    file: File, 
    category: DocumentCategory, 
    uploader: 'DOCTOR' | 'PATIENT',
    notes?: string
  ): Promise<ClinicalDocument> => {
    const list = DocumentService.getAll();
    
    // Fix: Convert to Base64 for local persistence instead of ObjectURL
    const url = await fileToBase64(file); 

    const newDoc: ClinicalDocument = {
      id: generateId(),
      patientId,
      uploaderRole: uploader,
      title: file.name,
      category,
      fileUrl: url,
      uploadDate: now(),
      fileSize: file.size, // Store as number
      notes,
      isPrivate: false,
      mimeType: file.type
    };
    list.push(newDoc);
    localStorage.setItem(DB_DOCUMENTS, JSON.stringify(list));
    return newDoc;
  },

  delete: (id: string) => {
    const list = DocumentService.getAll().filter(d => d.id !== id);
    localStorage.setItem(DB_DOCUMENTS, JSON.stringify(list));
  }
};

export const FinanceService = {
  getAll: (): Transaction[] => {
    try { return JSON.parse(localStorage.getItem(DB_TRANSACTIONS) || '[]'); } catch { return []; }
  },
  
  getByPatientId: (patientId: string) => {
    return FinanceService.getAll().filter(t => t.patientId === patientId);
  },

  createInvoice: (patientId: string, amount: number, description: string) => {
    const list = FinanceService.getAll();
    const inv: Transaction = {
      id: generateId(),
      patientId,
      amount,
      description,
      date: now(),
      status: 'PENDING'
    };
    list.push(inv);
    localStorage.setItem(DB_TRANSACTIONS, JSON.stringify(list));
  },

  markPaid: (id: string) => {
    const list = FinanceService.getAll();
    const item = list.find(t => t.id === id);
    if (item) {
      item.status = 'PAID';
      localStorage.setItem(DB_TRANSACTIONS, JSON.stringify(list));
    }
  }
};

// --- NEW SERVICES FOR PRO PATIENT PORTAL ---

export const MessageService = {
    getAll: (): SecureMessage[] => {
        try { return JSON.parse(localStorage.getItem(DB_MESSAGES) || '[]'); } catch { return []; }
    },
    getByPatient: (pid: string) => MessageService.getAll().filter(m => m.patientId === pid).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    send: (msg: Omit<SecureMessage, 'id'|'timestamp'|'read'>) => {
        const list = MessageService.getAll();
        list.push({ ...msg, id: generateId(), timestamp: now(), read: false });
        localStorage.setItem(DB_MESSAGES, JSON.stringify(list));
    }
};

export const MetricsService = {
    getAll: (): HealthMetric[] => {
        try { return JSON.parse(localStorage.getItem(DB_METRICS) || '[]'); } catch { return []; }
    },
    getByPatient: (pid: string) => {
        // Mock data if empty
        const data = JSON.parse(localStorage.getItem(DB_METRICS) || '[]');
        if (data.length === 0) return []; // Should return real data
        return data;
    },
    add: (metric: HealthMetric) => {
        const list = MetricsService.getAll();
        list.push(metric);
        localStorage.setItem(DB_METRICS, JSON.stringify(list));
    }
}

export const PatientManager = {
  login: PatientService.login,
  register: PatientService.create,
  findByName: (name: string) => PatientService.getAll().find(p => `${p.registry.firstName} ${p.registry.lastName}` === name),
  addDocument: async (pid: string, file: File, type: string) => {
      await DocumentService.upload(pid, file, 'ALTRO', 'PATIENT', type);
  },
  addPayment: (pid: string, data: any) => FinanceService.createInvoice(pid, data.amount, data.description),
  payInvoice: FinanceService.markPaid,
  getMetrics: MetricsService.getByPatient,
  getMessages: MessageService.getByPatient,
  sendMessage: MessageService.send,
  updateMedicalRecord: PatientService.updateClinical
};
