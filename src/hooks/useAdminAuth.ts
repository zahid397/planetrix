import { useAuthContext } from '@/context/AuthContext';
export function useAuth() {
  const { user, isAdmin, loading, signOut } = useAuthContext();
  return { user, isAdmin, loading, signOut };
}
export const useAdminAuth = useAuth;
