const POSTS = [
  {
    title: 'Why Saturn’s Rings Might Disappear',
    date: 'Apr 12, 2026',
    tag: 'Astronomy',
    excerpt: 'Scientists estimate Saturn loses 10,000 kg of ring material every second to ring rain…',
  },
  {
    title: 'The First Human Steps on Mars',
    date: 'Mar 28, 2026',
    tag: 'Space Travel',
    excerpt: 'A look at the engineering, biology, and bravery required for the next giant leap.',
  },
  {
    title: 'Inside Jupiter’s Great Red Spot',
    date: 'Mar 04, 2026',
    tag: 'Discovery',
    excerpt: 'The storm has raged for 350+ years. Recent Juno data reveals it’s deeper than Earth.',
  },
];

export default function BlogContent() {
  return (
    <div className="space-y-3">
      {POSTS.map((p, i) => (
        <article
          key={p.title}
          className="rounded-xl p-4 cursor-pointer transition-all hover:translate-x-1 animate-fade-in"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            animationDelay: `${i * 80}ms`,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span
              style={{
                fontSize: 9,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#7AB8FF',
                background: 'rgba(122,184,255,0.12)',
                padding: '3px 8px',
                borderRadius: 4,
              }}
            >
              {p.tag}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{p.date}</span>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
            {p.title}
          </h3>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            {p.excerpt}
          </p>
        </article>
      ))}
    </div>
  );
}
