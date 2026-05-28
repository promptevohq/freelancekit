import type { RateForm } from '../../types';

interface Props { data: RateForm; onChange: (d: RateForm) => void; onNext: () => void; }

const inputCls = 'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-colors placeholder:text-gray-300 bg-white';

const Field = ({ label, required, children, hint, prefix }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string; prefix?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}{required && <span className="text-teal-500 ml-1">*</span>}
    </label>
    {prefix ? (
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">{prefix}</span>
        <div className="[&>input]:pl-7">{children}</div>
      </div>
    ) : children}
    {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
  </div>
);

export function CalculatorFormView({ data, onChange, onNext }: Props) {
  const set = (key: keyof RateForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [key]: e.target.value });

  const isValid = data.annualIncome;

  return (
    <div className="space-y-5">
      <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl">
        <p className="text-xs text-teal-700 font-medium">
          💡 Enter your target numbers and we'll calculate your minimum viable rates plus ready-to-pitch packages.
        </p>
      </div>

      <Field label="Target Annual Income" required hint="How much do you want to take home?">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
          <input className={inputCls + ' pl-7'} type="number" placeholder="80000" value={data.annualIncome} onChange={set('annualIncome')} />
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Work Weeks / Year" hint="Excluding vacation, sick days">
          <input className={inputCls} type="number" placeholder="48" value={data.workWeeksPerYear} onChange={set('workWeeksPerYear')} />
        </Field>
        <Field label="Hours / Week" hint="Total working hours">
          <input className={inputCls} type="number" placeholder="40" value={data.hoursPerWeek} onChange={set('hoursPerWeek')} />
        </Field>
      </div>

      <Field label="Annual Business Expenses" hint="Software, hardware, office, insurance, etc.">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
          <input className={inputCls + ' pl-7'} type="number" placeholder="5000" value={data.businessExpenses} onChange={set('businessExpenses')} />
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Estimated Tax Rate (%)" hint="Include self-employment tax">
          <input className={inputCls} type="number" placeholder="30" value={data.taxRate} onChange={set('taxRate')} />
        </Field>
        <Field label="Profit Margin (%)" hint="Buffer above your minimum">
          <input className={inputCls} type="number" placeholder="20" value={data.profitMargin} onChange={set('profitMargin')} />
        </Field>
      </div>

      <div className="pt-2">
        <button onClick={onNext} disabled={!isValid} className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm rounded-xl transition-colors">
          Calculate My Rates →
        </button>
      </div>
    </div>
  );
}
