import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StepWizard } from '../../components/StepWizard';
import { OutputPreview } from '../../components/OutputPreview';
import { AIEnhanceButton } from '../../components/AIEnhanceButton';
import { FollowupFormView } from './form';
import { generateFollowup, ENHANCE_PROMPT } from './template';
import type { FollowupForm } from '../../types';
import { useProfile } from '../../hooks/useProfile';
import { TOOL_MAP } from '../../utils/tools';

const EMPTY: FollowupForm = {
  clientName: '', projectName: '', daysSince: '', context: '',
  callToAction: '', yourName: '', tone: 'professional',
};

export function FollowupTool() {
  const { addToast, addHistory, getDraft, saveDraft, clearDraft } = useApp();
  const { yourName } = useProfile();
  const tool = TOOL_MAP['followup'];
  const saved = getDraft('followup') as Partial<FollowupForm>;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FollowupForm>({ ...EMPTY, yourName, ...saved });
  const [output, setOutput] = useState('');

  function handleNext() {
    saveDraft('followup', form as unknown as Record<string, string>);
    setOutput(generateFollowup(form));
    setStep(2);
  }

  function handleReset() {
    setStep(1); setForm(EMPTY); clearDraft('followup'); setOutput('');
  }

  function handleSent() {
    addHistory({ toolId: 'followup', output, label: `Follow-up to ${form.clientName}` });
    addToast('Email saved to history!', 'success');
    setStep(3);
  }

  return (
    <div className="max-w-2xl">
      <StepWizard steps={tool.steps} currentStep={step} />

      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6">
          <FollowupFormView data={form} onChange={setForm} onNext={handleNext} />
        </div>
      )}

      {(step === 2 || step === 3) && (
        <OutputPreview
          content={output}
          filename={`followup-${form.clientName.toLowerCase().replace(/\s+/g, '-')}.txt`}
          onReset={handleReset}
        >
          <AIEnhanceButton content={output} prompt={ENHANCE_PROMPT} onEnhanced={(e) => { setOutput(e); addToast('Email enhanced!', 'success'); }} />
          {step === 2 && (
            <button onClick={handleSent} className="text-xs font-medium text-gray-500 hover:text-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors">
              Mark as Sent ✓
            </button>
          )}
        </OutputPreview>
      )}

      {step === 3 && (
        <div className="mt-4 p-4 bg-teal-50 border border-teal-100 rounded-xl text-sm text-teal-700 font-medium">
          ✅ Follow-up saved to history. Good luck!
        </div>
      )}
    </div>
  );
}
