import type { Planet } from '@/data/planets';
import CenterPlanet from './CenterPlanet';
import NeighborPlanet from './NeighborPlanet';
import OrbitalArcs from './OrbitalArcs';

interface Props {
  current: Planet;
  prev: Planet;
  next: Planet;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function PlanetScene({
  current,
  prev,
  next,
  currentIndex,
  onPrev,
  onNext,
}: Props) {
  return (
    <div
      className="relative flex-1 w-full flex items-center justify-center"
      style={{ overflow: 'visible', minHeight: 0, paddingBottom: 20 }}
    >
      <div className="relative w-full h-full max-w-5xl xl:max-w-6xl mx-auto" style={{ minHeight: 0 }}>
        <OrbitalArcs currentIndex={currentIndex} />
        <NeighborPlanet planet={prev} side="left" onClick={onPrev} />
        <NeighborPlanet planet={next} side="right" onClick={onNext} />
        <CenterPlanet planet={current} />
      </div>
    </div>
  );
}
