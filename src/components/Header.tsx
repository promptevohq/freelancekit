import { Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TOOL_MAP } from '../utils/tools';

export function Header() {
  const { activePage } = useApp();

  const tool = TOOL_MAP[activePage];

  const title = tool?.label ?? (activePage === 'settings' ? 'Settings' : 'Dashboard');
  const subtitle = tool?.description ?? (activePage === 'settings'
    ? 'Manage your preferences and API key'
    : 'Your AI-powered freelance toolkit');

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="font-display text-[17px] font-700 text-gray-900 leading-tight">
          {title}
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>

      <span className="flex items-center gap-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full">
        <Sparkles size={12} className="text-teal-500" />
        AI Ready
      </span>
    </header>
  );
}
