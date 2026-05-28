import type { InvoiceForm } from '../../types';
import { formatDate } from '../../utils/helpers';

export function generateInvoiceReminder(form: InvoiceForm): string {
  const date = formatDate();
  const isPastDue = parseInt(form.daysPastDue || '0') > 0;
  const days = parseInt(form.daysPastDue || '0');

  const subjects: Record<InvoiceForm['tone'], string> = {
    gentle: `Friendly Reminder: Invoice #${form.invoiceNumber} for ${form.projectName}`,
    firm:   `Payment Due: Invoice #${form.invoiceNumber} — ${days} Days Overdue`,
    final:  `FINAL NOTICE: Invoice #${form.invoiceNumber} — Immediate Action Required`,
  };

  const intros: Record<InvoiceForm['tone'], string> = {
    gentle: `I hope you're having a great week! I'm writing with a friendly reminder that invoice #${form.invoiceNumber} for ${form.projectName} is${isPastDue ? ` now ${days} days past due` : ' coming up'}.`,
    firm:   `I'm following up on invoice #${form.invoiceNumber} for ${form.projectName}. This payment is now ${days} days overdue and requires your immediate attention.`,
    final:  `Despite previous reminders, invoice #${form.invoiceNumber} for ${form.projectName} remains unpaid after ${days} days. This is a final notice before I pursue further action to recover the outstanding amount.`,
  };

  const closes: Record<InvoiceForm['tone'], string> = {
    gentle: `Please don't hesitate to reach out if you have any questions. I appreciate your prompt attention to this!`,
    firm:   `Please process this payment immediately to avoid any disruption to our working relationship.`,
    final:  `If payment is not received within 5 business days, I will have no choice but to pursue collections or legal remedies to recover the outstanding balance.`,
  };

  return `Subject: ${subjects[form.tone]}

Date: ${date}

Dear ${form.clientName},

${intros[form.tone]}

${'─'.repeat(50)}
INVOICE DETAILS
${'─'.repeat(50)}
Invoice Number:  #${form.invoiceNumber}
Project:         ${form.projectName}
Amount Due:      ${form.amount}
Due Date:        ${form.dueDate}
${isPastDue ? `Days Overdue:    ${days} days\n` : ''}${'─'.repeat(50)}

${form.paymentLink ? `You can pay online here: ${form.paymentLink}\n` : ''}
${closes[form.tone]}

${form.tone === 'final' ? '\nFormal written records of all communications have been kept.\n' : ''}
Best regards,
${form.yourName}
`;
}

export const ENHANCE_PROMPT = `You are an expert at writing professional invoice reminder emails. 
Enhance the following payment reminder to be clearer and more effective while remaining professional. 
Keep all invoice details (numbers, amounts, dates) exactly as-is. Return only the enhanced email.`;
