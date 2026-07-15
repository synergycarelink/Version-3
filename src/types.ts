export interface NDISService {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  ndisCategory: string;
  iconName: string; // Used to dynamically map Lucide icons
  features: string[];
  pricingGuide: string;
}

export interface ReferralSubmission {
  id: string;
  referrerName: string;
  referrerEmail: string;
  referrerPhone: string;
  relationship: 'self' | 'family' | 'coordinator' | 'health_professional' | 'other';
  participantName: string;
  participantAge: number;
  participantGender: string;
  ndisNumber?: string;
  primaryDisability: string;
  requestedServices: string[];
  preferredContact: 'phone' | 'email' | 'any';
  additionalInfo?: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'approved';
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSizeScale: 'normal' | 'large' | 'extra-large'; // 1x, 1.15x, 1.3x
  textToSpeech: boolean;
}

export interface PlanCalculatorInput {
  weeklyCoreBudget: number;
  weeklyCapacityBudget: number;
  supportHoursRequested: number;
}
