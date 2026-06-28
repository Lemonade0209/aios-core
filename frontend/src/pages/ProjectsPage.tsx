import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { useI18n } from '../i18n/I18nContext';
import { Project, ProjectStatus } from '../types';
import { errorMessage } from '../utils/errors';
import { optional } from '../utils/forms';

const statuses: ProjectStatus[] = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED'];

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  async function load() {
    setLoading(true);
    try {
      const response = await api.get<Project[]>('/projects');
      setProjects(response.data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      await api.post('/projects', {
        title: form.get('title'),
        description: optional(form.get('description')),
        goal: optional(form.get('goal')),
        status: form.get('status'),
        startDate: optional(form.get('startDate')),
        dueDate: optional(form.get('dueDate')),
      });
      event.currentTarget.reset();
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function remove(id: number) {
    if (!confirm(t('projects.deleteConfirm'))) return;
    await api.delete(`/projects/${id}`);
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form className="panel h-fit space-y-4" onSubmit={onSubmit}>
        <div>
          <h1 className="text-xl font-semibold">{t('projects.title')}</h1>
          <p className="text-sm text-zinc-600">{t('projects.subtitle')}</p>
        </div>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Field label={t('common.title')}><input name="title" required /></Field>
        <Field label={t('common.description')}><textarea name="description" /></Field>
        <Field label={t('common.goal')}><textarea name="goal" /></Field>
        <Field label={t('common.status')}>
          <select name="status" defaultValue="PLANNED">
            {statuses.map((status) => <option key={status} value={status}>{t(`status.${status}`)}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('common.start')}><input name="startDate" type="date" /></Field>
          <Field label={t('common.due')}><input name="dueDate" type="date" /></Field>
        </div>
        <button className="btn-primary w-full">{t('projects.create')}</button>
      </form>
      <section className="space-y-3">
        {loading ? <p className="text-sm text-zinc-600">{t('projects.loading')}</p> : null}
        {!loading && projects.length === 0 ? <EmptyState title={t('projects.empty')} /> : projects.map((project) => (
          <article key={project.id} className="panel">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <Link className="text-lg font-semibold text-teal-800" to={`/projects/${project.id}`}>{project.title}</Link>
                <p className="mt-1 text-sm text-zinc-600">{project.goal || project.description || t('common.noDescription')}</p>
                <p className="mt-2 text-xs uppercase text-zinc-500">{t(`status.${project.status}`)} · {project.dueDate ?? t('common.noDate')}</p>
              </div>
              <button className="btn-danger" onClick={() => void remove(project.id)}>{t('action.delete')}</button>
            </div>
            <div className="mt-4 h-2 rounded-full bg-zinc-100">
              <div className="h-2 rounded-full bg-teal-700" style={{ width: `${project.progress}%` }} />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-1"><label>{label}</label>{children}</div>;
}
