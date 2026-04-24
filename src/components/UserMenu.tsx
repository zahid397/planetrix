import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Shield, User as UserIcon, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAdminAuth';
import ProfilePanel from '@/components/ProfilePanel';

export default function UserMenu() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  if (loading) return <div className="user-avatar-btn opacity-0" aria-hidden />;

  if (!user) {
    return (
      <button
        onClick={() => nav(`/auth?next=${encodeURIComponent(loc.pathname)}`)}
        className="user-signin-pill"
        aria-label="Sign in"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>Sign In</span>
      </button>
    );
  }

  const initials = (user.email ?? '?').slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    toast.success('Signed out');
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          if (window.matchMedia('(min-width: 1024px)').matches) {
            setPanelOpen(true);
          } else {
            setOpen((v) => !v);
          }
        }}
        className="user-avatar-btn user-avatar-online"
        aria-label="Account menu"
      >
        {initials}
        <span className="avatar-online-dot" />
      </button>
      {open && (
        <div className="user-menu animate-fade-in">
          <div className="user-menu-header">
            <div className="user-menu-avatar">{initials}</div>
            <div className="user-menu-email" title={user.email ?? ''}>{user.email}</div>
          </div>
          <div className="user-menu-sep" />
          <button onClick={() => { setOpen(false); nav('/dashboard'); }} className="user-menu-item">
            <UserIcon className="w-3.5 h-3.5" /> Mission Hub
          </button>
          {isAdmin && (
            <button onClick={() => { setOpen(false); nav('/admin'); }} className="user-menu-item">
              <LayoutDashboard className="w-3.5 h-3.5" /> Mission Control
            </button>
          )}
          {!isAdmin && (
            <button onClick={() => { setOpen(false); nav('/admin/login'); }} className="user-menu-item">
              <Shield className="w-3.5 h-3.5" /> Admin Login
            </button>
          )}
          <div className="user-menu-sep" />
          <button onClick={handleSignOut} className="user-menu-item user-menu-danger">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      )}
      <ProfilePanel open={panelOpen} onOpenChange={setPanelOpen} />
    </div>
  );
}