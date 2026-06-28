import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
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
    if (!confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form key={editing?.id ?? 'new'} className="panel h-fit space-y-4" onSubmit={onSubmit}>
        <div>
          <h1 className="text-xl font-semibold">{editing ? 'Edit Task' : 'Tasks'}</h1>
          <p className="text-sm text-zinc-600">Plan work and link it to projects.</p>
        </div>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Field label="Title"><input name="title" defaultValue={editing?.title} required /></Field>
        <Field label="Project">
          <select name="projectId" defaultValue={editing?.projectId ?? ''}>
            <option value="">No project</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
          </select>
        </Field>
        <Field label="Description"><textarea name="description" defaultValue={editing?.description} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Priority"><select name="priority" defaultValue={editing?.priority ?? 'MEDIUM'}>{priorities.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Status"><select name="status" defaultValue={editing?.status ?? 'TODO'}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></Field>
        </div>
        <Field label="Due"><input name="dueDate" type="date" defaultValue={editing?.dueDate} /></Field>
        <div className="flex gap-2">
          <button className="btn-primary flex-1">{editing ? 'Save Task' : 'Create Task'}</button>
          {editing && <button className="btn-secondary" type="button" onClick={() => setEditing(null)}>Cancel</button>}
        </div>
      </form>
      <section className="space-y-3">
        {tasks.length === 0 ? <EmptyState title="No tasks yet" /> : tasks.map((task) => (
          <article key={task.id} className="panel">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <h2 className="font-semibold">{task.title}</h2>
                <p className="text-sm text-zinc-600">{task.description || 'No description'}</p>
                <p className={`mt-2 text-xs uppercase ${task.overdue ? 'text-red-700' : 'text-zinc-500'}`}>
                  {task.priority} · {task.status} · {task.projectTitle ?? 'No project'} · {task.dueDate ?? 'No due date'}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => setEditing(task)}>Edit</button>
                <button className="btn-danger" onClick={() => void remove(task.id)}>Delete</button>
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
