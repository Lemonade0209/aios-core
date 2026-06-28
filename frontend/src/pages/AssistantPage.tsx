import { FormEvent, useState } from 'react';
import { api } from '../api/client';
import { ChatResponse, SearchResponse } from '../types';
import { errorMessage } from '../utils/errors';

export function AssistantPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<ChatResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState<SearchResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post<ChatResponse>('/ai/chat', { question });
      setAnswer(response.data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function runSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      const response = await api.post<SearchResponse>('/search/semantic', { query: searchQuery });
      setSearch(response.data);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">AI Assistant</h1>
          <p className="text-sm text-zinc-600">Ask questions grounded in your projects, tasks, notes, and documents.</p>
        </div>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form className="panel space-y-3" onSubmit={ask}>
          <label htmlFor="question">Question</label>
          <textarea id="question" value={question} onChange={(event) => setQuestion(event.target.value)} required />
          <button className="btn-primary" disabled={loading}>{loading ? 'Thinking...' : 'Ask Assistant'}</button>
        </form>
        {answer && (
          <article className="panel space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Answer</h2>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
                {answer.usedOpenAi ? 'OpenAI' : 'Fallback'}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700">{answer.answer}</p>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Related Records</h3>
              {answer.relatedRecords.length === 0 ? <p className="text-sm text-zinc-500">No matching internal records.</p> : answer.relatedRecords.map((record) => (
                <Record key={`${record.sourceType}-${record.sourceId}`} record={record} />
              ))}
            </div>
          </article>
        )}
      </section>
      <aside className="space-y-4">
        <form className="panel space-y-3" onSubmit={runSearch}>
          <div>
            <h2 className="font-semibold">AI Search</h2>
            <p className="text-sm text-zinc-600">Uses keyword fallback unless embeddings are configured later.</p>
          </div>
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} required placeholder="Search by meaning or keyword" />
          <button className="btn-secondary w-full">Search</button>
        </form>
        {search && (
          <div className="panel space-y-3">
            <p className="text-xs uppercase text-zinc-500">Mode: {search.mode}</p>
            {search.results.length === 0 ? <p className="text-sm text-zinc-500">No results.</p> : search.results.map((record) => (
              <Record key={`${record.sourceType}-${record.sourceId}`} record={record} />
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

function Record({ record }: { record: { sourceType: string; sourceId: number; title: string; excerpt: string; score: number } }) {
  return (
    <div className="rounded-md border border-zinc-200 p-3">
      <p className="text-xs uppercase text-zinc-500">{record.sourceType} #{record.sourceId} · {record.score.toFixed(2)}</p>
      <p className="font-medium">{record.title}</p>
      {record.excerpt && <p className="mt-1 text-sm text-zinc-600">{record.excerpt}</p>}
    </div>
  );
}
