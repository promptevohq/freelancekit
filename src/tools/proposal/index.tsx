import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StepWizard } from '../../components/StepWizard';
import { OutputPreview } from '../../components/OutputPreview';
import { AIEnhanceButton } from '../../components/AIEnhanceButton';
import { ProposalFormView } from './form';
import { generateProposal, ENHANCE_PROMPT } from './template';
import type { ProposalForm } from '../../types';
import { useProfile } from '../../hooks/useProfile';
import { TOOL_MAP } from '../../utils/tools';

const EMPTY: ProposalForm = {
  clientName: '', projectTitle: '', projectDescription: '',
  deliverables: '', timeline: '', budget: '', yourName: '', yourRole: '',
};

export function ProposalTool() {
  const { addToast, addHistory, getDraft, saveDraft, clearDraft } = useApp();
  const { yourName, yourRole } = useProfile();
  const tool = TOOL_MAP['proposal'];
  const saved = getDraft('proposal') as Partial<ProposalForm>;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ProposalForm>({ ...EMPTY, yourName, yourRole, ...saved });
  const [output, setOutput] = useState('');

  function handleNext() {
    saveDraft('proposal', form as unknown as Record<string, string>);
    const text = generateProposal(form);
    setOutput(text);
    setStep(2);
  }

  function handleReset() {
    setStep(1);
    setForm(EMPTY);
    clearDraft('proposal');
    setOutput('');
  }

  function handleCopyDone() {
    addHistory({ toolId: 'proposal', output, label: `Proposal for ${form.clientName}` });
    addToast('Proposal saved to history!', 'success');
    setStep(3);
  }

  return (
    <div className="max-w-2xl w-full">
      <StepWizard steps={tool.steps} currentStep={step} />

      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6">
          <ProposalFormView data={form} onChange={setForm} onNext={handleNext} />
        </div>
      )}

      {(step === 2 || step === 3) && (
        <OutputPreview
          content={output}
          filename={`proposal-${form.clientName.toLowerCase().replace(/\s+/g, '-')}.txt`}
          title={`Proposal for ${form.clientName}`}
          onReset={handleReset}
        >
          <AIEnhanceButton
            content={output}
            prompt={ENHANCE_PROMPT}
            onEnhanced={(enhanced) => {
              setOutput(enhanced);
              addToast('Proposal enhanced!', 'success');
            }}
          />
          {step === 2 && (
            <button
              onClick={handleCopyDone}
              className="text-xs font-medium text-gray-500 hover:text-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Mark as Sent ✓
            </button>
          )}
        </OutputPreview>
      )}

      {step === 3 && (
        <div className="mt-4 p-4 bg-teal-50 border border-teal-100 rounded-xl text-sm text-teal-700 font-medium">
          ✅ Proposal saved to history. Start a new one whenever you're ready.
        </div>
      )}
    </div>
  );
}
