import { FormEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useI18n } from '../i18n/I18nContext';
import { DocumentItem, Note, Project, ProjectStatus, Task } from '../types';
import { errorMessage } from '../utils/errors';
import { optional } from '../utils/forms';

const statuses: ProjectStatus[] = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED'];

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [error, setError] = useState('');
  const { t } = useI18n();

  const load = useCallback(async () => {
    try {
      const [projectResponse, tasksResponse, notesResponse, docsResponse] = await Promise.all([
        api.get<Project>(`/projects/${projectId}`),
        api.get<Task[]>('/tasks'),
        api.get<Note[]>('/notes'),
        api.get<DocumentItem[]>('/documents'),
      ]);
      const id = Number(projectId);
      setProject(projectResponse.data);
      setTasks(tasksResponse.data.filter((task) => task.projectId === id));
      setNotes(notesResponse.data.filter((note) => note.projectId === id));
      setDocuments(docsResponse.data.filter((doc) => doc.projectId === id));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [projectId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const response = await api.put<Project>(`/projects/${projectId}`, {
        title: form.get('title'),
        description: optional(form.get('description')),
        goal: optional(form.get('goal')),
        status: form.get('status'),
        startDate: optional(form.get('startDate')),
        dueDate: optional(form.get('dueDate')),
      });
      setProject(response.data);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function summarize() {
    if (!project) return;
    const response = await api.post<{ summary: string }>('/ai/summarize', {
      sourceType: 'project',
      title: project.title,
      content: `${project.description ?? ''}\n${project.goal ?? ''}`,
    });
    alert(response.data.summary);
  }

  async function remove() {
    if (!confirm(t('projects.deleteConfirm'))) return;
    await api.delete(`/projects/${projectId}`);
    navigate('/projects');
  }

  if (error) return <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  if (!project) return <p className="text-sm text-zinc-600">{t('projects.loadingDetail')}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          <p className="text-sm text-zinc-600">{t(`status.${project.status}`)} · {project.progress}% {t('projects.complete')}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => void summarize()}>{t('action.summarize')}</button>
          <button className="btn-danger" onClick={() => void remove()}>{t('action.delete')}</button>
        </div>
      </div>
      <form className="panel grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <Field label={t('common.title')}><input name="title" defaultValue={project.title} required /></Field>
        <Field label={t('common.status')}>
          <select name="status" defaultValue={project.status}>{statuses.map((status) => <option key={status} value={status}>{t(`status.${status}`)}</option>)}</select>
        </Field>
        <Field label={t('common.description')}><textarea name="description" defaultValue={project.description} /></Field>
        <Field label={t('common.goal')}><textarea name="goal" defaultValue={project.goal} /></Field>
        <Field label={t('common.start')}><input name="startDate" type="date" defaultValue={project.startDate} /></Field>
        <Field label={t('common.due')}><input name="dueDate" type="date" defaultValue={project.dueDate} /></Field>
        <button className="btn-primary md:col-span-2">{t('projects.save')}</button>
      </form>
      <section className="grid gap-4 lg:grid-cols-3">
        <Related title={t('nav.tasks')} empty={t('projects.noneLinked')} items={tasks.map((task) => `${task.title} · ${t(`taskStatus.${task.status}`)}`)} />
        <Related title={t('nav.notes')} empty={t('projects.noneLinked')} items={notes.map((note) => note.title)} />
        <Related title={t('nav.documents')} empty={t('projects.noneLinked')} items={documents.map((doc) => doc.title)} />
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-1"><label>{label}</label>{children}</div>;
}

function Related({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div className="panel space-y-3">
      <h2 className="font-semibold">{title}</h2>
      {items.length === 0 ? <p className="text-sm text-zinc-500">{empty}</p> : items.map((item) => (
        <p key={item} className="rounded-md border border-zinc-200 p-3 text-sm">{item}</p>
      ))}
    </div>
  );
}
