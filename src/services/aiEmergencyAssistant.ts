import { FIRST_AID_PROTOCOLS } from '../data/firstAidData';
import { EmergencyType } from '../types/emergency';

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedFirstAidId?: string;
  detectedEmergencyType?: EmergencyType;
  priorityHint?: 'RED' | 'YELLOW' | 'GREEN';
  suggestedQuestions?: string[];
  isSimulation?: boolean;
}

export const AI_SYSTEM_DISCLAIMER = 
  "⚠️ JIVAN SETU AI Assistant is an academic prototype for emergency information organization and immediate first-aid guidance. It does not replace emergency clinical triage or medical diagnosis. For life-threatening emergencies, IMMEDIATELY call 112.";

export async function processAssistantQuery(
  userQuery: string,
  history: AssistantMessage[],
  language: 'en' | 'hi' = 'en'
): Promise<AssistantMessage> {
  const q = userQuery.toLowerCase().trim();

  // 1. Check if user configured Gemini API Key in environment
  const geminiApiKey = typeof import.meta !== 'undefined' ? (import.meta as any)?.env?.VITE_GEMINI_API_KEY : undefined;

  if (geminiApiKey && geminiApiKey.trim() !== '') {
    try {
      const response = await callGeminiApi(userQuery, history, language, geminiApiKey);
      if (response) return response;
    } catch {
      // Fallback gracefully to offline intelligence engine
    }
  }

  // 2. High-speed Offline Clinical Intelligence Engine
  return generateOfflineClinicalResponse(q, language);
}

function generateOfflineClinicalResponse(query: string, language: 'en' | 'hi'): AssistantMessage {
  const isHi = language === 'hi';
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Detection Patterns
  if (query.includes('cpr') || query.includes('not breathing') || query.includes('unconscious') || query.includes('सांस नहीं') || query.includes('बेहोश') || query.includes('धड़कन')) {
    const protocol = FIRST_AID_PROTOCOLS.find(p => p.id === 'cpr');
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: now,
      isSimulation: true,
      priorityHint: 'RED',
      detectedEmergencyType: 'Cardiac Arrest / Chest Pain',
      suggestedFirstAidId: 'cpr',
      text: isHi
        ? `🚨 **अत्यंत गंभीर आपातकाल: मरीज सांस नहीं ले रहा है / अचेत है!**\n\n1. तुरंत राष्ट्रीय आपातकालीन नंबर **112 पर कॉल करें**!\n2. **तुरंत सीपीआर शुरू करें:** मरीज को सख्त जमीन पर सीधा लिटाएं। छाती के बीच में दोनों हाथों से 100-120 बार प्रति मिनट की दर से जोर से दबाएं (कम से कम 2 इंच गहरा)।\n3. जब तक एम्बुलेंस या डॉक्टर न पहुंचे, छाती दबाना बंद न करें।`
        : `🚨 **CRITICAL EMERGENCY: Unresponsive & Not Breathing Normally!**\n\n1. **DIAL 112 IMMEDIATELY** or assign someone nearby to call.\n2. **START HANDS-ONLY CPR NOW:** Lay patient flat on a hard floor. Place heel of hand on the center of the breastbone. Push hard and fast (100–120 bpm, ~2 inches deep).\n3. Do not stop chest compressions until ambulance paramedics take over.`,
      suggestedQuestions: isHi 
        ? ['एम्बुलेंस बुलाएं', 'खून बहने का प्राथमिक उपचार', 'अस्पताल अलर्ट कैसे भेजें?'] 
        : ['Dispatch Ambulance Now', 'Severe Bleeding Guide', 'How to alert ER Hospital?']
    };
  }

  if (query.includes('bleed') || query.includes('blood') || query.includes('कट गया') || query.includes('खून') || query.includes('घाव')) {
    const protocol = FIRST_AID_PROTOCOLS.find(p => p.id === 'severe-bleeding');
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: now,
      isSimulation: true,
      priorityHint: 'RED',
      detectedEmergencyType: 'Severe Trauma & Bleeding',
      suggestedFirstAidId: 'severe-bleeding',
      text: isHi
        ? `🩸 **गंभीर रक्तस्राव नियंत्रण प्रोटोकॉल:**\n\n1. **घाव पर सीधा तेज दबाव:** किसी साफ कपड़े या पट्टी से दोनों हाथों से लगातार जोर से दबाएं।\n2. यदि खून बहुत तेजी से बह रहा है और रुक नहीं रहा, तो कपड़ा हटाए बिना ऊपर से और कपड़ा रखकर दबाएं।\n3. हाथ या पैर में भारी खून बहने पर घाव से 2-3 इंच ऊपर टूर्निकेट या मजबूत पट्टी बांधें।\n4. मरीज को जमीन पर लिटाकर रखें और गर्म रखें ताकि शॉक से बचाया जा सके।`
        : `🩸 **SEVERE BLEEDING PROTOCOL:**\n\n1. **Apply Firm Direct Pressure:** Press down hard directly on the bleeding site with a clean cloth or sterile pad.\n2. If cloth becomes soaked, **DO NOT remove it**—add more cloths on top and press even harder.\n3. For life-threatening limb hemorrhage that does not stop, apply a tourniquet 2–3 inches above the wound.\n4. Keep patient lying down and warm with a jacket/blanket to combat hypovolemic shock.`,
      suggestedQuestions: isHi
        ? ['टूर्निकेट कैसे लगाएं?', 'एम्बुलेंस ट्रैक करें', '112 पर कॉल करें']
        : ['How to apply Tourniquet?', 'Track Ambulance', 'Call Emergency 112']
    };
  }

  if (query.includes('chok') || query.includes('गले में') || query.includes('अटक') || query.includes('दम घुट')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: now,
      isSimulation: true,
      priorityHint: 'RED',
      detectedEmergencyType: 'Respiratory Distress / Choking',
      suggestedFirstAidId: 'choking',
      text: isHi
        ? `⚠️ **दम घुटने / सांस नली अवरोध (हेमलिच प्रक्रिया):**\n\n1. व्यक्ति के पीछे खड़े होकर अपनी बाहें उनकी कमर के चारों ओर लपेटें।\n2. एक मुट्ठी बनाएं, नाभि से ऊपर और पसलियों के नीचे रखें।\n3. अंदर और ऊपर की दिशा में तेजी से झटके दें।\n4. यदि मरीज अचेत हो जाए, तो तुरंत जमीन पर लिटाकर 112 पर कॉल करें और सीपीआर शुरू करें।`
        : `⚠️ **CHOKING EMERGENCY (Heimlich Maneuver):**\n\n1. Stand behind the victim and wrap your arms around their waist.\n2. Form a fist with thumb side just above their navel and below ribcage.\n3. Grasp your fist and perform quick, upward and inward abdominal thrusts.\n4. If the person loses consciousness, lower them gently to the floor, call 112, and begin CPR.`,
      suggestedQuestions: isHi
        ? ['शिशु के लिए क्या करें?', 'एम्बुलेंस सहायता']
        : ['What to do for an infant?', 'Emergency Dispatch']
    };
  }

  if (query.includes('chest pain') || query.includes('heart attack') || query.includes('छाती में दर्द') || query.includes('दौरा')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: now,
      isSimulation: true,
      priorityHint: 'RED',
      detectedEmergencyType: 'Cardiac Arrest / Chest Pain',
      suggestedFirstAidId: 'cpr',
      text: isHi
        ? `💔 **संदिग्ध दिल का दौरा (Heart Attack):**\n\n1. मरीज को तुरंत आराम से बैठाएं (पीठ को सहारा दें, जैसे दीवार या तकिया)।\n2. तंग कपड़े ढीले करें (शर्ट के बटन, टाई, बेल्ट)।\n3. मरीज को शांत रखें; किसी भी प्रकार का परिश्रम या चलना बिल्कुल रोकें।\n4. यदि मरीज अचेत हो जाए और सांस रुक जाए, तो बिना देरी तुरंत सीपीआर (छाती दबाना) शुरू करें!`
        : `💔 **SUSPECTED HEART ATTACK / ACUTE CORONARY SYNDROME:**\n\n1. Have the person sit down and rest immediately in a comfortable supported position (e.g., against a wall with knees bent).\n2. Loosen tight collars, ties, or belts to ease breathing.\n3. Keep them completely calm; prohibit any walking or physical effort.\n4. If the person becomes unresponsive or stops breathing, immediately initiate continuous CPR chest compressions!`,
      suggestedQuestions: isHi
        ? ['अस्पताल अलर्ट भेजें', 'एम्बुलेंस बुलाएं', 'सीपीआर कैसे करें?']
        : ['Send Hospital Pre-Alert', 'Call 112 Ambulance', 'How to perform CPR?']
    };
  }

  if (query.includes('stroke') || query.includes('लकवा') || query.includes('मुंह टेढ़ा') || query.includes('कमजोरी')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: now,
      isSimulation: true,
      priorityHint: 'RED',
      detectedEmergencyType: 'Stroke / Neurological',
      suggestedFirstAidId: 'stroke',
      text: isHi
        ? `🧠 **स्ट्रोक (लकवा) चेतावनी - B.E. F.A.S.T. नियम:**\n\n• **B (Balance):** अचानक चलने में लड़खड़ाहट\n• **F (Face):** क्या मुस्कुराने पर चेहरे का एक हिस्सा लटक रहा है?\n• **A (Arms):** क्या एक हाथ उठाने पर नीचे गिर रहा है?\n• **S (Speech):** क्या आवाज लड़खड़ा रही है?\n• **T (Time):** समय नोट करें और तुरंत अस्पताल ले जाएं। मरीज को कुछ भी खाने-पीने न दें!`
        : `🧠 **ACUTE STROKE ALERT - B.E. F.A.S.T. RULE:**\n\n• **Face:** Does one side of the face droop when smiling?\n• **Arms:** Can they raise both arms equally?\n• **Speech:** Is their speech slurred or strange?\n• **Time:** Note the exact symptom onset time and rush to a CT-equipped stroke hospital immediately.\n• **DO NOT give food, water, or aspirin.**`,
      suggestedQuestions: isHi
        ? ['नजदीकी अस्पताल देखें', 'एम्बुलेंस बुक करें']
        : ['Locate Stroke Hospital', 'Request Emergency Unit']
    };
  }

  if (query.includes('burn') || query.includes('जल गया') || query.includes('आग')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: now,
      isSimulation: false,
      priorityHint: 'YELLOW',
      detectedEmergencyType: 'Severe Burn',
      suggestedFirstAidId: 'burns',
      text: isHi
        ? `🔥 **जलने पर प्राथमिक उपचार:**\n\n1. जले स्थान पर कम से कम 10-20 मिनट तक नल का सामान्य ठंडा पानी डालें।\n2. कभी भी बर्फ या बर्फ का पानी न लगाएं।\n3. कोई टूथपेस्ट, तेल, हल्दी या घरेलू लेप न लगाएं।\n4. फफोले न फोड़ें और साफ कपड़े से ढीला ढकें।`
        : `🔥 **BURN FIRST-AID PROTOCOL:**\n\n1. Cool the burn under running cool tap water for 10–20 minutes.\n2. **DO NOT** use ice or ice-cold water.\n3. **DO NOT** apply toothpaste, oils, or turmeric powder.\n4. Do not puncture blisters. Cover loosely with a clean, sterile cloth.`,
      suggestedQuestions: isHi ? ['एम्बुलेंस सहायता', '112 डायल करें'] : ['Emergency Transport', 'Dial 112']
    };
  }

  // General Emergency Assistant Response
  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    timestamp: now,
    isSimulation: true,
    text: isHi
      ? `नमस्ते। मैं **जीवन सेतु (JIVAN SETU)** का स्मार्ट आपातकालीन सहायक हूँ।\n\nकृपया बताएं कि क्या स्थिति है:\n• क्या मरीज सांस ले रहा है?\n• क्या वह होश में है?\n• क्या अत्यधिक खून बह रहा है?\n\nआप नीचे दिए गए विकल्पों में से भी चुन सकते हैं या आपातकालीन सहायता हेतु तुरंत **112** पर संपर्क कर सकते हैं।`
      : `Hello. I am the **JIVAN SETU** AI Emergency Assistant.\n\nPlease describe the emergency quickly:\n• Is the person conscious and responsive?\n• Are they breathing normally?\n• Is there severe uncontrolled bleeding?\n\nYou can also click any of the emergency quick-actions below, or dial **112** immediately for official dispatch.`,
    suggestedQuestions: isHi
      ? ['मरीज सांस नहीं ले रहा', 'सड़क दुर्घटना एवं खून बहना', 'छाती में तेज दर्द', 'गले में कुछ अटक गया']
      : ['Person is not breathing', 'Road accident with bleeding', 'Severe chest pain', 'Person is choking']
  };
}

async function callGeminiApi(
  query: string,
  _history: AssistantMessage[],
  language: 'en' | 'hi',
  apiKey: string
): Promise<AssistantMessage | null> {
  const isHi = language === 'hi';
  const systemPrompt = `You are the JIVAN SETU Emergency Assistant for an Indian medical response system.
CRITICAL SAFETY RULES:
1. Always prioritize immediate 112 emergency calls for red flags.
2. Provide concise, step-by-step first-aid guidance only.
3. NEVER prescribe medications or diagnose diseases.
4. Keep answers brief, bulleted, and calm.
Language: ${isHi ? 'Hindi' : 'English'}.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Emergency Query: ${query}` }]
        }
      ]
    })
  });

  if (!response.ok) return null;
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text,
    isSimulation: false
  };
}
