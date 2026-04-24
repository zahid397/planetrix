import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAdminAuth';
export default function AdminLogin() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  useEffect(() => { if (!loading && user && isAdmin) nav('/admin', { replace: true }); }, [user, isAdmin, loading, nav]);
  if (loading) return null;
  return <Navigate to="/auth?next=/admin" replace />;
}
