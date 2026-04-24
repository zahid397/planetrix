import Logo from '@/components/Logo';
import UserMenu from '@/components/UserMenu';
import { useState } from 'react';
import InfoModal from '@/components/InfoModal';
import BlogContent from '@/components/footer-content/BlogContent';
import CareerContent from '@/components/footer-content/CareerContent';
import FaqContent from '@/components/footer-content/FaqContent';
import ContactContent from '@/components/footer-content/ContactContent';
import { Home, Orbit, Sparkles, Search } from 'lucide-react';
import { PLANETS } from '@/data/planets';
import { MOCK_NEWS, MOCK_PLANET_NUMBERS } from '@/data/mockContent';

type NavKey = 'blog' | 'career' | 'faq' | 'contact';
const NAV: { key: NavKey; label: string; title: string }[] = [
  { key: 'blog', label: 'Blog', title: 'Planetrix Blog' },
  { key: 'career', label: 'Career', title: 'Join the Mission' },
  { key: 'faq', label: 'FAQ', title: 'Frequently Asked' },
  { key: 'contact', label: 'Contact us', title: 'Contact Mission Control' },
];

type TabKey = 'home' | 'planets' | 'solar' | 'explore';

function selectPlanet(id: string) {
  window.dispatchEvent(new CustomEvent('planetrix:select', { detail: id }));
}

function PlanetsGridContent({ onPick }: { onPick: () => void }) {
  return (
    <div>
      <p className="text-white/70 text-sm mb-4">Tap a planet to navigate to it.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PLANETS.map((p) => (
          <button
            key={p.id}
            onClick={() => { selectPlanet(p.id); onPick(); }}
            className="mock-card group"
          >
            <img src={p.image} alt={p.name} className="w-12 h-12 rounded-full object-cover mb-2 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-white text-sm font-semibold text-center">{p.name}</div>
            <div className="text-white/50 text-[11px] text-center">{p.galaxy}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SolarSystemContent({ onPick }: { onPick: () => void }) {
  const list = PLANETS.filter((p) => p.id !== 'sun');
  return (
    <div className="space-y-3">
      <p className="text-white/70 text-sm">Ordered by distance from the Sun.</p>
      <div className="flex items-center justify-between text-[11px] text-white/40 uppercase tracking-wider px-2">
        <span>Planet</span>
        <span>Distance · Day</span>
      </div>
      {list.map((p, i) => {
        const m = MOCK_PLANET_NUMBERS[p.id];
        return (
          <button
            key={p.id}
            onClick={() => { selectPlanet(p.id); onPick(); }}
            className="mock-card w-full flex items-center gap-3 text-left"
          >
            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/60 text-xs font-bold">
              {i + 1}
            </div>
            <img src={p.image} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
              <div className="text-white font-semibold text-sm">{p.name}</div>
              <div className="text-white/50 text-xs">{p.diameter}</div>
            </div>
            <div className="text-right">
              <div className="text-white text-xs font-semibold">{m?.distanceMkm} M km</div>
              <div className="text-white/50 text-[11px]">{m?.dayHours}h day</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ExploreContent() {
  return (
    <div className="space-y-3">
      {MOCK_NEWS.map((n) => (
        <article key={n.id} className="mock-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-200">{n.tag}</span>
            <span className="text-white/40 text-[11px]">{new Date(n.date).toLocaleDateString()}</span>
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">{n.title}</h3>
          <p className="text-white/60 text-xs leading-relaxed">{n.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

export default function Header() {
  const [active, setActive] = useState<NavKey | null>(null);
  const meta = NAV.find((n) => n.key === active);
  const [tab, setTab] = useState<TabKey>('home');
  const [tabModal, setTabModal] = useState<TabKey | null>(null);

  const tabs = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'planets', label: 'Planets', icon: Orbit },
    { key: 'solar', label: 'Solar System', icon: Sparkles },
    { key: 'explore', label: 'Explore', icon: Search },
  ] as const;

  const handleTab = (key: TabKey) => {
    setTab(key);
    if (key === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setTabModal(key);
  };

  const renderContent = () => {
    switch (active) {
      case 'blog': return <BlogContent />;
      case 'career': return <CareerContent />;
      case 'faq': return <FaqContent />;
      case 'contact': return <ContactContent />;
      default: return null;
    }
  };

  const tabModalTitle =
    tabModal === 'planets' ? 'Choose a Planet'
    : tabModal === 'solar' ? 'Solar System'
    : tabModal === 'explore' ? 'Explore Space News'
    : '';

  const renderTabModal = () => {
    if (!tabModal) return null;
    if (tabModal === 'planets') return <PlanetsGridContent onPick={() => setTabModal(null)} />;
    if (tabModal === 'solar') return <SolarSystemContent onPick={() => setTabModal(null)} />;
    if (tabModal === 'explore') return <ExploreContent />;
    return null;
  };

  return (
    <>
    <header
      className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between logo-glow"
      style={{ padding: 'clamp(12px, 3vw, 20px) clamp(14px, 4vw, 24px)', height: 64 }}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={18} />
          <nav className="header-nav lg:hidden" aria-label="Primary">
            {NAV.map((n) => (
              <button key={n.key} type="button" onClick={() => setActive(n.key)} className="header-nav-link">
                {n.label}
              </button>
            ))}
          </nav>
        </div>

        <nav className="nav-pill-group hidden lg:flex" aria-label="Sections">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => handleTab(t.key)}
                className={`nav-pill ${isActive ? 'nav-pill-active' : ''}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center justify-end" style={{ minWidth: 80 }}>
          <UserMenu />
        </div>
      </div>
    </header>
    <InfoModal open={active !== null} onClose={() => setActive(null)} title={meta?.title ?? ''}>
      {renderContent()}
    </InfoModal>
    <InfoModal open={tabModal !== null} onClose={() => setTabModal(null)} title={tabModalTitle}>
      {renderTabModal()}
    </InfoModal>
    </>
  );
}
