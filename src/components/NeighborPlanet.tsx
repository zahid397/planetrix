import type { Planet } from '@/data/planets';

interface Props {
  planet: Planet;
  side: 'left' | 'right';
  onClick: () => void;
}

export default function NeighborPlanet({ planet, side, onClick }: Props) {
  const isLeft = side === 'left';
  const imageScale = planet.id === 'sun' ? 1.28 : planet.id === 'saturn' ? 1.1 : 1.16;

  return (
    <button
      key={planet.id}
      type="button"
      onClick={onClick}
      aria-label={`Go to ${planet.name}`}
      className="neighbor-enter group absolute top-1/2 cursor-pointer bg-transparent border-0 p-0"
      style={{
        [isLeft ? 'left' : 'right']: 0,
        transform: `translateY(-50%) translateX(${isLeft ? '-30%' : '30%'})`,
      }}
    >
      <div
        className="neighbor-float relative rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105"
        style={{
          width: 'clamp(56px, 16vw, 170px)',
          height: 'clamp(56px, 16vw, 170px)',
          aspectRatio: '1 / 1',
          boxShadow: `0 0 50px ${planet.glowColor}`,
          opacity: 0.9,
        }}
      >
        <img
          src={planet.image}
          alt={planet.name}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            mixBlendMode: 'screen',
            transform: `scale(${imageScale})`,
            transformOrigin: 'center',
          }}
        />
        <span
          className="hidden md:inline-block absolute whitespace-nowrap"
          style={{
            top: '50%',
            transform: 'translateY(-50%)',
            [isLeft ? 'right' : 'left']: 'calc(100% + 12px)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#fff',
            opacity: 0.85,
          }}
        >
          {planet.name}
        </span>
      </div>
    </button>
  );
}
