import { LogOut } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LanguageSelect } from '../components/LanguageSelect';
import { useAuth } from '../features/auth/AuthContext';
import { useI18n } from '../i18n/I18nContext';

const links = [
  ['/dashboard', 'nav.dashboard'],
  ['/projects', 'nav.projects'],
  ['/tasks', 'nav.tasks'],
  ['/notes', 'nav.notes'],
  ['/documents', 'nav.documents'],
  ['/assistant', 'nav.assistant'],
] as const;

export function AppLayout() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-lg font-semibold">AIOS-Core</p>
            <p className="text-xs text-zinc-500">{user?.email}</p>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(([to, key]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-teal-50 text-teal-800' : 'text-zinc-600 hover:bg-zinc-100'}`
                }
              >
                {t(key)}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSelect />
            <button
              className="btn-secondary"
              title={t('action.logout')}
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">
          {links.map(([to, key]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2 text-sm ${isActive ? 'bg-teal-50 text-teal-800' : 'text-zinc-600'}`
              }
            >
              {t(key)}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
