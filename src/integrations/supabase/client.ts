// Supabase replaced by local auth + localStorage.
// This stub keeps existing import paths compiling.
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: async () => ({}),
    signInWithPassword: async () => ({ data: null, error: { message: 'Use local auth' } }),
    signUp: async () => ({ data: null, error: { message: 'Use local auth' } }),
    resetPasswordForEmail: async () => ({ data: null, error: null }),
  },
  from: (_table: string) => ({
    select: (_cols?: string) => ({
      eq: (_col: string, _val: unknown) => ({
        eq: (_c: string, _v: unknown) => ({ maybeSingle: async () => ({ data: null, error: null }) }),
        order: (_col: string, _opts?: unknown) => Promise.resolve({ data: [], error: null }),
        maybeSingle: async () => ({ data: null, error: null }),
      }),
      order: (_col: string, _opts?: unknown) => ({
        limit: (_n: number) => Promise.resolve({ data: [], error: null }),
      }),
    }),
    insert: (_data: unknown) => ({
      select: () => ({ single: async () => ({ data: null, error: null }) }),
      then: (cb: (v: { error: null }) => void) => Promise.resolve({ error: null }).then(cb),
    }),
    update: (_data: unknown) => ({ eq: (_c: string, _v: unknown) => Promise.resolve({ error: null }) }),
    delete: () => ({ eq: (_c: string, _v: unknown) => Promise.resolve({ error: null }) }),
  }),
  storage: {
    from: (_bucket: string) => ({
      upload: async () => ({ error: null }),
      createSignedUrl: async () => ({ data: null, error: null }),
      remove: async () => ({ error: null }),
    }),
  },
  channel: (_name: string) => ({
    on: (_ev: string, _opts: unknown, _cb: unknown) => ({ subscribe: () => ({}) }),
  }),
  removeChannel: (_ch: unknown) => {},
};
