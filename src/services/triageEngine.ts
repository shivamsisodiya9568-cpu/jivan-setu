import { 
  BleedingLevel, 
  BreathingStatus, 
  ConsciousnessLevel, 
  EmergencyType, 
  EquipmentRecommendation, 
  PriorityLevel, 
  SbarSummary 
} from '../types/emergency';

export interface TriageInput {
  emergencyType: EmergencyType;
  consciousness: ConsciousnessLevel;
  breathing: BreathingStatus;
  severeBleeding: BleedingLevel;
  suspectedInjuries: string[];
  victimCount: number;
  patientAge?: number;
  patientGender?: 'Male' | 'Female' | 'Other' | 'Unknown' | string;
  additionalNotes?: string;
  patientName?: string;
}

export interface TriageEvaluation {
  priority: PriorityLevel;
  priorityScore: number;
  priorityReason: string;
  warningSigns: string[];
  clinicalFlags: string[];
  recommendedEquipment: EquipmentRecommendation[];
  sbarSummary: SbarSummary;
}

/**
 * JIVAN SETU Preliminary Assessment & Information Organization Engine
 * 
 * Safety Notice: This is an academic assistance system designed to pre-organize
 * critical data for responders. It does NOT replace clinical judgement, formal ATLS / START triage,
 * or physician oversight.
 */
export function evaluateEmergencyTriage(input: TriageInput): TriageEvaluation {
  const warningSigns: string[] = [];
  const clinicalFlags: string[] = [];
  let isRed = false;
  let isYellow = false;
  let score = 0;

  // 1. Airway & Breathing Evaluation
  if (input.breathing === 'Not Breathing') {
    isRed = true;
    score += 50;
    warningSigns.push('Critical: Patient is not breathing (Apnea)');
    clinicalFlags.push('IMMEDIATE_CPR_REQUIRED');
  } else if (input.breathing === 'Gasping / Struggling') {
    isRed = true;
    score += 35;
    warningSigns.push('Critical: Severe respiratory distress / Agonal breathing');
    clinicalFlags.push('AIRWAY_COMPROMISE_RISK');
  } else if (input.breathing === 'Rapid Shallow') {
    isYellow = true;
    score += 20;
    warningSigns.push('Urgent: Tachypnea / Rapid shallow respiration');
    clinicalFlags.push('RESPIRATORY_MONITORING');
  }

  // 2. Consciousness (AVPU scale)
  if (input.consciousness === 'Unresponsive / Unconscious') {
    isRed = true;
    score += 45;
    warningSigns.push('Critical: Complete loss of consciousness (GCS ≤ 8 equivalent)');
    clinicalFlags.push('COMA_UNRESPONSIVE');
  } else if (input.consciousness === 'Responds to Pain Only') {
    isRed = true;
    score += 35;
    warningSigns.push('Critical: Depressed consciousness, only responsive to painful stimuli');
    clinicalFlags.push('SEVERE_NEUROLOGIC_DEPRESSION');
  } else if (input.consciousness === 'Responds to Voice') {
    isYellow = true;
    score += 20;
    warningSigns.push('Urgent: Altered mental status / Lethargy');
    clinicalFlags.push('ALTERED_CONSCIOUSNESS');
  }

  // 3. Bleeding & Hemorrhage Control
  if (input.severeBleeding === 'Severe - Spurting / Uncontrolled') {
    isRed = true;
    score += 45;
    warningSigns.push('Critical: Arterial / High-volume uncontrolled hemorrhage');
    clinicalFlags.push('MASSIVE_HEMORRHAGE_SHOCK_RISK');
  } else if (input.severeBleeding === 'Moderate - Continuous Flow') {
    isYellow = true;
    score += 25;
    warningSigns.push('Urgent: Moderate continuous bleeding requiring pressure dressing');
    clinicalFlags.push('HEMOSTASIS_REQUIRED');
  }

  // 4. Emergency Type Risk Stratification
  if (input.emergencyType === 'Cardiac Arrest / Chest Pain') {
    score += 30;
    if (input.consciousness !== 'Alert & Responsive' || input.breathing !== 'Normal') {
      isRed = true;
      warningSigns.push('Critical: Acute Coronary Syndrome / Suspected Sudden Cardiac Arrest');
      clinicalFlags.push('DEFIBRILLATOR_PRIORITY');
    } else {
      isYellow = true;
      warningSigns.push('Urgent: Suspected Acute Myocardial Infarction');
    }
  } else if (input.emergencyType === 'Road Accident') {
    score += 20;
    if (input.victimCount > 1) {
      score += 15;
      warningSigns.push(`Multiple casualties reported (${input.victimCount} victims)`);
      clinicalFlags.push('MASS_CASUALTY_INCIDENT');
    }
  } else if (input.emergencyType === 'Stroke / Neurological') {
    isYellow = true;
    score += 25;
    warningSigns.push('Urgent: Possible Cerebrovascular Accident (Stroke Window)');
    clinicalFlags.push('STROKE_CODE_HYPERACUTE');
  } else if (input.emergencyType === 'Severe Burn') {
    score += 25;
    if (input.breathing !== 'Normal') {
      isRed = true;
      warningSigns.push('Critical: Inhalation injury / Severe thermal trauma');
      clinicalFlags.push('AIRWAY_BURNS');
    } else {
      isYellow = true;
    }
  }

  // 5. Suspected Injuries
  if (input.suspectedInjuries.includes('Head Trauma')) {
    score += 20;
    clinicalFlags.push('CERVICAL_SPINE_RESTRICTION');
    if (input.consciousness !== 'Alert & Responsive') {
      isRed = true;
      warningSigns.push('Critical: Traumatic Brain Injury with altered sensorium');
    } else {
      isYellow = true;
    }
  }
  if (input.suspectedInjuries.includes('Spinal / Neck Injury')) {
    isYellow = true;
    score += 20;
    clinicalFlags.push('FULL_SPINAL_IMMOBILIZATION');
    warningSigns.push('Urgent: Suspected vertebral / spinal cord injury');
  }
  if (input.suspectedInjuries.includes('Chest Trauma / Flail Chest')) {
    isRed = true;
    score += 30;
    warningSigns.push('Critical: Blunt thoracic trauma / Pneumothorax risk');
    clinicalFlags.push('THORACIC_COMPROMISE');
  }

  // Final Priority Classification
  // Medical safety rule: Never downgrade if critical red flags exist
  let finalPriority: PriorityLevel = 'GREEN';
  let priorityReason = 'No immediate life-threatening flags reported. Continuous monitoring recommended.';

  if (isRed || score >= 45) {
    finalPriority = 'RED';
    priorityReason = 'CRITICAL: Severe compromise of Airway, Breathing, Circulation, or Central Nervous System detected. Immediate advanced life support dispatch required.';
  } else if (isYellow || score >= 20) {
    finalPriority = 'YELLOW';
    priorityReason = 'URGENT: Serious condition requiring prompt clinical intervention, immobilization, or continuous monitoring to prevent deterioration.';
  } else {
    finalPriority = 'GREEN';
    priorityReason = 'LOWER URGENCY: Patient is conscious and breathing normally without active severe hemorrhage. Clinical evaluation is still advised.';
  }

  // Equipment recommendations based on flags
  const recommendedEquipment: EquipmentRecommendation[] = [
    {
      name: 'Oxygen Delivery System & High-Flow Mask',
      category: 'AIRWAY',
      priority: finalPriority === 'RED' ? 'CRITICAL' : 'ESSENTIAL',
      rationale: 'Provide supplemental oxygenation for hypoxemia or respiratory distress.'
    },
    {
      name: 'Vital Signs Multi-parameter Monitor',
      category: 'DIAGNOSTIC',
      priority: 'ESSENTIAL',
      rationale: 'Continuous assessment of SpO2, NIBP, 3-Lead ECG, and heart rate.'
    }
  ];

  if (finalPriority === 'RED' || input.emergencyType === 'Cardiac Arrest / Chest Pain') {
    recommendedEquipment.unshift({
      name: 'Automated External Defibrillator (AED) / Cardiac Defibrillator',
      category: 'CIRCULATION',
      priority: 'CRITICAL',
      rationale: 'Required for immediate rhythm check and shock delivery in ventricular fibrillation/tachycardia.'
    });
    recommendedEquipment.push({
      name: 'Suction Unit & Bag-Valve-Mask (Ambu Bag)',
      category: 'AIRWAY',
      priority: 'CRITICAL',
      rationale: 'Clear airway secretions/emesis and provide positive pressure ventilation.'
    });
  }

  if (input.severeBleeding.startsWith('Severe') || input.severeBleeding.startsWith('Moderate')) {
    recommendedEquipment.push({
      name: 'Arterial Tourniquet & Hemostatic Gauze Trauma Pack',
      category: 'CIRCULATION',
      priority: 'CRITICAL',
      rationale: 'Immediate mechanical pressure and hemostasis for extremity/junctional hemorrhage.'
    });
  }

  if (input.suspectedInjuries.some(i => i.includes('Spine') || i.includes('Head') || i.includes('Neck'))) {
    recommendedEquipment.push({
      name: 'Rigid Cervical Collar & Long Spinal Board with Head Immobilizers',
      category: 'IMMOBILIZATION',
      priority: 'CRITICAL',
      rationale: 'Protect against secondary spinal cord transsection during extrication and transport.'
    });
  }

  if (input.suspectedInjuries.some(i => i.includes('Fracture'))) {
    recommendedEquipment.push({
      name: 'Vacuum Splints & Traction Splint Set',
      category: 'IMMOBILIZATION',
      priority: 'ESSENTIAL',
      rationale: 'Immobilize suspected extremity fractures to relieve pain and reduce soft-tissue/vascular trauma.'
    });
  }

  // SBAR Clinical Summary Formulation
  const ptIdentifier = input.patientName || `Victim (${input.patientAge ? input.patientAge + 'y' : 'Age Unknown'}, ${input.patientGender || 'Unspecified'})`;
  const sbarSummary: SbarSummary = {
    situation: `Emergency dispatch for ${input.emergencyType} involving ${input.victimCount} casualty(ies). Patient identified as ${ptIdentifier}. Preliminary Priority: ${finalPriority}.`,
    background: `Reported incident at ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}. Suspected conditions: ${input.suspectedInjuries.join(', ') || 'General trauma/acute illness'}. ${input.additionalNotes ? `Reporter note: "${input.additionalNotes}"` : ''}`,
    assessment: `Consciousness: ${input.consciousness}. Respiration: ${input.breathing}. Hemorrhage: ${input.severeBleeding}. Primary warning signs: ${warningSigns.length > 0 ? warningSigns.join('; ') : 'Vitals stable on report'}.`,
    recommendation: `Dispatch ${finalPriority === 'RED' ? 'Advanced Life Support (ALS) Unit with paramedic team' : 'Basic Life Support (BLS) Unit'}. Prepare: ${recommendedEquipment.slice(0, 3).map(e => e.name).join(', ')}. Notify receiving trauma facility for priority bay availability.`
  };

  return {
    priority: finalPriority,
    priorityScore: score,
    priorityReason,
    warningSigns,
    clinicalFlags,
    recommendedEquipment,
    sbarSummary
  };
}
