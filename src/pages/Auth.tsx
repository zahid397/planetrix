import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff, Sparkles, ArrowLeft, Rocket, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useAuthContext } from '@/context/AuthContext';
import StarfieldCanvas from '@/components/StarfieldCanvas';

const emailSchema = z.string().trim().email({ message: 'Enter a valid email' }).max(255);
const passwordSchema = z.string().min(6, { message: 'Password must be at least 6 characters' }).max(72);

export default function Auth() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/dashboard';
  const { user, loading, signIn, signUp, resetPassword } = useAuthContext();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user) nav(next, { replace: true }); }, [user, loading, nav, next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ep = emailSchema.safeParse(email);
    if (!ep.success) { toast.error(ep.error.issues[0].message); return; }
    const pp = passwordSchema.safeParse(password);
    if (!pp.success) { toast.error(pp.error.issues[0].message); return; }
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await signIn(ep.data, pp.data);
        if (error) throw new Error(error);
        toast.success('Welcome back ✨');
      } else {
        const { error } = await signUp(ep.data, pp.data);
        if (error) throw new Error(error);
        toast.success('Account created. Welcome to Planetrix! 🚀');
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Authentication failed');
    } finally { setBusy(false); }
  };

  const forgotPassword = async () => {
    const ep = emailSchema.safeParse(email);
    if (!ep.success) { toast.error('Enter your email above first'); return; }
    const { error } = await resetPassword(ep.data);
    if (error) toast.error(error);
    else toast.success('Password reset simulated — check the demo credentials below.');
  };

  const tryDemo = async () => {
    setBusy(true);
    try {
      const { error } = await signIn('demo@planetrix.app', 'Demo!Explorer#2099');
      if (error) throw new Error(error);
      toast.success('Welcome aboard, demo explorer 🚀');
      nav('/dashboard', { replace: true });
    } catch (err: any) {
      toast.error(err?.message ?? 'Demo sign-in failed');
    } finally { setBusy(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#03060f', position: 'relative', overflow: 'hidden' }}>
      <StarfieldCanvas />
      <Link to="/" className="auth-back-link" aria-label="Back to home">
        <ArrowLeft className="w-4 h-4" /> <span>Home</span>
      </Link>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div className="auth-glass animate-auth-in" style={{ width: '100%', maxWidth: 420 }}>

          {/* Brand */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div className="auth-logo-orb-lg"><Sparkles size={26} color="#0A1628" /></div>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Planetrix</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Solar System Explorer</div>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 16 }}>
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              {mode === 'signin' ? 'Sign in to continue your cosmic journey' : 'Join the explorers — takes 10 seconds'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="auth-tabs" style={{ marginBottom: 20 }}>
            <button type="button" onClick={() => setMode('signin')} className={mode === 'signin' ? 'active' : ''}>Sign In</button>
            <button type="button" onClick={() => setMode('signup')} className={mode === 'signup' ? 'active' : ''}>Sign Up</button>
            <span className="auth-tab-indicator" style={{ transform: mode === 'signup' ? 'translateX(100%)' : 'translateX(0)' }} />
          </div>

          {/* Credentials hint */}
          <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
            <b style={{ color: '#a5b4fc' }}>Quick access:</b><br />
            Demo → <code style={{ color: '#e2e8f0' }}>demo@planetrix.app</code> / <code style={{ color: '#e2e8f0' }}>Demo!Explorer#2099</code><br />
            Admin → <code style={{ color: '#e2e8f0' }}>admin@planetrix.app</code> / <code style={{ color: '#e2e8f0' }}>Admin@2099!</code>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-3">
            <div className="admin-field">
              <Mail size={14} className="admin-field-icon" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@galaxy.com" autoComplete="email" className="admin-input" />
            </div>
            <div className="admin-field">
              <Lock size={14} className="admin-field-icon" />
              <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} className="admin-input" />
              <button type="button" onClick={() => setShowPwd((v) => !v)} className="admin-field-toggle" aria-label="Toggle password visibility">
                {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {mode === 'signin' && (
              <div style={{ textAlign: 'right' }}>
                <button type="button" onClick={forgotPassword} className="auth-forgot">Forgot password?</button>
              </div>
            )}
            <button type="submit" disabled={busy} className="auth-primary-btn">
              {busy ? <><Loader2 size={14} className="animate-spin" /> {mode === 'signin' ? 'Signing in…' : 'Creating…'}</>
                    : <><Rocket size={14} /> {mode === 'signin' ? 'Sign In' : 'Create Account'}</>}
            </button>
          </form>

          {/* Switch mode */}
          <button type="button" className="auth-switch-pill" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
            {mode === 'signin' ? <>Don&apos;t have an account? <b>Sign up</b></> : <>Already have an account? <b>Sign in</b></>}
          </button>

          <div className="auth-trust"><ShieldCheck size={12} /> <span>Your data stays local on this device</span></div>

          {/* Demo button */}
          <div style={{ marginTop: 14 }}>
            <button type="button" onClick={tryDemo} disabled={busy} className="auth-demo-btn">
              {busy ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
              <span>Try Demo Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
