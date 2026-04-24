import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface AuthCtx {
  user: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────
const USERS_KEY = 'px_users';
const SESSION_KEY = 'px_session';

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  createdAt: string;
}

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}
function saveUsers(u: StoredUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

/** Simple deterministic hash — demo only, not for production */
function hashPwd(pwd: string): string {
  let h = 0;
  for (let i = 0; i < ('px_s4lt_' + pwd).length; i++) {
    h = ((h << 5) - h) + ('px_s4lt_' + pwd).charCodeAt(i);
    h |= 0;
  }
  return String(Math.abs(h));
}

function seed() {
  const users = getUsers();
  const upsert = (email: string, pwd: string, isAdmin: boolean, id: string) => {
    if (!users.find((u) => u.email === email)) {
      users.push({ id, email, passwordHash: hashPwd(pwd), isAdmin, createdAt: new Date().toISOString() });
    }
  };
  upsert('admin@planetrix.app', 'Admin@2099!', true, 'seed-admin');
  upsert('demo@planetrix.app', 'Demo!Explorer#2099', false, 'seed-demo');
  saveUsers(users);
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthCtx>({
  user: null, isAdmin: false, loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: () => {},
  resetPassword: async () => ({ error: null }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seed();
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) { const p: AuthUser = JSON.parse(raw); if (p?.id) setUser(p); }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const found = getUsers().find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.passwordHash === hashPwd(password)
    );
    if (!found) return { error: 'Invalid email or password' };
    const authUser: AuthUser = { id: found.id, email: found.email, isAdmin: found.isAdmin, createdAt: found.createdAt };
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return { error: null };
  };

  const signUp = async (email: string, password: string): Promise<{ error: string | null }> => {
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { error: 'An account with this email already exists' };
    }
    const nu: StoredUser = { id: crypto.randomUUID(), email: email.trim().toLowerCase(), passwordHash: hashPwd(password), isAdmin: false, createdAt: new Date().toISOString() };
    saveUsers([...users, nu]);
    const authUser: AuthUser = { id: nu.id, email: nu.email, isAdmin: false, createdAt: nu.createdAt };
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return { error: null };
  };

  const signOut = () => { localStorage.removeItem(SESSION_KEY); setUser(null); };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    const found = getUsers().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return { error: 'No account found with that email' };
    return { error: null }; // In production: send email
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.isAdmin ?? false, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() { return useContext(AuthContext); }
