export default function SkeletonPage() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'linear-gradient(180deg,#060B18 0%,#0A1628 100%)' }}
    >
      {/* Header */}
      <div className="flex justify-center" style={{ padding: '20px 20px' }}>
        <div className="skeleton-element" style={{ width: 140, height: 20, borderRadius: 99 }} />
      </div>

      {/* Planet name + stats */}
      <div className="flex flex-col items-center" style={{ paddingTop: 30, gap: 24 }}>
        <div className="skeleton-element" style={{ width: 200, height: 48, borderRadius: 8 }} />
        <div className="planet-stats-grid" style={{ maxWidth: 1000, margin: '0 auto' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center" style={{ gap: 8 }}>
              <div className="skeleton-element" style={{ width: 60, height: 10, borderRadius: 4 }} />
              <div className="skeleton-element" style={{ width: 100, height: 16, borderRadius: 4 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Scene */}
      <div className="relative flex-1" style={{ overflow: 'visible' }}>
        <div
          className="skeleton-element rounded-full absolute top-1/2 left-1/2"
          style={{
            width: 'min(62vw, 280px)',
            height: 'min(62vw, 280px)',
            aspectRatio: '1 / 1',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="skeleton-element rounded-full absolute top-1/2"
          style={{
            width: 'clamp(72px, 18vw, 110px)',
            height: 'clamp(72px, 18vw, 110px)',
            aspectRatio: '1 / 1',
            left: 0,
            transform: 'translate(-30%, -50%)',
          }}
        />
        <div
          className="skeleton-element rounded-full absolute top-1/2"
          style={{
            width: 'clamp(72px, 18vw, 110px)',
            height: 'clamp(72px, 18vw, 110px)',
            aspectRatio: '1 / 1',
            right: 0,
            transform: 'translate(30%, -50%)',
          }}
        />
      </div>

      {/* Footer */}
      <div
        className="flex justify-between flex-wrap gap-4"
        style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex flex-col" style={{ gap: 8 }}>
          <div className="skeleton-element" style={{ width: 110, height: 16, borderRadius: 4 }} />
          <div className="skeleton-element" style={{ width: 220, height: 8, borderRadius: 4 }} />
          <div className="skeleton-element" style={{ width: 200, height: 8, borderRadius: 4 }} />
          <div className="skeleton-element" style={{ width: 180, height: 8, borderRadius: 4 }} />
        </div>
        <div className="flex flex-col items-end" style={{ gap: 8 }}>
          {[60, 40, 50, 35, 70].map((w, i) => (
            <div key={i} className="skeleton-element" style={{ width: w, height: 10, borderRadius: 4 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
