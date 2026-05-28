import type { ScopeForm } from '../../types';

interface Props { data: ScopeForm; onChange: (d: ScopeForm) => void; onNext: () => void; }

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

export function ScopeFormView({ data, onChange, onNext }: Props) {
  const set = (key: keyof ScopeForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...data, [key]: e.target.value });

  const isValid = data.projectName && data.clientName && data.objectives;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Project Name" required>
          <input className={inputCls} placeholder="Website Redesign" value={data.projectName} onChange={set('projectName')} />
        </Field>
        <Field label="Client Name" required>
          <input className={inputCls} placeholder="Acme Corp" value={data.clientName} onChange={set('clientName')} />
        </Field>
      </div>

      <Field label="Project Objectives" required hint="What will this project achieve?">
        <textarea className={textareaCls} rows={3} placeholder="Redesign the company website to improve user experience, increase conversions, and reflect the updated brand identity." value={data.objectives} onChange={set('objectives')} />
      </Field>

      <Field label="In Scope" hint="One item per line — what IS included.">
        <textarea className={textareaCls} rows={4} placeholder="Up to 10 pages designed and developed&#10;Mobile-responsive layouts&#10;Contact form integration&#10;Basic SEO setup" value={data.inScope} onChange={set('inScope')} />
      </Field>

      <Field label="Out of Scope" hint="One item per line — what is NOT included.">
        <textarea className={textareaCls} rows={4} placeholder="Content writing or copyediting&#10;Photography or custom illustration&#10;E-commerce functionality&#10;Ongoing maintenance" value={data.outOfScope} onChange={set('outOfScope')} />
      </Field>

      <Field label="Deliverables" hint="One deliverable per line.">
        <textarea className={textareaCls} rows={3} placeholder="Figma design files&#10;Fully developed website&#10;30-day post-launch support" value={data.deliverables} onChange={set('deliverables')} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Timeline">
          <input className={inputCls} placeholder="6 weeks from kickoff" value={data.timeline} onChange={set('timeline')} />
        </Field>
        <Field label="Revision Rounds">
          <input className={inputCls} placeholder="2 rounds included" value={data.revisions} onChange={set('revisions')} />
        </Field>
      </div>

      <Field label="Payment Terms">
        <input className={inputCls} placeholder="50% upfront, 50% on delivery" value={data.paymentTerms} onChange={set('paymentTerms')} />
      </Field>

      <div className="pt-2">
        <button onClick={onNext} disabled={!isValid} className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm rounded-xl transition-colors">
          Preview Scope Doc →
        </button>
      </div>
    </div>
  );
}
