export default function AboutContent() {
  return (
    <div className="space-y-5 text-white/80" style={{ fontSize: 14, lineHeight: 1.7 }}>
      <p>
        <span className="text-white font-semibold">Planetrix</span> is a cosmic exploration
        platform built for dreamers, scientists, and the perpetually curious. Founded in 2024,
        our mission is to make the wonders of the solar system feel within arm's reach.
      </p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { k: '9', v: 'Worlds Mapped' },
          { k: '120+', v: 'Hours of Footage' },
          { k: '4.9★', v: 'Explorer Rating' },
        ].map((s) => (
          <div
            key={s.v}
            className="rounded-xl p-4 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.k}</div>
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
              {s.v}
            </div>
          </div>
        ))}
      </div>
      <p>
        We blend NASA imagery, real planetary data, and elegant design to create an experience
        that's equal parts educational and breathtaking. Every pixel is a window into the
        infinite.
      </p>
      <p className="text-white/60 italic">— The Planetrix Team, somewhere on Earth 🌍</p>
    </div>
  );
}
