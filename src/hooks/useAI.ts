import { useState, useCallback } from 'react';

interface UseAIOptions {
  apiKey: string;
}

interface UseAIReturn {
  enhance: (prompt: string, content: string) => Promise<string>;
  loading: boolean;
  error: string | null;
}

export function useAI({ apiKey }: UseAIOptions): UseAIReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhance = useCallback(
    async (prompt: string, content: string): Promise<string> => {
      if (!apiKey) {
        throw new Error('No API key configured. Add your Groq API key in Settings.');
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            max_tokens: 2048,
            messages: [
              {
                role: 'user',
                content: `${prompt}\n\nHere is the content to enhance:\n\n${content}`,
              },
            ],
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          const msg = (err as { error?: { message?: string } }).error?.message;
          throw new Error(msg || `Groq API error: ${response.status}`);
        }

        const data = await response.json() as {
          choices: Array<{ message: { content: string } }>;
        };

        const text = data.choices?.[0]?.message?.content ?? '';
        if (!text) throw new Error('No response from Groq.');
        return text;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  return { enhance, loading, error };
}
