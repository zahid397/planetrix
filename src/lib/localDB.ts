// Replaces Supabase tables: chat_messages + job_applications
const CHAT_KEY = 'px_chat';
const APPS_KEY = 'px_apps';

export interface ChatMessage {
  id: string; session_id: string; planet_id: string;
  role: 'user' | 'assistant'; content: string; created_at: string;
}
export interface JobApplication {
  id: string; job_role: string; full_name: string; email: string;
  phone: string; experience: string; portfolio_url: string | null;
  cover_note: string | null; resume_path: string | null;
  reviewed: boolean; reviewed_at: string | null; created_at: string;
}

function get<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function save(key: string, data: unknown[]) { localStorage.setItem(key, JSON.stringify(data)); }

export const chatDB = {
  getForPlanet: (sid: string, pid: string): ChatMessage[] =>
    get<ChatMessage>(CHAT_KEY)
      .filter((m) => m.session_id === sid && m.planet_id === pid)
      .sort((a, b) => a.created_at.localeCompare(b.created_at)),
  insert: (m: Omit<ChatMessage, 'id' | 'created_at'>): ChatMessage => {
    const all = get<ChatMessage>(CHAT_KEY);
    const nm: ChatMessage = { ...m, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    save(CHAT_KEY, [...all, nm]);
    return nm;
  },
  clearForPlanet: (sid: string, pid: string) =>
    save(CHAT_KEY, get<ChatMessage>(CHAT_KEY).filter((m) => !(m.session_id === sid && m.planet_id === pid))),
};

export const appsDB = {
  getAll: (): JobApplication[] => get<JobApplication>(APPS_KEY).sort((a, b) => b.created_at.localeCompare(a.created_at)),
  insert: (app: Omit<JobApplication, 'id' | 'created_at' | 'reviewed' | 'reviewed_at'>): JobApplication => {
    const all = get<JobApplication>(APPS_KEY);
    const na: JobApplication = { ...app, id: crypto.randomUUID(), reviewed: false, reviewed_at: null, created_at: new Date().toISOString() };
    save(APPS_KEY, [...all, na]);
    return na;
  },
  update: (id: string, patch: Partial<JobApplication>) =>
    save(APPS_KEY, get<JobApplication>(APPS_KEY).map((a) => a.id === id ? { ...a, ...patch } : a)),
  delete: (id: string) =>
    save(APPS_KEY, get<JobApplication>(APPS_KEY).filter((a) => a.id !== id)),
};
