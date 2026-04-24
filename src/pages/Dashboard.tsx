import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Sparkles, Volume2, VolumeX, Shield, LayoutDashboard, LogIn } from 'lucide-react';
import StarfieldCanvas from '@/components/StarfieldCanvas';
import GalaxyCanvas from '@/components/GalaxyCanvas';
import Logo from '@/components/Logo';
import UserMenu from '@/components/UserMenu';
import { PLANETS } from '@/data/planets';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import { useAuth } from '@/hooks/useAdminAuth';

const LAST_PLANET_KEY = 'last_planet_id';

function getLastPlanetId(): string {
  if (typeof window === 'undefined') return PLANETS[0].id;
  return localStorage.getItem(LAST_PLANET_KEY) || PLANETS[0].id;
}

export default function Dashboard() {
  const nav = useNavigate();
  const lastId = getLastPlanetId();
  const { muted, toggle } = useAmbientSound(lastId);
  const { user, isAdmin, loading } = useAuth();

  const goPlanet = (id: string) => {
    localStorage.setItem(LAST_PLANET_KEY, id);
    nav('/');
  };

  // Fourth card: signed-out → Sign In CTA, admin → Mission Control, signed-in non-admin → Admin Login
  const fourthCard = !user
    ? { target: '/auth?next=/dashboard', label: 'Sign In', sub: 'Save your journey across devices', Icon: LogIn, color: 'hsl(45 95% 60%)' }
    : isAdmin
    ? { target: '/admin', label: 'Mission Control', sub: user.email ?? 'Admin tools', Icon: LayoutDashboard, color: 'hsl(45 95% 60%)' }
    : { target: '/admin/login', label: 'Admin Login', sub: user.email ?? 'Sign in to manage applications', Icon: Shield, color: 'hsl(45 95% 60%)' };
  const FourthIcon = fourthCard.Icon;

  return (
    <>
      <GalaxyCanvas />
      <StarfieldCanvas />
      <div className="star-field" aria-hidden />

      <main className="relative min-h-dvh flex flex-col">
        <header className="flex items-center justify-between px-5 md:px-10 py-5 gap-3">
          <Logo size={18} />
          <div className="flex items-center gap-3">
            <button
              onClick={() => nav('/')}
              className="dash-back"
              aria-label="Back to planets"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Planets</span>
            </button>
            <UserMenu />
          </div>
        </header>

        <div className="flex-1 px-5 md:px-10 pb-12 max-w-6xl mx-auto w-full">
          <div className="mb-8 md:mb-10">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Mission Hub</h1>
            <p className="text-sm md:text-base text-white/55">
              Explore planets, talk to the AI, and manage your account.
            </p>
          </div>

          <section className="dash-grid mb-12">
            <button onClick={() => nav('/')} className="dash-card">
              <Globe className="dash-card-icon" style={{ color: 'hsl(200 90% 60%)' }} />
              <div className="dash-card-title">Explore Planets</div>
              <div className="dash-card-sub">Browse the solar system</div>
            </button>

            <button onClick={() => nav(`/chat?planet=${lastId}`)} className="dash-card">
              <Sparkles className="dash-card-icon" style={{ color: 'hsl(280 85% 70%)' }} />
              <div className="dash-card-title">Chat with AI</div>
              <div className="dash-card-sub">Analyze any planet</div>
            </button>

            <button onClick={toggle} className="dash-card">
              {muted ? (
                <VolumeX className="dash-card-icon" style={{ color: 'hsl(0 0% 70%)' }} />
              ) : (
                <Volume2 className="dash-card-icon" style={{ color: 'hsl(160 70% 55%)' }} />
              )}
              <div className="dash-card-title">Ambient Sound</div>
              <div className="dash-card-sub">{muted ? 'Currently muted' : 'Currently playing'}</div>
            </button>

            <button onClick={() => nav(fourthCard.target)} className="dash-card" disabled={loading}>
              <FourthIcon className="dash-card-icon" style={{ color: fourthCard.color }} />
              <div className="dash-card-title">{fourthCard.label}</div>
              <div className="dash-card-sub">{fourthCard.sub}</div>
            </button>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">Jump to a planet</h2>
            <div className="dash-planet-grid">
              {PLANETS.map((p) => (
                <button key={p.id} onClick={() => goPlanet(p.id)} className="dash-planet-tile">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
