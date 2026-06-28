export function EmptyState({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600">
      <p className="font-medium text-zinc-900">{title}</p>
      {detail && <p className="mt-1">{detail}</p>}
    </div>
  );
}
