import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { errorMessage } from '../utils/errors';

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await login(form.get('email')!.toString(), form.get('password')!.toString());
      navigate('/dashboard');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <form className="panel w-full max-w-sm space-y-4" onSubmit={onSubmit}>
        <div>
          <h1 className="text-2xl font-semibold">AIOS-Core</h1>
          <p className="text-sm text-zinc-600">Sign in to your workspace.</p>
        </div>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="space-y-1">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="space-y-1">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <button className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Login'}
        </button>
        <p className="text-center text-sm text-zinc-600">
          Need an account? <Link className="font-medium text-teal-800" to="/signup">Sign up</Link>
        </p>
      </form>
    </main>
  );
}
