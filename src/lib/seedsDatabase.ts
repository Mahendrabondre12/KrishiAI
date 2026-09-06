export interface SeedRecommendation {
  id: string;
  cropName: string;
  seedVariety: string;
  brandOrBreeder: string;
  type: 'Hybrid' | 'High-Yielding Variety (HYV)' | 'Desi / Heirloom' | 'Biofortified' | 'Drought Tolerant';
  durationDays: number;
  expectedYieldQuintalPerAcre: string;
  idealSoilTypes: string[];
  idealSeason: 'Kharif' | 'Rabi' | 'Zaid' | 'All Season';
  waterRequirement: 'Low' | 'Moderate' | 'High';
  diseaseResistance: string[];
  specialTraits: string;
  sowingWindow: string;
  certifiedSeedPricePerKg: number;
  availableAtKVKOrDealers: string[];
}

export interface StateDistrictAgroProfile {
  state: string;
  stateLocalName: {
    hi: string;
    mr: string;
    te: string;
    ta: string;
    kn: string;
    pa: string;
    gu: string;
    bn: string;
  };
  centerCoordinates: { lat: number; lng: number };
  majorAgroClimaticZone: string;
  dominantSoil: string;
  annualRainfallMm: number;
  primaryCrops: string[];
  districts: {
    name: string;
    lat: number;
    lng: number;
    recommendedSeeds: SeedRecommendation[];
  }[];
}

export const STATE_SEED_RECOMMENDATION_DATABASE: StateDistrictAgroProfile[] = [
  {
    state: 'Maharashtra',
    stateLocalName: {
      hi: 'महाराष्ट्र',
      mr: 'महाराष्ट्र',
      te: 'మహారాష్ట్ర',
      ta: 'மகாராஷ்டிரா',
      kn: 'ಮಹಾರಾಷ್ಟ್ರ',
      pa: 'ਮਹਾਰਾਸ਼ਟਰ',
      gu: 'મહારાષ્ટ્ર',
      bn: 'মহারাষ্ট্র'
    },
    centerCoordinates: { lat: 19.7515, lng: 75.7139 },
    majorAgroClimaticZone: 'Western Plateau and Hills Zone',
    dominantSoil: 'Black Cotton Soil (Regur)',
    annualRainfallMm: 950,
    primaryCrops: ['Cotton', 'Soybean', 'Sugarcane', 'Onion', 'Pomegranate', 'Jowar', 'Wheat'],
    districts: [
      {
        name: 'Ahmednagar / Ahilyanagar',
        lat: 19.0952,
        lng: 74.7496,
        recommendedSeeds: [
          {
            id: 'mah_ahm_1',
            cropName: 'Soybean',
            seedVariety: 'JS-335 / JS-9560 / Phule Sangam (KDS-726)',
            brandOrBreeder: 'MPKV Rahuri / Mahabeej',
            type: 'High-Yielding Variety (HYV)',
            durationDays: 95,
            expectedYieldQuintalPerAcre: '12 - 16 q/acre',
            idealSoilTypes: ['Black', 'Clay Loam'],
            idealSeason: 'Kharif',
            waterRequirement: 'Moderate',
            diseaseResistance: ['Stem Rot Resistant', 'Yellow Mosaic Virus (YMV) Tolerance'],
            specialTraits: 'High oil content (21%), non-shattering pods even if harvest delayed by 10 days.',
            sowingWindow: '15 June - 10 July (after 75-100mm monsoon onset)',
            certifiedSeedPricePerKg: 110,
            availableAtKVKOrDealers: ['Mahabeej Center Rahuri', 'District Agro Input Agro-Vikas Kendra']
          },
          {
            id: 'mah_ahm_2',
            cropName: 'Wheat',
            seedVariety: 'Phule Samadhan (NIAW-1994) / HD-2967',
            brandOrBreeder: 'Niphad Wheat Research Station / IARI',
            type: 'High-Yielding Variety (HYV)',
            durationDays: 115,
            expectedYieldQuintalPerAcre: '18 - 22 q/acre',
            idealSoilTypes: ['Black', 'Loamy'],
            idealSeason: 'Rabi',
            waterRequirement: 'Moderate',
            diseaseResistance: ['Stem & Leaf Rust Resistant', 'Heat Stress Tolerant in terminal stage'],
            specialTraits: 'Amber lustrous grain, high protein (>12.5%), superior chapati quality.',
            sowingWindow: '1 November - 25 November',
            certifiedSeedPricePerKg: 48,
            availableAtKVKOrDealers: ['KVK Babhaleshwar', 'Ahmednagar District Farmers Cooperative']
          },
          {
            id: 'mah_ahm_3',
            cropName: 'Pomegranate',
            seedVariety: 'Bhagwa (Sindhuri / Kesar)',
            brandOrBreeder: 'NRC on Pomegranate, Solapur / MPKV',
            type: 'Desi / Heirloom',
            durationDays: 180,
            expectedYieldQuintalPerAcre: '40 - 55 q/acre (mature orchard)',
            idealSoilTypes: ['Well-drained Light to Medium Black', 'Sandy Loam'],
            idealSeason: 'All Season',
            waterRequirement: 'Low',
            diseaseResistance: ['Bacterial Blight (Telya) Management Protocol responsive'],
            specialTraits: 'Deep glossy red arils, soft seeds, high TSS (15-16° Brix) for export.',
            sowingWindow: 'Mrug Bahar (June) or Hasta Bahar (Sept-Oct)',
            certifiedSeedPricePerKg: 180,
            availableAtKVKOrDealers: ['National Seed Nursery Sangamner', 'MPKV Rahuri Outlet']
          },
          {
            id: 'mah_ahm_4',
            cropName: 'Onion',
            seedVariety: 'Bhima Super / Bhima Dark Red',
            brandOrBreeder: 'ICAR-DOGR Rajgurunagar',
            type: 'High-Yielding Variety (HYV)',
            durationDays: 110,
            expectedYieldQuintalPerAcre: '100 - 130 q/acre',
            idealSoilTypes: ['Sandy Loam', 'Light Black'],
            idealSeason: 'Kharif',
            waterRequirement: 'Moderate',
            diseaseResistance: ['Purple Blotch Tolerant', 'Thrips Tolerant'],
            specialTraits: 'Attractive dark red bulb with thin neck, superior keeping quality (4 months storage).',
            sowingWindow: 'Nursery: May-June; Transplanting: July-August',
            certifiedSeedPricePerKg: 1200,
            availableAtKVKOrDealers: ['Mahabeej Akola Outlets', 'Rahuri Agro Service']
          }
        ]
      },
      {
        name: 'Nashik',
        lat: 19.9975,
        lng: 73.7898,
        recommendedSeeds: [
          {
            id: 'mah_nsk_1',
            cropName: 'Table Grapes',
            seedVariety: 'Thomson Seedless / Manik Chaman / Sonaka',
            brandOrBreeder: 'ICAR-NRC Grapes Pune',
            type: 'Desi / Heirloom',
            durationDays: 145,
            expectedYieldQuintalPerAcre: '80 - 110 q/acre',
            idealSoilTypes: ['Sandy Loam', 'Medium Black (well drained)'],
            idealSeason: 'Rabi',
            waterRequirement: 'Moderate',
            diseaseResistance: ['Powdery Mildew & Downy Mildew tolerant on Dogridge rootstock'],
            specialTraits: 'High sugar TSS (18-20° Brix), elongated golden berries, export grade.',
            sowingWindow: 'October pruning window',
            certifiedSeedPricePerKg: 350,
            availableAtKVKOrDealers: ['Nashik Grape Growers Association (MahaGrape)', 'KVK Yashwantrao']
          },
          {
            id: 'mah_nsk_2',
            cropName: 'Tomato',
            seedVariety: 'Syngenta Abhinav (TO-1057) / US-1504',
            brandOrBreeder: 'Syngenta / US Agri',
            type: 'Hybrid',
            durationDays: 130,
            expectedYieldQuintalPerAcre: '250 - 320 q/acre',
            idealSoilTypes: ['Loamy', 'Red Sandy Loam'],
            idealSeason: 'Kharif',
            waterRequirement: 'Moderate',
            diseaseResistance: ['Tomato Leaf Curl Virus (ToLCV)', 'Bacterial Wilt Resistance'],
            specialTraits: 'Firm oval fruits, deep red color, excellent shelf life for long-distance transit.',
            sowingWindow: 'June-July for Kharif, Sept-Oct for Rabi',
            certifiedSeedPricePerKg: 18500,
            availableAtKVKOrDealers: ['Pimpalgaon Baswant Market Yard', 'Nashik Agro Agency']
          }
        ]
      },
      {
        name: 'Yavatmal / Vidarbha',
        lat: 20.3888,
        lng: 78.1204,
        recommendedSeeds: [
          {
            id: 'mah_yvt_1',
            cropName: 'Cotton (Kapas)',
            seedVariety: 'Bollgard-II RCH-659 BGII / Ajeet-155 BGII',
            brandOrBreeder: 'Rasi Seeds / Mahyco / CICR Nagpur',
            type: 'Hybrid',
            durationDays: 155,
            expectedYieldQuintalPerAcre: '10 - 15 q/acre',
            idealSoilTypes: ['Deep Black Cotton Soil'],
            idealSeason: 'Kharif',
            waterRequirement: 'Low',
            diseaseResistance: ['Bollworm Resistance', 'Bacterial Blight Tolerance'],
            specialTraits: 'Long staple fiber (29.5mm), easy picking large bolls, drought resilience.',
            sowingWindow: '10 June - 30 June (with monsoon onset)',
            certifiedSeedPricePerKg: 864,
            availableAtKVKOrDealers: ['CICR Nagpur Authorized Depot', 'Yavatmal Krishi Seva Kendra']
          }
        ]
      }
    ]
  },
  {
    state: 'Punjab',
    stateLocalName: {
      hi: 'पंजाब',
      mr: 'पंजाब',
      te: 'పంజాబ్',
      ta: 'பஞ்சாப்',
      kn: 'ಪಂಜಾಬ್',
      pa: 'ਪੰਜਾਬ',
      gu: 'પંજાબ',
      bn: 'পাঞ্জাব'
    },
    centerCoordinates: { lat: 31.1471, lng: 75.3412 },
    majorAgroClimaticZone: 'Trans-Gangetic Plains Zone',
    dominantSoil: 'Fertile Alluvial & Silt Loam',
    annualRainfallMm: 650,
    primaryCrops: ['Wheat', 'Rice / Paddy (Basmati & PR)', 'Cotton', 'Maize', 'Mustard', 'Potato'],
    districts: [
      {
        name: 'Ludhiana',
        lat: 30.9010,
        lng: 75.8573,
        recommendedSeeds: [
          {
            id: 'pb_ldh_1',
            cropName: 'Wheat',
            seedVariety: 'PBW-826 / DBW-303 (Karan Vaishnavi) / PBW-725',
            brandOrBreeder: 'PAU Ludhiana / ICAR-IIWBR Karnal',
            type: 'Biofortified',
            durationDays: 148,
            expectedYieldQuintalPerAcre: '24 - 28 q/acre',
            idealSoilTypes: ['Alluvial Loam', 'Clay Loam'],
            idealSeason: 'Rabi',
            waterRequirement: 'High',
            diseaseResistance: ['Complete Immunity to Yellow Rust (Puccinia striiformis) & Brown Rust'],
            specialTraits: 'High grain weight (1000 grain weight >42g), heat tolerance in terminal March.',
            sowingWindow: '25 October - 15 November',
            certifiedSeedPricePerKg: 42,
            availableAtKVKOrDealers: ['PAU Ludhiana Seed Shop Gate-1', 'PUNSEED Depots']
          },
          {
            id: 'pb_ldh_2',
            cropName: 'Basmati Rice',
            seedVariety: 'Pusa Basmati 1847 / Pusa Basmati 1509',
            brandOrBreeder: 'ICAR-IARI New Delhi',
            type: 'High-Yielding Variety (HYV)',
            durationDays: 120,
            expectedYieldQuintalPerAcre: '20 - 24 q/acre',
            idealSoilTypes: ['Alluvial Loam', 'Clay Loam'],
            idealSeason: 'Kharif',
            waterRequirement: 'High',
            diseaseResistance: ['Near-isogenic line with built-in Bacterial Leaf Blight and Blast resistance genes (xa13, Xa21, Pi2, Pi54)'],
            specialTraits: 'Extra-long slender aromatic grains (uncooked 8.4mm, cooked >19mm), non-lodging.',
            sowingWindow: 'Nursery: 20 May - 10 June; Direct Seeding / DSR option available',
            certifiedSeedPricePerKg: 95,
            availableAtKVKOrDealers: ['IARI Regional Seed Depot', 'PAU Seed Farm Samrala']
          }
        ]
      },
      {
        name: 'Bathinda / Malwa Belt',
        lat: 30.2110,
        lng: 74.9455,
        recommendedSeeds: [
          {
            id: 'pb_bth_1',
            cropName: 'Mustard (Sarson)',
            seedVariety: 'Pusa Mustard 31 (PDZ-1) / Giriraj (DRMRIJ-31)',
            brandOrBreeder: 'ICAR-DRMR Bharatpur',
            type: 'High-Yielding Variety (HYV)',
            durationDays: 135,
            expectedYieldQuintalPerAcre: '8 - 11 q/acre',
            idealSoilTypes: ['Sandy Loam', 'Light Alluvial'],
            idealSeason: 'Rabi',
            waterRequirement: 'Low',
            diseaseResistance: ['White Rust & Alternaria Blight Resistance'],
            specialTraits: 'High oil recovery (41.5%), low erucic acid, drought tolerant.',
            sowingWindow: '1 October - 20 October',
            certifiedSeedPricePerKg: 160,
            availableAtKVKOrDealers: ['Bathinda KVK Dabwali Road', 'PUNSEED Bathinda']
          }
        ]
      }
    ]
  },
  {
    state: 'Madhya Pradesh',
    stateLocalName: {
      hi: 'मध्य प्रदेश',
      mr: 'मध्य प्रदेश',
      te: 'మధ్యప్రదేశ్',
      ta: 'மத்திய பிரதேசம்',
      kn: 'ಮಧ್ಯಪ್ರದೇಶ',
      pa: 'ਮੱਧ ਪ੍ਰਦੇਸ਼',
      gu: 'મધ્ય પ્રદેશ',
      bn: 'মধ্যপ্রদেশ'
    },
    centerCoordinates: { lat: 22.9734, lng: 78.6569 },
    majorAgroClimaticZone: 'Central Plateau and Hills Zone',
    dominantSoil: 'Deep & Medium Black Soil (Malwa Plateau)',
    annualRainfallMm: 1000,
    primaryCrops: ['Soybean', 'Wheat (Sharbati)', 'Gram / Chickpea (Chana)', 'Garlic', 'Mustard', 'Lentil'],
    districts: [
      {
        name: 'Indore / Malwa',
        lat: 22.7196,
        lng: 75.8577,
        recommendedSeeds: [
          {
            id: 'mp_ind_1',
            cropName: 'Wheat (Sharbati)',
            seedVariety: 'C-306 (Traditional Sharbati) / HI-8759 (Pusa Tejas Durum) / HI-1544 (Purna)',
            brandOrBreeder: 'ICAR-IARI Regional Station Indore',
            type: 'High-Yielding Variety (HYV)',
            durationDays: 118,
            expectedYieldQuintalPerAcre: '20 - 25 q/acre',
            idealSoilTypes: ['Deep Black Clay (Malwa)', 'Regur'],
            idealSeason: 'Rabi',
            waterRequirement: 'Moderate',
            diseaseResistance: ['Rust Immune', 'Karnal Bunt Free'],
            specialTraits: 'Premium GI-tagged MP Sharbati golden luster, highest market price fetch (₹3,200+/qnt).',
            sowingWindow: '10 November - 30 November',
            certifiedSeedPricePerKg: 52,
            availableAtKVKOrDealers: ['IARI Indore Seed Counter', 'Indore Mandi Beej Nigam']
          },
          {
            id: 'mp_ind_2',
            cropName: 'Chickpea / Bengal Gram (Chana)',
            seedVariety: 'JG-16 / RVG-202 (Rajmata Vijayaraje Gram) / JAKI-9218',
            brandOrBreeder: 'JNKVV Jabalpur / RVSKVV Gwalior',
            type: 'Drought Tolerant',
            durationDays: 105,
            expectedYieldQuintalPerAcre: '9 - 13 q/acre',
            idealSoilTypes: ['Medium Black', 'Clay Loam'],
            idealSeason: 'Rabi',
            waterRequirement: 'Low',
            diseaseResistance: ['Fusarium Wilt Resistant', 'Root Rot Tolerant'],
            specialTraits: 'Bold seeded (100-seed weight 26g), upright canopy suitable for mechanical harvesting.',
            sowingWindow: '15 October - 10 November',
            certifiedSeedPricePerKg: 85,
            availableAtKVKOrDealers: ['MP Rajya Beej Nigam Indore', 'KVK Kasturbagram']
          }
        ]
      },
      {
        name: 'Ujjain / Dewas',
        lat: 23.1765,
        lng: 75.7885,
        recommendedSeeds: [
          {
            id: 'mp_ujn_1',
            cropName: 'Garlic (Lahsun)',
            seedVariety: 'G-282 (Yamuna Safed-3) / Amleta Desi Malwa',
            brandOrBreeder: 'NHRDF / DOGR',
            type: 'Desi / Heirloom',
            durationDays: 135,
            expectedYieldQuintalPerAcre: '45 - 60 q/acre',
            idealSoilTypes: ['Fertile Loam', 'Light Black'],
            idealSeason: 'Rabi',
            waterRequirement: 'Moderate',
            diseaseResistance: ['Purple Blotch Tolerant', 'Stemphyllium Blight Tolerant'],
            specialTraits: 'Large creamy white cloves (15-18 cloves/bulb), pungent aroma with high allicin content.',
            sowingWindow: '15 September - 15 October',
            certifiedSeedPricePerKg: 240,
            availableAtKVKOrDealers: ['Ujjain Krishi Upaj Mandi', 'NHRDF Indore Center']
          }
        ]
      }
    ]
  },
  {
    state: 'Gujarat',
    stateLocalName: {
      hi: 'गुजरात',
      mr: 'गुजरात',
      te: 'గుజరాత్',
      ta: 'குஜராத்',
      kn: 'ಗುಜರಾತ್',
      pa: 'ਗੁਜਰਾਤ',
      gu: 'ગુજરાત',
      bn: 'গুজরাত'
    },
    centerCoordinates: { lat: 22.2587, lng: 71.1924 },
    majorAgroClimaticZone: 'Gujarat Plains and Hills Zone',
    dominantSoil: 'Black Clay, Coastal Alluvium, Sandy Loam',
    annualRainfallMm: 800,
    primaryCrops: ['Groundnut (Peanut)', 'Cotton', 'Cumin (Jeera)', 'Castor', 'Sesame', 'Wheat (Bhalia)'],
    districts: [
      {
        name: 'Rajkot / Saurashtra',
        lat: 22.3039,
        lng: 70.8022,
        recommendedSeeds: [
          {
            id: 'gj_raj_1',
            cropName: 'Groundnut (Mungfali)',
            seedVariety: 'GG-20 (Gujarat Groundnut-20) / GJG-9 / Kadiri Lepakshi (K-1812)',
            brandOrBreeder: 'Junagadh Agricultural University (JAU) / ICAR-DGR',
            type: 'High-Yielding Variety (HYV)',
            durationDays: 110,
            expectedYieldQuintalPerAcre: '14 - 18 q/acre',
            idealSoilTypes: ['Sandy Loam', 'Light Black Medium Soil'],
            idealSeason: 'Kharif',
            waterRequirement: 'Moderate',
            diseaseResistance: ['Tikka Disease & Rust Tolerant', 'Stem Rot Moderate Tolerance'],
            specialTraits: 'Semi-spreading habit, 2-seeded bold pods, high shelling turnover (73%), oil content 51%.',
            sowingWindow: '15 June - 5 July',
            certifiedSeedPricePerKg: 135,
            availableAtKVKOrDealers: ['JAU Seed Depot Rajkot', 'Gujarat State Seed Corporation (GSSC)']
          },
          {
            id: 'gj_raj_2',
            cropName: 'Cumin (Jeera)',
            seedVariety: 'Gujarat Cumin-4 (GC-4) / GC-5',
            brandOrBreeder: 'SDAU Sardarkrushinagar',
            type: 'High-Yielding Variety (HYV)',
            durationDays: 105,
            expectedYieldQuintalPerAcre: '4 - 6 q/acre',
            idealSoilTypes: ['Sandy Loam (well drained)', 'Loamy'],
            idealSeason: 'Rabi',
            waterRequirement: 'Low',
            diseaseResistance: ['Wilt Disease Immune', 'Powdery Mildew Resistance'],
            specialTraits: 'High essential oil (3.8%), distinct aromatic fragrance, non-lodging canopy.',
            sowingWindow: '15 November - 5 December',
            certifiedSeedPricePerKg: 420,
            availableAtKVKOrDealers: ['Unjha APMC Seed Counters', 'GSSC Rajkot Depot']
          }
        ]
      }
    ]
  },
  {
    state: 'Uttar Pradesh',
    stateLocalName: {
      hi: 'उत्तर प्रदेश',
      mr: 'उत्तर प्रदेश',
      te: 'ఉత్తరప్రదేశ్',
      ta: 'உத்தரபிரதேசம்',
      kn: 'ಉತ್ತರ ಪ್ರದೇಶ',
      pa: 'ਉੱਤਰ ਪ੍ਰਦੇਸ਼',
      gu: 'ઉત્તર પ્રદેશ',
      bn: 'উত্তর প্রদেশ'
    },
    centerCoordinates: { lat: 26.8467, lng: 80.9462 },
    majorAgroClimaticZone: 'Upper & Middle Gangetic Plains Zone',
    dominantSoil: 'Deep Alluvial Silt and Gangetic Clay',
    annualRainfallMm: 980,
    primaryCrops: ['Sugarcane', 'Wheat', 'Paddy', 'Potato', 'Mustard', 'Mentha (Mint)'],
    districts: [
      {
        name: 'Varanasi / Purvanchal',
        lat: 25.3176,
        lng: 82.9739,
        recommendedSeeds: [
          {
            id: 'up_vns_1',
            cropName: 'Paddy / Rice',
            seedVariety: 'Swarna Sub-1 (Flood Tolerant) / HUR-105 (Malviya Sugandh)',
            brandOrBreeder: 'BHU Institute of Agricultural Sciences / IRRI',
            type: 'Drought Tolerant',
            durationDays: 138,
            expectedYieldQuintalPerAcre: '22 - 26 q/acre',
            idealSoilTypes: ['Alluvial Clay', 'Gangetic Silt'],
            idealSeason: 'Kharif',
            waterRequirement: 'High',
            diseaseResistance: ['Survives complete submergence up to 14 days under floodwaters with Sub1 gene'],
            specialTraits: 'High milling recovery, fine grain texture, resilient to Ganga plains seasonal inundation.',
            sowingWindow: 'Nursery: 1 June - 25 June; Transplanting: July',
            certifiedSeedPricePerKg: 55,
            availableAtKVKOrDealers: ['BHU Seed Distribution Center', 'UP Beej Vikas Nigam Varanasi']
          }
        ]
      },
      {
        name: 'Meerut / Western UP',
        lat: 28.9845,
        lng: 77.7064,
        recommendedSeeds: [
          {
            id: 'up_mrt_1',
            cropName: 'Sugarcane (Ganna)',
            seedVariety: 'Co-0238 (Karan-4) / Co-15023 / Co-0118',
            brandOrBreeder: 'ICAR-SBI Regional Station Karnal / IISR Lucknow',
            type: 'High-Yielding Variety (HYV)',
            durationDays: 330,
            expectedYieldQuintalPerAcre: '350 - 450 q/acre',
            idealSoilTypes: ['Rich Alluvial Loam'],
            idealSeason: 'All Season',
            waterRequirement: 'High',
            diseaseResistance: ['Red Rot Moderately Resistant', 'Top Borer Tolerance'],
            specialTraits: 'High sucrose sugar recovery (>12.5%), thick solid juicy canes, excellent ratoon ability.',
            sowingWindow: 'Autumn Planting: Oct-Nov; Spring Planting: Feb-March',
            certifiedSeedPricePerKg: 4.5,
            availableAtKVKOrDealers: ['Meerut Sugar Mill Cooperative Nursery', 'IISR Lucknow Depot']
          }
        ]
      }
    ]
  },
  {
    state: 'Karnataka',
    stateLocalName: {
      hi: 'कर्नाटक',
      mr: 'कर्नाटक',
      te: 'కర్ణాటక',
      ta: 'கர்நாடகா',
      kn: 'ಕರ್ನಾಟಕ',
      pa: 'ਕਰਨਾਟਕ',
      gu: 'કર્ણાટક',
      bn: 'কর্ণাটক'
    },
    centerCoordinates: { lat: 15.3173, lng: 75.7139 },
    majorAgroClimaticZone: 'Southern Plateau and Hills Zone',
    dominantSoil: 'Red Sandy Loam, Laterite, Deep Black (North Karnataka)',
    annualRainfallMm: 1100,
    primaryCrops: ['Ragi (Finger Millet)', 'Maize', 'Coffee', 'Arecanut', 'Sunflower', 'Tur / Red Gram'],
    districts: [
      {
        name: 'Bengaluru Rural / Mandya',
        lat: 12.9716,
        lng: 77.5946,
        recommendedSeeds: [
          {
            id: 'ka_blr_1',
            cropName: 'Ragi (Finger Millet)',
            seedVariety: 'ML-365 / GPU-28 / KMR-301',
            brandOrBreeder: 'UAS GKVK Bangalore / ICAR-IIMR',
            type: 'Biofortified',
            durationDays: 105,
            expectedYieldQuintalPerAcre: '14 - 18 q/acre',
            idealSoilTypes: ['Red Sandy Loam', 'Laterite'],
            idealSeason: 'Kharif',
            waterRequirement: 'Low',
            diseaseResistance: ['Blast Disease (Magnaporthe) Immune', 'Drought Stoppage Resilience'],
            specialTraits: 'Calcium rich (344mg/100g), high dietary fiber, low glycemic index superfood.',
            sowingWindow: '15 July - 15 August',
            certifiedSeedPricePerKg: 65,
            availableAtKVKOrDealers: ['UAS GKVK Seed Mela Counter Bangalore', 'Karnataka State Seeds Corporation (KSSC)']
          }
        ]
      },
      {
        name: 'Dharwad / Belagavi',
        lat: 15.4589,
        lng: 75.0078,
        recommendedSeeds: [
          {
            id: 'ka_dhd_1',
            cropName: 'Maize (Corn)',
            seedVariety: 'CP-818 / Pioneer P-3501 / Deccan-103',
            brandOrBreeder: 'UASD / Pioneer / CP Seeds',
            type: 'Hybrid',
            durationDays: 110,
            expectedYieldQuintalPerAcre: '30 - 38 q/acre',
            idealSoilTypes: ['Black Soil', 'Red Loamy'],
            idealSeason: 'Kharif',
            waterRequirement: 'Moderate',
            diseaseResistance: ['Turcicum Leaf Blight Resistance', 'Fall Armyworm (FAW) Protocol responsive'],
            specialTraits: 'Tight husk cover prevents bird damage, golden orange kernels with high starch.',
            sowingWindow: '10 June - 10 July',
            certifiedSeedPricePerKg: 340,
            availableAtKVKOrDealers: ['UAS Dharwad Seed Unit', 'Belagavi Rythu Seva Kendra']
          }
        ]
      }
    ]
  },
  {
    state: 'Telangana',
    stateLocalName: {
      hi: 'तेलंगाना',
      mr: 'तेलंगणा',
      te: 'తెలంగాణ',
      ta: 'தெலுங்கானா',
      kn: 'ತೆಲಂಗಾಣ',
      pa: 'ਤੇਲੰਗਾਨਾ',
      gu: 'તેલંગાણા',
      bn: 'তেলেঙ্গানা'
    },
    centerCoordinates: { lat: 18.1124, lng: 79.0193 },
    majorAgroClimaticZone: 'Southern Plateau and East Coast Plains',
    dominantSoil: 'Red Sandy Soil (Chalka), Black Cotton Soil',
    annualRainfallMm: 900,
    primaryCrops: ['Paddy (Telangana Sona)', 'Cotton', 'Chilli', 'Turmeric', 'Red Gram'],
    districts: [
      {
        name: 'Warangal / Karimnagar',
        lat: 17.9689,
        lng: 79.5941,
        recommendedSeeds: [
          {
            id: 'ts_wgl_1',
            cropName: 'Rice / Paddy (Telangana Sona)',
            seedVariety: 'RNR-15048 (Telangana Sona) / KNM-118',
            brandOrBreeder: 'PJTSAU Hyderabad',
            type: 'Biofortified',
            durationDays: 125,
            expectedYieldQuintalPerAcre: '24 - 28 q/acre',
            idealSoilTypes: ['Red Sandy (Chalka)', 'Clay Loam'],
            idealSeason: 'Kharif',
            waterRequirement: 'High',
            diseaseResistance: ['Blast Immune', 'BPH Tolerant'],
            specialTraits: 'Lowest Glycemic Index (GI 51.5) diabetic-friendly rice, fine slender grain, high market price.',
            sowingWindow: 'July 1 - July 25',
            certifiedSeedPricePerKg: 60,
            availableAtKVKOrDealers: ['TSSDC Warangal Outlet', 'PJTSAU Research Station']
          },
          {
            id: 'ts_wgl_2',
            cropName: 'Red Chilli (Mirchi)',
            seedVariety: 'Teja (S-17) / Wonder Hot / Byadgi KDL',
            brandOrBreeder: 'Spices Board / Private Hybrids',
            type: 'Hybrid',
            durationDays: 150,
            expectedYieldQuintalPerAcre: '25 - 35 q/acre (Dry)',
            idealSoilTypes: ['Well Drained Black Soil', 'Red Loam'],
            idealSeason: 'Kharif',
            waterRequirement: 'Moderate',
            diseaseResistance: ['Thrips parvispinus integrated management responsive', 'Anthracnose Tolerant'],
            specialTraits: 'Extreme pungency (75,000-100,000 SHU), deep crimson red color value (90 ASTA).',
            sowingWindow: 'Nursery: July; Transplanting: August-September',
            certifiedSeedPricePerKg: 16000,
            availableAtKVKOrDealers: ['Enumamula Chilli Yard Warangal', 'Agri Junction Karimnagar']
          }
        ]
      }
    ]
  },
  {
    state: 'Tamil Nadu',
    stateLocalName: {
      hi: 'तमिलनाडु',
      mr: 'तमिळनाडू',
      te: 'తమిళనాడు',
      ta: 'தமிழ்நாடு',
      kn: 'ತಮಿಳುನಾಡು',
      pa: 'ਤਾਮਿਲਨਾਡੂ',
      gu: 'તમિલનાડુ',
      bn: 'তামিলনাড়ু'
    },
    centerCoordinates: { lat: 11.1271, lng: 78.6569 },
    majorAgroClimaticZone: 'Southern Plateau & East Coast Hills',
    dominantSoil: 'Red Loam, Coastal Alluvium, Delta Silt (Cauvery Delta)',
    annualRainfallMm: 950,
    primaryCrops: ['Paddy (Ponni / CR1009)', 'Banana', 'Coconut', 'Groundnut', 'Blackgram', 'Sugarcane'],
    districts: [
      {
        name: 'Thanjavur / Cauvery Delta',
        lat: 10.7870,
        lng: 79.1378,
        recommendedSeeds: [
          {
            id: 'tn_tj_1',
            cropName: 'Paddy / Rice',
            seedVariety: 'CR 1009 Sub-1 (Ponmani) / ADT-53 / CO-51',
            brandOrBreeder: 'TNAU Coimbatore / TRRI Aduthurai',
            type: 'High-Yielding Variety (HYV)',
            durationDays: 140,
            expectedYieldQuintalPerAcre: '26 - 32 q/acre',
            idealSoilTypes: ['Cauvery Alluvial Clay', 'Delta Silt'],
            idealSeason: 'Kharif',
            waterRequirement: 'High',
            diseaseResistance: ['Submergence tolerant up to 18 days', 'Gall Midge & Blast Resistant'],
            specialTraits: 'Ideal for Thaladi and Samba seasons, high cooking expansion and palatability.',
            sowingWindow: 'August - September (Samba season)',
            certifiedSeedPricePerKg: 45,
            availableAtKVKOrDealers: ['TRRI Aduthurai Seed Sales Counter', 'TNAU Agri Seed Center Thanjavur']
          }
        ]
      },
      {
        name: 'Coimbatore / Pollachi',
        lat: 11.0168,
        lng: 76.9558,
        recommendedSeeds: [
          {
            id: 'tn_cbe_1',
            cropName: 'Banana',
            seedVariety: 'Grand Naine (G-9 Tissue Culture) / Red Banana (Sevvazhai)',
            brandOrBreeder: 'ICAR-NRCB Trichy / TNAU',
            type: 'High-Yielding Variety (HYV)',
            durationDays: 330,
            expectedYieldQuintalPerAcre: '320 - 400 q/acre',
            idealSoilTypes: ['Deep Well-Drained Loam'],
            idealSeason: 'All Season',
            waterRequirement: 'High',
            diseaseResistance: ['Panama Wilt (Fusarium Race 1) Resistant on TC Plants'],
            specialTraits: 'Uniform bunch weight (30-35 kg), cylindrical fingers, export standard.',
            sowingWindow: 'February - April or August - October',
            certifiedSeedPricePerKg: 18,
            availableAtKVKOrDealers: ['NRCB Trichy Outlet', 'TNAU Coimbatore Nursery']
          }
        ]
      }
    ]
  },
  {
    state: 'Rajasthan',
    stateLocalName: {
      hi: 'राजस्थान',
      mr: 'राजस्थान',
      te: 'రాజస్థాన్',
      ta: 'ராஜஸ்தான்',
      kn: 'ರಾಜಸ್ಥಾನ',
      pa: 'ਰਾਜਸਥਾਨ',
      gu: 'રાજસ્થાન',
      bn: 'রাজস্থান'
    },
    centerCoordinates: { lat: 27.0238, lng: 74.2179 },
    majorAgroClimaticZone: 'Western Dry Zone & Arid Plains',
    dominantSoil: 'Desert Sandy Soil, Calcareous Loam',
    annualRainfallMm: 380,
    primaryCrops: ['Bajra (Pearl Millet)', 'Mustard', 'Guar (Cluster Bean)', 'Cumin', 'Isabgol', 'Chickpea'],
    districts: [
      {
        name: 'Jodhpur / Marwar',
        lat: 26.2389,
        lng: 73.0243,
        recommendedSeeds: [
          {
            id: 'rj_jdh_1',
            cropName: 'Bajra (Pearl Millet)',
            seedVariety: 'RHB-177 / MPMH-17 / HHB-67 Improved',
            brandOrBreeder: 'ICAR-CAZRI Jodhpur / SKNAU Jobner',
            type: 'Drought Tolerant',
            durationDays: 70,
            expectedYieldQuintalPerAcre: '10 - 14 q/acre',
            idealSoilTypes: ['Arid Sandy Soil', 'Light Loam'],
            idealSeason: 'Kharif',
            waterRequirement: 'Low',
            diseaseResistance: ['Downy Mildew Immune', 'Green Ear Disease Resistant'],
            specialTraits: 'Ultra-short duration (65-70 days), escapes end-of-season arid drought, iron & zinc rich.',
            sowingWindow: '1 July - 20 July',
            certifiedSeedPricePerKg: 120,
            availableAtKVKOrDealers: ['CAZRI Seed Sales Unit Jodhpur', 'Rajasthan State Seeds Corp (RSSC)']
          },
          {
            id: 'rj_jdh_2',
            cropName: 'Guar / Cluster Bean',
            seedVariety: 'RGC-936 / RGC-1003 / HG-365',
            brandOrBreeder: 'SKRAU Bikaner',
            type: 'Drought Tolerant',
            durationDays: 85,
            expectedYieldQuintalPerAcre: '5 - 7 q/acre',
            idealSoilTypes: ['Desert Sandy Soil'],
            idealSeason: 'Kharif',
            waterRequirement: 'Low',
            diseaseResistance: ['Bacterial Blight Resistant'],
            specialTraits: 'High gum content (31.5%), high industrial export demand for guar gum powder.',
            sowingWindow: '5 July - 25 July',
            certifiedSeedPricePerKg: 90,
            availableAtKVKOrDealers: ['Marwar Krishi Kendra', 'RSSC Jodhpur']
          }
        ]
      }
    ]
  }
];

export function getRecommendedSeedsForLocation(
  stateName: string,
  districtName?: string
): {
  stateProfile?: StateDistrictAgroProfile;
  recommendedSeeds: SeedRecommendation[];
} {
  const normState = stateName.trim().toLowerCase();
  const foundState = STATE_SEED_RECOMMENDATION_DATABASE.find(
    (s) => s.state.toLowerCase() === normState || s.state.toLowerCase().includes(normState) || normState.includes(s.state.toLowerCase())
  );

  if (!foundState) {
    // Return first state as default fallback
    const fallback = STATE_SEED_RECOMMENDATION_DATABASE[0];
    return {
      stateProfile: fallback,
      recommendedSeeds: fallback.districts[0]?.recommendedSeeds || []
    };
  }

  if (districtName) {
    const normDist = districtName.trim().toLowerCase();
    const foundDist = foundState.districts.find(
      (d) => d.name.toLowerCase() === normDist || d.name.toLowerCase().includes(normDist) || normDist.includes(d.name.toLowerCase())
    );
    if (foundDist) {
      return {
        stateProfile: foundState,
        recommendedSeeds: foundDist.recommendedSeeds
      };
    }
  }

  // Flatten all district seeds for the state
  const allSeeds = foundState.districts.flatMap((d) => d.recommendedSeeds);
  return {
    stateProfile: foundState,
    recommendedSeeds: allSeeds
  };
}
