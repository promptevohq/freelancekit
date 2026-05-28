import type { ToolMeta } from '../types';

export const TOOLS: ToolMeta[] = [
  {
    id: 'proposal',
    label: 'Proposal Generator',
    description: 'Craft winning project proposals that convert prospects into clients.',
    icon: '📋',
    color: 'teal',
    steps: ['Project Details', 'Preview Proposal', 'Copy & Send'],
  },
  {
    id: 'followup',
    label: 'Follow-up Email',
    description: 'Write timely, professional follow-ups that get responses.',
    icon: '📧',
    color: 'blue',
    steps: ['Email Details', 'Preview Email', 'Copy & Send'],
  },
  {
    id: 'scope',
    label: 'Project Scope Builder',
    description: 'Define clear project boundaries to prevent scope creep.',
    icon: '🗂️',
    color: 'violet',
    steps: ['Scope Details', 'Preview Document', 'Copy & Send'],
  },
  {
    id: 'invoice',
    label: 'Invoice Reminder',
    description: 'Send polite but firm payment reminders that get you paid.',
    icon: '💰',
    color: 'amber',
    steps: ['Invoice Details', 'Preview Reminder', 'Copy & Send'],
  },
  {
    id: 'onboarding',
    label: 'Client Onboarding Kit',
    description: 'Welcome new clients with a professional onboarding experience.',
    icon: '🤝',
    color: 'emerald',
    steps: ['Client Details', 'Preview Kit', 'Copy & Send'],
  },
  {
    id: 'calculator',
    label: 'Rate & Package Calculator',
    description: 'Calculate your ideal rates and build service packages.',
    icon: '🧮',
    color: 'rose',
    steps: ['Your Numbers', 'View Results', 'Copy Packages'],
  },
];

export const TOOL_MAP = Object.fromEntries(TOOLS.map((t) => [t.id, t])) as Record<
  string,
  ToolMeta
>;
