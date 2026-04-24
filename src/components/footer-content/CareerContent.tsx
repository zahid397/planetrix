import { useState } from 'react';
import ApplyForm from '../ApplyForm';

const JOBS = [
  { role: 'Senior Frontend Engineer', loc: 'Remote · Worldwide', type: 'Full-time' },
  { role: 'Astrophysics Data Writer', loc: 'Houston, TX', type: 'Contract' },
  { role: '3D Motion Designer', loc: 'Remote · EU', type: 'Full-time' },
];

export default function CareerContent() {
  const [activeJob, setActiveJob] = useState<string | null>(null);

  if (activeJob) {
    return <ApplyForm jobRole={activeJob} onClose={() => setActiveJob(null)} />;
  }

  return (
    <div className="space-y-3">
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
        Help us map the cosmos. We're a small team obsessed with craft, science, and storytelling.
      </p>
      {JOBS.map((j, i) => (
        <div
          key={j.role}
          className="rounded-xl p-4 flex items-center justify-between gap-3 animate-fade-in"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            animationDelay: `${i * 80}ms`,
          }}
        >
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{j.role}</h3>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              {j.loc} · {j.type}
            </div>
          </div>
          <button
            onClick={() => setActiveJob(j.role)}
            className="rounded-full px-4 py-2 transition-all hover:scale-105"
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#0A1628',
              background: 'linear-gradient(135deg, #fff, #cfe0ff)',
            }}
          >
            Apply
          </button>
        </div>
      ))}
    </div>
  );
}
