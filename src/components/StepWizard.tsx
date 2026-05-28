import { Check } from 'lucide-react';

interface StepWizardProps {
  steps: string[];
  currentStep: number;
}

export function StepWizard({ steps, currentStep }: StepWizardProps) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={i} className="flex items-center">
            {/* Step bubble */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-200 ${
                  isDone
                    ? 'bg-teal-500 border-teal-500 text-white'
                    : isActive
                    ? 'bg-white border-teal-500 text-teal-600'
                    : 'bg-white border-gray-200 text-gray-400'
                }`}
              >
                {isDone ? <Check size={14} strokeWidth={3} /> : stepNum}
              </div>
              <span
                className={`text-[11px] font-medium whitespace-nowrap ${
                  isActive ? 'text-teal-700' : isDone ? 'text-teal-500' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div
                className={`h-px w-16 mx-2 mb-5 transition-all duration-300 ${
                  isDone ? 'bg-teal-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
