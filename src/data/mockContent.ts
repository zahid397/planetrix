// Mock content used by header tabs, action dock, and profile panel modals.
// All values are illustrative only — no backend.

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
}

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'James Webb captures a new spiral galaxy nursery',
    date: '2026-04-12',
    tag: 'Discovery',
    excerpt: 'Astronomers reveal a stunning star-forming region 25 million light-years from Earth.',
  },
  {
    id: 'n2',
    title: 'Artemis IV crew completes lunar sim training',
    date: '2026-04-08',
    tag: 'Mission',
    excerpt: 'Four astronauts wrap up six weeks of integrated simulations ahead of the 2027 launch window.',
  },
  {
    id: 'n3',
    title: 'Liquid water plumes detected on Europa flyby',
    date: '2026-03-29',
    tag: 'Science',
    excerpt: 'Europa Clipper confirms active venting from the icy moon\u2019s southern hemisphere.',
  },
  {
    id: 'n4',
    title: 'Private mission to Mars announces 2028 target',
    date: '2026-03-15',
    tag: 'Industry',
    excerpt: 'A consortium of three space companies pledges a crewed Mars flyby within the decade.',
  },
];

export interface ToolItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unit: string;
  // factor relative to Earth (gravity, day length, etc.) keyed by planet id
}

export const MOCK_TOOLS: ToolItem[] = [
  { id: 'weight', name: 'Weight Converter', emoji: '⚖️', description: 'Your weight on this planet', unit: 'kg' },
  { id: 'distance', name: 'Distance from Sun', emoji: '📏', description: 'Average orbital distance', unit: 'million km' },
  { id: 'day', name: 'Day Length', emoji: '🕒', description: 'One full rotation', unit: 'Earth hours' },
  { id: 'orbit', name: 'Orbit Speed', emoji: '🚀', description: 'Average orbital velocity', unit: 'km/s' },
  { id: 'lighttime', name: 'Light Travel Time', emoji: '💡', description: 'Time for sunlight to arrive', unit: 'minutes' },
  { id: 'gravity', name: 'Surface Gravity', emoji: '🌐', description: 'Gravitational pull at surface', unit: 'g (Earth = 1)' },
];

// Mock per-planet numeric values for the tools modal
export const MOCK_PLANET_NUMBERS: Record<string, {
  gravity: number;       // relative to Earth
  distanceMkm: number;   // million km from sun
  dayHours: number;      // Earth hours
  orbitKms: number;      // km/s
  lightMinutes: number;  // sunlight travel time
}> = {
  sun:     { gravity: 27.9,  distanceMkm: 0,     dayHours: 600,  orbitKms: 0,    lightMinutes: 0 },
  mercury: { gravity: 0.38,  distanceMkm: 57.9,  dayHours: 1408, orbitKms: 47.4, lightMinutes: 3.2 },
  venus:   { gravity: 0.91,  distanceMkm: 108.2, dayHours: 5832, orbitKms: 35.0, lightMinutes: 6.0 },
  earth:   { gravity: 1.0,   distanceMkm: 149.6, dayHours: 24,   orbitKms: 29.8, lightMinutes: 8.3 },
  mars:    { gravity: 0.38,  distanceMkm: 227.9, dayHours: 24.7, orbitKms: 24.1, lightMinutes: 12.7 },
  jupiter: { gravity: 2.53,  distanceMkm: 778.5, dayHours: 9.9,  orbitKms: 13.1, lightMinutes: 43.3 },
  saturn:  { gravity: 1.07,  distanceMkm: 1432,  dayHours: 10.7, orbitKms: 9.7,  lightMinutes: 79.6 },
  uranus:  { gravity: 0.89,  distanceMkm: 2867,  dayHours: 17.2, orbitKms: 6.8,  lightMinutes: 159.4 },
  neptune: { gravity: 1.14,  distanceMkm: 4515,  dayHours: 16.1, orbitKms: 5.4,  lightMinutes: 250.8 },
};

export const MOCK_PLANET_FACTS: Record<string, string[]> = {
  sun:     ['Contains 99.86% of the solar system\u2019s mass.', 'Light from its core takes ~170,000 years to escape.', 'Will become a red giant in ~5 billion years.'],
  mercury: ['Has no atmosphere to retain heat.', 'A year lasts only 88 Earth days.', 'Surface temperatures swing 600°C between day and night.'],
  venus:   ['Rotates backwards compared to most planets.', 'A day on Venus is longer than its year.', 'Surface pressure is 92x that of Earth.'],
  earth:   ['The only known planet with active plate tectonics.', '71% of its surface is covered by water.', 'Magnetic field shields us from solar wind.'],
  mars:    ['Hosts Olympus Mons, the tallest volcano in the system.', 'Has two tiny moons: Phobos and Deimos.', 'Polar ice caps grow and shrink with the seasons.'],
  jupiter: ['Has at least 95 known moons.', 'The Great Red Spot has raged for 350+ years.', 'Its magnetic field is 14x stronger than Earth\u2019s.'],
  saturn:  ['Less dense than water — it would float.', 'Rings are mostly water ice and rock.', 'Has hexagonal storms at its north pole.'],
  uranus:  ['Tilted 98° — it orbits on its side.', 'Coldest atmosphere in the solar system at -224°C.', 'Has 13 known faint rings.'],
  neptune: ['Winds reach 2,100 km/h — fastest in the system.', 'Discovered by mathematics before observation.', 'Takes 165 Earth years to orbit the Sun.'],
};

export const MOCK_VOICE_LINES: Record<string, string[]> = {
  sun:     ['Welcome to the Sun, the heart of our solar system.', 'Its surface burns at six thousand kelvin.', 'Every planet you know orbits this single star.'],
  mercury: ['This is Mercury, the swiftest planet.', 'It races around the Sun in just 88 days.', 'Its cratered face has barely changed in billions of years.'],
  venus:   ['You are now visiting Venus.', 'A thick blanket of clouds traps unbearable heat.', 'It is the hottest planet in the solar system.'],
  earth:   ['Welcome home — this is planet Earth.', 'A blue oasis of life amid the cosmic dark.', 'Cherish it, for we have only one.'],
  mars:    ['This is Mars, the rust-colored frontier.', 'Future explorers may one day walk these dunes.', 'Its thin air whispers across an ancient riverbed.'],
  jupiter: ['Behold Jupiter, the king of planets.', 'Its swirling storms could swallow the Earth whole.', 'Dozens of moons dance in its orbit.'],
  saturn:  ['You have reached Saturn, jewel of the solar system.', 'Its rings span hundreds of thousands of kilometers.', 'Mostly hydrogen and helium, it is lighter than water.'],
  uranus:  ['This is Uranus, the tilted ice giant.', 'It rolls through space on its side.', 'Methane in its atmosphere paints it pale blue.'],
  neptune: ['You have arrived at Neptune, the windy frontier.', 'Supersonic gales tear across its deep blue clouds.', 'It marks the edge of the major planetary realm.'],
};

// LocalStorage helpers for favorites & history (persisted, mock)
const FAV_KEY = 'planetrix_favorites';
const HIST_KEY = 'planetrix_history';

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  const seed = ['earth', 'saturn'];
  localStorage.setItem(FAV_KEY, JSON.stringify(seed));
  return seed;
}

export function setFavorites(ids: string[]) {
  localStorage.setItem(FAV_KEY, JSON.stringify(ids));
}

export function toggleFavorite(id: string): string[] {
  const current = getFavorites();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  setFavorites(next);
  return next;
}

export interface HistoryEntry {
  id: string;
  at: number;
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return [];
}

export function pushHistory(id: string) {
  const cur = getHistory().filter((h) => h.id !== id);
  const next = [{ id, at: Date.now() }, ...cur].slice(0, 10);
  localStorage.setItem(HIST_KEY, JSON.stringify(next));
}

// Settings (mock toggles)
const SETTINGS_KEY = 'planetrix_settings';
export interface AppSettings {
  sound: boolean;
  reducedMotion: boolean;
  autoVoice: boolean;
}
const DEFAULT_SETTINGS: AppSettings = { sound: true, reducedMotion: false, autoVoice: false };

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* noop */ }
  return DEFAULT_SETTINGS;
}

export function setSettings(s: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}
