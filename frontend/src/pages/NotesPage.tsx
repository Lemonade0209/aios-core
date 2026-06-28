import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { Note, Project } from '../types';
import { errorMessage } from '../utils/errors';
import { optionalNumber, splitTags } from '../utils/forms';

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Note | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  async function load() {
    try {
      const [noteResponse, projectResponse] = await Promise.all([
        api.get<Note[]>('/notes'),
        api.get<Project[]>('/projects'),
      ]);
      setNotes(noteResponse.data);
      setProjects(projectResponse.data);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return notes.filter((note) => `${note.title} ${note.content} ${note.tags.join(' ')}`.toLowerCase().includes(q));
  }, [notes, query]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const body = {
      projectId: optionalNumber(form.get('projectId')),
      title: form.get('title'),
      content: form.get('content'),
      tags: splitTags(form.get('tags')),
    };
    try {
      if (editing) {
        await api.put(`/notes/${editing.id}`, body);
      } else {
        await api.post('/notes', body);
      }
      setEditing(null);
      event.currentTarget.reset();
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete this note?')) return;
    await api.delete(`/notes/${id}`);
    await load();
  }

  async function summarize(note: Note) {
    const response = await api.post<{ summary: string }>('/ai/summarize', {
      sourceType: 'note',
      title: note.title,
      content: note.content,
    });
    alert(response.data.summary);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form key={editing?.id ?? 'new'} className="panel h-fit space-y-4" onSubmit={onSubmit}>
        <div>
          <h1 className="text-xl font-semibold">{editing ? 'Edit Note' : 'Notes'}</h1>
          <p className="text-sm text-zinc-600">Markdown-friendly notes with tags.</p>
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
        <Field label="Tags"><input name="tags" defaultValue={editing?.tags.join(', ')} placeholder="research, planning" /></Field>
        <div className="flex gap-2">
          <button className="btn-primary flex-1">{editing ? 'Save Note' : 'Create Note'}</button>
          {editing && <button className="btn-secondary" type="button" onClick={() => setEditing(null)}>Cancel</button>}
        </div>
      </form>
      <section className="space-y-3">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes..." />
        {filtered.length === 0 ? <EmptyState title="No matching notes" /> : filtered.map((note) => (
          <article key={note.id} className="panel">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <h2 className="font-semibold">{note.title}</h2>
                <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-zinc-600">{note.content}</p>
                <p className="mt-2 text-xs uppercase text-zinc-500">{note.projectTitle ?? 'No project'} · {note.tags.join(', ') || 'No tags'}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => void summarize(note)}>Summarize</button>
                <button className="btn-secondary" onClick={() => setEditing(note)}>Edit</button>
                <button className="btn-danger" onClick={() => void remove(note.id)}>Delete</button>
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
