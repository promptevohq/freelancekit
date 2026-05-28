import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StepWizard } from '../../components/StepWizard';
import { OutputPreview } from '../../components/OutputPreview';
import { CalculatorFormView } from './form';
import { calculateRates, generateRateDoc } from './template';
import { formatCurrency } from '../../utils/helpers';
import type { RateForm, RateResult } from '../../types';
import { TOOL_MAP } from '../../utils/tools';

const EMPTY: RateForm = {
  annualIncome: '', workWeeksPerYear: '', hoursPerWeek: '',
  businessExpenses: '', taxRate: '', profitMargin: '',
};

function RateCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-card">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-display text-2xl font-700 text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function PackageCard({ name, price, description, highlight }: {
  name: string; price: number; description: string; highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? 'bg-teal-50 border-teal-200' : 'bg-white border-gray-200'} shadow-card`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-semibold uppercase tracking-widest ${highlight ? 'text-teal-600' : 'text-gray-400'}`}>
          {name}
          {highlight && <span className="ml-2 text-[10px] bg-teal-500 text-white px-1.5 py-0.5 rounded-full">Popular</span>}
        </span>
        <span className="font-display text-xl font-700 text-gray-900">{formatCurrency(price)}</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

export function CalculatorTool() {
  const { addToast, addHistory, getDraft, saveDraft, clearDraft } = useApp();
  const tool = TOOL_MAP['calculator'];
  const saved = getDraft('calculator') as Partial<RateForm>;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RateForm>({ ...EMPTY, ...saved });
  const [result, setResult] = useState<RateResult | null>(null);
  const [output, setOutput] = useState('');

  function handleNext() {
    saveDraft('calculator', form as unknown as Record<string, string>);
    const rates = calculateRates(form);
    setResult(rates);
    setOutput(generateRateDoc(form, rates));
    setStep(2);
  }

  function handleReset() {
    setStep(1); setForm(EMPTY); clearDraft('calculator');
    setResult(null); setOutput('');
  }

  function handleCopy() {
    addHistory({ toolId: 'calculator', output, label: `Rates — ${formatCurrency(result?.hourlyRate ?? 0)}/hr` });
    addToast('Rates saved to history!', 'success');
    setStep(3);
  }

  return (
    <div className="max-w-2xl">
      <StepWizard steps={tool.steps} currentStep={step} />

      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6">
          <CalculatorFormView data={form} onChange={setForm} onNext={handleNext} />
        </div>
      )}

      {(step === 2 || step === 3) && result && (
        <div className="space-y-6">
          {/* Rate cards */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Your Base Rates</h3>
            <div className="grid grid-cols-2 gap-3">
              <RateCard label="Hourly Rate" value={formatCurrency(result.hourlyRate)} sub="minimum viable rate" />
              <RateCard label="Day Rate" value={formatCurrency(result.dayRate)} sub="8-hour day" />
              <RateCard label="Weekly Rate" value={formatCurrency(result.weeklyRate)} sub="5-day week" />
              <RateCard label="Monthly Rate" value={formatCurrency(result.monthlyRate)} sub="~4 weeks" />
            </div>
          </div>

          {/* Packages */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Service Packages</h3>
            <div className="space-y-2">
              <PackageCard {...result.starterPackage} />
              <PackageCard {...result.growthPackage} highlight />
              <PackageCard {...result.premiumPackage} />
            </div>
          </div>

          {/* Export */}
          <OutputPreview
            content={output}
            filename="my-freelance-rates.txt"
            onReset={handleReset}
          >
            {step === 2 && (
              <button
                onClick={handleCopy}
                className="text-xs font-medium text-gray-500 hover:text-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors"
              >
                Save to History ✓
              </button>
            )}
          </OutputPreview>
        </div>
      )}

      {step === 3 && (
        <div className="mt-4 p-4 bg-teal-50 border border-teal-100 rounded-xl text-sm text-teal-700 font-medium">
          ✅ Rates saved. Now go charge what you're worth! 🚀
        </div>
      )}
    </div>
  );
}
