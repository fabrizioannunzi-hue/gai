
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  role: Role;
  text: string;
  isError?: boolean;
}

// --- ACCESS CONTROL & COMPLIANCE ---
export type UserRole = 'ADMIN' | 'DOCTOR' | 'SECRETARY';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  action: string; // es: "VIEW_PATIENT", "EXPORT_DATA", "VALIDATE_AI"
  resourceId?: string;
  details?: string;
}

export interface ConsentLog {
  consentType: 'PRIVACY' | 'MARKETING' | 'AI_PROCESSING';
  version: string;
  acceptedAt: string;
  ipAddress?: string; // Simulato
  userAgent?: string; // Simulato
}

// --- CRM & DATABASE TYPES ---

export type DocumentCategory = 'REFERTO_MEDICO' | 'ANALISI_LABORATORIO' | 'IMMAGINI' | 'PRESCRIZIONE' | 'CONSENSO_PRIVACY' | 'ALTRO' | 'RADIOGRAFIA' | 'ECOGRAFIA' | 'REFERTO_SPECIALISTICO' | 'CONSENSO';
export type AppointmentStatus = 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';

export interface ClinicalDocument {
  id: string;
  patientId: string;
  uploaderRole: 'DOCTOR' | 'PATIENT';
  title: string;
  category: DocumentCategory;
  fileUrl: string; // Mock URL or Base64
  uploadDate: string;
  fileSize?: number; // Changed to number (bytes) for calculation consistency
  notes?: string;
  isPrivate: boolean; // Se true, visibile solo al dottore
  isValidated?: boolean; // Human-in-the-loop validation
  validatedBy?: string;
  storageKey?: string; // For cloud storage references
  mimeType?: string;
}

export interface CrmAppointment {
  id: string;
  patientId: string;
  patientName: string; // Denormalized for list views
  serviceType: string;
  date: string; // ISO Date YYYY-MM-DD
  time: string;
  status: AppointmentStatus;
  mode: 'IN_PRESENZA' | 'ONLINE';
  notes?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  patientId: string;
  amount: number;
  description: string;
  date: string;
  status: PaymentStatus;
  invoiceUrl?: string;
}

export interface HealthMetric {
  id: string;
  type: 'WEIGHT' | 'PRESSURE_SYS' | 'PRESSURE_DIA' | 'GLUCOSE' | 'HEART_RATE';
  value: number;
  unit: string;
  date: string;
}

export interface MedicalRecord {
  allergies: string[];
  medications: { name: string; dosage: string; frequency: string; active?: boolean }[];
  conditions: string[]; // Patologie pregresse
  bloodType?: string;
  lastCheckup?: string;
  familyHistory?: string[];
  chronicConditions?: string[];
}

export interface SecureMessage {
  id: string;
  patientId: string;
  sender: 'PATIENT' | 'DOCTOR' | 'SYSTEM';
  subject: string;
  content: string;
  read: boolean;
  timestamp: string;
}

export interface PatientProfile {
  id: string;
  registry: {
    firstName: string;
    lastName: string;
    fiscalCode: string;
    email: string;
    phone: string;
    birthDate?: string;
    address?: string;
    city?: string;
  };
  clinical?: MedicalRecord; // New Field
  metadata: {
    registeredAt: string;
    lastLogin?: string;
    tags?: string[]; // es: "Gravidanza", "Oncologia"
    consents: {
        privacyAccepted: boolean;
        termsAccepted: boolean;
        aiProcessingAccepted: boolean;
        acceptedAt: string;
        history?: ConsentLog[]; // Storico consensi per GDPR
    };
  };
  created_at?: string;
  updated_at?: string;
}

// --- CHAT & AI TYPES ---

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokens_used?: number;
}

export interface ChatSession {
  id: string;
  patient_id?: string;
  patient_name?: string;
  session_start: string;
  session_end?: string;
  last_activity?: string;
  status: 'ongoing' | 'completed' | 'abandoned';
  total_messages: number;
  source?: string;
  country?: string;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'mixed';
  topics?: string[];
  session_summary?: string;
}


// --- LEGACY/FRONTEND TYPES ---

export interface SubService {
  id: string;
  title: string;
  description: string; 
  price: string;
  fullDescription?: string; 
  duration?: string; 
  mode?: string; 
  reportTime?: string; 
  requiresPresence?: boolean; 
  preparatoryNotes?: string; 
  includedList?: string[]; 
  imageUrl?: string;
  iconName?: string;
  calendlySlug?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Baby' | 'Dna' | 'Stethoscope' | 'FileText' | 'Microscope' | 'Activity' | 'FileHeart' | 'UserCheck' | 'HeartHandshake' | 'Users' | 'ClipboardCheck' | 'Sparkles' | 'Anchor' | 'Smile';
  detailedDescription?: string;
  subServices?: SubService[];
  theme?: 'pink' | 'orange' | 'purple' | 'blue';
}

export interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
}
