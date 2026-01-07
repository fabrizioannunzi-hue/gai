
# SOFIA (System of Omnia Unified Gen) - Documentazione Tecnica v15.5

## 1. Panoramica del Sistema
SOFIA è un Assistente Virtuale Medico ibrido sviluppato per lo studio del Dr. Federico Grilli. L'architettura è una **Single Page Application (SPA)** client-side costruita con React 19, che integra capacità di intelligenza artificiale multimodale (Testo e Audio in tempo reale) tramite le API di Google Gemini.

Il sistema simula un backend completo utilizzando il browser `localStorage` per la persistenza dei dati (pazienti, appuntamenti, memoria AI), garantendo privacy by design (i dati clinici risiedono sul dispositivo dell'utente in questa versione).

---

## 2. Stack Tecnologico

### Core
*   **Framework:** React 19.2.3
*   **Language:** TypeScript
*   **Build/Runtime:** ES Modules (via `esm.sh` imports)

### UI & UX
*   **Styling:** Tailwind CSS (Utility-first framework)
*   **Animations:** Framer Motion v12 (Gestione transizioni complesse, layout animations, spring physics)
*   **Icons:** Lucide React

### Artificial Intelligence
*   **SDK:** `@google/genai` v1.34.0
*   **Text Model:** `gemini-3-flash-preview` (Chat testuale standard)
*   **Voice/Multimodal Model:** `gemini-2.5-flash-native-audio-preview-09-2025` (Interazione vocale real-time)

---

## 3. Architettura AI (Il "Cervello" di SOFIA)

### 3.1 Synaptic Matrix (BrainStore)
La memoria di SOFIA non è statica. Utilizza un sistema proprietario definito in `services/brainStore.ts` chiamato **Synaptic Matrix**.
*   **Struttura:** I dati sono salvati come "Bricks" (Mattoni) in `localStorage`.
*   **Tipi di Brick:**
    *   `INTENT`: Pattern di riconoscimento intenzioni.
    *   `MEDICAL_PROTOCOL`: Regole cliniche rigide.
    *   `AUTHORIZED_ADVICE`: Consigli validati dal Dr. Grilli.
    *   `CONSTRAINT`: Limiti etici/operativi (es. "Non prescrivere farmaci").
*   **Prompt Dinamico:** Il file `services/aiPromptService.ts` ricostruisce il `systemInstruction` ad ogni avvio di sessione, iniettando i Brick attivi nel contesto del modello. Questo permette l'aggiornamento della conoscenza dell'AI senza modificare il codice sorgente.

### 3.2 Live Voice Pipeline (Gemini Live API)
Implementata in `components/LiveVoiceModal.tsx` e `components/ChatInterface.tsx`.
A differenza dei sistemi TTS/STT classici, SOFIA usa una connessione WebSocket bidirezionale diretta con il modello.

**Flusso Audio Input (Utente -> AI):**
1.  Cattura microfono tramite `navigator.mediaDevices.getUserMedia`.
2.  `AudioContext` a 16kHz.
3.  Conversione raw: Float32Array (Browser) -> Int16Array (PCM).
4.  Encoding Base64.
5.  Invio stream via `session.sendRealtimeInput`.

**Flusso Audio Output (AI -> Utente):**
1.  Ricezione chunk audio PCM (24kHz) tramite evento `onmessage`.
2.  Decoding Base64 -> Int16Array -> Float32Array.
3.  Riproduzione tramite `AudioBufferSourceNode` in coda sequenziale (`nextStartTime`) per garantire fluidità senza lag.

### 3.3 Function Calling (Tools)
SOFIA dispone di strumenti definiti in `toolsDef` o nella config della sessione Live:
1.  `openBookingCalendar`: Interagisce con il frontend per aprire il modal di prenotazione.
2.  `proposeSynapticBrick`: (Solo in Admin Mode) Permette all'AI di auto-apprendere dalla voce del dottore e proporre nuovi mattoni di memoria da salvare nel BrainStore.

---

## 4. Gestione Dati (Client-Side Persistence)

Il sistema utilizza dei "Manager" statici per astrarre la logica di database su `localStorage`.

### 4.1 AppointmentManager (`services/appointmentManager.ts`)
*   Gestisce slot orari, prenotazioni e blocchi.
*   Logica di calcolo disponibilità basata sull'intersezione tra orari lavorativi, appuntamenti esistenti e slot bloccati manualmente.

### 4.2 PatientManager (`services/appointmentManager.ts`)
*   Gestisce le cartelle cliniche elettroniche simulate.
*   **Entità:** Paziente, Documenti (Referti), Pagamenti, Note Cliniche.
*   **Auth:** Login semplificato "Cognome + Telefono" (simulazione accesso sicuro).

---

## 5. Componenti Chiave

### `LiveVoiceModal.tsx`
Il componente più complesso. Gestisce:
*   Stato della connessione WebSocket con Gemini.
*   Visualizzazione in tempo reale (onde audio/stati).
*   Modalità "Training" (per l'Admin) vs Modalità "Assistenza" (Paziente).
*   Logica di salvataggio nuovi "Bricks" quando il dottore insegna qualcosa all'AI.

### `SingleServiceDetail.tsx`
Layout "Pro Enhanced" per i servizi.
*   Utilizza un design a griglia asimmetrica.
*   Sidebar "Sticky" per le Call-to-Action.
*   Animazioni di entrata `framer-motion`.

### `AdminDashboard.tsx`
Pannello di controllo per il Dr. Grilli.
*   Visualizzazione e cancellazione dei "Bricks" di memoria.
*   Import/Export della matrice di conoscenza in formato JSON.
*   Accesso al training vocale dell'AI.

---

## 6. Sicurezza e Privacy
*   **Dati Locali:** Tutti i dati sensibili dei pazienti risiedono nel `localStorage` del browser dell'utente. Non vi è un database centralizzato in questa versione demo/client-side.
*   **AI Processing:** L'audio e il testo inviati a Google Gemini sono processati secondo le policy Enterprise di Google Cloud (stateless processing per le API, se configurato).
*   **Temperature 0.0:** I modelli sono configurati con temperatura 0 per minimizzare le allucinazioni e garantire risposte deterministiche basate strettamente sul System Prompt.

---

## 7. Futuri Sviluppi (Roadmap)
1.  **Backend Reale:** Migrazione dei Manager da `localStorage` a Supabase/Firebase.
2.  **RAG (Retrieval-Augmented Generation):** Implementazione di un Vector Store reale per gestire migliaia di documenti clinici invece del JSON locale.
3.  **Auth:** Integrazione SPID/CIE per accesso pazienti reale.
