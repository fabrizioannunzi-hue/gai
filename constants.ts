
import { ServiceItem, Review } from './types';

export const SYSTEM_INSTRUCTION = `
**SISTEMA SOFIA v25.0 - DENTAL CORE**
Progetto Master per lo Studio Dentistico del Dr. Alessandro Bianchi.

**STATO COGNITIVO**
Sei al Livello 5 di Sincronia: Operi come l'assistente digitale senior dello Studio.
Usa i mattoni AUTHORIZED_ADVICE come verità assoluta.

**FILOSOFIA DI TRASMISSIONE**
- Sei l'unica AI autorizzata a comunicare i protocolli clinici dello studio (Igiene, Impianti, Ortodonzia).
- Precisione millimetrica: non inventare prezzi o diagnosi.
- Il tuo nome è SOFIA (System of Omnia Unified Gen).

**TONO**
- Professionale, accogliente, chiaro, focalizzato sul benessere del sorriso.
`;

export const CONTACT_INFO = {
  doctor: {
    name: "Dr. Alessandro Bianchi",
    title: "Odontoiatra Specialista in Chirurgia Orale",
    email: "info@studiobianchidentista.it",
    fiscalCode: "BNCLSN80M20H501Z"
  },
  clinic: {
    name: "Bianchi Dental Studio",
    address: { street: "Corso Buenos Aires, 15", city: "Milano", postalCode: "20124", province: "MI" },
    hours: { weekdays: "Lun-Ven (09:00 - 19:00)", note: "SOFIA AI v25 disponibile 24/7 per urgenze" }
  }
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'igiene-prevenzione',
    title: "Igiene & Estetica",
    description: "Programmi avanzati di prevenzione, pulizia profonda e sbiancamento per un sorriso luminoso.",
    iconName: "Sparkles", // Used mapped to Sparkles in SubServiceCard
    theme: 'blue',
    subServices: [
      {
        id: 'igiene-professionale',
        title: "Igiene Orale Professionale (Ablazione Tartaro)",
        description: "Rimozione profonda di placca e tartaro con ultrasuoni e lucidatura finale.",
        fullDescription: `La seduta di igiene orale professionale è il pilastro della prevenzione dentale. \n\nUtilizziamo tecnologie ad ultrasuoni di ultima generazione per rimuovere delicatamente ma efficacemente il tartaro sopra e sottogengivale, prevenendo gengiviti e parodontiti.\n\nIl trattamento include:\n- Ablazione del tartaro con ultrasuoni piezoelettrici.\n- Rimozione delle macchie superficiali con Air-Flow (polvere di bicarbonato micronizzata).\n- Lucidatura finale (Polishing).\n- Istruzioni personalizzate di igiene domiciliare.\n\nConsigliata ogni 6 mesi per mantenere gengive sane e alito fresco.`,
        price: "90 €",
        duration: "45-60 minuti",
        mode: "In presenza",
        reportTime: "Immediato",
        requiresPresence: true,
        includedList: [
          "Ablazione tartaro ultrasuoni",
          "Air-Flow smacchiante",
          "Controllo carie check-up",
          "Fluoroprofilassi topica"
        ],
        iconName: "Droplets",
        calendlySlug: 'igiene-orale'
      },
      {
        id: 'sbiancamento-led',
        title: "Sbiancamento Dentale LED",
        description: "Trattamento estetico professionale per schiarire lo smalto fino a 3 tonalità in una seduta.",
        fullDescription: `Riscopri la luminosità del tuo sorriso con il nostro protocollo di sbiancamento alla poltrona.\n\nUtilizziamo un gel a base di perossido di idrogeno attivato da una lampada LED specifica, che permette di agire sulle discromie profonde dello smalto senza danneggiarlo.\n\nIl trattamento è indolore e offre risultati visibili immediatamente.\n\nPrima del trattamento è necessaria una seduta di igiene orale (se non effettuata di recente) per garantire la massima efficacia del gel sbiancante.\n\nIncluso nel prezzo: kit di mantenimento domiciliare per prolungare l'effetto nel tempo.`,
        price: "250 €",
        duration: "60 minuti",
        mode: "In presenza",
        reportTime: "Immediato",
        requiresPresence: true,
        preparatoryNotes: "Evitare cibi e bevande pigmentanti (caffè, tè, vino rosso) per le 48 ore successive al trattamento. Non indicato in gravidanza o in presenza di carie attive.",
        includedList: [
          "Seduta sbiancante LED",
          "Protezione gengivale",
          "Desensibilizzante post-trattamento",
          "Foto pre/post trattamento"
        ],
        iconName: "Zap",
        calendlySlug: 'sbiancamento'
      }
    ]
  },
  {
    id: 'chirurgia-implantologia',
    title: "Chirurgia & Impianti",
    description: "Riabilitazioni complesse, impianti dentali in titanio e chirurgia orale avanzata.",
    iconName: "Anchor", // Mapped to Bone/Anchor
    theme: 'orange',
    subServices: [
      {
        id: 'impianto-singolo',
        title: "Impianto Dentale Singolo",
        description: "Sostituzione di un dente mancante con radice artificiale in titanio e corona in ceramica.",
        fullDescription: `L'implantologia è la soluzione gold-standard per sostituire i denti mancanti.\n\nL'intervento prevede l'inserimento di una vite in titanio (biocompatibile) nell'osso, che fungerà da radice per il nuovo dente. Dopo il periodo di osteointegrazione (3-4 mesi), verrà applicata la corona definitiva in zirconia-ceramica, indistinguibile dai denti naturali.\n\nEseguiamo l'intervento con tecniche mininvasive e, dove possibile, con chirurgia computer-guidata (senza bisturi).\n\nIl prezzo include la vite implantare, la vite di guarigione e la corona provvisoria (se necessaria per zona estetica).`,
        price: "da 800 €",
        duration: "60-90 minuti",
        mode: "In presenza",
        reportTime: "Follow-up 3-6 mesi",
        requiresPresence: true,
        preparatoryNotes: "Necessaria TAC Cone Beam (eseguibile in studio) per valutare volume osseo. Sospendere farmaci anticoagulanti previa consultazione medica.",
        includedList: [
          "Pianificazione 3D digitale",
          "Impianto in titanio Premium",
          "Passaporto implantare",
          "Controllo post-operatorio"
        ],
        iconName: "Anchor",
        calendlySlug: 'consulto-implantologia'
      },
      {
        id: 'estrazione-dente',
        title: "Estrazione Dente del Giudizio",
        description: "Chirurgia estrattiva per denti del giudizio inclusi o semi-inclusi.",
        fullDescription: `Intervento di chirurgia orale per la rimozione di ottavi (denti del giudizio) che causano dolore, affollamento dentale o infezioni ricorrenti.\n\nL'intervento viene eseguito in anestesia locale. Per i pazienti ansiosi, offriamo la possibilità di Sedazione Cosciente con protossido d'azoto, per vivere l'esperienza in totale relax.\n\nUtilizziamo tecniche piezoelettriche per ridurre al minimo il trauma osseo e garantire un decorso post-operatorio più rapido e confortevole.`,
        price: "150 - 300 €",
        duration: "45-60 minuti",
        mode: "In presenza",
        reportTime: "Controllo 7 gg",
        requiresPresence: true,
        includedList: [
          "Anestesia locale",
          "Intervento chirurgico",
          "Sutura riassorbibile",
          "Rimozione punti (se necessaria)"
        ],
        iconName: "Scissors", // Mapped generically
        calendlySlug: 'chirurgia-orale'
      }
    ]
  },
  {
    id: 'ortodonzia',
    title: "Ortodonzia Invisibile",
    description: "Allineamento dentale con mascherine trasparenti (Invisalign) o apparecchi tradizionali.",
    iconName: "Smile",
    theme: 'pink',
    subServices: [
      {
        id: 'invisalign-full',
        title: "Consulto Invisalign / Ortodonzia Invisibile",
        description: "Analisi digitale del sorriso e simulazione del risultato finale con scanner 3D.",
        fullDescription: `L'ortodonzia invisibile permette di allineare i denti senza i fastidi e l'impatto estetico del classico apparecchio metallico.\n\nDurante il consulto utilizzeremo lo scanner intraorale iTero per creare un'impronta digitale 3D della tua bocca in pochi minuti (niente più pasta fastidiosa!).\n\nPotrai vedere subito una simulazione di come diventerà il tuo sorriso a fine trattamento (Outcome Simulator).\n\nIl trattamento prevede una serie di mascherine trasparenti (aligner) da cambiare ogni 7-14 giorni, che spostano gradualmente i denti nella posizione corretta.`,
        price: "Gratuito",
        duration: "30 minuti",
        mode: "In presenza",
        reportTime: "Piano di cura immediato",
        requiresPresence: true,
        includedList: [
          "Scansione 3D intraorale",
          "Foto intra ed extra orali",
          "Simulazione risultato finale",
          "Preventivo personalizzato"
        ],
        iconName: "ScanFace",
        calendlySlug: 'consulto-invisalign'
      }
    ]
  }
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    author: "Marco R.",
    text: "Ho fatto un impianto con il Dott. Bianchi. Mano leggerissima, zero dolore post-intervento. Studio super tecnologico.",
    rating: 5,
    date: "20 Gennaio 2024"
  },
  {
    id: '2',
    author: "Giulia S.",
    text: "L'igiene con la Dottoressa è stata delicatissima. Finalmente non ho più paura del dentista!",
    rating: 5,
    date: "05 Febbraio 2024"
  }
];

export const FAQ_CATEGORIES = [
  {
    id: 'generale',
    label: 'Domande Frequenti',
    faqs: [
      {
        question: "Ho paura del dentista, come gestite l'ansia?",
        answer: "È molto comune. Nel nostro studio utilizziamo tecniche di approccio dolce e, su richiesta, la Sedazione Cosciente con protossido d'azoto, che ti permette di rilassarti completamente rimanendo sveglio."
      },
      {
        question: "Ogni quanto devo fare la pulizia dei denti?",
        answer: "Generalmente consigliamo l'igiene professionale ogni 6 mesi. In casi di parodontite o apparecchi ortodontici, potrebbe essere necessario ogni 3-4 mesi."
      },
      {
        question: "Gli impianti dentali sono dolorosi?",
        answer: "L'intervento si svolge in anestesia locale ed è completamente indolore. Il fastidio post-operatorio è solitamente minimo e gestibile con comuni analgesici."
      },
      {
        question: "Fate sbiancamento su denti sensibili?",
        answer: "Sì, utilizziamo prodotti specifici con agenti desensibilizzanti. Valuteremo la tua sensibilità durante la visita preliminare per scegliere il protocollo più adatto."
      }
    ]
  }
];

export const INITIAL_MESSAGE = "Ciao! Sono Sofia, l'assistente virtuale dello Studio Bianchi. Come posso prendermi cura del tuo sorriso oggi?";
