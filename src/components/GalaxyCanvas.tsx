import { useEffect, useRef } from 'react';

interface Particle {
  r: number;        // radius from galactic center
  theta: number;    // angle
  arm: number;      // 0 or 1
  size: number;
  hue: number;      // 0-1 along pink->purple->blue
  alpha: number;
  twinkle: number;
}

interface Nebula {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export default function GalaxyCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let particles: Particle[] = [];
    let nebulas: Nebula[] = [];
    let raf = 0;
    let mx = 0, my = 0;
    let rotation = 0;

    const colorAt = (hue: number, alpha: number) => {
      // pink (255,80,180) -> purple (140,80,220) -> blue (80,150,255)
      let r: number, g: number, b: number;
      if (hue < 0.5) {
        const t = hue / 0.5;
        r = 255 + (140 - 255) * t;
        g = 80 + (80 - 80) * t;
        b = 180 + (220 - 180) * t;
      } else {
        const t = (hue - 0.5) / 0.5;
        r = 140 + (80 - 140) * t;
        g = 80 + (150 - 80) * t;
        b = 220 + (255 - 220) * t;
      }
      return `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(2800, Math.floor((w * h) / 700));
      const armTwist = 4.2;
      particles = Array.from({ length: count }, () => {
        const arm = Math.random() < 0.5 ? 0 : 1;
        const r = Math.pow(Math.random(), 0.6) * Math.min(w, h) * 0.7;
        const armOffset = arm * Math.PI;
        const spread = (Math.random() - 0.5) * 0.55;
        const theta = (r / Math.min(w, h)) * armTwist + armOffset + spread;
        return {
          r,
          theta,
          arm,
          size: Math.random() * 1.4 + 0.4,
          hue: Math.min(1, r / (Math.min(w, h) * 0.7)),
          alpha: Math.random() * 0.5 + 0.25,
          twinkle: Math.random() * Math.PI * 2,
        };
      });

      nebulas = Array.from({ length: 5 }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        radius: Math.min(w, h) * (0.25 + Math.random() * 0.2),
        color: i % 2 === 0
          ? 'rgba(180, 90, 220, 0.10)'
          : 'rgba(80, 130, 255, 0.08)',
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      // Nebula clouds
      for (const n of nebulas) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -n.radius) n.x = w + n.radius;
        if (n.x > w + n.radius) n.x = -n.radius;
        if (n.y < -n.radius) n.y = h + n.radius;
        if (n.y > h + n.radius) n.y = -n.radius;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(n.x - n.radius, n.y - n.radius, n.radius * 2, n.radius * 2);
      }

      // Galaxy
      const cx = w * 0.5 + (mx / w - 0.5) * 30;
      const cy = h * 0.62 + (my / h - 0.5) * 20;
      rotation += reduce ? 0 : 0.0006;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      // Squash for elliptical galaxy
      ctx.scale(1, 0.55);

      for (const p of particles) {
        p.twinkle += 0.02;
        const x = Math.cos(p.theta) * p.r;
        const y = Math.sin(p.theta) * p.r;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));
        ctx.fillStyle = colorAt(p.hue, a);
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Galactic core glow
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(w, h) * 0.2);
      coreGrad.addColorStop(0, 'rgba(255, 220, 180, 0.35)');
      coreGrad.addColorStop(0.4, 'rgba(220, 140, 220, 0.15)');
      coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(w, h) * 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    if (!reduce) raf = requestAnimationFrame(tick);
    else tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.85,
      }}
    />
  );
}
