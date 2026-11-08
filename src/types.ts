/** App/producto publicado dentro de un canal (con enlace de acceso). */
export interface ChannelApp {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  /** Imagen de portada (la misma de su página web). Opcional. */
  image?: string;
  /** Color de marca para el degradado cuando no hay imagen. */
  brandColor: string;
  url: string;
  ctaLabel: string;
  /** Texto pequeño bajo el botón, ej. "15 días de DEMO". */
  ctaNote?: string;
}

/** Familia de negocios dentro de un canal (ej. Pedidos y repartos). */
export interface ChannelFamily {
  title: string;
  icon: string;
  examples: string;
  app?: ChannelApp;
}

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
  families?: ChannelFamily[];
  apps?: ChannelApp[];
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

/** Mini-CRM: origen de un lead */
export type LeadSource = 'web_form' | 'calendly' | 'manual' | 'whatsapp_interes' | 'chatbot';

/** Mini-CRM: estado del lead dentro del embudo comercial */
export type LeadStatus = 'nuevo' | 'contactado' | 'en_negociacion' | 'stand_by' | 'ganado' | 'perdido';

export interface Lead {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  channel: string | null;
  product: string | null;
  amount: number | null;
  currency: string;
  source: LeadSource;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
}

export type LeadInsert = Omit<Lead, 'id' | 'created_at'>;

export interface RevenueEntry {
  id: string;
  channel: string;
  product: string;
  amount: number;
  currency: string;
  description: string | null;
  entry_date: string;
  created_at: string;
}

export type RevenueInsert = Omit<RevenueEntry, 'id' | 'created_at'>;
