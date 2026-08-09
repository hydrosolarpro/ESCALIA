export interface Channel {
  id: string;
  code: string;
  title: string;
  description: string;
  fullDetails: string;
  tags: string[];
  color: string;
  bgColor: string;
  icon: string;
  image: string;
  caseStudyTitle?: string;
  caseStudyMetrics?: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  span: 'col-span-1' | 'md:col-span-2' | 'col-span-1 md:col-span-2' | 'col-span-1 md:col-span-3';
  details: string;
  capabilities: string[];
}

export interface DiscoveryFormState {
  name: string;
  email: string;
  reason: string;
  message?: string;
  budgetRange?: string;
}

export interface BookingState {
  name: string;
  email: string;
  date: string;
  timeSlot: string;
  channel: string;
  notes: string;
}

export interface CalculationResult {
  estimatedTimeWeeks: number;
  recommendedChannel: string;
  growthScore: number;
  keyMilestones: string[];
}
