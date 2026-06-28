import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { useI18n } from '../i18n/I18nContext';
import { Dashboard } from '../types';
import { errorMessage } from '../utils/errors';

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [error, setError] = useState('');
  const { t } = useI18n();

  useEffect(() => {
    api.get<Dashboard>('/dashboard').then((response) => setDashboard(response.data)).catch((err) => setError(errorMessage(err)));
  }, []);

  if (error) {
    return <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  }
  if (!dashboard) {
    return <p className="text-sm text-zinc-600">{t('dashboard.loading')}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
        <p className="text-sm text-zinc-600">{t('dashboard.subtitle')}</p>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <Metric label={t('dashboard.today')} value={dashboard.todaysTasks.length} />
        <Metric label={t('dashboard.overdue')} value={dashboard.overdueTasks.length} />
        <Metric label={t('dashboard.projects')} value={dashboard.projects.length} />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel space-y-3">
          <h2 className="font-semibold">{t('dashboard.todaysTasks')}</h2>
          {dashboard.todaysTasks.length === 0 ? <EmptyState title={t('dashboard.noTasksToday')} /> : dashboard.todaysTasks.map((task) => (
            <TaskRow key={task.id} title={task.title} meta={`${task.priority} · ${task.status}`} />
          ))}
        </div>
        <div className="panel space-y-3">
          <h2 className="font-semibold">{t('dashboard.overdueTasks')}</h2>
          {dashboard.overdueTasks.length === 0 ? <EmptyState title={t('dashboard.noOverdueTasks')} /> : dashboard.overdueTasks.map((task) => (
            <TaskRow key={task.id} title={task.title} meta={task.dueDate ?? t('common.noDate')} danger />
          ))}
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel space-y-3">
          <h2 className="font-semibold">{t('dashboard.projectProgress')}</h2>
          {dashboard.projects.length === 0 ? <EmptyState title={t('dashboard.noProjects')} detail={t('dashboard.noProjectsDetail')} /> : dashboard.projects.map((project) => (
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
          <h2 className="font-semibold">{t('dashboard.aiRecommendations')}</h2>
          {dashboard.aiRecommendations.map((item) => (
            <p key={item} className="rounded-md bg-teal-50 p-3 text-sm text-teal-950">{item}</p>
          ))}
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Recent title={t('dashboard.recentNotes')} items={dashboard.recentNotes.map((note) => note.title)} empty={t('dashboard.noNotes')} />
        <Recent title={t('dashboard.recentDocuments')} items={dashboard.recentDocuments.map((doc) => doc.title)} empty={t('dashboard.noDocuments')} />
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
