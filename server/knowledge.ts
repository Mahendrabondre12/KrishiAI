export interface CropKnowledge {
  name: string;
  scientificName: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';
  durationDays: number;
  stages: {
    stageName: string;
    dayRange: [number, number];
    waterRequirement: 'Low' | 'Moderate' | 'Critical' | 'High';
    criticalAction: string;
    vulnerablePests: string[];
    fertilizerFocus: string;
  }[];
  optimalTempRange: [number, number]; // in Celsius
  soilPreference: string[];
  recommendedNpkRatio: string; // e.g. "120:60:40 kg/ha"
  commonDiseases: {
    name: string;
    symptoms: string[];
    causes: string;
    organicRemedy: string;
    chemicalRemedy: string;
    dangerLevel: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  }[];
  irrigationTips: string;
  harvestIndicators: string;
}

export const AGRONOMIC_KNOWLEDGE: Record<string, CropKnowledge> = {
  Wheat: {
    name: "Wheat",
    scientificName: "Triticum aestivum",
    season: "Rabi",
    durationDays: 120,
    optimalTempRange: [15, 25],
    soilPreference: ["Alluvial", "Clay Loam", "Loamy"],
    recommendedNpkRatio: "120:60:40 kg/ha",
    stages: [
      {
        stageName: "Crown Root Initiation (CRI)",
        dayRange: [20, 25],
        waterRequirement: "Critical",
        criticalAction: "First irrigation is mandatory at 21 days after sowing (CRI stage) for root anchoring.",
        vulnerablePests: ["Termites", "Armyworm"],
        fertilizerFocus: "Top dressing with 1/3rd Nitrogen (Urea)."
      },
      {
        stageName: "Tillering / Vegetative",
        dayRange: [40, 45],
        waterRequirement: "High",
        criticalAction: "Second irrigation. Ensure weed-free field.",
        vulnerablePests: ["Aphids", "Brown Mite"],
        fertilizerFocus: "Second split of Nitrogen application."
      },
      {
        stageName: "Jointing & Booting",
        dayRange: [60, 65],
        waterRequirement: "Critical",
        criticalAction: "Third irrigation. Monitor for yellow rust pustules on leaves.",
        vulnerablePests: ["Yellow Rust", "Stem Borer"],
        fertilizerFocus: "Micronutrient spray (Zinc sulfate 0.5% + Urea 2%)."
      },
      {
        stageName: "Flowering & Anthesis",
        dayRange: [80, 85],
        waterRequirement: "Critical",
        criticalAction: "Avoid water stress. Do not spray chemicals during peak midday bee activity.",
        vulnerablePests: ["Karnal Bunt", "Head Blight"],
        fertilizerFocus: "Potassium nitrate (13:0:45) foliar spray 1% to boost grain size."
      },
      {
        stageName: "Milking & Dough / Grain Filling",
        dayRange: [100, 105],
        waterRequirement: "Moderate",
        criticalAction: "Light irrigation if hot dry winds blow. Avoid lodging (excess water during windy days).",
        vulnerablePests: ["Grain Aphids", "Ear-cockle"],
        fertilizerFocus: "No soil fertilizer. Foliar 0:0:50 if grain filling is sluggish."
      },
      {
        stageName: "Ripening & Maturity",
        dayRange: [115, 125],
        waterRequirement: "Low",
        criticalAction: "Stop all irrigation 10-14 days before harvest to allow grains to dry to 12% moisture.",
        vulnerablePests: ["Storage Weevils (prepare bins)"],
        fertilizerFocus: "None."
      }
    ],
    commonDiseases: [
      {
        name: "Yellow / Stripe Rust (Puccinia striiformis)",
        symptoms: ["Yellow-orange pustules arranged in linear stripes on upper leaf surface", "Chlorotic striping", "Powdery yellow spores rubbing onto fingers"],
        causes: "Cool (10-15°C) and humid/foggy weather with dew formation.",
        organicRemedy: "Spray Cow urine 10% fermented with neem extract or Trichoderma viride.",
        chemicalRemedy: "Propiconazole 25% EC @ 1ml/liter water (Tilt/Bumper) at first sign of pustules.",
        dangerLevel: "Severe"
      },
      {
        name: "Leaf Blight / Spot (Bipolaris sorokiniana)",
        symptoms: ["Oval, brownish-black lesions with yellow halos on leaves", "Premature drying of foliage"],
        causes: "High humidity (>80%) and temperatures between 20-28°C.",
        organicRemedy: "Foliar spray of Pseudomonas fluorescens @ 5g/liter.",
        chemicalRemedy: "Mancozeb 75% WP @ 2.5g/liter or Azoxystrobin @ 1ml/liter.",
        dangerLevel: "Moderate"
      }
    ],
    irrigationTips: "Wheat requires 4 to 6 irrigations depending on soil type. The CRI stage (21 DAS) and Flowering stage are absolute must-water stages.",
    harvestIndicators: "Grains become hard, cannot be crushed with fingernails, straw turns golden yellow, moisture is ~12-14%."
  },
  "Rice / Paddy": {
    name: "Rice / Paddy",
    scientificName: "Oryza sativa",
    season: "Kharif",
    durationDays: 135,
    optimalTempRange: [22, 32],
    soilPreference: ["Clay", "Clay Loam", "Alluvial"],
    recommendedNpkRatio: "120:40:40 kg/ha",
    stages: [
      {
        stageName: "Nursery & Transplanting",
        dayRange: [1, 25],
        waterRequirement: "High",
        criticalAction: "Maintain shallow 2-3 cm standing water. Transplant 2-3 seedlings per hill.",
        vulnerablePests: ["Thrips", "Caseworm"],
        fertilizerFocus: "Basal DAP 100 kg + MOP 30 kg + Zinc Sulphate 25 kg/ha."
      },
      {
        stageName: "Tillering / Vegetative",
        dayRange: [30, 50],
        waterRequirement: "High",
        criticalAction: "Maintain 3-5 cm water. Alternate wetting and drying (AWD) can save 25% water without yield loss.",
        vulnerablePests: ["Yellow Stem Borer", "Leaf Folder"],
        fertilizerFocus: "Top dress Urea 35 kg/ha with neem coating."
      },
      {
        stageName: "Panicle Initiation & Booting",
        dayRange: [65, 80],
        waterRequirement: "Critical",
        criticalAction: "Continuous 5 cm water depth. Critical stage: drought will cause chaffy grains.",
        vulnerablePests: ["Blast Disease", "Sheath Blight", "Brown Planthopper (BPH)"],
        fertilizerFocus: "Apply remaining 1/3rd Urea + Potash (MOP) 20 kg/ha."
      },
      {
        stageName: "Flowering & Heading",
        dayRange: [85, 95],
        waterRequirement: "Critical",
        criticalAction: "Ensure standing water. Avoid chemical spray during 9 AM to 12 PM pollination window.",
        vulnerablePests: ["Gandhi Bug", "False Smut"],
        fertilizerFocus: "Foliar 13:0:45 @ 10g/L."
      },
      {
        stageName: "Grain Filling (Milk & Dough)",
        dayRange: [100, 115],
        waterRequirement: "Moderate",
        criticalAction: "Intermittent irrigation. Keep soil saturated, avoid standing water.",
        vulnerablePests: ["Rice Bug", "Rats"],
        fertilizerFocus: "None."
      },
      {
        stageName: "Maturity & Harvest",
        dayRange: [120, 135],
        waterRequirement: "Low",
        criticalAction: "Drain out all water 10 days before harvest to facilitate uniform grain ripening and mechanical combine movement.",
        vulnerablePests: ["Birds", "Rodents"],
        fertilizerFocus: "None."
      }
    ],
    commonDiseases: [
      {
        name: "Rice Blast (Pyricularia oryzae)",
        symptoms: ["Spindle-shaped or eye-shaped lesions with grey center and brown borders on leaves", "Neck blast turns panicle neck black and breaks"],
        causes: "High nitrogen fertilization, high relative humidity (>90%), dew, and cloudy days.",
        organicRemedy: "Spray garlic-chilli extract 5% or Trichoderma harzianum @ 10g/L.",
        chemicalRemedy: "Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L.",
        dangerLevel: "Critical"
      },
      {
        name: "Brown Planthopper (Nilaparvata lugens)",
        symptoms: ["Hopper burn (circular patches of drying and dying plants)", "Sooty mold at base of tillers"],
        causes: "Excessive dense planting, heavy urea usage, continuous standing water.",
        organicRemedy: "Drain water from field for 3-4 days. Spray 5% Neem Seed Kernel Extract (NSKE).",
        chemicalRemedy: "Pymetrozine 50% WDG @ 0.6g/L or Triflumezopyrim 10% SC @ 0.5ml/L directed at stem base.",
        dangerLevel: "Severe"
      }
    ],
    irrigationTips: "Adopting AWD (Alternate Wetting and Drying) after tillering cuts methane emissions and prevents root rotting while saving water.",
    harvestIndicators: "85% of panicles turn golden straw color, upper grains are hard, grain moisture between 18-20%."
  },
  Cotton: {
    name: "Cotton",
    scientificName: "Gossypium hirsutum",
    season: "Kharif",
    durationDays: 160,
    optimalTempRange: [21, 35],
    soilPreference: ["Black Soil (Regur)", "Deep Alluvial", "Sandy Loam with good drainage"],
    recommendedNpkRatio: "100:50:50 kg/ha",
    stages: [
      {
        stageName: "Seedling & Vegetative",
        dayRange: [1, 35],
        waterRequirement: "Low",
        criticalAction: "Avoid waterlogging; cotton roots need aeration. Thin to 1 vigorous seedling per hill.",
        vulnerablePests: ["Jassids", "Thrips", "Whitefly"],
        fertilizerFocus: "Basal DAP + Potash + Top dress Urea 25%."
      },
      {
        stageName: "Square Formation (Buds)",
        dayRange: [40, 60],
        waterRequirement: "Moderate",
        criticalAction: "First critical irrigation. Monitor yellow sticky traps for sucking pests.",
        vulnerablePests: ["Spotted Bollworm", "Mirid Bugs"],
        fertilizerFocus: "Urea 35 kg + Magnesium Sulfate 10 kg/ha."
      },
      {
        stageName: "Flowering & Boll Development",
        dayRange: [70, 110],
        waterRequirement: "Critical",
        criticalAction: "Water stress here causes square/boll shedding. Keep soil consistently moist.",
        vulnerablePests: ["Pink Bollworm (PBW)", "American Bollworm", "Whitefly"],
        fertilizerFocus: "Foliar spray of 19:19:19 @ 10g/L + Planofix (NAA) 1ml/4.5L to prevent flower drop."
      },
      {
        stageName: "Boll Bursting & Picking",
        dayRange: [120, 160],
        waterRequirement: "Low",
        criticalAction: "Stop irrigation as bolls start opening to prevent lint discoloration and fungal rotting.",
        vulnerablePests: ["Dusk Cotton Bug", "Red Cotton Bug"],
        fertilizerFocus: "Foliar 0:0:50 (Potassium sulphate) 1% for fiber strength."
      }
    ],
    commonDiseases: [
      {
        name: "Pink Bollworm (Pectinophora gossypiella)",
        symptoms: ["Rosetted flowers (petals twisted into rosette)", "Exit holes on bolls with excreta", "Damaged lint and seeds"],
        causes: "Continuous late-season cotton cropping, warm humid nights.",
        organicRemedy: "Install 5-8 Pheromone traps (PBR) per acre. Release Trichogramma egg parasitoids.",
        chemicalRemedy: "Profenophos 50% EC @ 2ml/L or Chlorantraniliprole 18.5% SC @ 0.3ml/L.",
        dangerLevel: "Severe"
      },
      {
        name: "Cotton Leaf Curl Virus (CLCuV)",
        symptoms: ["Upward/downward leaf curling", "Thickening of main leaf veins", "Cup-like enations on undersides"],
        causes: "Transmitted by Whitefly (Bemisia tabaci).",
        organicRemedy: "Yellow sticky traps 15/acre. Spray 10,000 ppm Neem oil @ 3ml/L.",
        chemicalRemedy: "Control vector whitefly with Diafenthiuron 50% WP @ 1.2g/L or Dinotefuran 20% SG @ 0.4g/L.",
        dangerLevel: "Severe"
      }
    ],
    irrigationTips: "Drip irrigation gives 40% higher boll yield and prevents collar rot. Never let standing water remain for >12 hours.",
    harvestIndicators: "Bolls split open wide exposing clean fluffy white lint. Pick in dry sunny morning after dew evaporates."
  },
  Soybean: {
    name: "Soybean",
    scientificName: "Glycine max",
    season: "Kharif",
    durationDays: 95,
    optimalTempRange: [20, 30],
    soilPreference: ["Black Soil", "Well-drained Loam", "Clay Loam"],
    recommendedNpkRatio: "30:60:40 kg/ha + 20 kg Sulfur",
    stages: [
      {
        stageName: "Germination & Vegetative",
        dayRange: [1, 30],
        waterRequirement: "Moderate",
        criticalAction: "Keep field weed-free during first 30 days (critical weed competition period).",
        vulnerablePests: ["Girdle Beetle", "Stem Fly"],
        fertilizerFocus: "Rhizobium + PSB seed inoculation. Basal Single Super Phosphate (SSP) for Sulfur."
      },
      {
        stageName: "Flowering & Pod Initiation",
        dayRange: [35, 55],
        waterRequirement: "Critical",
        criticalAction: "Moisture stress at flowering causes severe blossom drop. Irrigate if dry spell exceeds 10 days.",
        vulnerablePests: ["Semilooper", "Spodoptera litura (Tobacco Caterpillar)"],
        fertilizerFocus: "Foliar spray Boron (20%) @ 1g/L + 0:52:34 @ 10g/L."
      },
      {
        stageName: "Pod Development & Grain Filling",
        dayRange: [60, 80],
        waterRequirement: "Critical",
        criticalAction: "Ensure adequate moisture for bold seed filling. Monitor for pod borers.",
        vulnerablePests: ["Pod Borer", "Anthracnose"],
        fertilizerFocus: "Potassium nitrate 13:0:45 @ 10g/L."
      },
      {
        stageName: "Maturity",
        dayRange: [85, 95],
        waterRequirement: "Low",
        criticalAction: "Harvest when 95% of leaves shed and pods make rattling sound when shaken.",
        vulnerablePests: ["Pod Shattering"],
        fertilizerFocus: "None."
      }
    ],
    commonDiseases: [
      {
        name: "Yellow Mosaic Virus (YMV)",
        symptoms: ["Alternating yellow and green patches on leaves", "Stunted growth with fewer pods"],
        causes: "Transmitted by Whitefly vector during warm humid conditions.",
        organicRemedy: "Rogue out infected plants immediately. Spray Neem seed kernel extract 5%.",
        chemicalRemedy: "Control vector with Thiamethoxam 25% WG @ 0.3g/L or Acetamiprid 20% SP @ 0.2g/L.",
        dangerLevel: "Severe"
      }
    ],
    irrigationTips: "Soybean is rainfed in central India, but 1-2 supplemental irrigations at flowering & pod filling increase yield by 35-50%.",
    harvestIndicators: "Pods turn yellowish-brown, leaves drop, seed moisture 13-15%."
  },
  Tomato: {
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    season: "Zaid",
    durationDays: 110,
    optimalTempRange: [18, 28],
    soilPreference: ["Sandy Loam", "Well-drained Loam", "Red Soil"],
    recommendedNpkRatio: "150:100:120 kg/ha",
    stages: [
      {
        stageName: "Transplanting & Vegetative",
        dayRange: [1, 30],
        waterRequirement: "Moderate",
        criticalAction: "Stake plants with bamboo sticks/trellis to keep foliage off ground and prevent soil-borne rots.",
        vulnerablePests: ["Leaf Miner", "Flea Beetles"],
        fertilizerFocus: "19:19:19 fertigation 3 kg/acre weekly."
      },
      {
        stageName: "Flowering & Fruit Set",
        dayRange: [35, 60],
        waterRequirement: "High",
        criticalAction: "Avoid fluctuating water levels to prevent Blossom End Rot (Calcium deficiency).",
        vulnerablePests: ["Fruit Borer (Helicoverpa armigera)", "Whitefly"],
        fertilizerFocus: "Calcium Nitrate 3 kg/acre + Boron 250g/acre."
      },
      {
        stageName: "Fruiting & Harvesting",
        dayRange: [65, 110],
        waterRequirement: "Moderate",
        criticalAction: "Harvest at 'Breaker stage' (pink tinge) for distant markets, or 'Full Red' for local sale.",
        vulnerablePests: ["Early Blight", "Late Blight", "Bacterial Wilt"],
        fertilizerFocus: "0:0:50 (SOP) fertigation for fruit firmness and sweetness (Brix)."
      }
    ],
    commonDiseases: [
      {
        name: "Early Blight (Alternaria solani)",
        symptoms: ["Target-like concentric rings on older bottom leaves", "Yellowing around dark spots", "Leaf drop"],
        causes: "Warm humid temperatures (24-30°C) with intermittent rain or overhead irrigation.",
        organicRemedy: "Copper Oxychloride (COC) @ 2.5g/L or Bacillus subtilis @ 5g/L.",
        chemicalRemedy: "Mancozeb 75% WP @ 2.5g/L or Difenoconazole 25% EC @ 1ml/L.",
        dangerLevel: "Moderate"
      },
      {
        name: "Late Blight (Phytophthora infestans)",
        symptoms: ["Water-soaked dark lesions on leaves and stems with white fuzzy fungal growth underneath", "Firm brown rotten patches on green fruit"],
        causes: "Cool (<20°C), damp, cloudy, foggy weather with continuous leaf wetness.",
        organicRemedy: "Bordeaux mixture 1% or Trichoderma viride.",
        chemicalRemedy: "Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2.5g/L or Cymoxanil + Mancozeb.",
        dangerLevel: "Critical"
      }
    ],
    irrigationTips: "Never use overhead sprinkler irrigation as wet leaves trigger early and late blights. Use drip irrigation directly at root zone.",
    harvestIndicators: "Fruit turns from mature green to breaker (turning) stage, firm skin, glossy surface."
  },
  Sugarcane: {
    name: "Sugarcane",
    scientificName: "Saccharum officinarum",
    season: "Perennial",
    durationDays: 360,
    optimalTempRange: [20, 35],
    soilPreference: ["Deep Alluvial", "Medium-Heavy Clay Loam", "Black Soil"],
    recommendedNpkRatio: "250:100:120 kg/ha",
    stages: [
      {
        stageName: "Germination & Tillering",
        dayRange: [1, 120],
        waterRequirement: "Moderate",
        criticalAction: "Intercultural weeding and earthing up at 90 days. Treat setts with carbendazim before planting.",
        vulnerablePests: ["Early Shoot Borer", "Termites"],
        fertilizerFocus: "Basal DAP + 1/3rd Urea top dress."
      },
      {
        stageName: "Grand Growth Period",
        dayRange: [121, 270],
        waterRequirement: "Critical",
        criticalAction: "Peak cane elongation. High water need; irrigate every 8-10 days in summer.",
        vulnerablePests: ["Top Borer", "Internode Borer", "Pyrilla"],
        fertilizerFocus: "Apply remaining Urea + Potash. Trash mulching in inter-rows to conserve water."
      },
      {
        stageName: "Maturation & Ripening",
        dayRange: [271, 360],
        waterRequirement: "Low",
        criticalAction: "Sucrose accumulation. Gradually taper off irrigation. Stop 20 days prior to crushing.",
        vulnerablePests: ["Red Rot", "Smut"],
        fertilizerFocus: "No nitrogen in late stage as it promotes vegetative growth and reduces sugar recovery %."
      }
    ],
    commonDiseases: [
      {
        name: "Red Rot (Colletotrichum falcatum)",
        symptoms: ["Third or fourth leaf from top turns yellow and dries up", "Splitting cane reveals red internal tissue with transverse white patches and alcoholic odor"],
        causes: "Infected seed setts, waterlogged alkaline soils.",
        organicRemedy: "Use disease-free certified tissue culture setts. Crop rotation with paddy.",
        chemicalRemedy: "Sett treatment with Carbendazim 0.1% for 15 minutes before planting.",
        dangerLevel: "Critical"
      }
    ],
    irrigationTips: "Drip fertigation in sugarcane saves 50% water and boosts cane tonnage from 40 to 75 tonnes/acre.",
    harvestIndicators: "Lower leaves dry, brix reading on hand refractometer reaches 18-20%, metallic ringing sound when cane is tapped."
  }
};
