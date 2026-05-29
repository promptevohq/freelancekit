import { Sparkles, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TOOL_MAP } from '../utils/tools';

export function Header() {
  const { activePage, history, historyPanelOpen, setHistoryPanelOpen } = useApp();

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

      <div className="flex items-center gap-2">
        {/* History button */}
        <button
          onClick={() => setHistoryPanelOpen(!historyPanelOpen)}
          className="relative flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
        >
          <Clock size={12} className="text-gray-400" />
          History
          {history.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center">
              {history.length > 9 ? '9+' : history.length}
            </span>
          )}
        </button>

        {/* AI Ready badge */}
        <span className="flex items-center gap-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full">
          <Sparkles size={12} className="text-teal-500" />
          AI Ready
        </span>
      </div>
    </header>
  );
}
