export interface FirstAidItem {
  id: string;
  category: string;
  titleEn: string;
  titleHi: string;
  iconName: string;
  summaryEn: string;
  summaryHi: string;
  immediateStepsEn: string[];
  immediateStepsHi: string[];
  whatToAvoidEn: string[];
  whatToAvoidHi: string[];
  whenToCall112En: string[];
  whenToCall112Hi: string[];
  isCritical: boolean;
}

export const FIRST_AID_PROTOCOLS: FirstAidItem[] = [
  {
    id: 'cpr',
    category: 'Cardiovascular',
    titleEn: 'Adult CPR (Cardiopulmonary Resuscitation)',
    titleHi: 'सीपीआर (जीवनरक्षक छाती दबाना)',
    iconName: 'HeartPulse',
    summaryEn: 'Immediate hands-only chest compressions for an unresponsive person who is not breathing normally.',
    summaryHi: 'अचेत और सांस न ले रहे व्यक्ति के लिए तुरंत केवल हाथों से छाती दबाने की विधि।',
    isCritical: true,
    immediateStepsEn: [
      'Call emergency 112 immediately or instruct a bystander to call.',
      'Place patient flat on a firm, hard surface.',
      'Place heel of one hand in the center of the chest; interlock other hand on top.',
      'Push hard and fast: 100 to 120 compressions per minute (to the beat of "Stayin Alive"), at least 2 inches (5 cm) deep.',
      'Allow the chest to recoil fully between each compression.',
      'If an AED is available, turn it on immediately and follow voice prompts.'
    ],
    immediateStepsHi: [
      'तुरंत 112 पर कॉल करें या किसी को तुरंत कॉल करने को कहें।',
      'मरीज को सख्त और समतल जमीन पर सीधा लिटाएं।',
      'छाती के बीच में अपनी एक हथेली रखें और दूसरी हथेली से उंगलियां फंसाएं।',
      'छाती को जोर से और तेजी से दबाएं: 100 से 120 बार प्रति मिनट, कम से कम 2 इंच गहरा।',
      'हर दबाव के बाद छाती को वापस अपनी जगह आने दें।',
      'यदि एईडी (AED) मशीन मिले तो चालू कर निर्देशों का पालन करें।'
    ],
    whatToAvoidEn: [
      'Do not interrupt compressions for more than 10 seconds.',
      'Do not perform rescue breaths if untrained; focus on high-quality continuous chest compressions.',
      'Do not place hands on ribs, neck, or lower abdomen.'
    ],
    whatToAvoidHi: [
      '10 सेकंड से अधिक समय तक दबाव रोकना नहीं चाहिए।',
      'यदि प्रशिक्षित नहीं हैं तो मुंह से सांस देने में समय व्यर्थ न करें, लगातार छाती दबाएं।',
      'पसलियों या पेट के निचले हिस्से पर दबाव न डालें।'
    ],
    whenToCall112En: [
      'Patient is completely unresponsive to shoulder shaking or shouting.',
      'Patient is gasping irregularly or not breathing at all.'
    ],
    whenToCall112Hi: [
      'मरीज हिलाने या आवाज देने पर कोई प्रतिक्रिया नहीं दे रहा है।',
      'मरीज की सांस रुक गई है या वह अजीब तरह से हांफ रहा है।'
    ]
  },
  {
    id: 'severe-bleeding',
    category: 'Trauma',
    titleEn: 'Severe Bleeding & Hemorrhage Control',
    titleHi: 'गंभीर रक्तस्राव एवं खून रोकना',
    iconName: 'Droplet',
    summaryEn: 'Direct pressure and elevation to prevent life-threatening hemorrhagic shock.',
    summaryHi: 'खून की अत्यधिक कमी और शॉक से बचाने के लिए सीधा दबाव और प्राथमिक उपचार।',
    isCritical: true,
    immediateStepsEn: [
      'Ensure scene is safe; wear disposable gloves if available.',
      'Apply firm, continuous direct pressure over the bleeding wound using a clean cloth or sterile gauze.',
      'If bleeding does not stop, press harder and add more cloth without removing the original layer.',
      'If bleeding from a limb is arterial/spurting and life-threatening, apply a certified commercial tourniquet 2-3 inches above the wound (never over a joint).',
      'Keep patient warm with a blanket and calm while keeping the wounded limb elevated if no fracture is suspected.'
    ],
    immediateStepsHi: [
      'सुनिश्चित करें कि जगह सुरक्षित है; यदि संभव हो तो दस्ताने पहनें।',
      'घाव पर साफ कपड़े या पट्टी से दोनों हाथों से लगातार तेज दबाव बनाएं।',
      'यदि खून बहना न रुके, तो कपड़ा हटाए बिना ऊपर से और कपड़ा रखकर जोर से दबाएं।',
      'यदि हाथ या पैर से खून की धार फूट रही हो, तो घाव से 2-3 इंच ऊपर टूर्निकेट (Tourniquet) या मजबूत पट्टी बांधें।',
      'मरीज को कंबल से ढककर गर्म रखें और शांत रहने में मदद करें।'
    ],
    whatToAvoidEn: [
      'Do NOT remove embedded objects (knives, glass shards); stabilize around them.',
      'Do NOT remove soaked dressings; always layer additional dressings on top.',
      'Do NOT use thin wire, cords, or shoelaces as tourniquets.'
    ],
    whatToAvoidHi: [
      'घाव में घुसी हुई किसी नुकीली चीज या कांच को खुद से न निकालें; उसके चारों ओर सहारा दें।',
      'खून से भीगे कपड़े को कभी न हटाएं, उसके ऊपर और कपड़ा जोड़ते जाएं।',
      'पतले तार या जूते के फीते से घाव को न बांधें।'
    ],
    whenToCall112En: [
      'Blood is spurting from the wound in rhythm with heartbeat.',
      'Bleeding does not slow after 5 minutes of continuous firm pressure.',
      'Patient feels cold, clammy, dizzy, or loses consciousness.'
    ],
    whenToCall112Hi: [
      'खून फुहारे की तरह बह रहा हो।',
      '5 मिनट लगातार दबाने पर भी खून न रुके।',
      'मरीज की त्वचा ठंडी व पीली पड़ रही हो या चक्कर खाकर बेहोश हो रहा हो।'
    ]
  },
  {
    id: 'choking',
    category: 'Airway',
    titleEn: 'Choking (Heimlich Maneuver)',
    titleHi: 'गले में कुछ अटकना (हेमलिच प्रक्रिया)',
    iconName: 'AlertTriangle',
    summaryEn: 'Abdominal thrusts for conscious victims experiencing severe airway obstruction.',
    summaryHi: 'सांस की नली में कुछ अटक जाने पर पेट पर दिए जाने वाले जीवनरक्षक झटके।',
    isCritical: true,
    immediateStepsEn: [
      'Ask the person: "Are you choking? Can you speak?" If they can cough loudly, encourage them to keep coughing.',
      'If they cannot speak, breathe, or make sound, stand behind them.',
      'Wrap your arms around their waist and lean them slightly forward.',
      'Make a fist with one hand and place the thumb side just above their navel and below the ribs.',
      'Grasp your fist with your other hand and deliver quick, upward and inward abdominal thrusts.',
      'Repeat until the foreign object is dislodged or the person becomes unresponsive (if unresponsive, begin CPR immediately).'
    ],
    immediateStepsHi: [
      'व्यक्ति से पूछें: "क्या आप बोल पा रहे हैं?" यदि वे खांस पा रहे हैं, तो खांसने दें।',
      'यदि वे बोलने, सांस लेने या खांसने में असमर्थ हैं, तो तुरंत उनके पीछे खड़े हों।',
      'अपनी बाहें उनकी कमर के चारों ओर लपेटें और उन्हें थोड़ा आगे झुकाएं।',
      'एक हाथ की मुट्ठी बनाएं और नाभि से थोड़ा ऊपर, पसलियों के नीचे रखें।',
      'दूसरे हाथ से मुट्ठी को पकड़ें और अंदर तथा ऊपर की ओर तेजी से झटके दें।',
      'जब तक अटकी वस्तु बाहर न निकल जाए तब तक दोहराएं।'
    ],
    whatToAvoidEn: [
      'Do NOT perform abdominal thrusts on infants under 1 year (use alternating back slaps and chest thrusts).',
      'Do NOT blindly sweep the mouth with your fingers if you cannot clearly see the object.'
    ],
    whatToAvoidHi: [
      '1 वर्ष से छोटे शिशु पर पेट के झटके न आजमाएं (उनकी पीठ पर हल्की थपकी दें)।',
      'मुंह में उंगली डालकर बिना देखे वस्तु निकालने की कोशिश न करें।'
    ],
    whenToCall112En: [
      'Person turns blue, gray, or loses consciousness.',
      'Foreign object remains lodged after multiple thrust cycles.'
    ],
    whenToCall112Hi: [
      'व्यक्ति के होंठ नीले पड़ने लगें या वह बेहोश हो जाए।',
      'प्रयासों के बाद भी फंसी वस्तु बाहर न निकले।'
    ]
  },
  {
    id: 'burns',
    category: 'Trauma',
    titleEn: 'Thermal & Chemical Burns',
    titleHi: 'जलने और झुलसने पर प्राथमिक उपचार',
    iconName: 'Flame',
    summaryEn: 'Cool water irrigation to stop tissue destruction without causing hypothermia.',
    summaryHi: 'त्वचा को और अधिक जलने से रोकने के लिए सामान्य ठंडे पानी से धोना।',
    isCritical: false,
    immediateStepsEn: [
      'Remove patient from the heat source and ensure scene safety.',
      'Immediately cool the burn under cool running tap water for at least 10 to 20 minutes.',
      'Gently remove rings, watches, belts, or tight clothing around the burned area before swelling starts.',
      'Cover loosely with a clean, dry, sterile non-adherent dressing or clean plastic cling wrap.',
      'Keep the patient warm to prevent systemic shock.'
    ],
    immediateStepsHi: [
      'मरीज को आग या गर्मी के स्रोत से तुरंत दूर हटाएं।',
      'जले हुए स्थान पर कम से कम 10 से 20 मिनट तक नल का सामान्य ठंडा बहता पानी डालें।',
      'सूजन आने से पहले अंगूठी, घड़ी और तंग कपड़े सावधानी से उतार दें।',
      'जले हिस्से को साफ, सूखे कपड़े या प्लास्टिक रैप से ढीला ढकें।',
      'मरीज को शॉक से बचाने के लिए गर्म रखें।'
    ],
    whatToAvoidEn: [
      'Do NOT apply ice or ice water directly to burns (causes severe tissue necrosis).',
      'Do NOT apply butter, toothpaste, cooking oil, or turmeric powders to open burns.',
      'Do NOT pop or puncture intact blisters.'
    ],
    whatToAvoidHi: [
      'जले पर कभी भी बर्फ न लगाएं (इससे त्वचा की कोशिकाएं मर जाती हैं)।',
      'टूथपेस्ट, तेल, मक्खन या हल्दी का लेप खुले जले घाव पर न लगाएं।',
      'जले हुए फफोले को कभी भी फोड़ें नहीं।'
    ],
    whenToCall112En: [
      'Burn involves face, hands, joints, groin, or major surface area.',
      'Burn is caused by chemicals, high-voltage electricity, or explosion.',
      'Skin appears charred black, leathery, or white.'
    ],
    whenToCall112Hi: [
      'चेहरा, हाथ, जोड़ या संवेदनशील अंग जल गए हों।',
      'बिजली के करंट या केमिकल से जला हो।',
      'त्वचा काली या चमड़े जैसी कठोर दिखने लगी हो।'
    ]
  },
  {
    id: 'stroke',
    category: 'Neurological',
    titleEn: 'Stroke Recognition (B.E. F.A.S.T.)',
    titleHi: 'स्ट्रोक / लकवा पहचान (B.E. F.A.S.T. नियम)',
    iconName: 'Brain',
    summaryEn: 'Rapid identification of cerebral ischemia symptoms where every minute saves brain cells.',
    summaryHi: 'ब्रेन स्ट्रोक के लक्षणों की त्वरित पहचान - समय पर अस्पताल पहुंचना जीवन बचाता है।',
    isCritical: true,
    immediateStepsEn: [
      'B - Balance: Sudden loss of balance, dizziness, or coordination.',
      'E - Eyes: Sudden blurriness, double vision, or loss of sight in one/both eyes.',
      'F - Face: Ask person to smile. Does one side of the face droop?',
      'A - Arms: Ask person to raise both arms. Does one arm drift downward?',
      'S - Speech: Ask person to repeat a simple sentence. Is speech slurred or strange?',
      'T - Time: Note the exact time symptoms started and call 112 immediately.'
    ],
    immediateStepsHi: [
      'B (संतुलन): अचानक चक्कर आना या चलने में संतुलन खोना।',
      'E (आंखें): एक या दोनों आंखों से धुंधला दिखना।',
      'F (चेहरा): मरीज को मुस्कुराने कहें; क्या चेहरे का एक तरफ का हिस्सा लटक रहा है?',
      'A (हाथ): दोनों हाथ ऊपर उठाने कहें; क्या एक हाथ नीचे गिर रहा है?',
      'S (आवाज): कोई साधारण वाक्य बोलने कहें; क्या आवाज लड़खड़ा रही है?',
      'T (समय): तुरंत लक्षण दिखने का समय नोट करें और 112 पर फोन करें।'
    ],
    whatToAvoidEn: [
      'Do NOT give the patient any food, water, or oral medications (choking risk due to dysphagia).',
      'Do NOT give aspirin unless specifically instructed by an emergency physician (stroke may be hemorrhagic).'
    ],
    whatToAvoidHi: [
      'मरीज को खाने या पीने के लिए पानी तक न दें (गले में अटकने का खतरा)।',
      'डॉक्टर की सलाह के बिना कोई दवा या एस्पिरिन न खिलाएं।'
    ],
    whenToCall112En: [
      'Any single sign of the B.E. F.A.S.T. protocol is present.',
      'Sudden severe headache with no known cause ("thunderclap headache").'
    ],
    whenToCall112Hi: [
      'चेहरा टेढ़ा होना, हाथ में कमजोरी या आवाज लड़खड़ाने का कोई भी लक्षण दिखे।',
      'अचानक बिजली के झटके जैसा असहनीय सिरदर्द हो।'
    ]
  },
  {
    id: 'fractures',
    category: 'Orthopedic',
    titleEn: 'Bone Fractures & Spinal Protection',
    titleHi: 'हड्डी टूटना और रीढ़ की हड्डी की सुरक्षा',
    iconName: 'ShieldAlert',
    summaryEn: 'Immobilization and splinting techniques to prevent neurovascular damage.',
    summaryHi: 'अंग को हिलने-डुलने से रोकना और नसों को नुकसान से बचाने के लिए सहारा देना।',
    isCritical: false,
    immediateStepsEn: [
      'Keep the injured limb completely still and supported in the position found.',
      'If spinal injury is suspected (high-speed accident, fall from height), DO NOT move the head or neck unless in imminent physical danger.',
      'Immobilize the joints above and below the suspected fracture using a rigid object (cardboard, rolled magazine, splint) padded with cloth.',
      'Check circulation (fingers/toes warm, pink, and feeling present) past the fracture site.',
      'Apply an ice pack wrapped in a cloth to reduce swelling (max 15 mins at a time).'
    ],
    immediateStepsHi: [
      'चोट लगे अंग को जिस स्थिति में है उसी स्थिति में स्थिर रखें और सहारा दें।',
      'यदि रीढ़ या गर्दन में चोट का अंदेशा हो, तो गर्दन को बिल्कुल न हिलाएं।',
      'टूटे हिस्से के ऊपर और नीचे के जोड़ों को कार्डबोर्ड या तख्त से सहारा देकर कपड़े से बांधें।',
      'उंगलियों को छूकर जांचें कि वे ठंडी या नीली तो नहीं पड़ रही हैं।',
      'सूजन कम करने के लिए कपड़े में बर्फ लपेटकर 15 मिनट के लिए लगाएं।'
    ],
    whatToAvoidEn: [
      'Do NOT attempt to push protruding bone back beneath the skin.',
      'Do NOT attempt to straighten or realign an angulated limb.',
      'Do NOT move a patient suspected of a spinal fracture without specialized spinal boards.'
    ],
    whatToAvoidHi: [
      'बाहर निकली हुई हड्डी को अंदर धकेलने की कोशिश कभी न करें।',
      'टेढ़े हुए हाथ या पैर को सीधा करने के लिए न खींचें।',
      'रीढ़ की चोट वाले मरीज को अकेले या बिना विशेषज्ञ बोर्ड के न उठाएं।'
    ],
    whenToCall112En: [
      'Bone has pierced through the skin (Open / Compound fracture).',
      'Limb is cold, numb, or turning pale/blue.',
      'Suspected fracture of pelvis, thigh (femur), neck, or back.'
    ],
    whenToCall112Hi: [
      'हड्डी त्वचा फाड़कर बाहर आ गई हो।',
      'हाथ या पैर सुन्न हो गया हो और नाड़ी न मिल रही हो।',
      'जांघ, कूल्हे, रीढ़ या गर्दन में फ्रैक्चर का शक हो।'
    ]
  },
  {
    id: 'snakebite',
    category: 'Toxicology',
    titleEn: 'Venomous Snakebite Protocol',
    titleHi: 'सांप काटने पर प्राथमिक चिकित्सा',
    iconName: 'Zap',
    summaryEn: 'Calm immobilization and rapid antivenom transport; DO NOT cut or suck venom.',
    summaryHi: 'मरीज को शांत रखना और अंग को स्थिर रखकर तुरंत एंटी-वेनम अस्पताल ले जाना।',
    isCritical: true,
    immediateStepsEn: [
      'Move safely away from the snake. DO NOT attempt to capture or kill it.',
      'Keep the victim calm and strictly seated/resting (exercise accelerates venom spread).',
      'Remove rings, bracelets, and tight footwear from the affected limb before swelling begins.',
      'Immobilize the bitten limb using a splint at heart level.',
      'Transport immediately to a hospital with Anti-Snake Venom (ASV) availability.'
    ],
    immediateStepsHi: [
      'सांप से सुरक्षित दूरी बनाएं, उसे पकड़ने या मारने की कोशिश न करें।',
      'मरीज को शांत रखें और बिल्कुल हिलने-डुलने न दें।',
      'सूजन आने से पहले कंगन, अंगूठी या जूते तुरंत उतार दें।',
      'डसे हुए हाथ या पैर को दिल के स्तर पर रखकर खपच्ची से सहारा दें।',
      'तुरंत उस नजदीकी अस्पताल ले जाएं जहां एंटी-वेनम (ASV) उपलब्ध हो।'
    ],
    whatToAvoidEn: [
      'Do NOT cut the bite wound with razors or blades.',
      'Do NOT attempt to suck out the venom by mouth or mechanical suction.',
      'Do NOT apply ice, potassium permanganate, or electric shocks.',
      'Do NOT tie an overly tight arterial tourniquet.'
    ],
    whatToAvoidHi: [
      'घाव पर चीरा या ब्लेड कभी न लगाएं।',
      'मुंह से जहर चूसने की कोशिश बिल्कुल न करें।',
      'बर्फ, बिजली के झटके या जड़ी-बूटी का लेप न लगाएं।',
      'खून का दौरा पूरी तरह रोकने वाला बहुत तंग तार या रस्सी न बांधें।'
    ],
    whenToCall112En: [
      'Fang puncture marks are visible with swelling, severe pain, or bleeding.',
      'Victim reports drooping eyelids, difficulty swallowing, or breathing distress.'
    ],
    whenToCall112Hi: [
      'सांप के दांतों के निशान, तेज दर्द या सूजन दिखाई दे।',
      'पलकें झुकने लगें, लार टपकने लगे या सांस लेने में तकलीफ हो।'
    ]
  }
];
