import { PLANETS } from '@/data/planets';
import { useIsMobile } from '@/hooks/use-mobile';

interface Props {
  currentIndex: number;
}

export default function OrbitalArcs({ currentIndex }: Props) {
  const isMobile = useIsMobile();

  // Decorative tiny planets — pick 3 not in current/neighbors
  const total = PLANETS.length;
  const exclude = new Set([
    currentIndex,
    (currentIndex - 1 + total) % total,
    (currentIndex + 1) % total,
  ]);
  const decorative = PLANETS.filter((_, i) => !exclude.has(i)).slice(0, 4);

  // arc parameters - centered on (720, 360) of viewBox 1440x720
  const cx = 720;
  const cy = 360;
  const opacityScale = isMobile ? 0.5 : 1;
  const arcs = [
    { rx: 220, ry: 70, opacity: 0.07 * opacityScale },
    { rx: 360, ry: 110, opacity: 0.08 * opacityScale },
    { rx: 510, ry: 160, opacity: 0.07 * opacityScale },
    { rx: 660, ry: 210, opacity: 0.06 * opacityScale },
  ];

  // Position decorative planets along arcs using parametric eq
  const decorPositions = [
    { arc: 0, angle: 0.85, size: 18 },
    { arc: 1, angle: 2.35, size: 26 },
    { arc: 2, angle: 0.45, size: 22 },
    { arc: 3, angle: 2.0, size: 30 },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1440 720"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {arcs.map((a, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={a.rx}
          ry={a.ry}
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeOpacity={a.opacity}
          strokeWidth={1}
        />
      ))}
      {!isMobile && decorative.map((p, i) => {
        const cfg = decorPositions[i];
        const arc = arcs[cfg.arc];
        const x = cx + arc.rx * Math.cos(cfg.angle);
        const y = cy + arc.ry * Math.sin(cfg.angle);
        return (
          <g key={p.id}>
            <defs>
              <clipPath id={`clip-${p.id}`}>
                <circle cx={x} cy={y} r={cfg.size} />
              </clipPath>
            </defs>
            <image
              href={p.image}
              x={x - cfg.size}
              y={y - cfg.size}
              width={cfg.size * 2}
              height={cfg.size * 2}
              clipPath={`url(#clip-${p.id})`}
              preserveAspectRatio="xMidYMid slice"
              opacity={0.85}
            />
          </g>
        );
      })}
    </svg>
  );
}
