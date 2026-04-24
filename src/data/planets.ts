import sunImg from '@/assets/sun.jpg';
import mercuryImg from '@/assets/mercury.jpg';
import venusImg from '@/assets/venus.jpg';
import earthImg from '@/assets/earth.jpg';
import marsImg from '@/assets/mars.jpg';
import jupiterImg from '@/assets/jupiter.jpg';
import saturnImg from '@/assets/saturn.jpg';
import uranusImg from '@/assets/uranus.jpg';
import neptuneImg from '@/assets/neptune.jpg';

export interface Planet {
  id: string;
  name: string;
  galaxy: string;
  diameter: string;
  lengthOfDay: string;
  avgTemp: string;
  image: string;
  size: number;
  glowColor: string;
  hasRings?: boolean;
  description?: string;
}

export const PLANETS: Planet[] = [
  {
    id: 'sun',
    name: 'Sun',
    galaxy: 'Milky Way',
    diameter: '1,392,684 km',
    lengthOfDay: '—',
    avgTemp: '6000 Kelvin',
    image: sunImg,
    size: 340,
    glowColor: 'rgba(255, 140, 30, 0.35)',
    description: 'The Sun is the star at the heart of our solar system, a luminous sphere of hot plasma whose gravity binds every planet, asteroid, and comet to its orbit.',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    galaxy: 'Milky Way',
    diameter: '4,879 km',
    lengthOfDay: '58.6 Earth days',
    avgTemp: '167°C',
    image: mercuryImg,
    size: 200,
    glowColor: 'rgba(180, 160, 140, 0.25)',
    description: 'Mercury is the smallest planet in our solar system and the closest to the Sun, scorched by day and frozen by night across its cratered surface.',
  },
  {
    id: 'venus',
    name: 'Venus',
    galaxy: 'Milky Way',
    diameter: '12,104 km',
    lengthOfDay: '2,802 Earth hours',
    avgTemp: '464°C',
    image: venusImg,
    size: 260,
    glowColor: 'rgba(230, 180, 60, 0.30)',
    description: 'Venus is the second planet from the Sun and the hottest in our solar system, wrapped in thick clouds of sulfuric acid that trap searing heat.',
  },
  {
    id: 'earth',
    name: 'Earth',
    galaxy: 'Milky Way',
    diameter: '12,742 km',
    lengthOfDay: '24 Earth hours',
    avgTemp: '15°C',
    image: earthImg,
    size: 265,
    glowColor: 'rgba(30, 100, 220, 0.30)',
    description: 'Earth is our home — the only known world to harbor life, with vast oceans, a protective atmosphere, and a single natural satellite, the Moon.',
  },
  {
    id: 'mars',
    name: 'Mars',
    galaxy: 'Milky Way',
    diameter: '6,794 km',
    lengthOfDay: '24.7 Earth hours',
    avgTemp: '65 degrees Celsius',
    image: marsImg,
    size: 230,
    glowColor: 'rgba(200, 80, 40, 0.30)',
    description: 'Mars, the red planet, is a cold desert world with the tallest volcano and the deepest canyon in the solar system — a prime target for human exploration.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    galaxy: 'Milky Way',
    diameter: '139,820 km',
    lengthOfDay: '9.9 Earth hours',
    avgTemp: '-110°C',
    image: jupiterImg,
    size: 310,
    glowColor: 'rgba(200, 150, 100, 0.28)',
    description: 'Jupiter is the largest planet in our solar system, a swirling gas giant guarded by dozens of moons and the iconic centuries-old Great Red Spot storm.',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    galaxy: 'Milky Way',
    diameter: '120,536 km',
    lengthOfDay: '10.7 Earth hours',
    avgTemp: '140-degree Celsius',
    image: saturnImg,
    size: 300,
    glowColor: 'rgba(210, 170, 80, 0.28)',
    hasRings: true,
    description: 'Saturn is the jewel of the solar system, a gas giant adorned by spectacular rings of ice and rock spanning hundreds of thousands of kilometers.',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    galaxy: 'Milky Way',
    diameter: '51,118 km',
    lengthOfDay: '17.2 Earth hours',
    avgTemp: '-195°C',
    image: uranusImg,
    size: 255,
    glowColor: 'rgba(100, 210, 220, 0.25)',
    description: 'Uranus is an ice giant tilted nearly on its side, rolling around the Sun with pale cyan clouds of methane and a faint set of dark, narrow rings.',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    galaxy: 'Milky Way',
    diameter: '49,528 km',
    lengthOfDay: '16.1 Earth hours',
    avgTemp: '-200°C',
    image: neptuneImg,
    size: 250,
    glowColor: 'rgba(40, 80, 220, 0.28)',
    description: 'Neptune is the windiest planet, a deep-blue ice giant on the dark frontier of the solar system where supersonic storms tear across its atmosphere.',
  },
];
