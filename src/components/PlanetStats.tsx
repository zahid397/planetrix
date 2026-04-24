import type { Planet } from '@/data/planets';

interface Props {
  planet: Planet;
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-center text-center" style={{ gap: 6 }}>
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.55)',
      }}
    >
      {label}
    </span>
    <span style={{ fontSize: 14, fontWeight: 300, color: '#fff' }}>{value}</span>
  </div>
);

export default function PlanetStats({ planet }: Props) {
  return (
    <div
      key={planet.id}
      className="stats-enter relative z-20 text-center px-4"
      style={{ paddingTop: 'clamp(72px, 10vw, 96px)', paddingBottom: 'clamp(8px, 2vw, 16px)' }}
    >
      <h1
        className="planet-title-mobile"
        style={{
          fontWeight: 800,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#fff',
          margin: 0,
        }}
      >
        {planet.name}
      </h1>
      <div className="planet-stats-grid max-w-5xl mx-auto px-4 md:px-8">
        <Stat label="Galaxy" value={planet.galaxy} />
        <Stat label="Diameter" value={planet.diameter} />
        <Stat label="Length of Day" value={planet.lengthOfDay} />
        <Stat label="Average Temperature" value={planet.avgTemp} />
      </div>
    </div>
  );
}
