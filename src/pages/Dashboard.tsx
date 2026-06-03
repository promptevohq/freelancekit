import { Clock, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { ToolCard } from '../components/ToolCard';
import { useApp } from '../context/AppContext';
import { TOOLS } from '../utils/tools';
import { truncate } from '../utils/helpers';

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-card flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest leading-none">{label}</p>
        <p className="font-display text-xl font-700 text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { history, settings, setActivePage } = useApp();
  const hasKey = Boolean(settings.claudeApiKey);
  const recentHistory = [...history]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const totalUses = history.length;
  const toolsUsed = new Set(history.map((h) => h.toolId)).size;

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white" />
          <div className="absolute -bottom-12 -left-6 w-36 h-36 rounded-full bg-white" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-teal-200" fill="currentColor" />
            <span className="text-teal-200 text-xs font-semibold uppercase tracking-widest">FreelanceKit</span>
          </div>
          <h2 className="font-display text-2xl font-700 text-white mb-1">
            Your AI Freelance Toolkit
          </h2>
          <p className="text-teal-100 text-sm leading-relaxed max-w-md">
            Generate proposals, follow-ups, scope docs, invoices, onboarding kits, and rate cards — in seconds.
          </p>
          {!hasKey && (
            <button
              onClick={() => setActivePage('settings')}
              className="mt-4 inline-flex items-center gap-2 bg-white text-teal-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors"
            >
              <Zap size={12} />
              Enable AI Enhancement
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard icon={<TrendingUp size={16} />} label="Total Outputs" value={totalUses} />
        <StatCard icon={<Zap size={16} />} label="Tools Used" value={`${toolsUsed} / 6`} />
        <StatCard icon={<Clock size={16} />} label="Drafts Saved" value={totalUses} />
      </div>

      {/* Tools grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-[15px] font-700 text-gray-900">All Tools</h2>
          <span className="text-xs text-gray-400">6 tools available</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* Recent history */}
      {recentHistory.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[15px] font-700 text-gray-900">Recent Activity</h2>
            <span className="text-xs text-gray-400">{history.length} total outputs</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-card divide-y divide-gray-100 overflow-hidden">
            {recentHistory.map((entry) => {
              const tool = TOOLS.find((t) => t.id === entry.toolId);
              return (
                <div key={entry.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <span className="text-lg w-7 text-center shrink-0">{tool?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{truncate(entry.label, 45)}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => setActivePage(entry.toolId)}
                    className="text-xs font-medium text-teal-600 hover:text-teal-700 shrink-0"
                  >
                    Open →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
