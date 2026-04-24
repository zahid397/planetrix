import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'Is Planetrix free to use?', a: 'Yes, exploring the solar system is completely free. Premium 4K imagery requires an account.' },
  { q: 'Where does the planetary data come from?', a: 'Public NASA / ESA datasets, JPL Horizons, and Wikimedia Commons imagery.' },
  { q: 'Can I use Planetrix for education?', a: 'Absolutely — teachers can request a free classroom pack via the Contact form.' },
  { q: 'Do you support VR or AR?', a: 'WebXR support is on the roadmap for late 2026.' },
  { q: 'Why is Pluto missing?', a: 'We honor the IAU 2006 definition. A dwarf-planets module is coming soon.' },
];

export default function FaqContent() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-2">
      {FAQS.map((f, i) => {
        const active = open === i;
        return (
          <div
            key={f.q}
            className="rounded-xl overflow-hidden transition-all"
            style={{
              background: active ? 'rgba(122,184,255,0.06)' : 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <button
              onClick={() => setOpen(active ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{f.q}</span>
              <ChevronDown
                size={16}
                className="text-white/60 transition-transform duration-300"
                style={{ transform: active ? 'rotate(180deg)' : 'rotate(0)' }}
              />
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: active ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', padding: '0 16px 14px', lineHeight: 1.6 }}>
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
