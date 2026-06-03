import {
  LayoutDashboard, FileText, Mail, FolderKanban,
  Receipt, Users, Calculator, Settings, Zap, X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ToolId } from '../types';

const NAV_TOOLS: Array<{ id: ToolId | 'dashboard' | 'settings'; label: string; icon: React.ReactNode }> = [
  { id: 'dashboard',  label: 'Dashboard',       icon: <LayoutDashboard size={18} /> },
  { id: 'proposal',   label: 'Proposal',         icon: <FileText size={18} /> },
  { id: 'followup',   label: 'Follow-up Email',  icon: <Mail size={18} /> },
  { id: 'scope',      label: 'Scope Builder',    icon: <FolderKanban size={18} /> },
  { id: 'invoice',    label: 'Invoice Reminder', icon: <Receipt size={18} /> },
  { id: 'onboarding', label: 'Onboarding Kit',   icon: <Users size={18} /> },
  { id: 'calculator', label: 'Rate Calculator',  icon: <Calculator size={18} /> },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { activePage, setActivePage } = useApp();

  function handleNav(id: string) {
    setActivePage(id);
    onMobileClose();
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shadow-sm">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <div>
            <span className="font-display text-[15px] font-700 text-gray-900 tracking-tight">
              FreelanceKit
            </span>
            <span className="block text-[10px] text-gray-400 font-medium tracking-widest uppercase leading-none mt-0.5">
              AI Toolkit
            </span>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onMobileClose}
          className="md:hidden text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-2 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          Menu
        </p>
        <ul className="space-y-0.5">
          {NAV_TOOLS.map(({ id, label, icon }) => {
            const isActive = activePage === id;
            return (
              <li key={id}>
                <button
                  onClick={() => handleNav(id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={isActive ? 'text-teal-600' : 'text-gray-400'}>
                    {icon}
                  </span>
                  {label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={() => handleNav('settings')}
          className={`w-full flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            activePage === 'settings'
              ? 'bg-teal-50 text-teal-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Settings size={18} className={activePage === 'settings' ? 'text-teal-600' : 'text-gray-400'} />
          Settings
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-60 shrink-0 bg-white border-r border-gray-100 flex-col h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* ── Mobile overlay ────────────────────────────────────────────────── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed left-0 top-0 h-full w-72 bg-white z-50 flex flex-col md:hidden shadow-2xl">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
