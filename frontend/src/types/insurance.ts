export type PMFBYSeason = 'Kharif' | 'Rabi' | 'Commercial / Horticultural';

export type PolicyStatusStage =
  | 'submitted'
  | 'doc_verification'
  | 'insurance_processing'
  | 'crop_verification'
  | 'policy_approved'
  | 'policy_active'
  | 'rejected';

export interface InsurancePolicyRecord {
  id: string; // e.g. PMFBY-TN-2026-84920
  farmerName: string;
  mobile: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  surveyNumber: string;
  crop: string;
  season: PMFBYSeason;
  sowingDate: string;
  landAreaAcres: number;
  sumInsured: number; // ₹ Total
  farmerPremiumRatePct: number; // e.g. 2.0%
  farmerPremiumAmount: number; // ₹
  govSubsidyAmount: number; // ₹
  insuranceCompany: string;
  policyPeriod: string;
  status: PolicyStatusStage;
  submittedDate: string;
  currentMilestone: string;
  rejectionReason?: string;
  correctiveAction?: string;
  certificateUrl?: string;
}

export interface CropLossReport {
  id: string; // e.g. CLAIM-2026-77391
  policyId?: string;
  crop: string;
  surveyNumber: string;
  location: string;
  dateOfLoss: string;
  damageCategory:
    | 'Drought'
    | 'Flood'
    | 'Heavy Rain'
    | 'Hailstorm'
    | 'Cyclone'
    | 'Landslide'
    | 'Pest'
    | 'Disease'
    | 'Inundation'
    | 'Other eligible event';
  estimatedDamagePct: number;
  description: string;
  photos: string[];
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
  reportedDate: string;
  status: 'Reported' | 'Surveyor Assigned' | 'Field Assessment In Progress' | 'Assessment Approved' | 'Settlement Disbursed';
  trackingNumber: string;
}

export interface PremiumCalculationResult {
  state: string;
  district: string;
  crop: string;
  season: PMFBYSeason;
  areaAcres: number;
  sumInsuredPerAcre: number;
  totalSumInsured: number;
  farmerRatePct: number;
  farmerPremiumPayable: number;
  actuarialRatePct: number;
  totalGrossPremium: number;
  centralSubsidyShare: number;
  stateSubsidyShare: number;
  totalGovtSubsidy: number;
  coverageWindow: string;
}
