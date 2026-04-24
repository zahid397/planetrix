import { useEffect, useRef } from 'react';
import { PLANETS } from '@/data/planets';

interface Props {
  currentIndex: number;
  onSelect: (i: number) => void;
}

export default function PlanetIconStrip({ currentIndex, onSelect }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = itemRefs.current[currentIndex];
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [currentIndex]);

  return (
    <div className="planet-icon-strip-wrap md:max-w-5xl md:mx-auto" aria-label="Planet selector">
      <div className="planet-icon-strip" ref={scrollerRef}>
        {PLANETS.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => (itemRefs.current[i] = el)}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Select ${p.name}`}
            aria-current={i === currentIndex}
            className={`planet-icon-item ${i === currentIndex ? 'is-active' : ''}`}
          >
            <img src={p.image} alt="" loading="lazy" />
            <span className="planet-icon-label">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
