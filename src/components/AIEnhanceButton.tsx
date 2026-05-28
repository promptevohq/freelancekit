import { Sparkles, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAI } from '../hooks/useAI';

interface AIEnhanceButtonProps {
  content: string;
  prompt: string;
  onEnhanced: (result: string) => void;
}

export function AIEnhanceButton({ content, prompt, onEnhanced }: AIEnhanceButtonProps) {
  const { settings, addToast } = useApp();
  const { enhance, loading } = useAI({ apiKey: settings.claudeApiKey || undefined });

  async function handleEnhance() {
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
      className="flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-lg border transition-all bg-gradient-to-r from-violet-500 to-purple-600 text-white border-transparent hover:from-violet-600 hover:to-purple-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <Sparkles size={13} />
      )}
      {loading ? 'Enhancing…' : '✨ Enhance with AI'}
    </button>
  );
}
