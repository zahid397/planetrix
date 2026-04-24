import { useEffect, useState } from 'react';

/**
 * Simulates a network fetch with a setTimeout delay.
 * Used to demonstrate the skeleton loader on first mount.
 */
export function useSimulatedFetch(delayMs = 2000) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs]);
  return ready;
}
