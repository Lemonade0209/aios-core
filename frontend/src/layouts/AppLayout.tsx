import { LogOut } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

const links = [
  ['/dashboard', 'Dashboard'],
  ['/projects', 'Projects'],
  ['/tasks', 'Tasks'],
  ['/notes', 'Notes'],
  ['/documents', 'Documents'],
  ['/assistant', 'Assistant'],
] as const;

export function AppLayout() {
  const { user, logout } = useAuth();
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
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-teal-50 text-teal-800' : 'text-zinc-600 hover:bg-zinc-100'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            className="btn-secondary"
            title="Log out"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2 text-sm ${isActive ? 'bg-teal-50 text-teal-800' : 'text-zinc-600'}`
              }
            >
              {label}
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
