import { Sparkles, Loader2, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAI } from '../hooks/useAI';

interface AIEnhanceButtonProps {
  content: string;
  prompt: string;
  onEnhanced: (result: string) => void;
}

export function AIEnhanceButton({ content, prompt, onEnhanced }: AIEnhanceButtonProps) {
  const { settings, setActivePage, addToast } = useApp();
  const { enhance, loading } = useAI({ apiKey: settings.claudeApiKey });

  const hasKey = Boolean(settings.claudeApiKey);

  async function handleEnhance() {
    if (!hasKey) {
      addToast('Add your Claude API key in Settings to use AI enhancement.', 'info');
      setActivePage('settings');
      return;
    }

    try {
      const result = await enhance(prompt, content);
      onEnhanced(result);
      addToast('✨ Content enhanced with AI!', 'success');
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : 'AI enhancement failed.',
        'error'
      );
    }
  }

  return (
    <button
      onClick={handleEnhance}
      disabled={loading}
      className={`flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-lg border transition-all ${
        hasKey
          ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white border-transparent hover:from-violet-600 hover:to-purple-700 shadow-sm'
          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
      } disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <Loader2 size={13} className="animate-spin" />
      ) : hasKey ? (
        <Sparkles size={13} />
      ) : (
        <KeyRound size={13} />
      )}
      {loading ? 'Enhancing…' : '✨ Enhance with AI'}
    </button>
  );
}
