import type { ProposalForm } from '../../types';

interface ProposalFormProps {
  data: ProposalForm;
  onChange: (data: ProposalForm) => void;
  onNext: () => void;
}

const Field = ({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-teal-500 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
  </div>
);

const inputCls =
  'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-colors placeholder:text-gray-300 bg-white';
const textareaCls = inputCls + ' resize-none';

export function ProposalFormView({ data, onChange, onNext }: ProposalFormProps) {
  const set = (key: keyof ProposalForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => onChange({ ...data, [key]: e.target.value });

  const isValid =
    data.clientName && data.projectTitle && data.projectDescription && data.yourName;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Client Name" required>
          <input
            className={inputCls}
            placeholder="Acme Corp"
            value={data.clientName}
            onChange={set('clientName')}
          />
        </Field>
        <Field label="Your Name" required>
          <input
            className={inputCls}
            placeholder="Jane Smith"
            value={data.yourName}
            onChange={set('yourName')}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Project Title" required>
          <input
            className={inputCls}
            placeholder="Brand Identity Redesign"
            value={data.projectTitle}
            onChange={set('projectTitle')}
          />
        </Field>
        <Field label="Your Role / Title">
          <input
            className={inputCls}
            placeholder="Freelance Designer"
            value={data.yourRole}
            onChange={set('yourRole')}
          />
        </Field>
      </div>

      <Field label="Project Description" required hint="Briefly describe the project goals and context.">
        <textarea
          className={textareaCls}
          rows={4}
          placeholder="We'll redesign your brand identity to better reflect your company's vision and connect with your target audience..."
          value={data.projectDescription}
          onChange={set('projectDescription')}
        />
      </Field>

      <Field label="Deliverables" hint="One deliverable per line.">
        <textarea
          className={textareaCls}
          rows={4}
          placeholder="Logo design (3 concepts + revisions)&#10;Brand style guide&#10;Business card design"
          value={data.deliverables}
          onChange={set('deliverables')}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Timeline">
          <input
            className={inputCls}
            placeholder="4–6 weeks from project kickoff"
            value={data.timeline}
            onChange={set('timeline')}
          />
        </Field>
        <Field label="Budget / Investment">
          <input
            className={inputCls}
            placeholder="$3,500 (50% upfront)"
            value={data.budget}
            onChange={set('budget')}
          />
        </Field>
      </div>

      <div className="pt-2">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm rounded-xl transition-colors"
        >
          Preview Proposal →
        </button>
      </div>
    </div>
  );
}
