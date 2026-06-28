import { FormEvent, useState } from 'react';
import { api } from '../api/client';
import { useI18n } from '../i18n/I18nContext';
import { ChatResponse, SearchResponse } from '../types';
import { errorMessage } from '../utils/errors';

export function AssistantPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<ChatResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState<SearchResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

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
          <h1 className="text-2xl font-semibold">{t('assistant.title')}</h1>
          <p className="text-sm text-zinc-600">{t('assistant.subtitle')}</p>
        </div>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form className="panel space-y-3" onSubmit={ask}>
          <label htmlFor="question">{t('assistant.question')}</label>
          <textarea id="question" value={question} onChange={(event) => setQuestion(event.target.value)} required />
          <button className="btn-primary" disabled={loading}>{loading ? t('assistant.thinking') : t('assistant.ask')}</button>
        </form>
        {answer && (
          <article className="panel space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">{t('assistant.answer')}</h2>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
                {answer.usedOpenAi ? 'OpenAI' : t('assistant.fallback')}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700">{answer.answer}</p>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">{t('assistant.related')}</h3>
              {answer.relatedRecords.length === 0 ? <p className="text-sm text-zinc-500">{t('assistant.noRelated')}</p> : answer.relatedRecords.map((record) => (
                <Record key={`${record.sourceType}-${record.sourceId}`} record={record} />
              ))}
            </div>
          </article>
        )}
      </section>
      <aside className="space-y-4">
        <form className="panel space-y-3" onSubmit={runSearch}>
          <div>
            <h2 className="font-semibold">{t('assistant.searchTitle')}</h2>
            <p className="text-sm text-zinc-600">{t('assistant.searchSubtitle')}</p>
          </div>
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} required placeholder={t('assistant.searchPlaceholder')} />
          <button className="btn-secondary w-full">{t('assistant.search')}</button>
        </form>
        {search && (
          <div className="panel space-y-3">
            <p className="text-xs uppercase text-zinc-500">{t('assistant.mode')}: {search.mode}</p>
            {search.results.length === 0 ? <p className="text-sm text-zinc-500">{t('assistant.noResults')}</p> : search.results.map((record) => (
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
