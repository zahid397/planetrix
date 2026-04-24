import { Shield, LayoutDashboard } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminEntryButton() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, isAdmin, loading } = useAdminAuth();

  if (loc.pathname.startsWith('/admin') || loc.pathname.startsWith('/auth') || loc.pathname.startsWith('/reset-password')) return null;
  if (loading) return null;
  // Only show floating shortcut for admins; everyone else uses the header UserMenu
  if (!user || !isAdmin) return null;

  const label = 'Mission Control';
  const target = '/admin';
  const Icon = LayoutDashboard;

  return (
    <button
      onClick={() => nav(target)}
      aria-label={label}
      className="admin-entry-btn fixed bottom-5 left-5 md:bottom-7 md:left-7 z-50"
    >
      <Icon className="w-4 h-4" strokeWidth={2.2} />
      <span className="admin-entry-label">{label}</span>
    </button>
  );
}
