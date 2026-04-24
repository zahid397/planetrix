import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
  baseAlpha: number;
  twinkle: number;
  twinkleSpeed: number;
}

interface Shooting {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function StarfieldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let stars: Star[] = [];
    let shooters: Shooting[] = [];
    let raf = 0;
    let mouseX = 0, mouseY = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(220, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.8 + 0.2,
        r: Math.random() * 1.4 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      }));
    };

    const spawnShooter = () => {
      const fromLeft = Math.random() > 0.5;
      shooters.push({
        x: fromLeft ? -50 : w + 50,
        y: Math.random() * h * 0.5,
        vx: (fromLeft ? 1 : -1) * (Math.random() * 4 + 6),
        vy: Math.random() * 2 + 1,
        life: 0,
        maxLife: 60,
      });
    };

    let frame = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      const px = (mouseX / w - 0.5) * 8;
      const py = (mouseY / h - 0.5) * 8;

      for (const s of stars) {
        s.twinkle += s.twinkleSpeed;
        const a = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.twinkle));
        const dx = s.x + px * s.z;
        const dy = s.y + py * s.z;
        ctx.beginPath();
        ctx.arc(dx, dy, s.r * s.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
        if (s.r > 1.2) {
          ctx.beginPath();
          ctx.arc(dx, dy, s.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,200,255,${a * 0.08})`;
          ctx.fill();
        }
      }

      shooters = shooters.filter((sh) => {
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life += 1;
        const t = 1 - sh.life / sh.maxLife;
        if (t <= 0) return false;
        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 6, sh.y - sh.vy * 6);
        grad.addColorStop(0, `rgba(255,255,255,${t})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 6, sh.y - sh.vy * 6);
        ctx.stroke();
        return true;
      });

      frame++;
      if (!reduce && frame % 240 === 0 && Math.random() > 0.4) spawnShooter();

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    if (!reduce) raf = requestAnimationFrame(tick);
    else {
      // single static draw
      tick();
      cancelAnimationFrame(raf);
    }

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
      }}
    />
  );
}
