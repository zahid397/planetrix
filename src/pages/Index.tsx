import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import PlanetStats from '@/components/PlanetStats';
import PlanetInfoPanel from '@/components/PlanetInfoPanel';
import PlanetScene from '@/components/PlanetScene';
import PlanetDots from '@/components/PlanetDots';
import PlanetIconStrip from '@/components/PlanetIconStrip';
import ActionDock from '@/components/ActionDock';
import Footer from '@/components/Footer';
import SkeletonPage from '@/components/skeleton/SkeletonPage';
import StarfieldCanvas from '@/components/StarfieldCanvas';
import GalaxyCanvas from '@/components/GalaxyCanvas';
import InfoModal from '@/components/InfoModal';
import { usePlanetNav } from '@/hooks/usePlanetNav';
import { useImageLoader } from '@/hooks/useImageLoader';
import { useSimulatedFetch } from '@/hooks/useSimulatedFetch';
import { PLANETS } from '@/data/planets';
import { MOCK_PLANET_FACTS, pushHistory } from '@/data/mockContent';

const LAST_PLANET_KEY = 'last_planet_id';

const Index = () => {
  const { current, prev, next, currentIndex, goNext, goPrev, goTo } = usePlanetNav();
  const { allLoaded } = useImageLoader();
  const fetchReady = useSimulatedFetch(2000);
  const ready = allLoaded && fetchReady;
  const [learnOpen, setLearnOpen] = useState(false);

  // Persist last viewed planet for dashboard/chat defaults + history + broadcast
  useEffect(() => {
    if (!current?.id) return;
    localStorage.setItem(LAST_PLANET_KEY, current.id);
    pushHistory(current.id);
    window.dispatchEvent(new CustomEvent('planetrix:current', { detail: current.id }));
  }, [current?.id]);

  // Listen for planet selection events from header modals
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const idx = PLANETS.findIndex((p) => p.id === id);
      if (idx >= 0) goTo(idx);
    };
    window.addEventListener('planetrix:select', onSelect);
    return () => window.removeEventListener('planetrix:select', onSelect);
  }, [goTo]);

  const facts = MOCK_PLANET_FACTS[current?.id] ?? [];

  return (
    <>
      {!ready && <SkeletonPage />}
      <GalaxyCanvas />
      <StarfieldCanvas />
      <div className="star-field" aria-hidden />
      <main className="home-main relative flex flex-col">
        <Header />

        {/* Mobile / tablet stats (unchanged) */}
        <div className="lg:hidden">
          <PlanetStats planet={current} />
        </div>

        {/* Desktop two-column: info panel + scene */}
        <div className="scene-wrap relative w-full flex lg:grid lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-6 lg:px-8 xl:px-12 lg:pt-24">
          <div className="hidden lg:flex items-center">
            <PlanetInfoPanel planet={current} onLearnMore={() => setLearnOpen(true)} />
          </div>
          <PlanetScene
            current={current}
            prev={prev}
            next={next}
            currentIndex={currentIndex}
            onPrev={goPrev}
            onNext={goNext}
          />
        </div>

        <div className="hidden md:block">
          <PlanetDots currentIndex={currentIndex} onSelect={goTo} />
        </div>

        <div className="icon-strip-shell">
          <PlanetIconStrip currentIndex={currentIndex} onSelect={goTo} />
        </div>

        <ActionDock />

        <Footer />
      </main>

      <InfoModal open={learnOpen} onClose={() => setLearnOpen(false)} title={current?.name ?? ''}>
        <div>
          <div className="flex items-start gap-4 mb-4">
            <img src={current?.image} alt={current?.name} className="w-20 h-20 rounded-full object-cover flex-shrink-0" />
            <p className="text-white/80 text-sm leading-relaxed">{current?.description}</p>
          </div>

          <h4 className="text-white/60 text-[11px] uppercase tracking-wider mb-2">Vital Statistics</h4>
          <div className="grid grid-cols-2 gap-2 mb-5">
            <div className="mock-card"><div className="text-white/50 text-[11px]">Galaxy</div><div className="text-white text-sm font-semibold">{current?.galaxy}</div></div>
            <div className="mock-card"><div className="text-white/50 text-[11px]">Diameter</div><div className="text-white text-sm font-semibold">{current?.diameter}</div></div>
            <div className="mock-card"><div className="text-white/50 text-[11px]">Day Length</div><div className="text-white text-sm font-semibold">{current?.lengthOfDay}</div></div>
            <div className="mock-card"><div className="text-white/50 text-[11px]">Avg Temp</div><div className="text-white text-sm font-semibold">{current?.avgTemp}</div></div>
          </div>

          <h4 className="text-white/60 text-[11px] uppercase tracking-wider mb-2">Fun Facts</h4>
          <ul className="space-y-2">
            {facts.map((f, i) => (
              <li key={i} className="mock-card text-sm text-white/80 flex gap-2">
                <span className="text-violet-300 font-bold">{i + 1}.</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </InfoModal>
    </>
  );
};

export default Index;
