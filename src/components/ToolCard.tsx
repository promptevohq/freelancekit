import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ToolMeta } from '../types';

const COLOR_MAP: Record<string, { card: string; badge: string; arrow: string }> = {
  teal:    { card: 'hover:border-teal-200 hover:bg-teal-50/30',   badge: 'bg-teal-50 border-teal-100',   arrow: 'text-teal-600' },
  blue:    { card: 'hover:border-blue-200 hover:bg-blue-50/30',   badge: 'bg-blue-50 border-blue-100',   arrow: 'text-blue-600' },
  violet:  { card: 'hover:border-violet-200 hover:bg-violet-50/30', badge: 'bg-violet-50 border-violet-100', arrow: 'text-violet-600' },
  amber:   { card: 'hover:border-amber-200 hover:bg-amber-50/30', badge: 'bg-amber-50 border-amber-100', arrow: 'text-amber-600' },
  emerald: { card: 'hover:border-emerald-200 hover:bg-emerald-50/30', badge: 'bg-emerald-50 border-emerald-100', arrow: 'text-emerald-600' },
  rose:    { card: 'hover:border-rose-200 hover:bg-rose-50/30',   badge: 'bg-rose-50 border-rose-100',   arrow: 'text-rose-600' },
};

interface ToolCardProps {
  tool: ToolMeta;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { setActivePage, history } = useApp();
  const colors = COLOR_MAP[tool.color] ?? COLOR_MAP.teal;

  const uses = history.filter((h) => h.toolId === tool.id).length;

  return (
    <button
      onClick={() => setActivePage(tool.id)}
      className={`group text-left bg-white border border-gray-200 rounded-2xl p-5 transition-all duration-200 hover:shadow-card-hover ${colors.card}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl ${colors.badge}`}>
          {tool.icon}
        </div>
        <ArrowRight
          size={16}
          className={`mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 ${colors.arrow}`}
        />
      </div>

      <h3 className="font-display text-[14px] font-700 text-gray-900 mb-1 leading-tight">
        {tool.label}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-4">{tool.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {tool.steps.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-gray-400' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        {uses > 0 && (
          <span className="text-[10px] font-medium text-gray-400">
            {uses} use{uses !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </button>
  );
}
