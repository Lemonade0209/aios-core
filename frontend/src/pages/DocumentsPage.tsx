import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { DocumentItem, Project } from '../types';
import { errorMessage } from '../utils/errors';
import { optional, optionalNumber } from '../utils/forms';

export function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<DocumentItem | null>(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      const [docResponse, projectResponse] = await Promise.all([
        api.get<DocumentItem[]>('/documents'),
        api.get<Project[]>('/projects'),
      ]);
      setDocuments(docResponse.data);
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
      content: form.get('content'),
      summary: optional(form.get('summary')),
    };
    try {
      if (editing) {
        await api.put(`/documents/${editing.id}`, body);
      } else {
        await api.post('/documents', body);
      }
      setEditing(null);
      event.currentTarget.reset();
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function summarize(id: number) {
    const response = await api.post<DocumentItem>(`/documents/${id}/summarize`);
    setDocuments((items) => items.map((item) => (item.id === id ? response.data : item)));
  }

  async function remove(id: number) {
    if (!confirm('Delete this document?')) return;
    await api.delete(`/documents/${id}`);
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form key={editing?.id ?? 'new'} className="panel h-fit space-y-4" onSubmit={onSubmit}>
        <div>
          <h1 className="text-xl font-semibold">{editing ? 'Edit Document' : 'Documents'}</h1>
          <p className="text-sm text-zinc-600">Store long-form context and summaries.</p>
        </div>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Field label="Title"><input name="title" defaultValue={editing?.title} required /></Field>
        <Field label="Project">
          <select name="projectId" defaultValue={editing?.projectId ?? ''}>
            <option value="">No project</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
          </select>
        </Field>
        <Field label="Content"><textarea name="content" defaultValue={editing?.content} required /></Field>
        <Field label="Summary"><textarea name="summary" defaultValue={editing?.summary} /></Field>
        <div className="flex gap-2">
          <button className="btn-primary flex-1">{editing ? 'Save Document' : 'Create Document'}</button>
          {editing && <button className="btn-secondary" type="button" onClick={() => setEditing(null)}>Cancel</button>}
        </div>
      </form>
      <section className="space-y-3">
        {documents.length === 0 ? <EmptyState title="No documents yet" /> : documents.map((doc) => (
          <article key={doc.id} className="panel">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <h2 className="font-semibold">{doc.title}</h2>
                <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-zinc-600">{doc.summary || doc.content}</p>
                <p className="mt-2 text-xs uppercase text-zinc-500">{doc.projectTitle ?? 'No project'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="btn-secondary" onClick={() => void summarize(doc.id)}>Summarize</button>
                <button className="btn-secondary" onClick={() => setEditing(doc)}>Edit</button>
                <button className="btn-danger" onClick={() => void remove(doc.id)}>Delete</button>
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
