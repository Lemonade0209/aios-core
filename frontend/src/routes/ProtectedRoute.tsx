import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="p-6 text-sm text-zinc-600">Loading...</div>;
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
