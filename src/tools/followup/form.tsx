import type { FollowupForm } from '../../types';

interface Props { data: FollowupForm; onChange: (d: FollowupForm) => void; onNext: () => void; }

const inputCls = 'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-colors placeholder:text-gray-300 bg-white';
const textareaCls = inputCls + ' resize-none';

const Field = ({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}{required && <span className="text-teal-500 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
  </div>
);

const TONES: Array<{ value: FollowupForm['tone']; label: string; desc: string }> = [
  { value: 'friendly', label: '😊 Friendly', desc: 'Warm & casual' },
  { value: 'professional', label: '💼 Professional', desc: 'Formal & respectful' },
  { value: 'urgent', label: '⚡ Urgent', desc: 'Direct & pressing' },
];

export function FollowupFormView({ data, onChange, onNext }: Props) {
  const set = (key: keyof FollowupForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...data, [key]: e.target.value });

  const isValid = data.clientName && data.projectName && data.yourName;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Client Name" required>
          <input className={inputCls} placeholder="Sarah Johnson" value={data.clientName} onChange={set('clientName')} />
        </Field>
        <Field label="Your Name" required>
          <input className={inputCls} placeholder="Alex Rivera" value={data.yourName} onChange={set('yourName')} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Project / Topic" required>
          <input className={inputCls} placeholder="Website Redesign" value={data.projectName} onChange={set('projectName')} />
        </Field>
        <Field label="Days Since Last Contact">
          <input className={inputCls} type="number" placeholder="7" value={data.daysSince} onChange={set('daysSince')} />
        </Field>
      </div>

      <Field label="Context" hint="What happened last time? What are you waiting on?">
        <textarea className={textareaCls} rows={3} placeholder="We had a great initial call and I sent over a proposal last week. I wanted to follow up to see if you had a chance to review it." value={data.context} onChange={set('context')} />
      </Field>

      <Field label="Call to Action" hint="What do you want them to do?">
        <textarea className={textareaCls} rows={2} placeholder="Could we schedule a 15-minute call this week to discuss?" value={data.callToAction} onChange={set('callToAction')} />
      </Field>

      <Field label="Tone">
        <div className="grid grid-cols-3 gap-2 mt-1">
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange({ ...data, tone: t.value })}
              className={`flex flex-col items-center gap-0.5 py-2.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                data.tone === t.value
                  ? 'border-teal-400 bg-teal-50 text-teal-700'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>{t.label}</span>
              <span className="text-[10px] font-normal opacity-70">{t.desc}</span>
            </button>
          ))}
        </div>
      </Field>

      <div className="pt-2">
        <button onClick={onNext} disabled={!isValid} className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm rounded-xl transition-colors">
          Preview Email →
        </button>
      </div>
    </div>
  );
}
