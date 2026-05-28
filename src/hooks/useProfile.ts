import { useApp } from '../context/AppContext';

/**
 * Returns profile fields mapped to the common "your info" fields
 * used across all tool forms. Tools call this on mount to pre-fill.
 */
export function useProfile() {
  const { settings } = useApp();
  const p = settings.profile ?? { name: '', email: '', role: '', website: '', phone: '' };

  return {
    yourName: p.name,
    yourEmail: p.email,
    yourRole: p.role,
    hasProfile: Boolean(p.name),
  };
}
