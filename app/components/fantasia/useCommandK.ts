import { useEffect } from 'react';

/** Ctrl / ⌘ + K opens the Salla search modal, like a command palette. */
export function useCommandK() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        window.salla?.event?.dispatch('search::open');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
