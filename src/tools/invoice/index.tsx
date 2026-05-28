import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StepWizard } from '../../components/StepWizard';
import { OutputPreview } from '../../components/OutputPreview';
import { AIEnhanceButton } from '../../components/AIEnhanceButton';
import { InvoiceFormView } from './form';
import { generateInvoiceReminder, ENHANCE_PROMPT } from './template';
import type { InvoiceForm } from '../../types';
import { useProfile } from '../../hooks/useProfile';
import { TOOL_MAP } from '../../utils/tools';

const EMPTY: InvoiceForm = {
  clientName: '', invoiceNumber: '', amount: '', dueDate: '',
  daysPastDue: '', projectName: '', yourName: '', paymentLink: '', tone: 'gentle',
};

export function InvoiceTool() {
  const { addToast, addHistory, getDraft, saveDraft, clearDraft } = useApp();
  const { yourName } = useProfile();
  const tool = TOOL_MAP['invoice'];
  const saved = getDraft('invoice') as Partial<InvoiceForm>;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<InvoiceForm>({ ...EMPTY, yourName, ...saved });
  const [output, setOutput] = useState('');

  function handleNext() {
    saveDraft('invoice', form as unknown as Record<string, string>);
    setOutput(generateInvoiceReminder(form));
    setStep(2);
  }

  function handleReset() { setStep(1); setForm(EMPTY); clearDraft('invoice'); setOutput(''); }

  function handleDone() {
    addHistory({ toolId: 'invoice', output, label: `Invoice #${form.invoiceNumber} — ${form.clientName}` });
    addToast('Reminder saved to history!', 'success');
    setStep(3);
  }

  return (
    <div className="max-w-2xl">
      <StepWizard steps={tool.steps} currentStep={step} />

      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6">
          <InvoiceFormView data={form} onChange={setForm} onNext={handleNext} />
        </div>
      )}

      {(step === 2 || step === 3) && (
        <OutputPreview
          content={output}
          filename={`invoice-reminder-${form.invoiceNumber}.txt`}
          onReset={handleReset}
        >
          <AIEnhanceButton content={output} prompt={ENHANCE_PROMPT} onEnhanced={(e) => { setOutput(e); addToast('Reminder enhanced!', 'success'); }} />
          {step === 2 && (
            <button onClick={handleDone} className="text-xs font-medium text-gray-500 hover:text-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors">
              Mark as Sent ✓
            </button>
          )}
        </OutputPreview>
      )}

      {step === 3 && (
        <div className="mt-4 p-4 bg-teal-50 border border-teal-100 rounded-xl text-sm text-teal-700 font-medium">
          ✅ Reminder sent. Go get paid! 💰
        </div>
      )}
    </div>
  );
}
