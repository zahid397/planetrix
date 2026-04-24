import type { Planet } from '@/data/planets';
import { MOCK_PLANET_FACTS } from '@/data/mockContent';

type Msg = { role: 'user' | 'assistant'; content: string };

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function sleep(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }
async function stream(text: string, cb: (c: string) => void) {
  for (let i = 0; i < text.length; i++) {
    cb(text[i]);
    await sleep(text[i] === '\n' ? 30 : i % 5 === 0 ? 10 : 3);
  }
}

function buildReply(planet: Planet, question: string): string {
  const facts = MOCK_PLANET_FACTS[planet.id] ?? [];
  const q = question.toLowerCase();
  if (/unique|special|interesting|tell me|what is/.test(q)) {
    return `**${cap(planet.id)}** is remarkable for many reasons:\n\n${facts.map((f) => `- ${f}`).join('\n')}\n\nEach makes it a standout world in our solar system.`;
  }
  if (/life|human|live|habitable/.test(q)) {
    const livable = planet.id === 'earth';
    return livable
      ? `**Earth** is the only confirmed life-bearing planet. Its liquid water, moderate temperatures, and magnetic field create perfect conditions for life.`
      : `Humans **cannot currently survive on ${cap(planet.id)}**. Key challenges:\n\n${facts.slice(0, 2).map((f) => `- ${f}`).join('\n')}\n\nFuture technology could change that story.`;
  }
  if (/temp|hot|cold/.test(q)) {
    return `The average temperature on **${cap(planet.id)}** is **${planet.avgTemp}**.\n\n${facts.slice(0, 2).map((f) => `- ${f}`).join('\n')}`;
  }
  if (/fun fact|fact/.test(q)) {
    const pick = facts[Math.floor(Math.random() * facts.length)];
    const next = facts[(facts.indexOf(pick) + 1) % facts.length];
    return `Here are two fascinating facts about **${cap(planet.id)}**:\n\n1. ${pick}\n2. ${next}\n\nAsk me anything else!`;
  }
  const f = facts[Math.floor(Math.random() * facts.length)] ?? `${cap(planet.id)} is a fascinating world.`;
  return `**${cap(planet.id)}**: ${f}\n\n${facts[(facts.indexOf(f) + 1) % facts.length] ?? ''}\n\nWant to explore more?`;
}

export async function mockPlanetChat(planet: Planet, messages: Msg[], onChunk: (c: string) => void) {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  await stream(buildReply(planet, lastUser?.content ?? ''), onChunk);
}

export async function mockComparePlanets(a: Planet, b: Planet, onChunk: (c: string) => void) {
  const text = `## ${a.name} vs ${b.name}\n\n### Size\n**${a.name}** has a diameter of ${a.diameter}. **${b.name}** measures ${b.diameter}.\n\n### Temperature\n${a.name} averages ${a.avgTemp}, while ${b.name} averages ${b.avgTemp}. Vastly different thermal environments.\n\n### Day Length\nA day on **${a.name}** lasts ${a.lengthOfDay}. On **${b.name}** it is ${b.lengthOfDay}.\n\n### Atmosphere & Habitability\nNeither is currently suitable for unprotected human life, but both are scientifically fascinating destinations.\n\n### Verdict\n${a.name} stands out for its ${a.name === 'Earth' ? 'unique biosphere and liquid water' : 'extreme and remarkable conditions'}. ${b.name} is notable for its ${b.hasRings ? 'iconic ring system' : 'powerful atmospheric dynamics'}.`;
  await stream(text, onChunk);
}
