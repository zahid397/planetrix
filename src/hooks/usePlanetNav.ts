import { useCallback, useEffect, useRef, useState } from 'react';
import { PLANETS } from '@/data/planets';
import { getAudioContext } from '@/hooks/useAmbientSound';
import { playWhoosh } from '@/lib/whoosh';

const TRANSITION_MS = 220;

export function usePlanetNav() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lockRef = useRef(false);

  const total = PLANETS.length;

  const goTo = useCallback((index: number) => {
    if (lockRef.current) return;
    const next = ((index % total) + total) % total;
    if (next === currentIndex) return;
    lockRef.current = true;
    setIsTransitioning(true);
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'running') playWhoosh(ctx);
    window.setTimeout(() => {
      setCurrentIndex(next);
      setIsTransitioning(false);
      lockRef.current = false;
    }, TRANSITION_MS);
  }, [currentIndex, total]);

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  // Touch swipe
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let active = false;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      active = true;
    };
    const onEnd = (e: TouchEvent) => {
      if (!active) return;
      active = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) goNext(); else goPrev();
      }
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onEnd);
    };
  }, [goNext, goPrev]);

  const current = PLANETS[currentIndex];
  const prev = PLANETS[(currentIndex - 1 + total) % total];
  const next = PLANETS[(currentIndex + 1) % total];

  return { currentIndex, current, prev, next, goTo, goNext, goPrev, isTransitioning, total };
}
