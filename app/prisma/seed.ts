/**
 * prisma/seed.ts
 *
 * Seeds the database with:
 * 1. A test user (doctor@emleqbank.com / password123)
 * 2. 15 verified EMLE-level questions
 *
 * Run with: npm run prisma:seed
 */

import { PrismaClient, Subject, Difficulty } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding EMLE QBank database...\n");

  // ── 1. Test User ────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "doctor@emleqbank.com" },
    update: {},
    create: {
      email:        "doctor@emleqbank.com",
      name:         "Dr. Mohamed Hassan",
      passwordHash,
      school:       "Kasr Al-Ainy",
      plan:         "FREE",
      aiCredits:    10,
    },
  });
  console.log(`✅ Test user: ${user.email}`);

  // ── 2. Questions ────────────────────────────────────────────────────────
  const questions = [
    // INTERNAL MEDICINE
    {
      stem:        "A 55-year-old man presents with sudden-onset dyspnea and right pleuritic chest pain. He returned from a 12-hour flight 3 days ago. SpO₂ is 91%, HR 112 bpm, BP 98/68 mmHg. D-dimer is markedly elevated. CXR is unremarkable.",
      question:    "What is the BEST immediate management?",
      options:     JSON.stringify(["Start IV antibiotics immediately", "Start heparin IV + CT Pulmonary Angiography immediately", "Immediate thrombolysis with tPA", "Bedside echocardiography and observe", "Oral aspirin and observation"]),
      correct:     1,
      explanation: "Classic PE: DVT risk factor (long flight) + sudden dyspnea + pleuritic pain + elevated D-dimer + hypoxia. Patient is hemodynamically borderline stable (BP 98) → start Heparin IMMEDIATELY without waiting for CT to confirm, then perform CTPA (Gold Standard). Thrombolysis is reserved only for massive PE with hemodynamic collapse (BP <90 despite resuscitation).",
      highYield:   "Wells Score >4 = High PE probability → proceed with CTPA. Start anticoagulation before imaging if clinical suspicion is high. Thrombolysis only for massive PE (BP <90 or cardiac arrest). CTPA = Gold Standard. V/Q scan if contrast contraindicated.",
      subject:     Subject.INTERNAL_MEDICINE,
      topic:       "Pulmonology",
      subtopic:    "Pulmonary Embolism",
    },
    {
      stem:        "A 60-year-old man presents with acute crushing chest pain radiating to the left arm for 2 hours. ECG shows ST elevation in V1-V4. Troponin I is elevated at 3.2 ng/mL. BP 140/90, HR 90 bpm.",
      question:    "What is the HIGHEST PRIORITY management?",
      options:     JSON.stringify(["Aspirin 325mg + Primary PCI immediately (Door-to-balloon <90min)", "Echocardiography to confirm diagnosis first", "Heparin IV infusion only", "Wait for serial troponins before intervention", "Morphine + Metoprolol only"]),
      correct:     0,
      explanation: "Anterior STEMI (V1-V4 = LAD territory). 'Time is muscle' — Door-to-Balloon target <90 minutes. Immediate dual antiplatelet (Aspirin + Ticagrelor/Clopidogrel) + Primary PCI. Primary PCI is superior to thrombolysis when available within 120 minutes. Every 30-minute delay increases mortality by ~7.5%.",
      highYield:   "STEMI criteria: ST elevation ≥1mm in ≥2 contiguous limb leads OR ≥2mm in precordial leads. LBBB + ischemia symptoms = STEMI equivalent. Primary PCI: best if D2B <90min. Thrombolysis if PCI unavailable and symptom onset <12h. Avoid morphine (increases ticagrelor absorption delay).",
      subject:     Subject.INTERNAL_MEDICINE,
      topic:       "Cardiology",
      subtopic:    "Acute MI",
    },
    {
      stem:        "A 65-year-old woman with a 10-year history of hypertension and diabetes presents with dyspnea on exertion and bilateral ankle edema for 3 months. Echocardiography shows EF of 32% with dilated left ventricle. Creatinine is 1.3 mg/dL.",
      question:    "What is the FIRST-LINE treatment combination for this condition?",
      options:     JSON.stringify(["Furosemide alone", "ACE inhibitor + Beta-blocker + Mineralocorticoid Receptor Antagonist + SGLT2 inhibitor", "Calcium channel blocker + Digoxin", "Nitrates + Hydralazine only", "Amiodarone + Aspirin"]),
      correct:     1,
      explanation: "HFrEF (EF <40%): The 'Fantastic Four' guideline-directed therapy = ACEi/ARB/ARNI + Beta-blocker + MRA + SGLT2 inhibitor. Each reduces mortality independently. Start all at low doses and uptitrate. Add diuretics (furosemide) for symptom relief of fluid overload. Avoid CCBs (negative inotropy). SGLT2i (dapagliflozin/empagliflozin) are now Class I indication.",
      highYield:   "HFrEF Fantastic Four: 1) ACEi/ARB/ARNI (Sacubitril-Valsartan preferred if tolerated) 2) Beta-blocker (carvedilol/bisoprolol/metoprolol succinate) 3) MRA (spironolactone/eplerenone) 4) SGLT2i (dapagliflozin/empagliflozin). EF <40% = HFrEF. EF 40-49% = HFmrEF. EF ≥50% = HFpEF.",
      subject:     Subject.INTERNAL_MEDICINE,
      topic:       "Cardiology",
      subtopic:    "Heart Failure",
    },
    {
      stem:        "A 45-year-old man with Type 2 Diabetes for 10 years presents for follow-up. Creatinine 2.1 mg/dL, eGFR 38 mL/min, BP 152/96 mmHg, HbA1c 8.2%. Urine albumin-to-creatinine ratio (UACR): 380 mg/g.",
      question:    "Which medication is MOST important to slow CKD progression in this patient?",
      options:     JSON.stringify(["Metformin at double dose", "ACE inhibitor or ARB + SGLT2 inhibitor", "Calcium channel blocker alone", "Daily high-dose furosemide", "Start hemodialysis immediately"]),
      correct:     1,
      explanation: "Diabetic Nephropathy: CKD Stage 3b (eGFR 30-44). ACEi/ARB reduce intraglomerular hypertension + proteinuria + slow CKD progression independently of BP effect. SGLT2 inhibitors (canagliflozin, finerenone) now have Class I evidence for CKD with albuminuria (CREDENCE, DAPA-CKD trials). Metformin is contraindicated when eGFR <30 (lactic acidosis risk). Note: eGFR 38 = can still use metformin with caution but not at higher doses.",
      highYield:   "Renoprotective order: ACEi/ARB → SGLT2i (add if eGFR ≥20, UACR ≥200) → Finerenone (MRA, if persistent UACR >300). Metformin: STOP when eGFR <30. BP target in DM nephropathy: <130/80. Avoid NSAIDs. Monitor K+ with ACEi/ARB + MRA combination.",
      subject:     Subject.INTERNAL_MEDICINE,
      topic:       "Nephrology",
      subtopic:    "Diabetic Nephropathy",
    },

    // GENERAL SURGERY
    {
      stem:        "A 7-year-old girl presents with periumbilical pain that migrated to the right lower quadrant over 8 hours, anorexia, and low-grade fever of 38.2°C. Examination reveals McBurney point tenderness and rebound tenderness. WBC = 15,200/μL.",
      question:    "What is the MOST appropriate management?",
      options:     JSON.stringify(["CT abdomen with contrast immediately", "Ultrasound and observation for 24 hours", "Oral antibiotics and discharge home", "Laparoscopic appendectomy", "Exploratory laparotomy via right lower quadrant incision"]),
      correct:     3,
      explanation: "Classic acute appendicitis: Migratory pain (periumbilical → RLQ) + anorexia + low fever + McBurney tenderness + Blumberg sign (rebound) + leukocytosis = Alvarado score 7-8 = High probability. In pediatric patients with clear clinical diagnosis, CT is avoided (radiation risk). Laparoscopic appendectomy is the gold standard. Ultrasound is first-line imaging if diagnosis uncertain. Open approach reserved for perforation with phlegmon.",
      highYield:   "Alvarado Score (MANTRELS): Migration + Anorexia + N/V + RLQ Tenderness + Rebound + Elevated temp + Leukocytosis + Shift to left. Score ≥7 = operate. Rovsing sign: RLQ pain when pressing LLQ. Psoas sign: pain on right hip extension. Obturator sign: pain on internal rotation. Perforation risk ↑ after 24-36 hours.",
      subject:     Subject.GENERAL_SURGERY,
      topic:       "Acute Abdomen",
      subtopic:    "Appendicitis",
    },
    {
      stem:        "A 35-year-old man is brought to the ED following a high-speed motor vehicle accident. BP 78/50, HR 136 bpm, respiratory rate 28/min. He is confused (GCS 13). Abdomen is rigid and distended. FAST examination shows free fluid in Morrison's pouch and the pelvic space.",
      question:    "What is the MOST appropriate immediate management?",
      options:     JSON.stringify(["CT abdomen and pelvis with contrast immediately", "Diagnostic peritoneal lavage (DPL)", "Emergency exploratory laparotomy (Damage Control Surgery)", "Angioembolization of splenic artery", "IV fluid resuscitation + repeat FAST in 30 minutes"]),
      correct:     2,
      explanation: "Hemorrhagic Shock Class IV (BP <70, HR >120, GCS altered) + FAST positive (free fluid = intraperitoneal hemorrhage) = Hemodynamically UNSTABLE. ATLS algorithm: Unstable + FAST positive → straight to OR. NO time for CT. Emergency Damage Control Laparotomy: stop the hemorrhage + control contamination → ICU stabilization → planned re-look at 24-48h. CT is for STABLE patients only.",
      highYield:   "FAST: Free fluid in Morrison (hepatorenal), splenorenal, pelvic = positive. ATLS: Stable + FAST+ → CT. Unstable + FAST+ → OR immediately. Unstable + FAST– → pelvic XR + consider thoracic source. Damage Control: Packing + temporary closure → ICU → definitive repair. Permissive hypotension (MAP 50-65) until surgical hemorrhage control.",
      subject:     Subject.GENERAL_SURGERY,
      topic:       "Trauma",
      subtopic:    "Abdominal Trauma",
    },
    {
      stem:        "A 42-year-old woman presents with a left breast lump for 3 months. It is hard, irregular, non-tender, and fixed to underlying tissue. BIRADS-5 on mammography. Ultrasound shows a 2.2cm hypoechoic solid mass with spiculated margins and microcalcifications.",
      question:    "What is the MOST important next diagnostic step?",
      options:     JSON.stringify(["Fine Needle Aspiration Cytology (FNAC)", "Core Needle Biopsy (CNB) with receptor analysis (ER/PR/HER2)", "Immediate wide local excision + sentinel node biopsy", "MRI of both breasts", "Surveillance mammogram in 6 months"]),
      correct:     1,
      explanation: "BIRADS-5: >95% probability of malignancy. Triple Assessment: Clinical + Imaging + Histopathology. Core Needle Biopsy (CNB) is SUPERIOR to FNAC because: 1) Provides histological architecture, 2) Gives receptor status (ER/PR/HER2) which determines complete treatment plan, 3) Can distinguish invasive vs in-situ. FNAC gives cytology only, no receptor status. Receptor status determines: surgery type, need for chemotherapy, hormonal therapy, and targeted therapy (trastuzumab).",
      highYield:   "Breast Cancer Subtypes: Luminal A (ER+/PR+, HER2–, low Ki67) = best prognosis, hormonal therapy. Luminal B (ER+, HER2+/–, high Ki67). HER2-enriched = Trastuzumab. Triple Negative (ER–/PR–/HER2–) = chemotherapy only, worst prognosis. BIRADS: 1-2=benign. 3=short-term follow-up. 4-5=biopsy. Sentinel LN biopsy for clinically node-negative.",
      subject:     Subject.GENERAL_SURGERY,
      topic:       "Breast",
      subtopic:    "Breast Cancer",
    },

    // PEDIATRICS
    {
      stem:        "A 3-day-old neonate presents with jaundice that was first noticed at 18 hours of age. Total bilirubin is 18.5 mg/dL (direct 0.5 mg/dL). Mother is blood group O+, the baby is A+. Direct Coombs test is positive. The baby appears lethargic.",
      question:    "What is the MOST appropriate immediate management?",
      options:     JSON.stringify(["Phototherapy alone and monitor", "Double-volume exchange transfusion + intensive phototherapy", "Give Rhogam to the mother", "IV glucose + recheck bilirubin in 12 hours", "Oral phenobarbital"]),
      correct:     1,
      explanation: "ABO Incompatibility = Hemolytic Disease of Newborn (HDN): Mother O + Baby A → IgG anti-A antibodies cross placenta → hemolysis. Pathological jaundice criteria: Onset <24h + Coombs positive + rising rapidly. Total bilirubin 18.5 at 72h with active hemolysis + lethargy = High-risk zone on Bhutani nomogram → Exchange Transfusion is indicated plus intensive phototherapy. Rhogam = for Rh incompatibility, NOT ABO. Exchange transfusion = 2-volume exchange (removes ~85% of sensitized RBCs).",
      highYield:   "Physiological jaundice: onset >24h, peaks day 3-5, resolves by day 10 (term). Pathological: onset <24h, bilirubin >95th percentile, direct >2 mg/dL, persists >2 weeks. Kernicterus = bilirubin deposits in globus pallidus/subthalamic nuclei = irreversible. Phototherapy converts unconjugated bili to water-soluble isomers. Bhutani nomogram = treatment threshold by age (hours) and risk factors.",
      subject:     Subject.PEDIATRICS,
      topic:       "Neonatology",
      subtopic:    "Neonatal Jaundice",
    },
    {
      stem:        "An 18-month-old boy presents with a 1-day history of barking cough, hoarse voice, and inspiratory stridor. He had a mild runny nose for 2 days before. Temperature is 37.8°C. He is alert and interactive. Symptoms are worse at night.",
      question:    "What is the DIAGNOSIS and BEST treatment?",
      options:     JSON.stringify(["Acute Epiglottitis — immediate securing of airway in OR", "Viral Croup (Laryngotracheobronchitis) — single-dose Dexamethasone 0.6 mg/kg + Nebulized Epinephrine if severe", "Foreign body aspiration — urgent rigid bronchoscopy", "Bacterial Tracheitis — IV broad-spectrum antibiotics", "Asthma exacerbation — Salbutamol nebulizer"]),
      correct:     1,
      explanation: "Viral Croup: Parainfluenza virus type 1 (most common). Age 6 months - 3 years. Classic triad: barking cough + inspiratory stridor + hoarse voice + preceding URTI + worse at night. Temperature usually low-grade. Child looks well (unlike epiglottitis). Steeple sign on neck AP X-ray (subglottic narrowing). Treatment: Mild-Moderate = single-dose oral/IM Dexamethasone 0.6 mg/kg (reduces edema, lasts 24-72h). Severe = + Nebulized Epinephrine (temporary, monitor for rebound at 2-4h).",
      highYield:   "CROUP vs EPIGLOTTITIS: Croup = gradual, barking cough, low fever, child alert, age 1-3yr. Epiglottitis = sudden, drooling, tripod position, HIGH fever, toxic, age 3-7yr (now rare post-Hib vaccine). NEVER examine oropharynx in suspected epiglottitis → secure airway in OR first. Steeple sign = croup. Thumb sign = epiglottitis. Cool mist air: no proven benefit.",
      subject:     Subject.PEDIATRICS,
      topic:       "Respiratory",
      subtopic:    "Croup",
    },
    {
      stem:        "An 8-year-old boy presents with pallor, progressive fatigue, and splenomegaly since infancy. He has required 4 blood transfusions in his life. Hemoglobin 7.2 g/dL, MCV 58 fL. Blood film: marked microcytosis, hypochromia, target cells, nucleated RBCs. HbA₂ is elevated at 5.8%. Both parents are from Upper Egypt and are carriers.",
      question:    "What is the DEFINITIVE curative treatment for this condition?",
      options:     JSON.stringify(["Iron supplementation", "Regular blood transfusions + Deferoxamine chelation + Allogeneic Bone Marrow Transplantation (BMT)", "Hydroxyurea monotherapy", "Splenectomy alone", "G-CSF injections"]),
      correct:     1,
      explanation: "Beta-Thalassemia Major (Cooley's Anemia): Elevated HbA₂ (>3.5%) + severe microcytic anemia + splenomegaly since infancy + carrier parents. Treatment: 1) Regular transfusions (every 3-4 weeks, target Hb >9g/dL) 2) Iron chelation (Deferoxamine or Deferasirox) to prevent hemosiderosis (cardiac, hepatic, endocrine iron overload) 3) Allogeneic BMT = ONLY CURE. Hydroxyurea works for Sickle Cell (↑HbF) but has limited role in Thal Major. Gene therapy is emerging but not yet standard.",
      highYield:   "Thal Minor: HbA₂ >3.5%, mild anemia, asymptomatic = carrier. Thal Intermedia: moderate disease, some transfusion dependence. Thal Major: severe, transfusion-dependent. Iron overload complications: cardiomyopathy (MC cause of death), liver cirrhosis, DM, hypogonadism, hypothyroidism. Fetal Hb (HbF) = α₂γ₂, protective in sickle cell. Hb electrophoresis: diagnostic tool.",
      subject:     Subject.PEDIATRICS,
      topic:       "Hematology",
      subtopic:    "Thalassemia",
    },

    // OBSTETRICS & GYNECOLOGY
    {
      stem:        "A 32-week primigravida presents to the labor and delivery unit with sudden painless bright red vaginal bleeding. She denies contractions or trauma. Her blood pressure is 118/76, HR 88 bpm, and the uterus is soft. Fetal heart tracing shows a reactive pattern. Ultrasound shows the placenta covering the internal cervical os completely.",
      question:    "What is the CORRECT immediate management?",
      options:     JSON.stringify(["Perform digital vaginal examination to assess cervical dilation", "Emergency cesarean section immediately regardless of gestational age", "Immediate hospitalization + IV access + NO vaginal exam + antenatal corticosteroids + plan delivery at 36-37 weeks", "Induction of labor with oxytocin", "External cephalic version"]),
      correct:     2,
      explanation: "Complete Placenta Previa (Grade IV): Placenta covers internal os completely. Painless bright red bleeding is the hallmark warning bleed. ABSOLUTE CONTRAINDICATION to vaginal examination (catastrophic hemorrhage). Management of stable bleed at 32 weeks: 1) Immediate admission 2) IV access, crossmatch blood 3) Antenatal corticosteroids (betamethasone) for fetal lung maturity 4) If stable: expectant management until 36-37 weeks 5) DELIVERY = always by C-section (regardless of position). Emergency CS if: uncontrolled hemorrhage, fetal distress.",
      highYield:   "ABRUPTION vs PREVIA: Abruption = painful, rigid uterus, concealed/revealed bleeding, fetal distress. Previa = painless, soft uterus, bright red bleeding. Vasa Previa = fetal vessel bleeding after ROM → fetal exsanguination. Grading: I=lateral, II=marginal, III=partial, IV=complete. Morbidly adherent placenta (accreta/increta/percreta) = risk with prior CS + anterior previa.",
      subject:     Subject.OBSTETRICS_GYNECOLOGY,
      topic:       "Obstetrics",
      subtopic:    "Antepartum Hemorrhage",
    },
    {
      stem:        "A 28-year-old woman presents to the ED with acute right-sided pelvic pain and 7 weeks of amenorrhea. Urine pregnancy test is positive. Vital signs: BP 88/56, HR 124 bpm, pale and diaphoretic. Ultrasound shows no intrauterine pregnancy and free fluid in the peritoneum. Hemoglobin is 8.4 g/dL.",
      question:    "What is the MOST appropriate management?",
      options:     JSON.stringify(["Methotrexate 50 mg/m² IM injection immediately", "Emergency surgical intervention (laparoscopy or laparotomy) immediately", "Serial β-hCG measurements every 48 hours and repeat ultrasound", "IV progesterone supplementation", "IV antibiotics for PID treatment"]),
      correct:     1,
      explanation: "Ruptured Ectopic Pregnancy: Amenorrhea + positive hCG + no IUP on US + hemodynamic instability (BP 88/56, HR 124) + anemia (Hb 8.4) + free peritoneal fluid = intraperitoneal hemorrhage. SURGICAL EMERGENCY — immediate intervention. Methotrexate criteria (NONE are met): must be hemodynamically STABLE + β-hCG <5000 IU/L + no fetal cardiac activity + unruptured + no contraindications. Laparoscopy preferred if stable enough; laparotomy if hemodynamically unstable.",
      highYield:   "Ectopic implantation sites: Fallopian tube (97%) → ampulla (70%) > isthmus > fimbria. Risk factors: PID, prior ectopic, tubal surgery, IUD, IVF. Methotrexate criteria: Stable + β-hCG <5000 + unruptured + no fetal cardiac activity + no hepatic/renal disease + reliable for follow-up. Anti-D for Rh-negative patients. Cornual ectopic = most dangerous (ruptures at higher gestational age).",
      subject:     Subject.OBSTETRICS_GYNECOLOGY,
      topic:       "Gynecology",
      subtopic:    "Ectopic Pregnancy",
    },

    // EMERGENCY MEDICINE
    {
      stem:        "A 70-year-old man arrives by ambulance after collapsing at home. He is unresponsive, with no palpable pulse and no spontaneous respirations. The cardiac monitor shows coarse ventricular fibrillation.",
      question:    "What is the FIRST and MOST important intervention?",
      options:     JSON.stringify(["Epinephrine 1mg IV bolus immediately", "Amiodarone 300mg IV bolus", "Unsynchronized DC defibrillation at 200J (biphasic) immediately", "Intubation and establish definitive airway first", "Begin CPR for 2 minutes then reassess rhythm"]),
      correct:     2,
      explanation: "VF = Shockable rhythm + Cardiac arrest. ACLS 2020 algorithm: Immediately defibrillate WITHOUT delay. Every minute without defibrillation reduces survival by 7-10%. After shock: immediately resume CPR for 2 minutes before rhythm check. Epinephrine 1mg IV every 3-5 minutes after first shock cycle. Amiodarone 300mg if VF/pVT persists after 2nd shock. Do NOT delay shock to place IV or intubate.",
      highYield:   "Shockable: VF + Pulseless VT → Defibrillate. Non-shockable: Asystole + PEA → CPR + Epinephrine. 4H4T reversible causes: Hypoxia, Hypovolemia, Hypo/Hyperkalemia, Hypothermia; Tamponade, Tension pneumo, Thrombosis (PE/MI), Toxins. Biphasic: 200J. Monophasic: 360J. Synchronized cardioversion for VT WITH pulse.",
      subject:     Subject.EMERGENCY_MEDICINE,
      topic:       "Resuscitation",
      subtopic:    "Ventricular Fibrillation",
    },
    {
      stem:        "A 25-year-old man is brought unconscious to the ED after taking a large amount of Paracetamol (acetaminophen) tablets approximately 4 hours ago. He is semi-conscious, GCS 12. BP 100/70, HR 106. Serum Paracetamol level is markedly elevated above the treatment line on the Rumack-Matthew nomogram.",
      question:    "What is the MOST important therapeutic intervention?",
      options:     JSON.stringify(["Activated charcoal 50g PO/NG immediately", "N-Acetylcysteine (NAC) IV immediately (Acetadote protocol)", "Gastric lavage via NG tube", "Flumazenil IV 0.2mg", "Sodium bicarbonate IV infusion"]),
      correct:     1,
      explanation: "Paracetamol toxicity: Toxic metabolite NAPQI (via CYP2E1 at high doses) depletes hepatic glutathione → hepatocellular necrosis. 4 stages: I (0-24h) = asymptomatic/GI symptoms; II (24-72h) = RUQ pain, elevated LFTs; III (72-96h) = peak hepatotoxicity, ALF; IV = resolution or death. N-Acetylcysteine (NAC) = antidote = replenishes glutathione. MOST EFFECTIVE in first 8-10h but give up to 24h. Activated charcoal only if <2h post-ingestion and airway protected.",
      highYield:   "Antidotes: NAC = Paracetamol. Naloxone = Opioids (pinpoint pupils, bradypnea). Flumazenil = Benzodiazepines (CAUTION: can precipitate seizures in chronic users). Atropine + Pralidoxime = Organophosphates (SLUDGE). Sodium bicarb = TCAs (wide QRS + VT). Digoxin-specific Fab = Digoxin. Deferoxamine = Iron overdose. Hydroxocobalamin = Cyanide. Fomepizole = Methanol/Ethylene glycol.",
      subject:     Subject.EMERGENCY_MEDICINE,
      topic:       "Toxicology",
      subtopic:    "Paracetamol Overdose",
    },
  ];

  // Insert all questions
  let inserted = 0;
  for (const q of questions) {
    await prisma.question.upsert({
      where: { id: q.stem.substring(0, 20).replace(/\s/g, "_") + "_id" },
      update: {},
      create: {
        id:          q.stem.substring(0, 20).replace(/[^a-zA-Z0-9]/g, "_").toLowerCase() + "_" + Math.random().toString(36).substring(2, 6),
        stem:        q.stem,
        question:    q.question,
        options:     q.options,
        correct:     q.correct,
        explanation: q.explanation,
        highYield:   q.highYield,
        subject:     q.subject,
        topic:       q.topic,
        subtopic:    q.subtopic,
        difficulty:  Difficulty.EMLE_LEVEL,
        isActive:    true,
        isVerified:  true,
        source:      "EMLE QBank Seed",
      },
    });
    inserted++;
  }

  console.log(`✅ ${inserted} questions seeded`);
  console.log("\n🎉 Seed complete!");
  console.log("   Test user: doctor@emleqbank.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
