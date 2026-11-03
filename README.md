# JIVAN SETU (जीवन सेतु)
> **"Bridging the Gap Between Emergencies and Timely Medical Response."**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-OpenStreetMap-199900.svg)](https://leafletjs.com/)
[![Status](https://img.shields.io/badge/Academic%20Project-B.Tech%20Capstone-red.svg)]()

---

## 📌 Project Overview
**JIVAN SETU** is a modern, responsive, smart emergency medical response and ambulance coordination platform designed to address the **"Golden Hour"** bottleneck in pre-hospital trauma care. 

In high-stress medical crises, traditional telephone dispatches suffer from severe location ambiguity, zero advance clinical data, and unprepared hospital emergency departments. **JIVAN SETU** connects four key stakeholders into a unified digital loop:
1. **Accident Victims & Bystanders**
2. **108 EMS Ambulance Dispatch & Paramedic Crews**
3. **Hospital Emergency Trauma Departments (ED / ER)**
4. **Central State Emergency Command Dispatchers**

---

## 🚀 Key Features & Capabilities

### 1. Smart Emergency Incident Questionnaire
- Intuitive, mobile-first responsive reporting form completable in under 45 seconds.
- Rapid capture of caller info, incident category, consciousness (**AVPU Scale**), respiration pattern, active arterial bleeding, and suspected anatomical injuries.
- **Voice-to-Text Dictation** using Web Speech API (supports Hindi and English speech).
- **GPS Auto-detection & Interactive Map**: Automatically locks browser coordinates with click-and-drag pin correction on OpenStreetMap.

### 2. Smart Patient Priority Matrix (Preliminary Triage)
- Deterministic clinical assessment engine categorizing incidents into:
  - 🔴 **RED (Critical)**: Immediate resuscitation & Advanced Life Support (ALS) dispatched.
  - 🟡 **YELLOW (Urgent)**: Prompt clinical stabilization and immobilization.
  - 🟢 **GREEN (Lower Urgency)**: Stable vitals; standard evaluation.
- **Safety Safeguard**: Never automatically downgrades a patient on missing questionnaire answers. Clearly identified as preliminary informational organization.

### 3. AI Emergency Assistant with SBAR Formulation
- Conversational emergency triage interface capable of organizing unstructured descriptions.
- Automatically constructs standardized **SBAR** (*Situation, Background, Assessment, Recommendation*) clinical handover notes.
- **100% Offline Medical Intelligence Fallback**: Built-in deterministic rules engine operates instantly without requiring external paid API keys.
- Optional Google Gemini API integration when `VITE_GEMINI_API_KEY` is supplied in `.env`.

### 4. Ambulance Personnel Console (108 EMS)
- Live incoming dispatch queue with vehicle telemetry (Call Sign: Eagle-1 ALS).
- Interactive status transitions: `Received` ➔ `Accepted` ➔ `En Route` ➔ `Arrived at Scene` ➔ `Patient Transporting` ➔ `Completed`.
- **Ambulance Equipment Recommender**: Intelligent checklist tailoring gear (Defibrillator, Arterial Tourniquet, Cervical Collar, Ventilator) to reported symptoms.
- One-click trigger for destination hospital pre-alerts.

### 5. Hospital ER Trauma Bay Pre-Alert Console
- Eliminates emergency room admission surprise by providing advance notification.
- Real-time ETA countdown, inbound ambulance telemetry, and clinical SBAR handover summary.
- **Trauma Bay Readiness Checklist**: Allows charge nurses to confirm bay clearance, cross-match blood reserves (O-negative), and alert on-call surgeons.

### 6. Central Command & Coordination Hub (Admin)
- System-wide analytics: total incidents, priority distribution, ambulance fleet utilization, and hospital bed counts.
- Filterable, searchable emergency incident database with one-click **CSV Export**.

### 7. Interactive OpenStreetMap Route Optimization
- Embedded Leaflet map rendering the three-point corridor:
  `Ambulance Base Station` ➔ `Incident Ground` ➔ `Receiving Trauma ER`.
- Route distance (km), estimated travel times (mins), and planned smart-city green corridor integration notes.

### 8. Bilingual First-Aid Guidance with Voice Playback
- Medically reviewed emergency protocols for: CPR, Choking (Heimlich), Severe Bleeding & Tourniquets, Burns, Stroke (B.E. F.A.S.T.), Fractures, and Snakebites.
- Instant language toggle (**English & हिंदी**).
- Hands-free text-to-speech audio readout.

---

## 🎬 9-Step Faculty Evaluation Demonstration Flow
JIVAN SETU includes a built-in interactive presentation wizard at `/demo` to help you present the project to your college professors:

| Step | Persona | Action Demonstrated |
| :---: | :--- | :--- |
| **1** | Bystander | Submits incident report near Safdarjung Flyover with head injury & bleeding. |
| **2** | Gateway | Generates unique Incident ID (`JS-2026-9041`) and writes to local database. |
| **3** | Triage Engine | Classifies patient as **RED (Critical)** and recommends ALS Defibrillator & Tourniquet. |
| **4** | Ambulance Crew | Eagle-1 ALS unit receives the dispatch telemetry on vehicle console. |
| **5** | Paramedic | Reviews critical warning signs and accepts the assignment. |
| **6** | Driver | Advances status to **En Route**; live route countdown starts (ETA ~ 4 mins). |
| **7** | Hospital ER | AIIMS Apex Trauma console sounds advance pre-alert chime with SBAR summary. |
| **8** | ER Nurse | Acknowledges alert, clears Trauma Bay 1, and reserves 2 units O-negative blood. |
| **9** | Paramedic & ER | Stretcher arrives at hospital; handover is confirmed and case marked completed. |

---

## 🛠️ Technology Stack
- **Frontend Framework**: React 18 with TypeScript 5.7
- **Bundler & Dev Server**: Vite 6.1
- **Styling**: Tailwind CSS 3.4 with custom Healthcare Navy & Emergency Red palette
- **Icons**: Lucide React
- **Geospatial & Mapping**: Leaflet 1.9 & OpenStreetMap (No proprietary billing or API keys required)
- **Voice Capabilities**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)
- **State & Database**: Reactive LocalStorage Storage Service with cross-tab custom event dispatchers

---

## 💻 Local Setup & Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher (tested on Node v24).
- npm (Node Package Manager).

### 1. Clone & Navigate to Project Directory
```bash
cd "c:\Users\shiva\OneDrive\Documents\New folder"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
The terminal will display:
```
  VITE v6.1.0  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Build for Production
To test production bundling and type checks:
```bash
npm run build
```

---

## 🔐 Medical Safety & Academic Disclaimer
> **IMPORTANT:** JIVAN SETU is an academic engineering capstone prototype designed to model data coordination between emergency actors. In any real-world life-threatening emergency in India, always dial **112** (All Emergencies) or **108** (Medical Ambulance) immediately.
> 
> The preliminary patient priority feature is an organizational aid and does not substitute for certified clinical triage, doctor examination, or approved institutional medical protocols.
