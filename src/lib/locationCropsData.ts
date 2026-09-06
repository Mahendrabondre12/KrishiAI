import { MostHarvestedCrop } from '../types';

export interface StateHarvestProfile {
  state: string;
  majorAgroZone: string;
  agroZoneCode: string;
  dominantSoil: string;
  climateType: string;
  annualRainfallMm: string;
  totalCultivatedAreaMillionHa: string;
  weatherVulnerability: string[];
  endemicDiseases: string[];
  sampleCropDoctorCases: Array<{
    id: string;
    crop: string;
    disease: string;
    symptoms: string;
    image: string;
    color: string;
  }>;
  topHarvestedCrops: MostHarvestedCrop[];
  districtSpecificCrops: Record<string, MostHarvestedCrop[]>;
}

export const STATE_HARVEST_CATALOG: Record<string, StateHarvestProfile> = {
  Maharashtra: {
    state: 'Maharashtra',
    majorAgroZone: 'Western Plateau and Hills Zone',
    agroZoneCode: 'ICAR Zone IX',
    dominantSoil: 'Black Cotton Soil (Regur / Vertisols)',
    climateType: 'Semi-Arid Tropical with 700-1100mm Monsoon',
    annualRainfallMm: '750 - 1150 mm',
    totalCultivatedAreaMillionHa: '17.4 Mha',
    weatherVulnerability: ['Late September dry spells', 'Pre-harvest October unseasonal rain', 'Pink bollworm humidity surges'],
    endemicDiseases: ['Soybean Yellow Mosaic Virus', 'Soybean Rust', 'Cotton Pink Bollworm', 'Sugarcane Red Rot', 'Onion Purple Blotch'],
    sampleCropDoctorCases: [
      {
        id: 'mh_soy_rust',
        crop: 'Soybean',
        disease: 'Soybean Rust (Phakopsora pachyrhizi)',
        symptoms: 'Small tan/brown polygonal necrotic pustules on lower leaf canopy during humid spells.',
        image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?w=600&auto=format&fit=crop&q=80',
        color: 'border-amber-400'
      },
      {
        id: 'mh_cotton_curl',
        crop: 'Cotton',
        disease: 'Cotton Leaf Curl Virus & Whitefly',
        symptoms: 'Upward curling and vein thickening of terminal leaves with stunted boll formation.',
        image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80',
        color: 'border-indigo-400'
      },
      {
        id: 'mh_onion_blotch',
        crop: 'Onion',
        disease: 'Purple Blotch (Alternaria porri)',
        symptoms: 'Water-soaked sunken elliptical lesions with purple-brown centers on onion foliage.',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
        color: 'border-purple-400'
      },
      {
        id: 'mh_grapes_mildew',
        crop: 'Grapes',
        disease: 'Downy Mildew (Plasmopara viticola)',
        symptoms: 'Yellow oil-spot lesions on upper leaf surface with white cottony down on underside.',
        image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80',
        color: 'border-emerald-400'
      }
    ],
    topHarvestedCrops: [
      {
        id: 'mh_soybean',
        cropName: 'Soybean',
        localName: 'सोयाबीन',
        harvestRank: 1,
        typicalHarvestSeason: 'Kharif',
        durationDays: 100,
        avgYieldQuintalsPerAcre: '10 - 14 q/acre',
        profitabilityIndex: 'High (₹45k-80k/ac)',
        dominantDistricts: ['Latur', 'Nagpur', 'Amravati', 'Akola', 'Nanded', 'Yavatmal'],
        climateSoilSuitability: 'Deep Black Cotton Soil with 800-1100mm monsoon rainfall. 99% Soil Match.',
        popularVarieties: ['JS 20-98', 'Phule Sangam (KDS 726)', 'JS 335', 'NRC 127', 'MACS 1407'],
        recommendedSowingMonth: 'June - July',
        harvestMonth: 'September - October',
        marketDemand: 'Very High',
        waterRequirement: 'Moderate'
      },
      {
        id: 'mh_cotton',
        cropName: 'Cotton',
        localName: 'कापूस / कपाशी',
        harvestRank: 2,
        typicalHarvestSeason: 'Kharif',
        durationDays: 160,
        avgYieldQuintalsPerAcre: '8 - 12 q/acre',
        profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
        dominantDistricts: ['Yavatmal', 'Akola', 'Jalgaon', 'Wardha', 'Aurangabad', 'Beed'],
        climateSoilSuitability: 'Deep moisture-retentive Black Cotton soil. Highly adapted to Vidarbha & Marathwada.',
        popularVarieties: ['Phule Dhanwantari (Desi)', 'G-Cot-20', 'RCH 659 BG II', 'Kaveri Jadoo'],
        recommendedSowingMonth: 'June - July',
        harvestMonth: 'November - January',
        marketDemand: 'Very High',
        waterRequirement: 'Moderate'
      },
      {
        id: 'mh_sugarcane',
        cropName: 'Sugarcane',
        localName: 'ऊस',
        harvestRank: 3,
        typicalHarvestSeason: 'All Season',
        durationDays: 330,
        avgYieldQuintalsPerAcre: '350 - 450 q/acre',
        profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
        dominantDistricts: ['Kolhapur', 'Pune', 'Solapur', 'Sangli', 'Ahmednagar', 'Satara'],
        climateSoilSuitability: 'Perennial irrigation canals & drip systems in Western Maharashtra fertile basins.',
        popularVarieties: ['Co-86032 (Nira)', 'Co-0265 (Phule 265)', 'MS 10001', 'CoM 0265'],
        recommendedSowingMonth: 'July (Adsali) / Oct (Pre-seasonal)',
        harvestMonth: 'October - March',
        marketDemand: 'Very High',
        waterRequirement: 'High'
      },
      {
        id: 'mh_onion',
        cropName: 'Onion',
        localName: 'कांदा',
        harvestRank: 4,
        typicalHarvestSeason: 'Rabi',
        durationDays: 120,
        avgYieldQuintalsPerAcre: '120 - 160 q/acre',
        profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
        dominantDistricts: ['Nashik', 'Pune', 'Ahmednagar', 'Solapur'],
        climateSoilSuitability: 'Well-drained light-to-medium loamy soils with cool dry winter weather.',
        popularVarieties: ['Bhima Super', 'Bhima Shakti', 'Phule Samarth', 'Nashik Red'],
        recommendedSowingMonth: 'November - December',
        harvestMonth: 'March - April',
        marketDemand: 'Very High',
        waterRequirement: 'Moderate'
      },
      {
        id: 'mh_chickpea',
        cropName: 'Gram / Chickpea',
        localName: 'हरभरा / चणा',
        harvestRank: 5,
        typicalHarvestSeason: 'Rabi',
        durationDays: 105,
        avgYieldQuintalsPerAcre: '8 - 12 q/acre',
        profitabilityIndex: 'High (₹45k-80k/ac)',
        dominantDistricts: ['Latur', 'Osmanabad', 'Akola', 'Buldhana', 'Ahmednagar'],
        climateSoilSuitability: 'Residual moisture in heavy black soil after Kharif harvest.',
        popularVarieties: ['Phule Vikram', 'Vijay', 'Digvijay', 'Jaki 9218'],
        recommendedSowingMonth: 'October - November',
        harvestMonth: 'February - March',
        marketDemand: 'High',
        waterRequirement: 'Low'
      }
    ],
    districtSpecificCrops: {
      Nashik: [
        {
          id: 'nsk_grapes',
          cropName: 'Grapes',
          localName: 'द्राक्षे',
          harvestRank: 1,
          typicalHarvestSeason: 'Rabi',
          durationDays: 140,
          avgYieldQuintalsPerAcre: '100 - 140 q/acre',
          profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
          dominantDistricts: ['Nashik', 'Dindori', 'Niphad', 'Satana'],
          climateSoilSuitability: 'Grape Capital of India - well-drained volcanic slopes with mild winter sunshine.',
          popularVarieties: ['Thompson Seedless', 'Sonaka', 'Sharad Seedless', 'Crimson Seedless'],
          recommendedSowingMonth: 'Pruning: Oct',
          harvestMonth: 'February - April',
          marketDemand: 'Very High',
          waterRequirement: 'Moderate'
        }
      ],
      Kolhapur: [
        {
          id: 'klp_sugarcane',
          cropName: 'Sugarcane',
          localName: 'ऊस',
          harvestRank: 1,
          typicalHarvestSeason: 'All Season',
          durationDays: 340,
          avgYieldQuintalsPerAcre: '400 - 550 q/acre',
          profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
          dominantDistricts: ['Kolhapur', 'Kagal', 'Shirol', 'Hatkanangle'],
          climateSoilSuitability: 'Panchganga river basin rich alluvium with high solar radiation and assured canal water.',
          popularVarieties: ['Co-86032 (Nira)', 'Co-0265 (Phule 265)'],
          recommendedSowingMonth: 'July - October',
          harvestMonth: 'November - April',
          marketDemand: 'Very High',
          waterRequirement: 'High'
        }
      ]
    }
  },
  Punjab: {
    state: 'Punjab',
    majorAgroZone: 'Trans-Gangetic Plains Zone',
    agroZoneCode: 'ICAR Zone VI',
    dominantSoil: 'Fertile Alluvial Loam (Inceptisols)',
    climateType: 'Semi-Arid Subtropical with High Tube-well Canal Density',
    annualRainfallMm: '500 - 750 mm',
    totalCultivatedAreaMillionHa: '4.1 Mha',
    weatherVulnerability: ['Early spring heatwaves affecting wheat grain filling', 'Foggy humid conditions triggering Yellow Rust', 'Post-paddy stubble window'],
    endemicDiseases: ['Wheat Yellow / Stripe Rust', 'Rice Blast', 'Bacterial Leaf Blight', 'Mustard White Rust', 'Cotton Whitefly'],
    sampleCropDoctorCases: [
      {
        id: 'pb_wheat_yellow_rust',
        crop: 'Wheat',
        disease: 'Yellow / Stripe Rust (Puccinia striiformis)',
        symptoms: 'Bright yellow powdery stripes on leaves during cool humid Punjab mornings.',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
        color: 'border-amber-400'
      },
      {
        id: 'pb_rice_blast',
        crop: 'Rice / Paddy',
        disease: 'Rice Blast (Pyricularia oryzae)',
        symptoms: 'Spindle-shaped diamond lesions on leaves and neck rot on Basmati panicles.',
        image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80',
        color: 'border-emerald-400'
      },
      {
        id: 'pb_mustard_rust',
        crop: 'Mustard / Rapeseed',
        disease: 'White Rust (Albugo candida)',
        symptoms: 'White to cream-colored raised blisters on lower leaf surface and staghead malformation.',
        image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?w=600&auto=format&fit=crop&q=80',
        color: 'border-rose-400'
      },
      {
        id: 'pb_cotton_whitefly',
        crop: 'Cotton',
        disease: 'Whitefly Infestation & Sooty Mold',
        symptoms: 'Chlorotic yellowing of leaves with sticky honeydew and black fungal sooty mold.',
        image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80',
        color: 'border-indigo-400'
      }
    ],
    topHarvestedCrops: [
      {
        id: 'pb_wheat',
        cropName: 'Wheat',
        localName: 'ਕਣਕ',
        harvestRank: 1,
        typicalHarvestSeason: 'Rabi',
        durationDays: 130,
        avgYieldQuintalsPerAcre: '22 - 26 q/acre',
        profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
        dominantDistricts: ['Ludhiana', 'Bhatinda', 'Patiala', 'Sangrur', 'Amritsar', 'Jalandhar'],
        climateSoilSuitability: 'Deep alluvial loams with cool winter nights and canal/tubewell network. 100% Soil Match.',
        popularVarieties: ['PBW-826 (High Yield Champion)', 'HD-3086 (Pusa Gautami)', 'DBW-187 (Karan Vandana)', 'DBW-303', 'PBW-725'],
        recommendedSowingMonth: 'October 25 - November 15',
        harvestMonth: 'April - May',
        marketDemand: 'Very High',
        waterRequirement: 'Moderate'
      },
      {
        id: 'pb_paddy',
        cropName: 'Rice / Paddy',
        localName: 'ਝੋਨਾ / ਬਾਸਮਤੀ',
        harvestRank: 2,
        typicalHarvestSeason: 'Kharif',
        durationDays: 125,
        avgYieldQuintalsPerAcre: '28 - 34 q/acre',
        profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
        dominantDistricts: ['Ludhiana', 'Sangrur', 'Amritsar', 'Patiala', 'Kapurthala'],
        climateSoilSuitability: 'Submerged alluvial clay loam beds with high summer temperatures.',
        popularVarieties: ['PR-126 (Short Duration - 123 days)', 'Pusa Basmati 1718', 'Pusa Basmati 1509', 'PR-131'],
        recommendedSowingMonth: 'June 15 - July 10',
        harvestMonth: 'October - November',
        marketDemand: 'Very High',
        waterRequirement: 'High'
      },
      {
        id: 'pb_cotton',
        cropName: 'Cotton',
        localName: 'ਕਪਾਹ / ਨਰਮਾ',
        harvestRank: 3,
        typicalHarvestSeason: 'Kharif',
        durationDays: 155,
        avgYieldQuintalsPerAcre: '9 - 13 q/acre',
        profitabilityIndex: 'High (₹45k-80k/ac)',
        dominantDistricts: ['Bhatinda', 'Mansa', 'Fazilka', 'Sri Muktsar Sahib'],
        climateSoilSuitability: 'South-western semi-arid belt of Punjab with light-to-medium loams.',
        popularVarieties: ['PAU Bt 1', 'RCH 659', 'Bhakti Bt'],
        recommendedSowingMonth: 'April 15 - May 15',
        harvestMonth: 'October - November',
        marketDemand: 'High',
        waterRequirement: 'Moderate'
      },
      {
        id: 'pb_mustard',
        cropName: 'Mustard / Rapeseed',
        localName: 'ਸਰ੍ਹੋਂ / ਰਾਇਆ',
        harvestRank: 4,
        typicalHarvestSeason: 'Rabi',
        durationDays: 125,
        avgYieldQuintalsPerAcre: '8 - 11 q/acre',
        profitabilityIndex: 'High (₹45k-80k/ac)',
        dominantDistricts: ['Bhatinda', 'Fazilka', 'Hoshiarpur', 'Ropar'],
        climateSoilSuitability: 'Light sandy loams requiring low irrigation in winter.',
        popularVarieties: ['RLC-3', 'Giriraj', 'Pusa Mustard 30'],
        recommendedSowingMonth: 'October 1 - October 20',
        harvestMonth: 'February - March',
        marketDemand: 'High',
        waterRequirement: 'Low'
      }
    ],
    districtSpecificCrops: {}
  },
  'Madhya Pradesh': {
    state: 'Madhya Pradesh',
    majorAgroZone: 'Central Plateau and Hills Zone',
    agroZoneCode: 'ICAR Zone VIII',
    dominantSoil: 'Medium to Deep Black Soil (Malwa & Narmada Basin)',
    climateType: 'Sub-Humid Continental with 850-1200mm Rainfall',
    annualRainfallMm: '800 - 1250 mm',
    totalCultivatedAreaMillionHa: '15.2 Mha',
    weatherVulnerability: ['Dry spells during soybean pod-filling', 'Malwa unseasonal hail during wheat maturity'],
    endemicDiseases: ['Soybean Charcoal Rot', 'Girdle Beetle', 'Sharbati Wheat Rust', 'Gram Pod Borer (Helicoverpa)', 'Garlic Blight'],
    sampleCropDoctorCases: [
      {
        id: 'mp_soy_rot',
        crop: 'Soybean',
        disease: 'Charcoal Rot (Macrophomina phaseolina)',
        symptoms: 'Greyish ash-like discoloration of stem base with tiny black sclerotia.',
        image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?w=600&auto=format&fit=crop&q=80',
        color: 'border-slate-400'
      },
      {
        id: 'mp_gram_borer',
        crop: 'Gram / Chickpea',
        disease: 'Pod Borer (Helicoverpa armigera)',
        symptoms: 'Circular entrance holes on developing gram pods with larvae feeding inside.',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
        color: 'border-emerald-400'
      },
      {
        id: 'mp_garlic_blight',
        crop: 'Garlic',
        disease: 'Stemphylium Leaf Blight',
        symptoms: 'Small yellow-to-orange flecks turning into extended brown blighted patches on garlic tips.',
        image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80',
        color: 'border-amber-400'
      }
    ],
    topHarvestedCrops: [
      {
        id: 'mp_soybean',
        cropName: 'Soybean',
        localName: 'सोयाबीन (सोया प्रदेश)',
        harvestRank: 1,
        typicalHarvestSeason: 'Kharif',
        durationDays: 98,
        avgYieldQuintalsPerAcre: '11 - 15 q/acre',
        profitabilityIndex: 'High (₹45k-80k/ac)',
        dominantDistricts: ['Ujjain', 'Indore', 'Dewas', 'Sehore', 'Vidisha', 'Dhar'],
        climateSoilSuitability: 'The Soybean Bowl of India - deep moisture-holding black cotton soil.',
        popularVarieties: ['JS 20-34 (Early 88d)', 'JS 20-98', 'RVS 2001-4', 'JS 95-60', 'NRC 138'],
        recommendedSowingMonth: 'June 20 - July 10',
        harvestMonth: 'September - October',
        marketDemand: 'Very High',
        waterRequirement: 'Moderate'
      },
      {
        id: 'mp_wheat',
        cropName: 'Wheat (Sharbati & Durum)',
        localName: 'शरबती गेहूँ',
        harvestRank: 2,
        typicalHarvestSeason: 'Rabi',
        durationDays: 120,
        avgYieldQuintalsPerAcre: '18 - 24 q/acre',
        profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
        dominantDistricts: ['Sehore', 'Hoshangabad (Narmadapuram)', 'Harda', 'Vidisha', 'Raisen'],
        climateSoilSuitability: 'GI Tagged Sharbati Wheat - rainfed rich Narmada basin soils.',
        popularVarieties: ['HI-1544 (Purna)', 'HI-8759 (Pusa Tejas Durum)', 'C-306 (Sharbati)', 'GW-322', 'HI-1634'],
        recommendedSowingMonth: 'November 1 - November 25',
        harvestMonth: 'March - April',
        marketDemand: 'Very High',
        waterRequirement: 'Moderate'
      },
      {
        id: 'mp_gram',
        cropName: 'Gram / Chickpea',
        localName: 'चना (काबुली व देशी)',
        harvestRank: 3,
        typicalHarvestSeason: 'Rabi',
        durationDays: 105,
        avgYieldQuintalsPerAcre: '9 - 13 q/acre',
        profitabilityIndex: 'High (₹45k-80k/ac)',
        dominantDistricts: ['Ujjain', 'Dewas', 'Vidisha', 'Damoh', 'Sagar'],
        climateSoilSuitability: 'Black and mixed red soils with zero-till residual moisture.',
        popularVarieties: ['JG 14', 'JG 16', 'RVG 202', 'Dollar Chana (Kabuli)'],
        recommendedSowingMonth: 'October 15 - November 15',
        harvestMonth: 'February - March',
        marketDemand: 'High',
        waterRequirement: 'Low'
      },
      {
        id: 'mp_garlic',
        cropName: 'Garlic',
        localName: 'लहसुन (रियावन)',
        harvestRank: 4,
        typicalHarvestSeason: 'Rabi',
        durationDays: 130,
        avgYieldQuintalsPerAcre: '40 - 55 q/acre',
        profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
        dominantDistricts: ['Mandsaur', 'Neemuch', 'Ratlam', 'Ujjain'],
        climateSoilSuitability: 'Malwa plateau cool winter with fertile loams. GI registered Riyaawan Garlic.',
        popularVarieties: ['Riyaawan Silver Garlic (GI)', 'G-282 (Yamuna Safed 3)', 'G-1 (Yamuna Safed)'],
        recommendedSowingMonth: 'October - November',
        harvestMonth: 'March - April',
        marketDemand: 'Very High',
        waterRequirement: 'Moderate'
      }
    ],
    districtSpecificCrops: {}
  },
  Gujarat: {
    state: 'Gujarat',
    majorAgroZone: 'Gujarat Plains and Hills Zone',
    agroZoneCode: 'ICAR Zone XIII',
    dominantSoil: 'Medium Black, Sandy Loam (Goradu) & Coastal Alluvial',
    climateType: 'Arid to Semi-Arid with High Solar Radiation',
    annualRainfallMm: '600 - 900 mm',
    totalCultivatedAreaMillionHa: '9.8 Mha',
    weatherVulnerability: ['Saurashtra mid-season dry spells', 'High wind velocity during groundnut pegging', 'Late monsoon cyclonic showers'],
    endemicDiseases: ['Groundnut Tikka & Collar Rot', 'Cotton Pink Bollworm', 'Cumin / Jeera Blight & Wilt', 'Castor Semi-Looper'],
    sampleCropDoctorCases: [
      {
        id: 'gj_groundnut_tikka',
        crop: 'Groundnut / Peanut',
        disease: 'Tikka Disease (Cercospora personata)',
        symptoms: 'Dark brown circular necrotic leaf spots with yellow chlorotic rings on peanut leaves.',
        image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?w=600&auto=format&fit=crop&q=80',
        color: 'border-amber-400'
      },
      {
        id: 'gj_cotton_bollworm',
        crop: 'Cotton',
        disease: 'Pink Bollworm (Pectinophora gossypiella)',
        symptoms: 'Rosetted flowers with larvae boring into green bolls and staining lint.',
        image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80',
        color: 'border-indigo-400'
      },
      {
        id: 'gj_cumin_blight',
        crop: 'Cumin / Jeera',
        disease: 'Cumin Alternaria Blight',
        symptoms: 'Dark brown spots on leaves and stems leading to blackish burnt appearance.',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
        color: 'border-red-400'
      }
    ],
    topHarvestedCrops: [
      {
        id: 'gj_groundnut',
        cropName: 'Groundnut / Peanut',
        localName: 'મગફળી',
        harvestRank: 1,
        typicalHarvestSeason: 'Kharif',
        durationDays: 110,
        avgYieldQuintalsPerAcre: '10 - 15 q/acre',
        profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
        dominantDistricts: ['Rajkot', 'Junagadh', 'Amreli', 'Jamnagar', 'Bhavnagar'],
        climateSoilSuitability: 'Saurashtra well-drained sandy loam with warm sunny climate.',
        popularVarieties: ['GG-20 (Gujarat Groundnut 20)', 'GJG-22', 'TG 37A', 'Kadiri 6', 'G-Cot-20'],
        recommendedSowingMonth: 'June 15 - July 10',
        harvestMonth: 'October - November',
        marketDemand: 'Very High',
        waterRequirement: 'Moderate'
      },
      {
        id: 'gj_cotton',
        cropName: 'Cotton',
        localName: 'કપાસ',
        harvestRank: 2,
        typicalHarvestSeason: 'Kharif',
        durationDays: 160,
        avgYieldQuintalsPerAcre: '10 - 14 q/acre',
        profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
        dominantDistricts: ['Rajkot', 'Surendranagar', 'Ahmedabad', 'Baroda', 'Bhavnagar'],
        climateSoilSuitability: 'Deep black and medium loams under drip fertigation.',
        popularVarieties: ['G-Cot-20', 'G.Cot.Hy. 12', 'RCH 659 BG II', 'Kaveri Money Maker'],
        recommendedSowingMonth: 'June - July',
        harvestMonth: 'November - January',
        marketDemand: 'Very High',
        waterRequirement: 'Moderate'
      },
      {
        id: 'gj_cumin',
        cropName: 'Cumin / Jeera',
        localName: 'જીરું',
        harvestRank: 3,
        typicalHarvestSeason: 'Rabi',
        durationDays: 105,
        avgYieldQuintalsPerAcre: '4 - 6 q/acre',
        profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
        dominantDistricts: ['Banaskantha', 'Patan', 'Surendranagar', 'Mehsana', 'Kutch'],
        climateSoilSuitability: 'Unjha Mandi catchment - cool, dry, low-humidity winter soils.',
        popularVarieties: ['GC-4 (Gujarat Cumin 4)', 'RZ-209', 'GC-2'],
        recommendedSowingMonth: 'November 1 - November 20',
        harvestMonth: 'February - March',
        marketDemand: 'Very High',
        waterRequirement: 'Low'
      },
      {
        id: 'gj_castor',
        cropName: 'Castor Seed',
        localName: 'દિવેલા / એરંડા',
        harvestRank: 4,
        typicalHarvestSeason: 'Kharif',
        durationDays: 180,
        avgYieldQuintalsPerAcre: '12 - 16 q/acre',
        profitabilityIndex: 'High (₹45k-80k/ac)',
        dominantDistricts: ['Banaskantha', 'Mehsana', 'Sabarkantha', 'Gandhinagar'],
        climateSoilSuitability: 'Sandy loam soils with high drought resistance and high industrial oil value.',
        popularVarieties: ['GCH-7 (Gujarat Castor Hybrid 7)', 'GCH-9', 'DCH-519'],
        recommendedSowingMonth: 'July 15 - August 15',
        harvestMonth: 'December - March',
        marketDemand: 'High',
        waterRequirement: 'Low'
      }
    ],
    districtSpecificCrops: {}
  },
  Karnataka: {
    state: 'Karnataka',
    majorAgroZone: 'Southern Plateau and Hills Zone',
    agroZoneCode: 'ICAR Zone X',
    dominantSoil: 'Red Sandy Loam (Alfisols) & Medium Black Soil',
    climateType: 'Semi-Arid to Humid Tropical (Ghats & Plains)',
    annualRainfallMm: '650 - 1300 mm',
    totalCultivatedAreaMillionHa: '11.6 Mha',
    weatherVulnerability: ['Rainfall gaps during ragi tillering', 'Fall Armyworm in dry maize belts', 'Koleroga rot during Ghat monsoon'],
    endemicDiseases: ['Ragi Blast (Pyricularia)', 'Maize Fall Armyworm', 'Coffee Berry Borer & Rust', 'Arecanut Koleroga (Fruit Rot)'],
    sampleCropDoctorCases: [
      {
        id: 'ka_ragi_blast',
        crop: 'Finger Millet / Ragi',
        disease: 'Finger / Neck Blast (Pyricularia grisea)',
        symptoms: 'Spindle-shaped spots with grey centers on leaves; blackening of neck below earhead.',
        image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80',
        color: 'border-emerald-400'
      },
      {
        id: 'ka_maize_armyworm',
        crop: 'Maize / Corn',
        disease: 'Fall Armyworm (Spodoptera frugiperda)',
        symptoms: 'Shot-hole feeding marks and sawdust-like frass deep in the leaf whorl.',
        image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?w=600&auto=format&fit=crop&q=80',
        color: 'border-amber-400'
      },
      {
        id: 'ka_coffee_rust',
        crop: 'Coffee (Arabica / Robusta)',
        disease: 'Coffee Leaf Rust (Hemileia vastatrix)',
        symptoms: 'Bright orange-yellow powdery pustules on underside of coffee leaves.',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
        color: 'border-amber-500'
      }
    ],
    topHarvestedCrops: [
      {
        id: 'ka_ragi',
        cropName: 'Finger Millet / Ragi',
        localName: 'ರಾಗಿ',
        harvestRank: 1,
        typicalHarvestSeason: 'Kharif',
        durationDays: 105,
        avgYieldQuintalsPerAcre: '12 - 16 q/acre',
        profitabilityIndex: 'High (₹45k-80k/ac)',
        dominantDistricts: ['Mandya', 'Mysuru', 'Tumakuru', 'Hassan', 'Bengaluru Rural'],
        climateSoilSuitability: 'Red gravelly loam requiring minimal water; superfood nutritional grain.',
        popularVarieties: ['GPU-28', 'ML-365', 'KMR-301', 'GPU-48'],
        recommendedSowingMonth: 'July - August',
        harvestMonth: 'November - December',
        marketDemand: 'High',
        waterRequirement: 'Low'
      },
      {
        id: 'ka_maize',
        cropName: 'Maize / Corn',
        localName: 'ಮೆಕ್ಕೆಜೋಳ',
        harvestRank: 2,
        typicalHarvestSeason: 'Kharif',
        durationDays: 110,
        avgYieldQuintalsPerAcre: '26 - 32 q/acre',
        profitabilityIndex: 'High (₹45k-80k/ac)',
        dominantDistricts: ['Davanagere', 'Haveri', 'Belagavi', 'Ballari', 'Shimoga'],
        climateSoilSuitability: 'Well-drained red and medium black soils with high feed mill demand.',
        popularVarieties: ['CP 818', 'Pioneer 3396', 'NK 6240', 'DKC 9108'],
        recommendedSowingMonth: 'June - July',
        harvestMonth: 'October - November',
        marketDemand: 'Very High',
        waterRequirement: 'Moderate'
      },
      {
        id: 'ka_paddy',
        cropName: 'Rice / Paddy (Sona Masoori)',
        localName: 'ಭತ್ತ (ಸೋನಾ ಮಸೂರಿ)',
        harvestRank: 3,
        typicalHarvestSeason: 'Kharif',
        durationDays: 135,
        avgYieldQuintalsPerAcre: '24 - 30 q/acre',
        profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
        dominantDistricts: ['Raichur', 'Ballari', 'Koppal', 'Mandya', 'Shimoga'],
        climateSoilSuitability: 'Tungabhadra & Cauvery irrigation command zones.',
        popularVarieties: ['BPT-5204 (Sona Masoori)', 'Gangavathi Sona (GGV-05-01)', 'JGL-1798'],
        recommendedSowingMonth: 'July 1 - July 25',
        harvestMonth: 'November - December',
        marketDemand: 'Very High',
        waterRequirement: 'High'
      }
    ],
    districtSpecificCrops: {}
  },
  'Uttar Pradesh': {
    state: 'Uttar Pradesh',
    majorAgroZone: 'Upper & Middle Gangetic Plains',
    agroZoneCode: 'ICAR Zone V',
    dominantSoil: 'Deep Alluvial Silt Loam (Entisols / Inceptisols)',
    climateType: 'Sub-Humid Gangetic Alluvial with Continental Winters',
    annualRainfallMm: '750 - 1100 mm',
    totalCultivatedAreaMillionHa: '16.8 Mha',
    weatherVulnerability: ['Winter fog & cloudiness causing Potato Late Blight', 'Sugarcane waterlogging in Terai belt', 'Pre-monsoon heatwaves'],
    endemicDiseases: ['Sugarcane Red Rot (Colletotrichum)', 'Potato Late Blight (Phytophthora)', 'Wheat Karnal Bunt', 'Mustard Aphids'],
    sampleCropDoctorCases: [
      {
        id: 'up_sugar_redrot',
        crop: 'Sugarcane',
        disease: 'Red Rot (Colletotrichum falcatum)',
        symptoms: 'Third or fourth leaf yellowing, internal cane pith showing reddish patches with white cross-bands.',
        image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?w=600&auto=format&fit=crop&q=80',
        color: 'border-rose-400'
      },
      {
        id: 'up_potato_lateblight',
        crop: 'Potato',
        disease: 'Late Blight (Phytophthora infestans)',
        symptoms: 'Water-soaked black lesions on leaf margins with white mildew on underside during foggy winter.',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
        color: 'border-slate-500'
      },
      {
        id: 'up_wheat_karnal',
        crop: 'Wheat',
        disease: 'Karnal Bunt (Tilletia indica)',
        symptoms: 'Partial bunted grains emitting rotten-fish trimethylamine odor during harvest.',
        image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80',
        color: 'border-amber-400'
      }
    ],
    topHarvestedCrops: [
      {
        id: 'up_sugarcane',
        cropName: 'Sugarcane',
        localName: 'गन्ना',
        harvestRank: 1,
        typicalHarvestSeason: 'All Season',
        durationDays: 320,
        avgYieldQuintalsPerAcre: '320 - 420 q/acre',
        profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
        dominantDistricts: ['Meerut', 'Muzaffarnagar', 'Saharanpur', 'Lakhimpur Kheri', 'Bijnor'],
        climateSoilSuitability: 'Deep alluvium with high subsoil water table and sugar mill clusters.',
        popularVarieties: ['Co-0238 (Karan 4)', 'Co-0118', 'CoLk 94184 (Birendra)', 'Co-15023'],
        recommendedSowingMonth: 'Autumn: Oct-Nov / Spring: Feb-Mar',
        harvestMonth: 'November - April',
        marketDemand: 'Very High',
        waterRequirement: 'High'
      },
      {
        id: 'up_wheat',
        cropName: 'Wheat',
        localName: 'गेहूँ',
        harvestRank: 2,
        typicalHarvestSeason: 'Rabi',
        durationDays: 125,
        avgYieldQuintalsPerAcre: '20 - 24 q/acre',
        profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
        dominantDistricts: ['Meerut', 'Aligarh', 'Kanpur', 'Varanasi', 'Gorakhpur'],
        climateSoilSuitability: 'Deep Gangetic alluvial plains with moderate winter chills.',
        popularVarieties: ['PBW-502', 'HD-2967', 'HD-3086', 'DBW-187'],
        recommendedSowingMonth: 'November 1 - November 25',
        harvestMonth: 'March - April',
        marketDemand: 'Very High',
        waterRequirement: 'Moderate'
      },
      {
        id: 'up_potato',
        cropName: 'Potato',
        localName: 'आलू',
        harvestRank: 3,
        typicalHarvestSeason: 'Rabi',
        durationDays: 95,
        avgYieldQuintalsPerAcre: '130 - 170 q/acre',
        profitabilityIndex: 'Very High (₹70k-1.2L/ac)',
        dominantDistricts: ['Agra', 'Farrukhabad', 'Kannauj', 'Aligarh', 'Mathura'],
        climateSoilSuitability: 'Agra Potato Belt - friable sandy loam with rapid tuber expansion.',
        popularVarieties: ['Kufri Pukhraj (Early)', 'Kufri Bahar', 'Kufri Chipsona 1 & 3', 'Kufri Mohan'],
        recommendedSowingMonth: 'October 15 - November 5',
        harvestMonth: 'January - March',
        marketDemand: 'Very High',
        waterRequirement: 'Moderate'
      }
    ],
    districtSpecificCrops: {}
  }
};

// Helper function to get most harvested crops for any state and district
export function getLocationMostHarvestedCrops(stateName: string, districtName?: string): MostHarvestedCrop[] {
  const normalizedState = Object.keys(STATE_HARVEST_CATALOG).find(
    (k) => k.toLowerCase() === stateName.toLowerCase() || stateName.toLowerCase().includes(k.toLowerCase())
  );

  if (!normalizedState) {
    // Fallback to Maharashtra or generic
    return STATE_HARVEST_CATALOG.Maharashtra.topHarvestedCrops;
  }

  const profile = STATE_HARVEST_CATALOG[normalizedState];
  if (districtName && profile.districtSpecificCrops[districtName]) {
    const specific = profile.districtSpecificCrops[districtName];
    const combined = [...specific, ...profile.topHarvestedCrops.filter((c) => !specific.some((s) => s.id === c.id))];
    return combined;
  }

  return profile.topHarvestedCrops;
}

export function getLocationAgroZoneInfo(stateName: string): StateHarvestProfile {
  const normalizedState = Object.keys(STATE_HARVEST_CATALOG).find(
    (k) => k.toLowerCase() === stateName.toLowerCase() || stateName.toLowerCase().includes(k.toLowerCase())
  );

  return normalizedState ? STATE_HARVEST_CATALOG[normalizedState] : STATE_HARVEST_CATALOG.Maharashtra;
}

export function getStateCropDoctorSampleCases(stateName: string) {
  const info = getLocationAgroZoneInfo(stateName);
  return info.sampleCropDoctorCases || STATE_HARVEST_CATALOG.Maharashtra.sampleCropDoctorCases;
}

export const ALL_SUPPORTED_STATES = Object.keys(STATE_HARVEST_CATALOG);

