import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { useI18n } from '../i18n/I18nContext';
import { Project, Task, TaskPriority, TaskStatus } from '../types';
import { errorMessage } from '../utils/errors';
import { optional, optionalNumber } from '../utils/forms';

const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Task | null>(null);
  const [error, setError] = useState('');
  const { t } = useI18n();

  async function load() {
    try {
      const [taskResponse, projectResponse] = await Promise.all([
        api.get<Task[]>('/tasks'),
        api.get<Project[]>('/projects'),
      ]);
      setTasks(taskResponse.data);
      setProjects(projectResponse.data);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const body = {
      projectId: optionalNumber(form.get('projectId')),
      title: form.get('title'),
      description: optional(form.get('description')),
      priority: form.get('priority'),
      status: form.get('status'),
      dueDate: optional(form.get('dueDate')),
    };
    try {
      if (editing) {
        await api.put(`/tasks/${editing.id}`, body);
      } else {
        await api.post('/tasks', body);
      }
      setEditing(null);
      event.currentTarget.reset();
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function remove(id: number) {
    if (!confirm(t('tasks.deleteConfirm'))) return;
    await api.delete(`/tasks/${id}`);
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form key={editing?.id ?? 'new'} className="panel h-fit space-y-4" onSubmit={onSubmit}>
        <div>
          <h1 className="text-xl font-semibold">{editing ? t('tasks.editTitle') : t('tasks.title')}</h1>
          <p className="text-sm text-zinc-600">{t('tasks.subtitle')}</p>
        </div>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Field label={t('common.title')}><input name="title" defaultValue={editing?.title} required /></Field>
        <Field label={t('common.project')}>
          <select name="projectId" defaultValue={editing?.projectId ?? ''}>
            <option value="">{t('common.noProject')}</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
          </select>
        </Field>
        <Field label={t('common.description')}><textarea name="description" defaultValue={editing?.description} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('common.priority')}><select name="priority" defaultValue={editing?.priority ?? 'MEDIUM'}>{priorities.map((item) => <option key={item} value={item}>{t(`priority.${item}`)}</option>)}</select></Field>
          <Field label={t('common.status')}><select name="status" defaultValue={editing?.status ?? 'TODO'}>{statuses.map((item) => <option key={item} value={item}>{t(`taskStatus.${item}`)}</option>)}</select></Field>
        </div>
        <Field label={t('common.due')}><input name="dueDate" type="date" defaultValue={editing?.dueDate} /></Field>
        <div className="flex gap-2">
          <button className="btn-primary flex-1">{editing ? t('tasks.save') : t('tasks.create')}</button>
          {editing && <button className="btn-secondary" type="button" onClick={() => setEditing(null)}>{t('action.cancel')}</button>}
        </div>
      </form>
      <section className="space-y-3">
        {tasks.length === 0 ? <EmptyState title={t('tasks.empty')} /> : tasks.map((task) => (
          <article key={task.id} className="panel">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <h2 className="font-semibold">{task.title}</h2>
                <p className="text-sm text-zinc-600">{task.description || t('common.noDescription')}</p>
                <p className={`mt-2 text-xs uppercase ${task.overdue ? 'text-red-700' : 'text-zinc-500'}`}>
                  {t(`priority.${task.priority}`)} · {t(`taskStatus.${task.status}`)} · {task.projectTitle ?? t('common.noProject')} · {task.dueDate ?? t('common.noDate')}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => setEditing(task)}>{t('action.edit')}</button>
                <button className="btn-danger" onClick={() => void remove(task.id)}>{t('action.delete')}</button>
              </div>
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
