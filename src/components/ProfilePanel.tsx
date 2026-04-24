import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  User as UserIcon,
  Settings,
  Sun,
  Moon,
  Heart,
  History,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  BadgeCheck,
  Crown,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthContext } from '@/context/AuthContext';
const useAuth = useAuthContext;
import InfoModal from '@/components/InfoModal';
import ContactContent from '@/components/footer-content/ContactContent';
import AboutContent from '@/components/footer-content/AboutContent';
import { PLANETS } from '@/data/planets';
import {
  getFavorites,
  toggleFavorite,
  getHistory,
  getSettings,
  setSettings,
  type AppSettings,
  type HistoryEntry,
} from '@/data/mockContent';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const THEME_KEY = 'planetrix_theme';
type ModalKey = 'help' | 'about' | 'settings' | 'favorites' | 'history';

function SettingsBody() {
  const [s, setS] = useState<AppSettings>(() => getSettings());
  const update = (patch: Partial<AppSettings>) => {
    const next = { ...s, ...patch };
    setS(next);
    setSettings(next);
  };
  const Row = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div className="profile-menu-row">
      <span className="profile-menu-label">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`profile-theme-toggle ${value ? 'is-dark' : 'is-light'}`}
        aria-label={`Toggle ${label}`}
      >
        <span className="profile-theme-knob" />
      </button>
    </div>
  );
  return (
    <div className="space-y-1">
      <p className="text-white/60 text-xs mb-3">Preferences are saved locally on this device.</p>
      <Row label="Ambient Sound" value={s.sound} onChange={(v) => update({ sound: v })} />
      <Row label="Reduced Motion" value={s.reducedMotion} onChange={(v) => update({ reducedMotion: v })} />
      <Row label="Auto-play Voice Tour" value={s.autoVoice} onChange={(v) => update({ autoVoice: v })} />
    </div>
  );
}

function FavoritesBody({ onPick }: { onPick: () => void }) {
  const [favs, setFavs] = useState<string[]>(() => getFavorites());
  const planets = PLANETS.filter((p) => favs.includes(p.id));
  if (planets.length === 0) {
    return <p className="text-white/60 text-sm">No favorites yet — tap the heart on any planet card.</p>;
  }
  return (
    <div className="space-y-2">
      {planets.map((p) => (
        <div key={p.id} className="mock-card flex items-center gap-3">
          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
          <button
            className="flex-1 text-left"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('planetrix:select', { detail: p.id }));
              onPick();
            }}
          >
            <div className="text-white text-sm font-semibold">{p.name}</div>
            <div className="text-white/50 text-xs">{p.galaxy}</div>
          </button>
          <button
            onClick={() => setFavs(toggleFavorite(p.id))}
            aria-label="Remove favorite"
            className="text-rose-400 hover:text-rose-300 transition-colors p-2"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>
      ))}
    </div>
  );
}

function HistoryBody({ onPick }: { onPick: () => void }) {
  const [items, setItems] = useState<HistoryEntry[]>(() => getHistory());
  const clear = () => {
    localStorage.removeItem('planetrix_history');
    setItems([]);
  };
  if (items.length === 0) {
    return <p className="text-white/60 text-sm">No history yet — explore some planets first.</p>;
  }
  return (
    <div>
      <div className="flex justify-end mb-3">
        <button onClick={clear} className="text-white/60 hover:text-white text-xs flex items-center gap-1">
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>
      <div className="space-y-2">
        {items.map((h) => {
          const p = PLANETS.find((x) => x.id === h.id);
          if (!p) return null;
          return (
            <button
              key={`${h.id}-${h.at}`}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('planetrix:select', { detail: p.id }));
                onPick();
              }}
              className="mock-card w-full flex items-center gap-3 text-left"
            >
              <img src={p.image} alt={p.name} className="w-9 h-9 rounded-full object-cover" />
              <div className="flex-1">
                <div className="text-white text-sm font-semibold">{p.name}</div>
                <div className="text-white/50 text-xs">{new Date(h.at).toLocaleString()}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfilePanel({ open, onOpenChange }: Props) {
  const nav = useNavigate();
  const { user, signOut } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') ?? 'dark';
  });
  const [info, setInfo] = useState<ModalKey | null>(null);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  if (!user) return null;

  const namePart = (user.email ?? 'Explorer').split('@')[0];
  const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
  const initials = (user.email ?? '?').slice(0, 2).toUpperCase();

  const close = () => onOpenChange(false);
  const go = (path: string) => { close(); nav(path); };
  const openModal = (key: ModalKey) => { close(); setTimeout(() => setInfo(key), 150); };

  const handleSignOut = async () => {
    close();
    await signOut();
    toast.success('Signed out');
  };

  const menu = [
    { icon: UserIcon, label: 'Profile', onClick: () => go('/dashboard') },
    { icon: Settings, label: 'Settings', onClick: () => openModal('settings') },
    { icon: Heart, label: 'Favorites', onClick: () => openModal('favorites') },
    { icon: History, label: 'History', onClick: () => openModal('history') },
    { icon: HelpCircle, label: 'Help & Support', onClick: () => openModal('help') },
    { icon: Info, label: 'About Planetrix', onClick: () => openModal('about') },
  ];

  const modalTitle =
    info === 'help' ? 'Contact Mission Control'
    : info === 'about' ? 'About Planetrix'
    : info === 'settings' ? 'Settings'
    : info === 'favorites' ? 'Your Favorites'
    : info === 'history' ? 'Recent History'
    : '';

  const modalBody =
    info === 'help' ? <ContactContent />
    : info === 'about' ? <AboutContent />
    : info === 'settings' ? <SettingsBody />
    : info === 'favorites' ? <FavoritesBody onPick={() => setInfo(null)} />
    : info === 'history' ? <HistoryBody onPick={() => setInfo(null)} />
    : null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="profile-panel border-l border-white/10 p-0 w-[88vw] sm:w-[380px]">
          <SheetTitle className="sr-only">Profile</SheetTitle>
          <div className="profile-panel-inner">
            <div className="profile-header">
              <div className="profile-avatar-ring">
                <div className="profile-avatar">{initials}</div>
                <span className="profile-online-dot" />
              </div>
              <div className="profile-name-row">
                <span className="profile-name">{displayName}</span>
                <BadgeCheck className="w-4 h-4 text-sky-400" />
              </div>
              <div className="profile-email" title={user.email ?? ''}>{user.email}</div>
            </div>

            <div className="profile-premium">
              <div className="profile-premium-left">
                <span className="profile-premium-icon">
                  <Crown className="w-4 h-4 text-amber-300" />
                </span>
                <div>
                  <div className="profile-premium-title">Planetrix Premium</div>
                  <div className="profile-premium-sub">Active Plan</div>
                </div>
              </div>
              <button className="profile-premium-btn" onClick={() => toast.success('You are already on Premium 🎉')}>Upgrade</button>
            </div>

            <div className="profile-menu">
              {menu.map((m) => (
                <button key={m.label} className="profile-menu-row" onClick={m.onClick}>
                  <span className="profile-menu-icon"><m.icon className="w-4 h-4" /></span>
                  <span className="profile-menu-label">{m.label}</span>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </button>
              ))}
              <div className="profile-menu-row" role="group">
                <span className="profile-menu-icon">
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </span>
                <span className="profile-menu-label">Theme</span>
                <button
                  type="button"
                  className={`profile-theme-toggle ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  aria-label="Toggle theme"
                >
                  <span className="profile-theme-knob" />
                </button>
              </div>
            </div>

            <button className="profile-logout" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <InfoModal open={info !== null} onClose={() => setInfo(null)} title={modalTitle}>
        {modalBody}
      </InfoModal>
    </>
  );
}
