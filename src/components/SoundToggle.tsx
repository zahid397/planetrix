import { Volume2, VolumeX } from 'lucide-react';
import { useAmbientSound } from '@/hooks/useAmbientSound';

interface Props {
  planetId: string;
}

export default function SoundToggle({ planetId }: Props) {
  const { muted, toggle } = useAmbientSound(planetId);

  return (
    <button
      onClick={toggle}
      aria-label={muted ? 'Unmute ambient sound' : 'Mute ambient sound'}
      className="fixed bottom-20 left-5 md:bottom-24 md:left-8 z-50"
      style={{
        width: 48,
        height: 48,
        borderRadius: '999px',
        background: 'linear-gradient(135deg, hsl(220 60% 18% / 0.85), hsl(260 50% 14% / 0.85))',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: muted
          ? '0 6px 20px rgba(0,0,0,0.4)'
          : '0 6px 24px hsl(220 90% 55% / 0.4), 0 0 0 1px rgba(255,255,255,0.08)',
        animation: muted ? 'none' : 'soundPulse 2.6s ease-in-out infinite',
        backdropFilter: 'blur(8px)',
      }}
    >
      {muted ? (
        <VolumeX className="w-5 h-5 mx-auto text-white/70" />
      ) : (
        <Volume2 className="w-5 h-5 mx-auto text-white" />
      )}
    </button>
  );
}
