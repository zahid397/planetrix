import { useCallback, useEffect, useRef, useState } from 'react';
import { getPlanetTone, type PlanetTone } from '@/lib/planetTones';

const STORAGE_KEY = 'planet_sound_muted';
const CROSSFADE_SEC = 1.6;

let sharedCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedCtx) {
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as
      | typeof AudioContext
      | undefined;
    if (!Ctx) return null;
    sharedCtx = new Ctx();
  }
  return sharedCtx;
}

interface ToneVoice {
  oscs: OscillatorNode[];
  lfo: OscillatorNode;
  lfoGain: GainNode;
  filter: BiquadFilterNode;
  delay: DelayNode;
  feedback: GainNode;
  bus: GainNode;          // planet bus (volume animated for crossfade)
  planetMaster: number;   // tone-defined master level
  stop: (when: number) => void;
}

function buildVoice(ctx: AudioContext, tone: PlanetTone, destination: AudioNode): ToneVoice {
  const bus = ctx.createGain();
  bus.gain.value = 0;
  bus.connect(destination);

  const filter = ctx.createBiquadFilter();
  filter.type = tone.filter.type;
  filter.frequency.value = tone.filter.freq;
  filter.Q.value = tone.filter.q;
  filter.connect(bus);

  const delay = ctx.createDelay(2);
  delay.delayTime.value = tone.delay.time;
  const feedback = ctx.createGain();
  feedback.gain.value = tone.delay.feedback;
  const wet = ctx.createGain();
  wet.gain.value = tone.delay.mix;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(bus);

  const lfo = ctx.createOscillator();
  lfo.frequency.value = tone.lfo.freq;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = tone.lfo.depth;
  lfo.connect(lfoGain);

  const oscs: OscillatorNode[] = tone.layers.map((layer) => {
    const o = ctx.createOscillator();
    o.type = layer.type;
    o.frequency.value = layer.freq;
    if (layer.detune) o.detune.value = layer.detune;
    lfoGain.connect(o.frequency);
    const g = ctx.createGain();
    g.gain.value = layer.gain;
    o.connect(g);
    g.connect(filter);
    g.connect(delay);
    return o;
  });

  lfo.start();
  oscs.forEach((o) => o.start());

  const stop = (when: number) => {
    try {
      oscs.forEach((o) => o.stop(when));
      lfo.stop(when);
    } catch {
      /* already stopped */
    }
  };

  return { oscs, lfo, lfoGain, filter, delay, feedback, bus, planetMaster: tone.master, stop };
}

export function useAmbientSound(planetId: string) {
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === '1';
  });
  const [started, setStarted] = useState(false);
  const masterRef = useRef<GainNode | null>(null);
  const currentVoiceRef = useRef<ToneVoice | null>(null);
  const currentPlanetRef = useRef<string | null>(null);

  const ensureMaster = useCallback((ctx: AudioContext) => {
    if (!masterRef.current) {
      const m = ctx.createGain();
      m.gain.value = muted ? 0 : 1;
      m.connect(ctx.destination);
      masterRef.current = m;
    }
    return masterRef.current!;
  }, [muted]);

  const swapTo = useCallback((targetPlanet: string) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const master = ensureMaster(ctx);
    const tone = getPlanetTone(targetPlanet);
    const now = ctx.currentTime;

    const newVoice = buildVoice(ctx, tone, master);
    // Fade in new voice to its planet-master level
    newVoice.bus.gain.cancelScheduledValues(now);
    newVoice.bus.gain.setValueAtTime(0, now);
    newVoice.bus.gain.linearRampToValueAtTime(newVoice.planetMaster, now + CROSSFADE_SEC);

    // Fade out previous
    const prev = currentVoiceRef.current;
    if (prev) {
      prev.bus.gain.cancelScheduledValues(now);
      prev.bus.gain.linearRampToValueAtTime(0, now + CROSSFADE_SEC);
      prev.stop(now + CROSSFADE_SEC + 0.2);
    }

    currentVoiceRef.current = newVoice;
    currentPlanetRef.current = targetPlanet;
  }, [ensureMaster]);

  const start = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (!currentVoiceRef.current) {
      swapTo(planetId);
    }
    setStarted(true);
  }, [planetId, swapTo]);

  // Auto-start on first user interaction
  useEffect(() => {
    if (started) return;
    const onInteract = () => {
      start();
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
    };
    window.addEventListener('pointerdown', onInteract);
    window.addEventListener('keydown', onInteract);
    return () => {
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
    };
  }, [started, start]);

  // Crossfade when planet changes
  useEffect(() => {
    if (!started) return;
    if (currentPlanetRef.current === planetId) return;
    swapTo(planetId);
  }, [planetId, started, swapTo]);

  // React to mute changes (master gain)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
    const ctx = getAudioContext();
    if (!ctx || !masterRef.current) return;
    const target = muted ? 0 : 1;
    masterRef.current.gain.cancelScheduledValues(ctx.currentTime);
    masterRef.current.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.4);
  }, [muted]);

  const toggle = useCallback(() => {
    setMuted((m) => !m);
    if (!started) start();
  }, [started, start]);

  return { muted, toggle, started };
}
