import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { Dashboard } from '../types';
import { errorMessage } from '../utils/errors';

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Dashboard>('/dashboard').then((response) => setDashboard(response.data)).catch((err) => setError(errorMessage(err)));
  }, []);

  if (error) {
    return <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  }
  if (!dashboard) {
    return <p className="text-sm text-zinc-600">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-zinc-600">Current work, risk, and recent context.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <Metric label="Today" value={dashboard.todaysTasks.length} />
        <Metric label="Overdue" value={dashboard.overdueTasks.length} />
        <Metric label="Projects" value={dashboard.projects.length} />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel space-y-3">
          <h2 className="font-semibold">Today's Tasks</h2>
          {dashboard.todaysTasks.length === 0 ? <EmptyState title="No tasks due today" /> : dashboard.todaysTasks.map((task) => (
            <TaskRow key={task.id} title={task.title} meta={`${task.priority} · ${task.status}`} />
          ))}
        </div>
        <div className="panel space-y-3">
          <h2 className="font-semibold">Overdue Tasks</h2>
          {dashboard.overdueTasks.length === 0 ? <EmptyState title="No overdue tasks" /> : dashboard.overdueTasks.map((task) => (
            <TaskRow key={task.id} title={task.title} meta={task.dueDate ?? 'No date'} danger />
          ))}
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel space-y-3">
          <h2 className="font-semibold">Project Progress</h2>
          {dashboard.projects.length === 0 ? <EmptyState title="No projects yet" detail="Create a project to start tracking progress." /> : dashboard.projects.map((project) => (
            <Link key={project.id} className="block rounded-md border border-zinc-200 p-3 hover:bg-zinc-50" to={`/projects/${project.id}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{project.title}</span>
                <span className="text-sm text-zinc-500">{project.progress}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-zinc-100">
                <div className="h-2 rounded-full bg-teal-700" style={{ width: `${project.progress}%` }} />
              </div>
            </Link>
          ))}
        </div>
        <div className="panel space-y-3">
          <h2 className="font-semibold">AI Recommendations</h2>
          {dashboard.aiRecommendations.map((item) => (
            <p key={item} className="rounded-md bg-teal-50 p-3 text-sm text-teal-950">{item}</p>
          ))}
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Recent title="Recent Notes" items={dashboard.recentNotes.map((note) => note.title)} empty="No notes yet" />
        <Recent title="Recent Documents" items={dashboard.recentDocuments.map((doc) => doc.title)} empty="No documents yet" />
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function TaskRow({ title, meta, danger = false }: { title: string; meta: string; danger?: boolean }) {
  return (
    <div className="rounded-md border border-zinc-200 p-3">
      <p className="font-medium">{title}</p>
      <p className={`text-sm ${danger ? 'text-red-700' : 'text-zinc-500'}`}>{meta}</p>
    </div>
  );
}

function Recent({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div className="panel space-y-3">
      <h2 className="font-semibold">{title}</h2>
      {items.length === 0 ? <EmptyState title={empty} /> : items.map((item) => <p key={item} className="rounded-md border border-zinc-200 p-3 text-sm">{item}</p>)}
    </div>
  );
}
