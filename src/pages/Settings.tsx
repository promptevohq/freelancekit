import { useState } from 'react';
import { Eye, EyeOff, Save, Trash2, Key, Sparkles, ShieldCheck, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Settings() {
  const { settings, updateSettings, addToast, clearHistory } = useApp();
  const [apiKey, setApiKey] = useState(settings.claudeApiKey);
  const [showKey, setShowKey] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [profile, setProfile] = useState(settings.profile ?? { name: '', email: '', role: '', website: '', phone: '' });
  const [profileSaved, setProfileSaved] = useState(false);

  function handleSaveProfile() {
    updateSettings({ profile });
    setProfileSaved(true);
    addToast('Profile saved! It will auto-fill your tools.', 'success');
    setTimeout(() => setProfileSaved(false), 2000);
  }

  function handleSave() {
    updateSettings({ claudeApiKey: apiKey.trim() });
    addToast('Settings saved!', 'success');
  }

  function handleClearHistory() {
    if (!confirmClear) { setConfirmClear(true); return; }
    clearHistory();
    addToast('History cleared.', 'info');
    setConfirmClear(false);
  }

  const hasKey = Boolean(apiKey.trim());

  return (
    <div className="max-w-xl space-y-6">
      {/* Freelancer Profile */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
            <User size={15} className="text-teal-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Your Freelancer Profile</h2>
            <p className="text-xs text-gray-500">Auto-fills your info across all tools</p>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-colors placeholder:text-gray-300 bg-white"
                placeholder="Jane Smith"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-colors placeholder:text-gray-300 bg-white"
                placeholder="jane@studio.com"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role / Title</label>
              <input
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-colors placeholder:text-gray-300 bg-white"
                placeholder="Freelance Designer"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (optional)</label>
              <input
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-colors placeholder:text-gray-300 bg-white"
                placeholder="+1 555 000 0000"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Website (optional)</label>
            <input
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-colors placeholder:text-gray-300 bg-white"
              placeholder="https://yoursite.com"
              value={profile.website}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
            />
          </div>
          <button
            onClick={handleSaveProfile}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
              profileSaved
                ? 'bg-teal-500 text-white'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            <Save size={14} />
            {profileSaved ? 'Saved!' : 'Save Profile'}
          </button>
        </div>
      </div>

      {/* API Key */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
            <Key size={15} className="text-violet-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Your Own API Key <span className="text-xs font-normal text-gray-400">(optional)</span></h2>
            <p className="text-xs text-gray-500">AI enhancement works automatically — add your own key for unlimited personal use</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Status badge */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
            'bg-teal-50 text-teal-700 border border-teal-100'
          }`}>
            {hasKey ? <Sparkles size={13} /> : <Sparkles size={13} />}
            {hasKey ? 'Using your personal Groq API key' : 'Using shared AI — works for everyone automatically'}
          </div>

          {/* Key input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full px-3.5 py-2.5 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-colors font-mono placeholder:font-sans placeholder:text-gray-300 bg-white"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <ShieldCheck size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-500 leading-relaxed">
              Your API key is stored <strong>only in your browser's localStorage</strong> — it never leaves your device or gets sent to any server other than Anthropic's.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Save size={14} />
              Save Key
            </button>
            {hasKey && (
              <button
                onClick={() => { setApiKey(''); updateSettings({ claudeApiKey: '' }); addToast('API key removed.', 'info'); }}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
                Remove Key
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400">
            Don't have a key?{' '}
            <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
              Get one free at console.groq.com →
            </a>
          </p>
        </div>
      </div>

      {/* Data management */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
            <Trash2 size={15} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Data Management</h2>
            <p className="text-xs text-gray-500">Manage your local history and drafts</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            All data is stored locally in your browser. Clearing history removes saved outputs but keeps your drafts and settings.
          </p>
          <button
            onClick={handleClearHistory}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-all ${
              confirmClear
                ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                : 'text-red-600 border-red-200 bg-red-50 hover:bg-red-100'
            }`}
          >
            <Trash2 size={14} />
            {confirmClear ? '⚠️ Click again to confirm' : 'Clear All History'}
          </button>
          {confirmClear && (
            <button onClick={() => setConfirmClear(false)} className="text-xs text-gray-400 hover:text-gray-600 ml-1">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* About */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">About FreelanceKit</h2>
          <div className="space-y-1.5 text-xs text-gray-500">
            <p>Version 1.0.0 — M1 Build</p>
            <p>6 AI-powered tools for professional freelancers.</p>
            <p>Built with React 18, TypeScript, Vite 5, TailwindCSS 3, and Claude AI.</p>
            <p className="pt-1 text-gray-400">All processing happens in your browser. No backend. No data collection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
