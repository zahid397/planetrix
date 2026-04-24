import { useEffect, useState } from 'react';
import { PLANETS } from '@/data/planets';

export function useImageLoader() {
  const [allLoaded, setAllLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    let loaded = 0;
    const total = PLANETS.length;

    PLANETS.forEach((p) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded += 1;
        if (!mounted) return;
        setProgress(loaded / total);
        if (loaded >= total) setAllLoaded(true);
      };
      img.src = p.image;
    });

    // Failsafe — never block UI more than 4s
    const failsafe = window.setTimeout(() => {
      if (mounted) setAllLoaded(true);
    }, 4000);

    return () => {
      mounted = false;
      window.clearTimeout(failsafe);
    };
  }, []);

  return { allLoaded, progress };
}
