import { StageDetail } from '../types';

export interface CropStageSystem {
  cropName: string;
  defaultDurationDays: number;
  stages: {
    1: StageDetail;
    2: StageDetail;
    3: StageDetail;
    4: StageDetail;
  };
}

export const CROP_STAGES_CATALOG: Record<string, CropStageSystem> = {
  Soybean: {
    cropName: 'Soybean',
    defaultDurationDays: 100,
    stages: {
      1: {
        stageNumber: 1,
        title: 'Stage 1: Sowing & Emergence',
        subtitle: 'Germination, Radicle emergence & Cotyledon opening',
        dayRange: 'Days 0 – 20',
        progressPct: 15,
        keyActivities: [
          'Seed treatment with Rhizobium + PSB bio-inoculants & Trichoderma (5g/kg)',
          'Sow at 2.5 - 4 cm depth after receiving >75mm monsoon rain',
          'Apply pre-emergence herbicide (Pendimethalin 30% EC @ 1.0 kg a.i./ha within 48 hrs)'
        ],
        fertilizerDose: 'Basal Dose: N:P:K @ 30:60:40 kg/ha + Sulphur (20 kg/ha) for high oil content',
        irrigationRule: 'Critical to avoid water-logging in clay soil; light drainage furrow every 4 rows',
        riskWatch: 'Damping off & Collar rot in excess moisture; poor seed emergence if crust forms',
        pestAlert: 'Stem fly (Melanagromyza sojae) early oviposition'
      },
      2: {
        stageNumber: 2,
        title: 'Stage 2: Vegetative Growth & Branching',
        subtitle: 'Trifoliate leaf emergence, Node formation & Root nodulation',
        dayRange: 'Days 21 – 45',
        progressPct: 40,
        keyActivities: [
          'Inter-cultivation (hoeing / kolpa) at 20-25 DAS to aerate soil',
          'Foliar spray of 19:19:19 (10g/L) + Micronutrient mix for canopy vigour',
          'Install Yellow Sticky Traps (10/acre) & Pheromone traps for Spodoptera'
        ],
        fertilizerDose: 'Foliar micronutrient spray (Zinc 0.5% + Boron 0.2%) during early branching',
        irrigationRule: 'Provide 1 light irrigation if dry spell exceeds 12-14 days during active vegetative growth',
        riskWatch: 'Moisture stress during branching stunts node count and potential pod sites',
        pestAlert: 'Girdle beetle (Obereopsis brevis) and Semi-looper defoliators'
      },
      3: {
        stageNumber: 3,
        title: 'Stage 3: Flowering & Pod Formation',
        subtitle: 'Raceme blooming, Pod initiation & Seed filling (R3-R5)',
        dayRange: 'Days 46 – 75',
        progressPct: 75,
        keyActivities: [
          'MOST CRITICAL MOISTURE PERIOD: Ensure adequate root-zone moisture',
          'Foliar spray of 0:52:34 (MKP @ 10g/L) + Boron (1g/L) to prevent flower drop',
          'Avoid heavy tractor/equipment movement inside dense crop canopy'
        ],
        fertilizerDose: 'Foliar application of 13:00:45 (Potassium Nitrate @ 1%) at early pod filling',
        irrigationRule: 'DO NOT allow moisture stress during pod filling; irrigate immediately if wilting is observed',
        riskWatch: 'Flower & young pod drop due to prolonged cloudy weather or sudden water stress',
        pestAlert: 'Pod borer (Helicoverpa armigera) & Spodoptera litura feeding on green pods'
      },
      4: {
        stageNumber: 4,
        title: 'Stage 4: Maturity, Pod Ripening & Harvest',
        subtitle: 'Leaf senescence, Pod yellowing-to-brown & Moisture dry-down',
        dayRange: 'Days 76 – 105+',
        progressPct: 100,
        keyActivities: [
          'Stop all irrigation 10-14 days prior to expected harvest',
          'Harvest when 90-95% pods turn golden-brown and seeds rattle inside pods',
          'Thresh at 350-400 RPM cylinder speed to prevent seed coat breakage / germination loss',
          'Dry harvested grain to 10-12% moisture before bagging and mandi auction'
        ],
        fertilizerDose: 'No fertilizers required during ripening phase',
        irrigationRule: 'Zero irrigation. Keep field dry to facilitate mechanical harvesting and prevent seed rotting',
        riskWatch: 'Pod shattering if harvest is delayed in hot dry winds; pre-harvest sprouting if unseasonal rain occurs',
        pestAlert: 'Storage bruchids (Callosobruchus chinensis) in stored seed grain'
      }
    }
  },
  Wheat: {
    cropName: 'Wheat',
    defaultDurationDays: 125,
    stages: {
      1: {
        stageNumber: 1,
        title: 'Stage 1: Sowing & Crown Root Initiation (CRI)',
        subtitle: 'Germination, Coleoptile emergence & Crown root development',
        dayRange: 'Days 0 – 25',
        progressPct: 15,
        keyActivities: [
          'Seed treatment with Carboxin + Thiram (2g/kg) and Azotobacter culture',
          'CRI Stage (20-25 DAS) is the single most critical irrigation stage',
          'Apply pre-emergence weedicide (Pendimethalin 30% EC within 3 days)'
        ],
        fertilizerDose: 'Basal Dose: Full P2O5 (60 kg/ha), Full K2O (40 kg/ha), 1/3rd Nitrogen (40 kg/ha)',
        irrigationRule: 'First irrigation strictly at CRI stage (21 DAS); crown roots initiate secondary tillering',
        riskWatch: 'Delayed CRI irrigation permanently reduces effective tiller count per plant by up to 35%',
        pestAlert: 'Termites in light sandy soil; armyworm cutting early seedlings'
      },
      2: {
        stageNumber: 2,
        title: 'Stage 2: Active Tillering & Jointing',
        subtitle: 'Stem elongation, Secondary root network & Node development',
        dayRange: 'Days 26 – 60',
        progressPct: 40,
        keyActivities: [
          'Second irrigation at Late Tillering stage (40-45 DAS)',
          'Top-dress 2nd split of Nitrogen (Urea 40 kg/ha) followed by light irrigation',
          'Spray post-emergence herbicide (Clodinafop-propargyl for Phalaris minor / Mandusi)'
        ],
        fertilizerDose: 'Top dress 1/3rd Urea (40 kg/ha) + Zinc Sulphate (25 kg/ha if zinc deficient)',
        irrigationRule: 'Provide 2nd irrigation at late tillering (42 DAS) and 3rd at jointing (60 DAS)',
        riskWatch: 'Yellowing of lower leaves due to nitrogen leaching or waterlogging in clay patches',
        pestAlert: 'Foliar aphids (Rhopalosiphum padi) colonizing under-leaf surfaces'
      },
      3: {
        stageNumber: 3,
        title: 'Stage 3: Booting, Heading & Flowering',
        subtitle: 'Flag leaf emergence, Ear head emergence & Anthesis',
        dayRange: 'Days 61 – 90',
        progressPct: 75,
        keyActivities: [
          'Irrigation at Flowering stage (80-85 DAS) - avoid irrigation during heavy winds to prevent lodging',
          'Foliar spray of 0:52:34 (1%) + Zinc EDTA (1g/L) for bold grain development',
          'Prophylactic scouting for Stripe (Yellow) Rust and Leaf Blight'
        ],
        fertilizerDose: 'Final top-dressing of remaining Urea (30 kg/ha) before flag leaf stage',
        irrigationRule: 'Flowering & Milking stages require steady soil moisture; irrigate on calm wind days only',
        riskWatch: 'Crop lodging (falling over) if irrigation coincides with strong westerly winds (>20 km/h)',
        pestAlert: 'Yellow / Brown Rust pustules on flag leaf; wheat earhead bug'
      },
      4: {
        stageNumber: 4,
        title: 'Stage 4: Grain Filling, Dough & Maturity',
        subtitle: 'Milking, Soft/Hard dough stage & Golden ripening',
        dayRange: 'Days 91 – 130+',
        progressPct: 100,
        keyActivities: [
          'Last irrigation at early dough stage (100-105 DAS) to maximize test weight (1000-grain wt)',
          'Withhold irrigation during hard dough stage to enable natural sun drying',
          'Combine harvest when grain moisture drops below 12-14%',
          'Store in clean, fumigated metal bins or airtight hermetic bags'
        ],
        fertilizerDose: 'No fertilizer application in dough and ripening stages',
        irrigationRule: 'Stop all water 15 days before combine harvest to avoid soil compaction and wet straw',
        riskWatch: 'Terminal heat stress (sudden rise in temperature >32°C) causing shriveled grains',
        pestAlert: 'Rust pustule blackening (Teliospores); granary weevil in storage'
      }
    }
  },
  Cotton: {
    cropName: 'Cotton',
    defaultDurationDays: 160,
    stages: {
      1: {
        stageNumber: 1,
        title: 'Stage 1: Sowing, Emergence & Square Initiation',
        subtitle: 'Germination, Monopodial branching & Pin-head square formation',
        dayRange: 'Days 0 – 35',
        progressPct: 15,
        keyActivities: [
          'Dibble seeds at 90x60 cm or 120x45 cm spacing on ridges',
          'Gap filling within 8-10 DAS to maintain plant population (7,000-9,000 plants/acre)',
          'Apply Imidacloprid seed treatment against sucking pests'
        ],
        fertilizerDose: 'Basal Dose: 25% Nitrogen (30 kg/ha), 100% P2O5 (60 kg/ha), 50% K2O (30 kg/ha)',
        irrigationRule: 'Light initial irrigation; avoid standing water on young seedlings',
        riskWatch: 'Root rot & seedling wilt in heavy black cotton soil under waterlogged conditions',
        pestAlert: 'Early sucking pests: Thrips, Jassids, and Whiteflies'
      },
      2: {
        stageNumber: 2,
        title: 'Stage 2: Vegetative Growth & Peak Squaring',
        subtitle: 'Sympodial fruiting branches, Square development & Canopy build-up',
        dayRange: 'Days 36 – 70',
        progressPct: 40,
        keyActivities: [
          'First top dressing of Nitrogen at 35 DAS (30 kg/ha) + earthing up',
          'Install Pheromone traps for Pink Bollworm (Pectinophora gossypiella @ 5/acre)',
          'Foliar spray of 19:19:19 + Magnesium Sulphate (1%) to prevent reddening of leaves'
        ],
        fertilizerDose: 'Top dress 2nd split of N (30 kg/ha) + micronutrient foliar spray (Magnesium + Boron)',
        irrigationRule: 'Maintain 50% available soil moisture through drip or furrow at 10-12 day intervals',
        riskWatch: 'Square shedding due to severe vegetative overgrowth (lush canopy) or cloudy spells',
        pestAlert: 'Pink bollworm adult rosette flowers; Aphids and Whitefly transmitting Leaf Curl Virus'
      },
      3: {
        stageNumber: 3,
        title: 'Stage 3: Peak Flowering & Boll Development',
        subtitle: 'White/pink flower anthesis, Boll enlargement & Fiber elongation',
        dayRange: 'Days 71 – 115',
        progressPct: 75,
        keyActivities: [
          'CRITICAL PERIOD: Peak moisture and nutrient demand phase',
          'Foliar spray of 13:00:45 (Potassium Nitrate 10g/L) + Planofix (NAA 4.5 SL @ 4ml/15L) to curb boll drop',
          'Inspect green bolls for Pink Bollworm entry holes'
        ],
        fertilizerDose: '3rd split of N (30 kg/ha) + remaining K2O (30 kg/ha) at peak boll development',
        irrigationRule: 'Strictly avoid water stress during boll expansion; irrigate every 6-8 days in drip',
        riskWatch: 'Boll rot and internal boll damage by second-generation bollworm larvae',
        pestAlert: 'Pink Bollworm (PBW) larvae tunneling inside developing bolls; Spodoptera defoliation'
      },
      4: {
        stageNumber: 4,
        title: 'Stage 4: Boll Bursting & Multi-Pick Harvesting',
        subtitle: 'Boll cracking, Fluffy white lint exposure & Pickings',
        dayRange: 'Days 116 – 170+',
        progressPct: 100,
        keyActivities: [
          'First picking when 50-60% bolls are fully burst and dry',
          'Pick clean seed-cotton in early morning hours to avoid dry leaf trash contamination',
          'Dry picked seed cotton on clean tarpaulins before market delivery',
          'Terminate crop cycle on time to break the Pink Bollworm carry-over cycle'
        ],
        fertilizerDose: 'No chemical fertilizers. Optional 1% Potassium spray for late remaining top bolls',
        irrigationRule: 'Taper off irrigation. Stop 15-20 days before final picking to promote uniform boll opening',
        riskWatch: 'Lint staining and quality degradation if unseasonal rain drenches open bolls',
        pestAlert: 'Dusky cotton bug and Red cotton bug staining open lint'
      }
    }
  },
  'Rice / Paddy': {
    cropName: 'Rice / Paddy',
    defaultDurationDays: 130,
    stages: {
      1: {
        stageNumber: 1,
        title: 'Stage 1: Nursery & Transplanting / Seedling',
        subtitle: 'Wet bed raising, Uprooting, Transplanting & Hill establishment',
        dayRange: 'Days 0 – 25',
        progressPct: 15,
        keyActivities: [
          'Nursery raising with Trichoderma seed treatment (10g/kg)',
          'Transplant 20-25 day old seedlings at 20x15 cm spacing (2-3 seedlings per hill)',
          'Maintain 2-3 cm shallow standing water during seedling establishment'
        ],
        fertilizerDose: 'Basal Dose: 1/3rd Nitrogen (40 kg/ha), Full P2O5 (50 kg/ha), 1/2 K2O (25 kg/ha) + Zinc Sulphate (25 kg/ha)',
        irrigationRule: 'Maintain 2-3 cm thin water layer during transplanting and initial 7-10 days',
        riskWatch: 'Khaira disease (Zinc deficiency) showing rusty brown leaf spotting; snail feeding',
        pestAlert: 'Yellow stem borer (dead hearts at seedling stage); Caseworm'
      },
      2: {
        stageNumber: 2,
        title: 'Stage 2: Active Tillering & Panicle Initiation',
        subtitle: 'Tiller multiplication, Root respiration & Internode elongation',
        dayRange: 'Days 26 – 60',
        progressPct: 40,
        keyActivities: [
          'Alternate Wetting and Drying (AWD) to aerate root zone and save 25% water',
          'Top-dress 2nd split of Urea (40 kg/ha) at maximum tillering (35-40 DAT)',
          'Weed control with cono-weeder or post-emergence herbicide (Bispyribac-sodium)'
        ],
        fertilizerDose: 'Top dress 1/3rd Nitrogen (40 kg/ha) at active tillering',
        irrigationRule: 'Adopt AWD (Alternate Wetting and Drying) with 5 cm water, then let dry for 2 days',
        riskWatch: 'Excessive stagnant water restricting oxygen to roots and causing sulfide injury',
        pestAlert: 'Stem borer (dead hearts) and Leaf folder (scraped transparent leaf tubes)'
      },
      3: {
        stageNumber: 3,
        title: 'Stage 3: Booting, Flowering & Milking',
        subtitle: 'Flag leaf expansion, Panicle exertion, Anthesis & Grain filling',
        dayRange: 'Days 61 – 95',
        progressPct: 75,
        keyActivities: [
          'MOST SENSITIVE TO MOISTURE STRESS: Maintain 5 cm continuous standing water',
          'Top-dress final 1/3rd N (40 kg/ha) + remaining K2O (25 kg/ha) at Panicle Initiation',
          'Prophylactic spray against Neck Blast, Bacterial Leaf Blight, and Sheath Blight'
        ],
        fertilizerDose: 'Final Nitrogen split (30 kg/ha) + Potassium (25 kg/ha) at Panicle Initiation',
        irrigationRule: 'Strictly maintain 5 cm water depth from heading to milking stage',
        riskWatch: 'White earheads (chaffy sterile grains) if water stress occurs during flowering',
        pestAlert: 'Brown Planthopper (BPH) hopper burn in dense canopy; Gundhi bug feeding on milk'
      },
      4: {
        stageNumber: 4,
        title: 'Stage 4: Dough, Golden Ripening & Harvesting',
        subtitle: 'Hard dough, Panicle drooping & Golden grain maturity',
        dayRange: 'Days 96 – 135+',
        progressPct: 100,
        keyActivities: [
          'Drain field water completely 10-12 days before scheduled harvest',
          'Harvest when 80-85% grains in panicles turn golden yellow and straw dries',
          'Thresh and dry grain on clean floor until moisture reaches 12-14%',
          'Protect stored paddy from moisture and rodents'
        ],
        fertilizerDose: 'No fertilizer application in ripening stage',
        irrigationRule: 'Complete surface water drainage 10-12 days prior to combine or manual harvesting',
        riskWatch: 'Grain shattering if harvesting is delayed; mold growth if un-drained field floods',
        pestAlert: 'Storage weevils (Sitophilus oryzae) in granaries'
      }
    }
  },
  Sugarcane: {
    cropName: 'Sugarcane',
    defaultDurationDays: 330,
    stages: {
      1: {
        stageNumber: 1,
        title: 'Stage 1: Germination & Sprouting Phase',
        subtitle: 'Sett bud swelling, Primary shoot emergence & Root band activity',
        dayRange: 'Days 0 – 45',
        progressPct: 15,
        keyActivities: [
          'Sett treatment with Carbendazim (1g/L) for 15 mins to eliminate Red Rot spores',
          'Plant 2-3 bud setts in furrows at 4-5 feet row spacing',
          'Apply pre-emergence Atrazine (2 kg/ha) within 3 days of planting'
        ],
        fertilizerDose: 'Basal Dose: 10% Nitrogen (25 kg/ha), 100% P2O5 (85 kg/ha), 50% K2O (60 kg/ha)',
        irrigationRule: 'Light, frequent irrigation (every 6-8 days) to keep soil moist for bud sprouting',
        riskWatch: 'Sett rotting in heavy waterlogged soils; poor bud sprouting if setts dry out',
        pestAlert: 'Early shoot borer (Chilo infuscatellus) causing dead hearts in young shoots'
      },
      2: {
        stageNumber: 2,
        title: 'Stage 2: Tillering / Formative Phase',
        subtitle: 'Clump formation, Mother shoot tillering & Root network expansion',
        dayRange: 'Days 46 – 120',
        progressPct: 35,
        keyActivities: [
          'First earthing up at 45 DAS and partial earthing up at 90 DAS',
          'Top-dress 2nd split of Nitrogen (Urea @ 75 kg/ha) at 45-60 DAS',
          'Spray 19:19:19 + Ferrous Sulphate (1%) in alkaline/calcareous soils'
        ],
        fertilizerDose: 'Top dress 40% Nitrogen (100 kg/ha) in two equal splits at 45 and 90 DAS',
        irrigationRule: 'Irrigate at 8-10 day intervals; moisture stress during tillering cuts millable cane count',
        riskWatch: 'Moisture stress suppresses tiller production; iron chlorosis in high pH soils',
        pestAlert: 'Internode borer and Whitefly infestation on lower leaf surface'
      },
      3: {
        stageNumber: 3,
        title: 'Stage 3: Grand Growth & Elongation Phase',
        subtitle: 'Rapid internode extension, Cane girth swelling & Biomass accumulation',
        dayRange: 'Days 121 – 250',
        progressPct: 75,
        keyActivities: [
          'Heavy earthing up (90-120 DAS) to prevent cane lodging in monsoon winds',
          'Trash mulching between rows to conserve moisture and suppress weeds',
          'Propping / trash wrapping (binding canes together) to resist cyclonic lodging'
        ],
        fertilizerDose: 'Final split of Nitrogen (50 kg/ha) + remaining K2O (60 kg/ha) before grand growth closes',
        irrigationRule: 'Peak water requirement (10-12 days frequency); avoid prolonged waterlogging',
        riskWatch: 'Cane lodging in high winds leading to rat damage and sucrose inversion',
        pestAlert: 'Top shoot borer (Scirpophaga excerptalis) causing bunchy top; Pyrilla leafhopper'
      },
      4: {
        stageNumber: 4,
        title: 'Stage 4: Ripening, Sucrose Accumulation & Harvest',
        subtitle: 'Vegetative slowdown, Sugar concentration & Brix value peaking (>18°)',
        dayRange: 'Days 251 – 360+',
        progressPct: 100,
        keyActivities: [
          'Withhold irrigation 20-30 days prior to cane harvesting to concentrate sucrose',
          'Check hand-refractometer brix (>18-20% indicates peak sugar recovery)',
          'Harvest close to ground level (highest sucrose concentration is in bottom 3 internodes)',
          'Deliver to sugar mill within 24-36 hours of cutting to avoid post-harvest inversion'
        ],
        fertilizerDose: 'Zero nitrogen in ripening stage (excess nitrogen reduces sucrose crystallization)',
        irrigationRule: 'Stop irrigation 20-25 days before mill harvest to maximize sugar recovery %',
        riskWatch: 'Delayed crushing causing sucrose inversion and weight loss up to 1.5% per day',
        pestAlert: 'Woolly aphids and Scale insect on mature rind'
      }
    }
  },
  Maize: {
    cropName: 'Maize',
    defaultDurationDays: 105,
    stages: {
      1: {
        stageNumber: 1,
        title: 'Stage 1: Sowing & Seedling Emergence (VE-V4)',
        subtitle: 'Coleoptile emergence, Whorl formation & Primary root anchorage',
        dayRange: 'Days 0 – 20',
        progressPct: 15,
        keyActivities: [
          'Seed treatment with Cyantraniliprole 19.8% + Thiamethoxam 19.8% against Fall Armyworm',
          'Sow at 60x20 cm spacing on ridges; apply Atrazine 50% WP (1 kg/ha) pre-emergence',
          'Thin out to single vigorous plant per hill at 12-14 DAS'
        ],
        fertilizerDose: 'Basal Dose: 1/3rd Nitrogen (40 kg/ha), Full P2O5 (60 kg/ha), Full K2O (40 kg/ha) + Zinc (25 kg/ha)',
        irrigationRule: 'Light initial furrow irrigation; avoid waterlogging around seed zone',
        riskWatch: 'Seedling blight in wet cold soils; early Fall Armyworm leaf scraping',
        pestAlert: 'Fall Armyworm (Spodoptera frugiperda) window pane leaf damage'
      },
      2: {
        stageNumber: 2,
        title: 'Stage 2: Knee-High & Rapid Vegetative (V6-V12)',
        subtitle: 'Canopy closure, Brace root development & Tassel initiation',
        dayRange: 'Days 21 – 45',
        progressPct: 40,
        keyActivities: [
          'First top dressing of Urea (40 kg/ha) at Knee-high stage (30 DAS) with earthing up',
          'Direct scouting inside leaf whorls for Fall Armyworm caterpillars',
          'Foliar application of Chlorantraniliprole 18.5 SC (0.4 ml/L) or Emamectin Benzoate if FAW crosses 5% threshold'
        ],
        fertilizerDose: 'Top dress 1/3rd Nitrogen (Urea 45 kg/ha) at Knee-High stage + Zinc foliar spray',
        irrigationRule: 'Irrigate at 8-10 day intervals; do not let soil crack deeply',
        riskWatch: 'Nutrient starvation during rapid canopy expansion drastically lowers cob size',
        pestAlert: 'Fall Armyworm whorl feeding and stem borer tunnels'
      },
      3: {
        stageNumber: 3,
        title: 'Stage 3: Tasseling, Silking & Blister / Milk (VT-R3)',
        subtitle: 'Pollen shed, Silk emergence, Ovule fertilization & Kernel swelling',
        dayRange: 'Days 46 – 75',
        progressPct: 75,
        keyActivities: [
          'MOST CRITICAL IRRIGATION PERIOD: Silking & Tasseling cannot endure water deficit',
          'Top dress final 1/3rd Nitrogen (Urea 35 kg/ha) at pre-tasseling stage',
          'Foliar spray of 0:52:34 (1%) + Boron (1g/L) for 100% tip filling of cobs'
        ],
        fertilizerDose: 'Final Nitrogen split (35 kg/ha) before tassel emergence',
        irrigationRule: 'Strictly irrigate at Tasseling and Silking; 2 days of drought reduces yield by 20%',
        riskWatch: 'Poor pollination (chaffy cob tips) due to high heat (>38°C) or severe water deficit',
        pestAlert: 'Cob borer (Helicoverpa armigera) entering through silk channel into developing cob'
      },
      4: {
        stageNumber: 4,
        title: 'Stage 4: Dough, Dent & Black Layer Maturity (R4-R6)',
        subtitle: 'Starch hard-pack, Husk browning & Black layer formation on kernel tip',
        dayRange: 'Days 76 – 110+',
        progressPct: 100,
        keyActivities: [
          'Stop irrigation when cob husks turn straw-yellow and dry',
          'Harvest when physiological black layer appears at the tip of kernel attachment',
          'De-husk and sun dry cobs to 12-14% moisture before shelling',
          'Shell with mechanical maize sheller to keep grain intact'
        ],
        fertilizerDose: 'No fertilizer in dough and dent stages',
        irrigationRule: 'Stop irrigation 10-12 days before cob harvesting',
        riskWatch: 'Aspergillus flavus (Aflatoxin) mold infection if harvested cobs are stored damp',
        pestAlert: 'Grain weevil in storage'
      }
    }
  }
};

// Universal Generic Fallback for crops not listed explicitly
export function getCropStageSystem(cropName: string): CropStageSystem {
  const normalized = Object.keys(CROP_STAGES_CATALOG).find(
    (k) => k.toLowerCase() === cropName.toLowerCase() || cropName.toLowerCase().includes(k.toLowerCase())
  );

  if (normalized && CROP_STAGES_CATALOG[normalized]) {
    return CROP_STAGES_CATALOG[normalized];
  }

  // Generic 4-stage agricultural model
  return {
    cropName: cropName || 'General Crop',
    defaultDurationDays: 120,
    stages: {
      1: {
        stageNumber: 1,
        title: 'Stage 1: Sowing & Seedling Emergence',
        subtitle: 'Germination, root anchoring & early seedling establishment',
        dayRange: 'Days 0 – 25',
        progressPct: 15,
        keyActivities: [
          'Certified seed treatment with bio-fungicide (Trichoderma 5g/kg)',
          'Sow in well-pulverized seedbed with adequate soil moisture',
          'Pre-emergence weed control within 48 hours of sowing'
        ],
        fertilizerDose: 'Basal Dose: 1/3rd Nitrogen + 100% Phosphorus + 50% Potassium',
        irrigationRule: 'Light initial irrigation; prevent crust formation and water-logging',
        riskWatch: 'Damping off and cutworm damage to tender emerging seedlings',
        pestAlert: 'Early sucking pests and seedling stem cutting'
      },
      2: {
        stageNumber: 2,
        title: 'Stage 2: Vegetative Growth & Branching / Tillering',
        subtitle: 'Canopy expansion, secondary root network & vegetative vigor',
        dayRange: 'Days 26 – 55',
        progressPct: 40,
        keyActivities: [
          'Inter-cultivation weeding and soil aeration at 20-30 DAS',
          'Top-dress 2nd split of Nitrogen (Urea) with balanced micronutrient spray',
          'Install sticky and pheromone monitoring traps'
        ],
        fertilizerDose: 'Top dress 1/3rd Nitrogen + foliar micronutrient blend (Zinc, Iron, Boron)',
        irrigationRule: 'Provide steady irrigation at 8-12 day intervals according to soil texture',
        riskWatch: 'Nitrogen deficiency and weed competition choking young crop canopy',
        pestAlert: 'Defoliating caterpillars, leaf miners and sucking insects'
      },
      3: {
        stageNumber: 3,
        title: 'Stage 3: Flowering & Reproductive Pod / Grain Formation',
        subtitle: 'Anthesis, pollination, fruit/grain set & rapid cell enlargement',
        dayRange: 'Days 56 – 90',
        progressPct: 75,
        keyActivities: [
          'CRITICAL MOISTURE PERIOD: Strictly prevent water stress during blooming and fruit set',
          'Foliar spray of 0:52:34 (MKP 1%) + Boron (1g/L) to prevent flower/pod drop',
          'Prophylactic scouting for fungal blights and fruit/pod borers'
        ],
        fertilizerDose: 'Final Nitrogen split + Potassium Nitrate (13:00:45) foliar booster',
        irrigationRule: 'Maintain optimal root-zone moisture; do not allow sudden drying or flooding',
        riskWatch: 'Abrupt flower drop, pod abortion or sterile grain heads from water deficit',
        pestAlert: 'Pod and fruit borers, aphids, and flower thrips'
      },
      4: {
        stageNumber: 4,
        title: 'Stage 4: Maturity, Ripening & Harvesting',
        subtitle: 'Senescence, grain hard-dough, color change & final harvest',
        dayRange: 'Days 91 – 130+',
        progressPct: 100,
        keyActivities: [
          'Stop irrigation 10-15 days prior to harvest to enable uniform dry-down',
          'Harvest when 85-90% of fruits/pods/grains reach full maturity index',
          'Thresh and dry to safe storage moisture (<12-14%)',
          'Plan mandi logistics and safe hermetic storage'
        ],
        fertilizerDose: 'Zero fertilizers during ripening and pre-harvest phase',
        irrigationRule: 'Withhold irrigation to facilitate machine/manual harvesting and prevent rotting',
        riskWatch: 'Pre-harvest shattering or rotting if caught in unseasonal rainfall',
        pestAlert: 'Storage pests (weevils, beetles, moths)'
      }
    }
  };
}
