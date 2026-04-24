import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Mic, Bot, LayoutGrid, Share2, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';
import InfoModal from '@/components/InfoModal';
import { MOCK_TOOLS, MOCK_VOICE_LINES, MOCK_PLANET_NUMBERS } from '@/data/mockContent';
import { PLANETS, type Planet } from '@/data/planets';

type ModalKey = 'voice' | 'tools' | null;

function VoiceModalBody({ planet }: { planet: Planet }) {
  const lines = MOCK_VOICE_LINES[planet.id] ?? ['Welcome, traveler.'];
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const supports = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => () => { if (supports) window.speechSynthesis.cancel(); }, [supports]);

  const speak = (i: number) => {
    if (!supports) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(lines[i]);
    u.rate = 0.95;
    u.pitch = 1;
    u.onend = () => {
      if (i + 1 < lines.length) {
        setIdx(i + 1);
        speak(i + 1);
      } else {
        setPlaying(false);
        setIdx(0);
      }
    };
    window.speechSynthesis.speak(u);
  };

  const toggle = () => {
    if (!supports) {
      toast.error('Voice not supported in this browser');
      return;
    }
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
    } else {
      setPlaying(true);
      speak(idx);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <img src={planet.image} alt={planet.name} className="w-14 h-14 rounded-full object-cover" />
        <div>
          <div className="text-white font-semibold">{planet.name} · Voice Tour</div>
          <div className="text-white/50 text-xs">{lines.length} narrated lines</div>
        </div>
        <button
          onClick={toggle}
          className="ml-auto w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white hover:scale-105 transition-transform"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
        </button>
      </div>
      <ol className="space-y-2">
        {lines.map((l, i) => (
          <li
            key={i}
            className={`mock-card text-sm transition-all ${i === idx && playing ? 'ring-1 ring-violet-400/50' : ''}`}
          >
            <span className="text-white/40 text-xs mr-2">{i + 1}.</span>
            <span className="text-white/85">{l}</span>
          </li>
        ))}
      </ol>
      {!supports && (
        <p className="text-amber-300/80 text-xs mt-3">Speech synthesis isn't available — showing transcript only.</p>
      )}
    </div>
  );
}

function ToolsModalBody({ planet }: { planet: Planet }) {
  const [active, setActive] = useState<string | null>(null);
  const [input, setInput] = useState('70');
  const nums = MOCK_PLANET_NUMBERS[planet.id];

  const tool = MOCK_TOOLS.find((t) => t.id === active);

  const compute = (): string => {
    if (!tool || !nums) return '—';
    const n = parseFloat(input) || 0;
    switch (tool.id) {
      case 'weight':    return `${(n * nums.gravity).toFixed(2)} kg`;
      case 'distance':  return `${nums.distanceMkm} million km`;
      case 'day':       return `${nums.dayHours} Earth hours`;
      case 'orbit':     return `${nums.orbitKms} km/s`;
      case 'lighttime': return `${nums.lightMinutes} minutes`;
      case 'gravity':   return `${nums.gravity} g`;
      default:          return '—';
    }
  };

  return (
    <div>
      <p className="text-white/60 text-xs mb-3">Quick calculators for <span className="text-white/90 font-semibold">{planet.name}</span></p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {MOCK_TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`mock-card text-left ${active === t.id ? 'ring-1 ring-violet-400/60' : ''}`}
          >
            <div className="text-2xl mb-1">{t.emoji}</div>
            <div className="text-white text-xs font-semibold">{t.name}</div>
            <div className="text-white/50 text-[10px] mt-0.5">{t.description}</div>
          </button>
        ))}
      </div>
      {tool && (
        <div className="mock-card">
          <div className="text-white text-sm font-semibold mb-2">{tool.emoji} {tool.name}</div>
          {tool.id === 'weight' && (
            <div className="flex items-center gap-2 mb-2">
              <label className="text-white/60 text-xs">Your weight (kg):</label>
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-white/10 text-white text-sm rounded-md px-2 py-1 w-24 outline-none focus:ring-1 focus:ring-violet-400/60"
              />
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-white/60 text-xs">Result:</span>
            <span className="text-white text-lg font-bold">{compute()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ActionDock() {
  const nav = useNavigate();
  const [modal, setModal] = useState<ModalKey>(null);
  const planetRef = useRef<Planet>(PLANETS[0]);
  const [planet, setPlanet] = useState<Planet>(PLANETS[0]);

  // Stay in sync with current planet from Index.tsx
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const p = PLANETS.find((x) => x.id === id);
      if (p) { planetRef.current = p; setPlanet(p); }
    };
    const onPlanet = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const p = PLANETS.find((x) => x.id === id);
      if (p) { planetRef.current = p; setPlanet(p); }
    };
    window.addEventListener('planetrix:select', onSelect);
    window.addEventListener('planetrix:current', onPlanet);
    // Init from localStorage
    const last = localStorage.getItem('last_planet_id');
    if (last) {
      const p = PLANETS.find((x) => x.id === last);
      if (p) { planetRef.current = p; setPlanet(p); }
    }
    return () => {
      window.removeEventListener('planetrix:select', onSelect);
      window.removeEventListener('planetrix:current', onPlanet);
    };
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Planetrix', url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const items = [
    { icon: MessageCircle, label: 'Chat', onClick: () => nav('/chat'), tone: 'from-violet-500 to-fuchsia-500' },
    { icon: Mic, label: 'Voice', onClick: () => setModal('voice'), tone: 'from-sky-500 to-blue-600' },
    { icon: Bot, label: 'AI', onClick: () => nav(`/chat?planet=${planet.id}`), tone: 'from-emerald-500 to-teal-600' },
    { icon: LayoutGrid, label: 'Tools', onClick: () => setModal('tools'), tone: 'from-amber-500 to-orange-600' },
    { icon: Share2, label: 'Share', onClick: handleShare, tone: 'from-pink-500 to-rose-600' },
  ];

  return (
    <>
      <div className="action-dock-wrap" aria-label="Quick actions">
        <div className="action-dock">
          {items.map((it) => (
            <button key={it.label} type="button" onClick={it.onClick} className="action-dock-item" aria-label={it.label}>
              <span className={`action-dock-icon bg-gradient-to-br ${it.tone}`}>
                <it.icon className="w-4 h-4 text-white" strokeWidth={2.2} />
              </span>
              <span className="action-dock-label">{it.label}</span>
            </button>
          ))}
        </div>
      </div>
      <InfoModal
        open={modal === 'voice'}
        onClose={() => setModal(null)}
        title={`Voice Tour · ${planet.name}`}
      >
        <VoiceModalBody planet={planet} />
      </InfoModal>
      <InfoModal
        open={modal === 'tools'}
        onClose={() => setModal(null)}
        title={`Planet Tools · ${planet.name}`}
      >
        <ToolsModalBody planet={planet} />
      </InfoModal>
    </>
  );
}
