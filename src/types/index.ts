export type ToolId =
  | 'proposal'
  | 'followup'
  | 'scope'
  | 'invoice'
  | 'onboarding'
  | 'calculator';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToolMeta {
  id: ToolId;
  label: string;
  description: string;
  icon: string;
  color: string;
  steps: string[];
}

export interface FreelancerProfile {
  name: string;
  email: string;
  role: string;
  website: string;
  phone: string;
}

export interface AppSettings {
  claudeApiKey: string;
  theme: 'light';
  profile: FreelancerProfile;
}

export interface HistoryEntry {
  id: string;
  toolId: ToolId;
  output: string;
  createdAt: string;
  label: string;
}

export interface DraftEntry {
  toolId: ToolId;
  data: Record<string, string>;
  updatedAt: string;
}

// ── Proposal ──────────────────────────────────────────────────────────────────
export interface ProposalForm {
  clientName: string;
  projectTitle: string;
  projectDescription: string;
  deliverables: string;
  timeline: string;
  budget: string;
  yourName: string;
  yourRole: string;
}

// ── Follow-up Email ────────────────────────────────────────────────────────────
export interface FollowupForm {
  clientName: string;
  projectName: string;
  daysSince: string;
  context: string;
  callToAction: string;
  yourName: string;
  tone: 'friendly' | 'professional' | 'urgent';
}

// ── Scope Builder ─────────────────────────────────────────────────────────────
export interface ScopeForm {
  projectName: string;
  clientName: string;
  objectives: string;
  inScope: string;
  outOfScope: string;
  deliverables: string;
  timeline: string;
  revisions: string;
  paymentTerms: string;
}

// ── Invoice Reminder ──────────────────────────────────────────────────────────
export interface InvoiceForm {
  clientName: string;
  invoiceNumber: string;
  amount: string;
  dueDate: string;
  daysPastDue: string;
  projectName: string;
  yourName: string;
  paymentLink: string;
  tone: 'gentle' | 'firm' | 'final';
}

// ── Onboarding Kit ────────────────────────────────────────────────────────────
export interface OnboardingForm {
  clientName: string;
  projectName: string;
  startDate: string;
  communicationChannel: string;
  meetingCadence: string;
  pointOfContact: string;
  tools: string;
  yourName: string;
  yourEmail: string;
}

// ── Rate Calculator ───────────────────────────────────────────────────────────
export interface RateForm {
  annualIncome: string;
  workWeeksPerYear: string;
  hoursPerWeek: string;
  businessExpenses: string;
  taxRate: string;
  profitMargin: string;
}

export interface RateResult {
  hourlyRate: number;
  dayRate: number;
  weeklyRate: number;
  monthlyRate: number;
  starterPackage: { name: string; price: number; description: string };
  growthPackage: { name: string; price: number; description: string };
  premiumPackage: { name: string; price: number; description: string };
}
