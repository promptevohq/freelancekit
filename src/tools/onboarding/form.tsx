import type { OnboardingForm } from '../../types';

interface Props { data: OnboardingForm; onChange: (d: OnboardingForm) => void; onNext: () => void; }

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

export function OnboardingFormView({ data, onChange, onNext }: Props) {
  const set = (key: keyof OnboardingForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...data, [key]: e.target.value });

  const isValid = data.clientName && data.projectName && data.yourName && data.yourEmail;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Client Name" required>
          <input className={inputCls} placeholder="Sarah at Acme Corp" value={data.clientName} onChange={set('clientName')} />
        </Field>
        <Field label="Project Name" required>
          <input className={inputCls} placeholder="Brand Refresh 2024" value={data.projectName} onChange={set('projectName')} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Your Name" required>
          <input className={inputCls} placeholder="Alex Rivera" value={data.yourName} onChange={set('yourName')} />
        </Field>
        <Field label="Your Email" required>
          <input className={inputCls} type="email" placeholder="alex@studio.com" value={data.yourEmail} onChange={set('yourEmail')} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Project Start Date">
          <input className={inputCls} type="date" value={data.startDate} onChange={set('startDate')} />
        </Field>
        <Field label="Client's Point of Contact">
          <input className={inputCls} placeholder="Sarah Johnson, Marketing Lead" value={data.pointOfContact} onChange={set('pointOfContact')} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Communication Channel">
          <input className={inputCls} placeholder="Slack, Email, etc." value={data.communicationChannel} onChange={set('communicationChannel')} />
        </Field>
        <Field label="Meeting Cadence">
          <input className={inputCls} placeholder="Weekly 30-min check-ins" value={data.meetingCadence} onChange={set('meetingCadence')} />
        </Field>
      </div>

      <Field label="Tools & Platforms" hint="One tool per line.">
        <textarea className={textareaCls} rows={4} placeholder="Figma — design files&#10;Notion — project docs&#10;Slack — daily communication&#10;Google Drive — asset storage" value={data.tools} onChange={set('tools')} />
      </Field>

      <div className="pt-2">
        <button onClick={onNext} disabled={!isValid} className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm rounded-xl transition-colors">
          Preview Onboarding Kit →
        </button>
      </div>
    </div>
  );
}
