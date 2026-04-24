// Per-planet ambient sonic identity.
// Each preset describes layered oscillators that build a unique drone "tone".
// Kept intentionally low-frequency, low-volume, evolving — ambient, not musical.

export interface OscLayer {
  freq: number;
  type: OscillatorType;
  gain: number;        // relative gain within the planet bus (0..1)
  detune?: number;     // cents
}

export interface PlanetTone {
  layers: OscLayer[];
  filter: { type: BiquadFilterType; freq: number; q: number };
  lfo: { freq: number; depth: number };  // depth in Hz applied to oscillator freqs
  delay: { time: number; feedback: number; mix: number };
  master: number;      // overall planet bus gain (0..1)
}

// Sun — warm, bright, radiant: higher partials, sawtooth shimmer, soft filter open
const sun: PlanetTone = {
  layers: [
    { freq: 110,    type: 'sine',     gain: 0.55 },
    { freq: 220,    type: 'triangle', gain: 0.40 },
    { freq: 329.6,  type: 'sawtooth', gain: 0.10, detune: 6 },
    { freq: 440,    type: 'sine',     gain: 0.18, detune: -4 },
  ],
  filter: { type: 'lowpass', freq: 2200, q: 0.6 },
  lfo:    { freq: 0.18, depth: 2.5 },
  delay:  { time: 0.40, feedback: 0.35, mix: 0.35 },
  master: 0.09,
};

// Mercury — bare, metallic, sparse
const mercury: PlanetTone = {
  layers: [
    { freq: 98,  type: 'sine',     gain: 0.55 },
    { freq: 196, type: 'triangle', gain: 0.30 },
    { freq: 392, type: 'sine',     gain: 0.12, detune: 8 },
  ],
  filter: { type: 'bandpass', freq: 900, q: 1.4 },
  lfo:    { freq: 0.06, depth: 1.5 },
  delay:  { time: 0.30, feedback: 0.25, mix: 0.20 },
  master: 0.07,
};

// Venus — thick, hot, pressurized: detuned saws, narrow band
const venus: PlanetTone = {
  layers: [
    { freq: 73.4, type: 'sawtooth', gain: 0.45, detune: -8 },
    { freq: 73.4, type: 'sawtooth', gain: 0.45, detune:  8 },
    { freq: 146.8,type: 'sine',     gain: 0.30 },
  ],
  filter: { type: 'lowpass', freq: 700, q: 1.0 },
  lfo:    { freq: 0.10, depth: 3.0 },
  delay:  { time: 0.55, feedback: 0.40, mix: 0.30 },
  master: 0.08,
};

// Earth — balanced, organic, breathing
const earth: PlanetTone = {
  layers: [
    { freq: 82.4,  type: 'sine',     gain: 0.55 },
    { freq: 164.8, type: 'triangle', gain: 0.30 },
    { freq: 246.9, type: 'sine',     gain: 0.18, detune: -4 },
  ],
  filter: { type: 'lowpass', freq: 1500, q: 0.7 },
  lfo:    { freq: 0.12, depth: 2.0 },
  delay:  { time: 0.50, feedback: 0.35, mix: 0.30 },
  master: 0.085,
};

// Mars — dusty, dry, brittle: high-pass grit, slow tremolo
const mars: PlanetTone = {
  layers: [
    { freq: 65.4,  type: 'sawtooth', gain: 0.35, detune: -5 },
    { freq: 130.8, type: 'triangle', gain: 0.40 },
    { freq: 261.6, type: 'square',   gain: 0.06, detune: 4 },
  ],
  filter: { type: 'highpass', freq: 180, q: 0.8 },
  lfo:    { freq: 0.22, depth: 4.0 },
  delay:  { time: 0.28, feedback: 0.20, mix: 0.18 },
  master: 0.075,
};

// Jupiter — vast, stormy, immense: very low fundamentals, wide motion
const jupiter: PlanetTone = {
  layers: [
    { freq: 41.2,  type: 'sine',     gain: 0.60 },
    { freq: 61.7,  type: 'sine',     gain: 0.40, detune: -6 },
    { freq: 82.4,  type: 'triangle', gain: 0.30 },
    { freq: 164.8, type: 'sawtooth', gain: 0.08, detune: 10 },
  ],
  filter: { type: 'lowpass', freq: 900, q: 0.9 },
  lfo:    { freq: 0.05, depth: 5.5 },
  delay:  { time: 0.70, feedback: 0.50, mix: 0.40 },
  master: 0.10,
};

// Saturn — ringed, shimmering, glassy
const saturn: PlanetTone = {
  layers: [
    { freq: 55,    type: 'sine',     gain: 0.50 },
    { freq: 110,   type: 'triangle', gain: 0.35 },
    { freq: 277.2, type: 'sine',     gain: 0.18, detune: -8 },
    { freq: 415.3, type: 'sine',     gain: 0.10, detune: 12 },
  ],
  filter: { type: 'lowpass', freq: 1800, q: 0.5 },
  lfo:    { freq: 0.09, depth: 2.2 },
  delay:  { time: 0.62, feedback: 0.55, mix: 0.45 },
  master: 0.085,
};

// Uranus — cold, tilted, ethereal
const uranus: PlanetTone = {
  layers: [
    { freq: 87.3,  type: 'sine',     gain: 0.50 },
    { freq: 174.6, type: 'triangle', gain: 0.30 },
    { freq: 349.2, type: 'sine',     gain: 0.20, detune: 14 },
  ],
  filter: { type: 'lowpass', freq: 1200, q: 0.6 },
  lfo:    { freq: 0.07, depth: 3.5 },
  delay:  { time: 0.80, feedback: 0.50, mix: 0.42 },
  master: 0.08,
};

// Neptune — deep, watery, oceanic: long delay, slow swell
const neptune: PlanetTone = {
  layers: [
    { freq: 49,    type: 'sine',     gain: 0.60 },
    { freq: 73.4,  type: 'sine',     gain: 0.40, detune: -6 },
    { freq: 146.8, type: 'triangle', gain: 0.25 },
    { freq: 196,   type: 'sine',     gain: 0.12, detune: 8 },
  ],
  filter: { type: 'lowpass', freq: 700, q: 1.1 },
  lfo:    { freq: 0.04, depth: 4.5 },
  delay:  { time: 0.90, feedback: 0.60, mix: 0.50 },
  master: 0.09,
};

export const PLANET_TONES: Record<string, PlanetTone> = {
  sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune,
};

export function getPlanetTone(planetId: string): PlanetTone {
  return PLANET_TONES[planetId] ?? earth;
}
