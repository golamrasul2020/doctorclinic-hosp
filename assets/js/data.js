/* ==========================================================================
   data.js — mock/sample data for the frontend demo.
   Replace with real content, or fetch from a backend API once available.
   Used by service-details.html to render content based on ?service= query.
   ========================================================================== */

const SERVICES_DATA = {
  consultation: {
    title: "Neurology Consultation",
    icon: "bi-clipboard2-pulse",
    image: "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=1400&auto=format&fit=crop",
    overview: "A comprehensive first evaluation to understand your symptoms, medical history and neurological health.",
    symptoms: ["Headaches", "Dizziness or balance issues", "Numbness or tingling", "Memory concerns"],
    diagnosis: ["Detailed history and physical exam", "Neurological examination", "Referral for imaging or labs if needed"],
    treatment: ["Personalized treatment plan", "Medication management where appropriate", "Referral to specialists if needed"],
    whenToSee: "If you experience persistent or unexplained neurological symptoms, book a consultation for evaluation.",
    faqs: [
      { q: "How long does a first consultation take?", a: "Typically 20–30 minutes, depending on complexity." },
      { q: "Do I need a referral?", a: "A referral is not required, but bringing prior records helps." }
    ]
  },
  stroke: {
    title: "Stroke Management",
    icon: "bi-heart-pulse",
    image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1400&auto=format&fit=crop",
    overview: "Assessment, treatment and rehabilitation planning for patients affected by stroke.",
    symptoms: ["Sudden weakness on one side", "Slurred speech", "Facial drooping", "Sudden vision changes"],
    diagnosis: ["Neurological exam", "Brain imaging (CT/MRI) referral", "Risk factor assessment"],
    treatment: ["Acute management coordination", "Secondary prevention plan", "Rehabilitation referral"],
    whenToSee: "Stroke symptoms are a medical emergency — seek immediate care, then follow up for ongoing management.",
    faqs: [
      { q: "What are the warning signs of stroke?", a: "Sudden weakness, slurred speech, facial drooping — act FAST and seek emergency care." },
      { q: "Is follow-up care available?", a: "Yes, structured follow-up visits are part of stroke management." }
    ]
  },
  epilepsy: {
    title: "Epilepsy Treatment",
    icon: "bi-activity",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b7e05?q=80&w=1400&auto=format&fit=crop",
    overview: "Diagnosis and long-term management of seizure disorders, tailored to each patient.",
    symptoms: ["Recurrent seizures", "Brief episodes of confusion", "Staring spells", "Uncontrollable jerking"],
    diagnosis: ["Detailed seizure history", "EEG referral", "Imaging where indicated"],
    treatment: ["Anti-seizure medication management", "Lifestyle guidance", "Regular monitoring"],
    whenToSee: "See a specialist after a first unexplained seizure or if seizures recur.",
    faqs: [
      { q: "Can epilepsy be managed effectively?", a: "Many patients achieve good seizure control with the right treatment plan." }
    ]
  },
  migraine: {
    title: "Headache & Migraine",
    icon: "bi-lightning-charge",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1400&auto=format&fit=crop",
    overview: "Evaluation and individualized treatment plans for chronic and acute headache disorders.",
    symptoms: ["Throbbing head pain", "Sensitivity to light/sound", "Nausea", "Visual aura"],
    diagnosis: ["Headache history and pattern review", "Neurological exam", "Imaging if red flags present"],
    treatment: ["Acute and preventive medication options", "Trigger identification", "Lifestyle adjustments"],
    whenToSee: "See a doctor for frequent, severe, or changing headache patterns.",
    faqs: [{ q: "Are migraines treatable long-term?", a: "Yes — many patients see significant improvement with preventive care." }]
  }
};

const BLOG_DATA = [
  { id: "stroke-symptoms", category: "Stroke", date: "2026-05-10", title: "Understanding Stroke Symptoms", excerpt: "Recognizing the early warning signs of stroke can save lives — here's what to watch for.", image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=900&auto=format&fit=crop",
    body: "Recognizing a stroke quickly is one of the most important things a family member or bystander can do. Sudden weakness on one side of the body, slurred or difficult speech, facial drooping, and sudden vision changes are all warning signs that call for immediate emergency care. The sooner treatment begins, the better the potential outcome. <!-- EDIT: expand with clinically reviewed detail -->" },
  { id: "migraine-prevention", category: "Migraine", date: "2026-04-22", title: "Migraine Prevention Tips", excerpt: "Simple, evidence-based habits that may help reduce migraine frequency.", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=900&auto=format&fit=crop",
    body: "Regular sleep, consistent meals, hydration, and stress management are often the first line of defense against frequent migraines. Keeping a headache diary can help identify personal triggers, and a specialist can recommend preventive medication where lifestyle changes aren't enough. <!-- EDIT: expand with clinically reviewed detail -->" },
  { id: "epilepsy-awareness", category: "Epilepsy", date: "2026-03-18", title: "Epilepsy Awareness: Myths and Facts", excerpt: "Separating common misconceptions from clinical reality.", image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b7e05?q=80&w=900&auto=format&fit=crop",
    body: "Epilepsy is a manageable neurological condition, not a mental illness, and most people with epilepsy lead full lives with the right treatment plan. Understanding seizure first aid and reducing stigma both play an important role in patient wellbeing. <!-- EDIT: expand with clinically reviewed detail -->" },
  { id: "parkinsons-overview", category: "Movement Disorders", date: "2026-02-05", title: "Parkinson's Disease: An Overview", excerpt: "Understanding symptoms, diagnosis and management approaches.", image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=900&auto=format&fit=crop",
    body: "Parkinson's disease typically develops gradually, often starting with a slight tremor in one hand. Early diagnosis and a coordinated care plan — including medication, physical therapy, and support — can help manage symptoms effectively over time. <!-- EDIT: expand with clinically reviewed detail -->" },
  { id: "when-to-see-neurologist", category: "General", date: "2026-01-14", title: "When Should You See a Neurologist?", excerpt: "Signs that a visit to a neurology specialist may be worthwhile.", image: "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=900&auto=format&fit=crop",
    body: "Persistent headaches, unexplained numbness, memory changes, balance problems, or recurring dizziness are all reasons to consider a neurology consultation. A thorough evaluation can identify the cause and guide the right next steps. <!-- EDIT: expand with clinically reviewed detail -->" },
  { id: "childrens-neuro-health", category: "Pediatric", date: "2025-12-20", title: "Children's Neurological Health", excerpt: "What parents should know about pediatric neurological development.", image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=900&auto=format&fit=crop",
    body: "Developmental milestones, recurring headaches, or seizure-like episodes in children warrant specialist evaluation. Pediatric neurology focuses on both diagnosis and family-centered guidance through every stage of a child's care. <!-- EDIT: expand with clinically reviewed detail -->" }
];
