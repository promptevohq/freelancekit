import { X, Trash2, Clock, RotateCcw, FileText, Mail, FolderKanban, Receipt, Users, Calculator } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TOOLS } from '../utils/tools';
import { truncate, copyToClipboard } from '../utils/helpers';
import type { ToolId } from '../types';

const TOOL_ICONS: Record<ToolId, React.ReactNode> = {
  proposal:   <FileText size={14} />,
  followup:   <Mail size={14} />,
  scope:      <FolderKanban size={14} />,
  invoice:    <Receipt size={14} />,
  onboarding: <Users size={14} />,
  calculator: <Calculator size={14} />,
};

const COLOR_MAP: Record<string, string> = {
  teal:    'bg-teal-50 text-teal-600 border-teal-100',
  blue:    'bg-blue-50 text-blue-600 border-blue-100',
  violet:  'bg-violet-50 text-violet-600 border-violet-100',
  amber:   'bg-amber-50 text-amber-600 border-amber-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  rose:    'bg-rose-50 text-rose-600 border-rose-100',
};

export function HistoryPanel() {
  const {
    history,
    historyPanelOpen,
    setHistoryPanelOpen,
    deleteHistoryEntry,
    clearHistory,
    addToast,
    setActivePage,
  } = useApp();

  const sorted = [...history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  async function handleCopy(output: string) {
    try {
      await copyToClipboard(output);
      addToast('Copied to clipboard!', 'success');
    } catch {
      addToast('Failed to copy.', 'error');
    }
  }

  if (!historyPanelOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
        onClick={() => setHistoryPanelOpen(false)}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-panel z-50 flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-teal-600" />
            <h2 className="font-display text-[15px] font-700 text-gray-900">History</h2>
            {history.length > 0 && (
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {history.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={() => {
                  clearHistory();
                  addToast('History cleared.', 'info');
                }}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setHistoryPanelOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <Clock size={32} className="text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-400">No history yet</p>
              <p className="text-xs text-gray-300 mt-1">
                Your generated outputs will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sorted.map((entry) => {
                const tool = TOOLS.find((t) => t.id === entry.toolId);
                const colorCls = COLOR_MAP[tool?.color ?? 'teal'];

                return (
                  <div key={entry.id} className="px-4 py-3 hover:bg-gray-50 transition-colors group">
                    {/* Tool badge + date */}
                    <div className="flex items-center justify-between mb-2">
                      <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border ${colorCls}`}>
                        {TOOL_ICONS[entry.toolId]}
                        {tool?.label}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Label */}
                    <p className="text-sm font-medium text-gray-800 mb-1 truncate">
                      {truncate(entry.label, 40)}
                    </p>

                    {/* Preview */}
                    <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
                      {truncate(entry.output, 100)}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(entry.output)}
                        className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <RotateCcw size={11} />
                        Copy
                      </button>
                      <button
                        onClick={() => {
                          setActivePage(entry.toolId);
                          setHistoryPanelOpen(false);
                        }}
                        className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Open Tool
                      </button>
                      <button
                        onClick={() => {
                          deleteHistoryEntry(entry.id);
                          addToast('Entry deleted.', 'info');
                        }}
                        className="ml-auto text-gray-300 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
