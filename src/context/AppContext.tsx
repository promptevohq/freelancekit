import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  AppSettings,
  Toast,
  ToastType,
  ToolId,
  HistoryEntry,
  DraftEntry,
} from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/helpers';

const SETTINGS_KEY = 'freelancekit_settings';
const HISTORY_KEY = 'freelancekit_history';
const DRAFTS_KEY = 'freelancekit_drafts';

interface AppContextValue {
  // Navigation
  activePage: string;
  setActivePage: (page: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;

  // History
  history: HistoryEntry[];
  addHistory: (entry: Omit<HistoryEntry, 'id' | 'createdAt'>) => void;
  clearHistory: (toolId?: ToolId) => void;
  deleteHistoryEntry: (id: string) => void;
  historyPanelOpen: boolean;
  setHistoryPanelOpen: (open: boolean) => void;

  // Drafts
  getDraft: (toolId: ToolId) => Record<string, string>;
  saveDraft: (toolId: ToolId, data: Record<string, string>) => void;
  clearDraft: (toolId: ToolId) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activePage, setActivePage] = useState('dashboard');

  // Listen to browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      setActivePage(hash || 'dashboard');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [settings, setSettings] = useLocalStorage<AppSettings>(SETTINGS_KEY, {
    claudeApiKey: '',
    theme: 'light',
    profile: { name: '', email: '', role: '', website: '', phone: '' },
  });

  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(HISTORY_KEY, []);
  const [drafts, setDrafts] = useLocalStorage<DraftEntry[]>(DRAFTS_KEY, []);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [historyPanelOpen, setHistoryPanelOpen] = useState(false);

  const navigateTo = useCallback((page: string) => {
    setActivePage(page);
    // Push to browser history so back button works
    const hash = page === 'dashboard' ? '#' : '#' + page;
    window.history.pushState({ page }, '', hash);
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...patch }));
    },
    [setSettings]
  );

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addHistory = useCallback(
    (entry: Omit<HistoryEntry, 'id' | 'createdAt'>) => {
      setHistory((prev) => {
        const newEntry: HistoryEntry = {
          ...entry,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        // Keep last 10 per tool
        const filtered = prev.filter((h) => h.toolId !== entry.toolId);
        const toolEntries = prev.filter((h) => h.toolId === entry.toolId);
        const kept = [newEntry, ...toolEntries].slice(0, 10);
        return [...filtered, ...kept];
      });
    },
    [setHistory]
  );

  const deleteHistoryEntry = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((h) => h.id !== id));
    },
    [setHistory]
  );

  const clearHistory = useCallback(
    (toolId?: ToolId) => {
      if (toolId) {
        setHistory((prev) => prev.filter((h) => h.toolId !== toolId));
      } else {
        setHistory([]);
      }
    },
    [setHistory]
  );

  const getDraft = useCallback(
    (toolId: ToolId): Record<string, string> => {
      const draft = drafts.find((d) => d.toolId === toolId);
      return draft?.data ?? {};
    },
    [drafts]
  );

  const saveDraft = useCallback(
    (toolId: ToolId, data: Record<string, string>) => {
      setDrafts((prev) => {
        const filtered = prev.filter((d) => d.toolId !== toolId);
        return [
          ...filtered,
          { toolId, data, updatedAt: new Date().toISOString() },
        ];
      });
    },
    [setDrafts]
  );

  const clearDraft = useCallback(
    (toolId: ToolId) => {
      setDrafts((prev) => prev.filter((d) => d.toolId !== toolId));
    },
    [setDrafts]
  );

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage: navigateTo,
        settings,
        updateSettings,
        toasts,
        addToast,
        removeToast,
        history,
        addHistory,
        clearHistory,
        deleteHistoryEntry,
        historyPanelOpen,
        setHistoryPanelOpen,
        getDraft,
        saveDraft,
        clearDraft,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
