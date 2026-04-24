import { useEffect, useState } from 'react';
import type { Planet } from '@/data/planets';

interface Props {
  planet: Planet;
}

export default function CenterPlanet({ planet }: Props) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w < 480) setScale(Math.min(0.62, (h * 0.32) / 220));
      else if (w < 768) setScale(Math.min(0.72, (h * 0.36) / 220));
      else if (w < 1024) setScale(0.85);
      else setScale(1.05);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const size = Math.round(planet.size * scale);
  const imageScale = planet.id === 'sun' ? 1.32 : planet.id === 'saturn' ? 1.12 : 1.18;

  return (
    <div
      key={planet.id}
      className="planet-enter absolute top-1/2 left-1/2 z-10"
      style={{
        width: size,
        height: size,
        maxWidth: 'min(65vw, 340px)',
        maxHeight: 'min(65vw, 340px)',
        aspectRatio: '1 / 1',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: `0 0 80px ${planet.glowColor}, 0 0 160px ${planet.glowColor}`,
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
            border: 'none',
            outline: 'none',
            mixBlendMode: 'screen',
            transform: `scale(${imageScale})`,
            transformOrigin: 'center',
          }}
        />
      </div>
      {planet.hasRings && (
        <svg
          className="saturn-ring"
          width={size * 1.9}
          height={size * 0.6}
          viewBox="0 0 380 120"
          aria-hidden
        >
          <ellipse
            cx="190"
            cy="60"
            rx="180"
            ry="22"
            fill="none"
            stroke="rgba(210, 170, 80, 0.35)"
            strokeWidth="6"
          />
          <ellipse
            cx="190"
            cy="60"
            rx="160"
            ry="18"
            fill="none"
            stroke="rgba(230, 190, 110, 0.25)"
            strokeWidth="3"
          />
        </svg>
      )}
    </div>
  );
}
