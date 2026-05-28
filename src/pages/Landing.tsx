import {
  Zap, FileText, Mail, FolderKanban, Receipt,
  Users, Calculator, ArrowRight, Check, Sparkles,
  Star
} from 'lucide-react';

interface LandingProps {
  onLaunch: () => void;
}

const TOOLS = [
  { icon: <FileText size={20} />, label: 'Proposal Generator', desc: 'Craft winning proposals that convert prospects into clients.', color: 'teal' },
  { icon: <Mail size={20} />, label: 'Follow-up Email', desc: 'Write timely follow-ups that actually get responses.', color: 'blue' },
  { icon: <FolderKanban size={20} />, label: 'Scope Builder', desc: 'Define clear boundaries and prevent scope creep.', color: 'violet' },
  { icon: <Receipt size={20} />, label: 'Invoice Reminder', desc: 'Send firm but polite reminders that get you paid.', color: 'amber' },
  { icon: <Users size={20} />, label: 'Onboarding Kit', desc: 'Welcome clients with a professional onboarding experience.', color: 'emerald' },
  { icon: <Calculator size={20} />, label: 'Rate Calculator', desc: 'Calculate your ideal rates and build service packages.', color: 'rose' },
];

const COLOR_MAP: Record<string, string> = {
  teal:    'bg-teal-50 border-teal-100 text-teal-600',
  blue:    'bg-blue-50 border-blue-100 text-blue-600',
  violet:  'bg-violet-50 border-violet-100 text-violet-600',
  amber:   'bg-amber-50 border-amber-100 text-amber-600',
  emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600',
  rose:    'bg-rose-50 border-rose-100 text-rose-600',
};

const STEPS = [
  { num: '01', title: 'Fill the form', desc: 'Enter your project details — takes less than 2 minutes.' },
  { num: '02', title: 'Preview output', desc: 'Instantly get a professional, formatted document.' },
  { num: '03', title: 'Copy & send', desc: 'Copy to clipboard or download. Done.' },
];

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Freelance Designer', text: 'I used to spend an hour writing proposals. Now it takes 3 minutes and they look better than ever.', stars: 5 },
  { name: 'Marcus T.', role: 'Web Developer', text: 'The invoice reminder tool alone has recovered thousands in late payments. Absolute game changer.', stars: 5 },
  { name: 'Priya M.', role: 'Content Strategist', text: 'Finally a tool built for freelancers. The scope builder saved my last project from total scope creep.', stars: 5 },
];

export function Landing({ onLaunch }: LandingProps) {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shadow-sm">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-display text-[16px] font-700 text-gray-900 tracking-tight">FreelanceKit</span>
          </div>
          <button
            onClick={onLaunch}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Launch App
            <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Sparkles size={12} />
          AI-Powered • 100% Free • No Account Needed
        </div>
        <h1 className="font-display text-5xl font-800 text-gray-900 leading-tight mb-6 max-w-3xl mx-auto">
          The AI Toolkit Every
          <span className="text-teal-600"> Freelancer </span>
          Needs
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto mb-10">
          Generate proposals, follow-ups, scope docs, invoice reminders, onboarding kits, and rate cards — in seconds, not hours.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onLaunch}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-teal-100 text-sm"
          >
            <Zap size={16} fill="white" />
            Try FreelanceKit Free
            <ArrowRight size={14} />
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-400">No signup. No credit card. Works in your browser.</p>

        {/* App preview */}
        <div className="mt-14 relative">
          <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-2xl shadow-panel overflow-hidden max-w-4xl mx-auto">
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-300" />
              <span className="w-3 h-3 rounded-full bg-amber-300" />
              <span className="w-3 h-3 rounded-full bg-green-300" />
              <span className="ml-3 text-xs text-gray-400 font-mono">freelancekit-zeta.vercel.app</span>
            </div>
            <div className="p-6 bg-gradient-to-br from-teal-600 to-teal-700">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} className="text-teal-200" fill="currentColor" />
                <span className="text-teal-200 text-xs font-semibold uppercase tracking-widest">FreelanceKit</span>
              </div>
              <h3 className="font-display text-xl font-700 text-white mb-1">Your AI Freelance Toolkit</h3>
              <p className="text-teal-100 text-sm">Generate proposals, follow-ups, scope docs, invoices and more — in seconds.</p>
            </div>
            <div className="p-6 grid grid-cols-3 gap-3">
              {TOOLS.slice(0, 3).map((tool) => (
                <div key={tool.label} className="bg-white border border-gray-200 rounded-xl p-3 shadow-card">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-2 ${COLOR_MAP[tool.color]}`}>
                    {tool.icon}
                  </div>
                  <p className="text-xs font-semibold text-gray-800">{tool.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-700 text-gray-900 mb-3">6 Tools. Every Freelance Need.</h2>
            <p className="text-gray-500 max-w-md mx-auto">Everything you need to run a professional freelance business — without the expensive software.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((tool) => (
              <div key={tool.label} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${COLOR_MAP[tool.color]}`}>
                  {tool.icon}
                </div>
                <h3 className="font-display text-[14px] font-700 text-gray-900 mb-1">{tool.label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-700 text-gray-900 mb-3">Ready in 3 Steps</h2>
            <p className="text-gray-500">No learning curve. Just fill, preview, and send.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-sm font-700 text-teal-600">{step.num}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Feature */}
      <section className="bg-gradient-to-br from-violet-50 to-purple-50 py-20 border-y border-violet-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Sparkles size={12} />
              Optional AI Enhancement
            </div>
            <h2 className="font-display text-3xl font-700 text-gray-900 mb-4">
              Make it Even Better with AI
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Every tool has an optional "✨ Enhance with AI" button. Connect your free Groq API key and let AI polish your output — making it more persuasive, professional, and client-ready.
            </p>
            <div className="flex flex-col items-center gap-2">
              {['Free Groq API — no credit card needed', 'One click to enhance any output', 'Keeps all your specific details intact'].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-teal-500" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-700 text-gray-900 mb-3">Freelancers Love It</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-card">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-700 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl font-700 text-white mb-4">
            Start Working Smarter Today
          </h2>
          <p className="text-teal-100 mb-8 max-w-md mx-auto">
            Join freelancers who save hours every week with FreelanceKit. Free forever. No account needed.
          </p>
          <button
            onClick={onLaunch}
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-teal-50 transition-colors shadow-lg text-sm"
          >
            <Zap size={16} fill="currentColor" />
            Launch FreelanceKit Free
            <ArrowRight size={14} />
          </button>
          <p className="mt-4 text-xs text-teal-200">No signup. No credit card. 100% free.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-teal-500 flex items-center justify-center">
              <Zap size={12} className="text-white" fill="white" />
            </div>
            <span className="font-display text-sm font-700 text-gray-900">FreelanceKit</span>
          </div>
          <p className="text-xs text-gray-400">Free forever. Built for freelancers.</p>
        </div>
      </footer>

    </div>
  );
}
