import type { Planet } from '@/data/planets';
import { Globe2, Ruler, Clock, Thermometer, ArrowRight } from 'lucide-react';

interface Props {
  planet: Planet;
  onLearnMore?: () => void;
}

const STAT_ICONS = {
  galaxy: Globe2,
  diameter: Ruler,
  day: Clock,
  temp: Thermometer,
} as const;

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Globe2;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="info-stat-card">
      <div className="info-stat-icon" style={{ background: tone }}>
        <Icon className="w-4 h-4 text-white" strokeWidth={2.2} />
      </div>
      <div className="info-stat-text">
        <div className="info-stat-label">{label}</div>
        <div className="info-stat-value">{value}</div>
      </div>
    </div>
  );
}

export default function PlanetInfoPanel({ planet, onLearnMore }: Props) {
  return (
    <aside key={planet.id} className="info-panel stats-enter">
      <h1 className="info-panel-title">{planet.name}</h1>
      <p className="info-panel-desc">
        {planet.description ??
          'A celestial body in our solar system, drifting through the cosmic dark with its own story to tell.'}
      </p>
      <button type="button" className="info-panel-learn" onClick={onLearnMore}>
        Learn more <ArrowRight className="w-3.5 h-3.5" />
      </button>
      <div className="info-panel-grid">
        <StatCard icon={STAT_ICONS.galaxy} label="Galaxy" value={planet.galaxy} tone="linear-gradient(135deg,#6a8cff,#3a55c8)" />
        <StatCard icon={STAT_ICONS.diameter} label="Diameter" value={planet.diameter} tone="linear-gradient(135deg,#a78bfa,#7c3aed)" />
        <StatCard icon={STAT_ICONS.day} label="Length of Day" value={planet.lengthOfDay} tone="linear-gradient(135deg,#34d399,#059669)" />
        <StatCard icon={STAT_ICONS.temp} label="Avg Temperature" value={planet.avgTemp} tone="linear-gradient(135deg,#fb923c,#ea580c)" />
      </div>
    </aside>
  );
}
