import { Sparkles, Key } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TOOL_MAP } from '../utils/tools';

export function Header() {
  const { activePage, setActivePage, settings } = useApp();

  const tool = TOOL_MAP[activePage];
  const hasApiKey = Boolean(settings.claudeApiKey);

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

      <div className="flex items-center gap-2">
        {hasApiKey ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full">
            <Sparkles size={12} className="text-teal-500" />
            AI Ready
          </span>
        ) : (
          <button
            onClick={() => setActivePage('settings')}
            className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors"
          >
            <Key size={12} />
            Add API Key
          </button>
        )}
      </div>
    </header>
  );
}
