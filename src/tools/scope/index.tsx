import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StepWizard } from '../../components/StepWizard';
import { OutputPreview } from '../../components/OutputPreview';
import { AIEnhanceButton } from '../../components/AIEnhanceButton';
import { ScopeFormView } from './form';
import { generateScope, ENHANCE_PROMPT } from './template';
import type { ScopeForm } from '../../types';
import { useProfile } from '../../hooks/useProfile';
import { TOOL_MAP } from '../../utils/tools';

const EMPTY: ScopeForm = {
  projectName: '', clientName: '', objectives: '', inScope: '',
  outOfScope: '', deliverables: '', timeline: '', revisions: '', paymentTerms: '',
};

export function ScopeTool() {
  const { addToast, addHistory, getDraft, saveDraft, clearDraft } = useApp();
  const { yourName } = useProfile();
  const tool = TOOL_MAP['scope'];
  const saved = getDraft('scope') as Partial<ScopeForm>;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ScopeForm>({ ...EMPTY, ...saved });
  const [output, setOutput] = useState('');

  function handleNext() {
    saveDraft('scope', form as unknown as Record<string, string>);
    setOutput(generateScope(form));
    setStep(2);
  }

  function handleReset() { setStep(1); setForm(EMPTY); clearDraft('scope'); setOutput(''); }

  function handleDone() {
    addHistory({ toolId: 'scope', output, label: `Scope: ${form.projectName}` });
    addToast('Scope doc saved to history!', 'success');
    setStep(3);
  }

  return (
    <div className="max-w-2xl w-full">
      <StepWizard steps={tool.steps} currentStep={step} />

      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6">
          <ScopeFormView data={form} onChange={setForm} onNext={handleNext} />
        </div>
      )}

      {(step === 2 || step === 3) && (
        <OutputPreview
          content={output}
          filename={`scope-${form.projectName.toLowerCase().replace(/\s+/g, '-')}.txt`}
          title={`Scope: ${form.projectName}`}
          onReset={handleReset}
        >
          <AIEnhanceButton content={output} prompt={ENHANCE_PROMPT} onEnhanced={(e) => { setOutput(e); addToast('Scope enhanced!', 'success'); }} />
          {step === 2 && (
            <button onClick={handleDone} className="text-xs font-medium text-gray-500 hover:text-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors">
              Mark as Sent ✓
            </button>
          )}
        </OutputPreview>
      )}

      {step === 3 && (
        <div className="mt-4 p-4 bg-teal-50 border border-teal-100 rounded-xl text-sm text-teal-700 font-medium">
          ✅ Scope document saved. No more scope creep!
        </div>
      )}
    </div>
  );
}
