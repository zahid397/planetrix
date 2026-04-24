interface LogoProps {
  size?: number;
}

export default function Logo({ size = 18 }: LogoProps) {
  return (
    <div className="flex items-center gap-2 select-none" aria-label="Planetrix">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="3.5"
          stroke="white"
          strokeWidth="1.2"
          transform="rotate(-25 12 12)"
        />
        <circle cx="12" cy="12" r="4" fill="white" />
      </svg>
      <span
        style={{
          fontSize: size * 0.95,
          letterSpacing: '0.12em',
          fontWeight: 700,
          color: '#fff',
          textTransform: 'uppercase',
        }}
      >
        Planet<span style={{ fontWeight: 300 }}>rix</span>
      </span>
    </div>
  );
}
