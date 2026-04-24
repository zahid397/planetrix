import { PLANETS } from '@/data/planets';

interface Props {
  currentIndex: number;
  onSelect: (i: number) => void;
}

export default function PlanetDots({ currentIndex, onSelect }: Props) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-30 flex items-center gap-2"
      style={{ bottom: 140 }}
    >
      {PLANETS.map((p, i) => (
        <button
          key={p.id}
          type="button"
          aria-label={`Go to ${p.name}`}
          onClick={() => onSelect(i)}
          className={`dot ${i === currentIndex ? 'dot-active' : 'dot-inactive'}`}
        />
      ))}
    </div>
  );
}
