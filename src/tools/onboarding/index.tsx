import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StepWizard } from '../../components/StepWizard';
import { OutputPreview } from '../../components/OutputPreview';
import { AIEnhanceButton } from '../../components/AIEnhanceButton';
import { OnboardingFormView } from './form';
import { generateOnboardingKit, ENHANCE_PROMPT } from './template';
import type { OnboardingForm } from '../../types';
import { useProfile } from '../../hooks/useProfile';
import { TOOL_MAP } from '../../utils/tools';

const EMPTY: OnboardingForm = {
  clientName: '', projectName: '', startDate: '', communicationChannel: '',
  meetingCadence: '', pointOfContact: '', tools: '', yourName: '', yourEmail: '',
};

export function OnboardingTool() {
  const { addToast, addHistory, getDraft, saveDraft, clearDraft } = useApp();
  const { yourName, yourEmail } = useProfile();
  const tool = TOOL_MAP['onboarding'];
  const saved = getDraft('onboarding') as Partial<OnboardingForm>;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<OnboardingForm>({ ...EMPTY, yourName, yourEmail, ...saved });
  const [output, setOutput] = useState('');

  function handleNext() {
    saveDraft('onboarding', form as unknown as Record<string, string>);
    setOutput(generateOnboardingKit(form));
    setStep(2);
  }

  function handleReset() { setStep(1); setForm(EMPTY); clearDraft('onboarding'); setOutput(''); }

  function handleDone() {
    addHistory({ toolId: 'onboarding', output, label: `Onboarding: ${form.clientName}` });
    addToast('Onboarding kit saved!', 'success');
    setStep(3);
  }

  return (
    <div className="max-w-2xl">
      <StepWizard steps={tool.steps} currentStep={step} />

      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6">
          <OnboardingFormView data={form} onChange={setForm} onNext={handleNext} />
        </div>
      )}

      {(step === 2 || step === 3) && (
        <OutputPreview
          content={output}
          filename={`onboarding-${form.clientName.toLowerCase().replace(/\s+/g, '-')}.txt`}
          title={`Onboarding Kit: ${form.clientName}`}
          onReset={handleReset}
        >
          <AIEnhanceButton content={output} prompt={ENHANCE_PROMPT} onEnhanced={(e) => { setOutput(e); addToast('Kit enhanced!', 'success'); }} />
          {step === 2 && (
            <button onClick={handleDone} className="text-xs font-medium text-gray-500 hover:text-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors">
              Mark as Sent ✓
            </button>
          )}
        </OutputPreview>
      )}

      {step === 3 && (
        <div className="mt-4 p-4 bg-teal-50 border border-teal-100 rounded-xl text-sm text-teal-700 font-medium">
          ✅ Onboarding kit sent. Welcome your new client! 🤝
        </div>
      )}
    </div>
  );
}
