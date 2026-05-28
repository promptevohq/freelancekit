import { useState, useCallback } from 'react';

interface UseAIOptions {
  apiKey?: string; // optional — user's own key overrides proxy
}

interface UseAIReturn {
  enhance: (prompt: string, content: string) => Promise<string>;
  loading: boolean;
  error: string | null;
}

export function useAI({ apiKey }: UseAIOptions = {}): UseAIReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhance = useCallback(
    async (prompt: string, content: string): Promise<string> => {
      setLoading(true);
      setError(null);

      try {
        const messages = [
          {
            role: 'user',
            content: `${prompt}\n\nHere is the content to enhance:\n\n${content}`,
          },
        ];

        let response: Response;

        if (apiKey) {
          // User's own Groq key — call directly
          response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: 'llama-3.1-8b-instant',
              max_tokens: 2048,
              messages,
            }),
          });
        } else {
          // Use server proxy (no key needed from user)
          response = await fetch('/api/enhance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages }),
          });
        }

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          const msg = (err as { error?: { message?: string } | string }).error;
          throw new Error(
            typeof msg === 'string' ? msg : (msg as { message?: string })?.message || `Error: ${response.status}`
          );
        }

        const data = await response.json() as {
          choices: Array<{ message: { content: string } }>;
        };

        const text = data.choices?.[0]?.message?.content ?? '';
        if (!text) throw new Error('No response received.');
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
