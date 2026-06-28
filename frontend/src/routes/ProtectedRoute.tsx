import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { useI18n } from '../i18n/I18nContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  if (loading) {
    return <div className="p-6 text-sm text-zinc-600">{t('common.loading')}</div>;
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
