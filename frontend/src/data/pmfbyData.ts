import { InsurancePolicyRecord, CropLossReport, PMFBYSeason } from '../types/insurance';

export interface PMFBYCropConfig {
  name: string;
  season: PMFBYSeason;
  defaultSumInsuredPerAcre: number;
  farmerRatePct: number; // Kharif: 2.0%, Rabi: 1.5%, Commercial/Horticulture: 5.0%
  actuarialRatePct: number; // Total market rate before subsidy (e.g. 12-16%)
  empanelledCompany: string;
}

export const OFFICIAL_PMFBY_CROPS: Record<string, PMFBYCropConfig> = {
  'Tomato': {
    name: 'Tomato',
    season: 'Commercial / Horticultural',
    defaultSumInsuredPerAcre: 65000,
    farmerRatePct: 5.0,
    actuarialRatePct: 14.5,
    empanelledCompany: 'Agriculture Insurance Company of India (AICIL)'
  },
  'Onion': {
    name: 'Onion',
    season: 'Commercial / Horticultural',
    defaultSumInsuredPerAcre: 55000,
    farmerRatePct: 5.0,
    actuarialRatePct: 13.8,
    empanelledCompany: 'HDFC ERGO General Insurance Co. Ltd.'
  },
  'Potato': {
    name: 'Potato',
    season: 'Rabi',
    defaultSumInsuredPerAcre: 70000,
    farmerRatePct: 1.5,
    actuarialRatePct: 12.0,
    empanelledCompany: 'IFFCO Tokio General Insurance'
  },
  'Paddy': {
    name: 'Paddy / Basmati Rice',
    season: 'Kharif',
    defaultSumInsuredPerAcre: 48000,
    farmerRatePct: 2.0,
    actuarialRatePct: 11.5,
    empanelledCompany: 'Agriculture Insurance Company of India (AICIL)'
  },
  'Wheat': {
    name: 'Wheat',
    season: 'Rabi',
    defaultSumInsuredPerAcre: 45000,
    farmerRatePct: 1.5,
    actuarialRatePct: 10.0,
    empanelledCompany: 'SBI General Insurance'
  },
  'Cotton': {
    name: 'Cotton (Kapas)',
    season: 'Commercial / Horticultural',
    defaultSumInsuredPerAcre: 60000,
    farmerRatePct: 5.0,
    actuarialRatePct: 15.2,
    empanelledCompany: 'Bajaj Allianz General Insurance'
  },
  'Turmeric': {
    name: 'Turmeric',
    season: 'Commercial / Horticultural',
    defaultSumInsuredPerAcre: 85000,
    farmerRatePct: 5.0,
    actuarialRatePct: 16.0,
    empanelledCompany: 'Agriculture Insurance Company of India (AICIL)'
  },
  'Maize': {
    name: 'Maize (Corn)',
    season: 'Kharif',
    defaultSumInsuredPerAcre: 38000,
    farmerRatePct: 2.0,
    actuarialRatePct: 11.0,
    empanelledCompany: 'ICICI Lombard General Insurance'
  },
  'Carrot': {
    name: 'Carrot',
    season: 'Commercial / Horticultural',
    defaultSumInsuredPerAcre: 58000,
    farmerRatePct: 5.0,
    actuarialRatePct: 13.5,
    empanelledCompany: 'Agriculture Insurance Company of India (AICIL)'
  }
};

export const INITIAL_DEMO_POLICIES: InsurancePolicyRecord[] = [
  {
    id: 'PMFBY-TN-2026-84920',
    farmerName: 'Selvam Murugan',
    mobile: '+91 98765 43210',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    taluk: 'Mettupalayam',
    village: 'Sirumugai',
    surveyNumber: '42/1A',
    crop: 'Tomato',
    season: 'Commercial / Horticultural',
    sowingDate: '2026-06-15',
    landAreaAcres: 3.5,
    sumInsured: 227500,
    farmerPremiumRatePct: 5.0,
    farmerPremiumAmount: 11375,
    govSubsidyAmount: 21612,
    insuranceCompany: 'Agriculture Insurance Company of India (AICIL)',
    policyPeriod: 'Kharif 2026 – Rabi 2027',
    status: 'policy_active',
    submittedDate: '2026-06-20',
    currentMilestone: 'Policy Active & Fully Protected',
    certificateUrl: '#'
  },
  {
    id: 'PMFBY-TN-2026-91823',
    farmerName: 'Selvam Murugan',
    mobile: '+91 98765 43210',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    taluk: 'Mettupalayam',
    village: 'Sirumugai',
    surveyNumber: '89/3B',
    crop: 'Paddy',
    season: 'Kharif',
    sowingDate: '2026-07-01',
    landAreaAcres: 2.0,
    sumInsured: 96000,
    farmerPremiumRatePct: 2.0,
    farmerPremiumAmount: 1920,
    govSubsidyAmount: 9120,
    insuranceCompany: 'Agriculture Insurance Company of India (AICIL)',
    policyPeriod: 'Kharif 2026',
    status: 'insurance_processing',
    submittedDate: '2026-07-05',
    currentMilestone: 'Insurance Company Underwriting Review'
  },
  {
    id: 'PMFBY-TN-2025-33109',
    farmerName: 'Selvam Murugan',
    mobile: '+91 98765 43210',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    taluk: 'Annur',
    village: 'Kariyampalayam',
    surveyNumber: '112/5',
    crop: 'Cotton',
    season: 'Commercial / Horticultural',
    sowingDate: '2025-08-10',
    landAreaAcres: 1.5,
    sumInsured: 90000,
    farmerPremiumRatePct: 5.0,
    farmerPremiumAmount: 4500,
    govSubsidyAmount: 9180,
    insuranceCompany: 'Bajaj Allianz General Insurance',
    policyPeriod: 'Kharif 2025',
    status: 'rejected',
    submittedDate: '2025-08-25',
    currentMilestone: 'Application Rejected',
    rejectionReason: 'Land Adangal / Patta record name mismatched with Aadhaar bank passbook entry for Survey No. 112/5.',
    correctiveAction: 'Upload an updated revenue certificate or certified Patta copy matching your exact registered Aadhaar name and re-submit online.'
  }
];

export const INITIAL_DEMO_LOSS_REPORTS: CropLossReport[] = [
  {
    id: 'CLAIM-2026-77391',
    policyId: 'PMFBY-TN-2026-84920',
    crop: 'Tomato',
    surveyNumber: '42/1A',
    location: 'Sirumugai, Mettupalayam, Coimbatore',
    dateOfLoss: '2026-08-22',
    damageCategory: 'Heavy Rain',
    estimatedDamagePct: 45,
    description: 'Sudden flash cloudburst waterlogged the entire lower terrace; root rot and blossom drop observed across 1.5 acres.',
    photos: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=500&auto=format&fit=crop&q=80'
    ],
    gpsCoordinates: {
      latitude: 11.2995,
      longitude: 76.9945
    },
    reportedDate: '2026-08-23',
    status: 'Surveyor Assigned',
    trackingNumber: 'TN-CBE-LOSS-2026-0842'
  }
];

export const PMFBY_FAQS = [
  {
    q: 'What is Pradhan Mantri Fasal Bima Yojana (PMFBY)?',
    a: 'PMFBY is the flagship crop insurance scheme launched by the Government of India (Ministry of Agriculture & Farmers Welfare) to provide financial support to farmers suffering crop loss or damage arising out of unforeseen natural calamities, pests, and diseases.'
  },
  {
    q: 'Who can benefit from PMFBY?',
    a: 'All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers, are eligible for coverage. The scheme is voluntary for all farmers.'
  },
  {
    q: 'What crops are covered under PMFBY?',
    a: 'Food crops (Cereals, Millets, and Pulses), Oilseeds, and Annual Commercial / Annual Horticultural crops notified by respective state governments.'
  },
  {
    q: 'What are the premium rates payable by farmers?',
    a: 'PMFBY has very low farmer premium rates: Maximum 2.0% of Sum Insured for Kharif food and oilseed crops, 1.5% for Rabi food and oilseed crops, and 5.0% for annual commercial / horticultural crops. The balance premium is heavily subsidized and shared equally between Central and State Governments.'
  },
  {
    q: 'What risks and stages of crop loss are covered?',
    a: '1. Prevented Sowing / Planting Risk\n2. Standing Crop Losses (Drought, Flood, Inundation, Cyclone, Hailstorm, Pest/Disease)\n3. Post-Harvest Losses (up to 14 days after harvest for crops kept in field in cut & spread condition)\n4. Localized Calamities (Hailstorm, Landslide, Inundation, Cloudburst).'
  },
  {
    q: 'What is the deadline to report crop loss / localized damage?',
    a: 'Loss must be intimated within 72 hours of the calamity occurrence through the Crop Insurance App, official PMFBY portal (pmfby.gov.in), Toll-Free Helpline 14447, or nearest Agriculture Officer / Bank Branch.'
  },
  {
    q: 'What documents are required to apply?',
    a: '1. Aadhaar Card\n2. Bank Passbook (with IFSC and Aadhaar linkage)\n3. Land Record (Patta / Chitta / 7/12 / Land Possession Certificate)\n4. Sowing Certificate or Self-Declaration of Sowing\n5. Tenant / Sharecropper agreement (if applicable).'
  },
  {
    q: 'How are insurance claim settlements processed?',
    a: 'Claims for widespread losses are calculated using Crop Cutting Experiments (CCE) data compared with threshold yields. Localized losses and post-harvest losses are assessed by designated loss assessment teams using geo-tagged satellite data and digital photos.'
  }
];

export const PMFBY_OFFICIAL_LINKS = {
  portal: 'https://pmfby.gov.in/',
  guidelines: 'https://pmfby.gov.in/pdf/Revised_Operational_Guidelines.pdf',
  farmerCorner: 'https://pmfby.gov.in/farmerRegistrationForm',
  premiumCalculator: 'https://pmfby.gov.in/premiumCalculator',
  trackApplication: 'https://pmfby.gov.in/applicationStatus',
  grievance: 'https://pmfby.gov.in/grievance',
  tollFreeNumber: '14447'
};
