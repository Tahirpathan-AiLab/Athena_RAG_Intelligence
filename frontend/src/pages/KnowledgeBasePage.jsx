import { FileText, Database, Layers, HardDrive } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function KnowledgeBasePage() {
  const { documents, stats, isUploading } = useChat();

  const cards = [
    { icon: FileText, label: 'Documents', value: stats.documents, color: 'text-accent-400', bg: 'bg-accent-600/15' },
    { icon: Layers, label: 'Chunks', value: stats.chunks.toLocaleString(), color: 'text-teal-400', bg: 'bg-teal-500/15' },
    { icon: Database, label: 'Embeddings', value: stats.embeddings.toLocaleString(), color: 'text-amber-400', bg: 'bg-amber-500/15' },
    { icon: HardDrive, label: 'Storage Used', value: `${stats.storageMB.toFixed(1)} MB`, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  ];

  return (
    <div className="themed-scroll flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl border border-surface-border bg-surface-100 p-4 light:bg-gray-50">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${c.bg}`}>
                <c.icon size={17} className={c.color} />
              </div>
              <p className="text-[20px] font-bold text-white light:text-gray-900">{c.value}</p>
              <p className="text-[12px] text-gray-500">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <p className="text-[13px] font-bold text-white light:text-gray-900">Indexed Documents</p>
          {isUploading && <span className="text-[12px] text-accent-400">Uploading and indexing…</span>}
        </div>
        <div className="flex flex-col gap-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface-100 p-3.5 light:bg-gray-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/15">
                <FileText size={16} className="text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-gray-100 light:text-gray-900">{doc.name}</p>
                <p className="text-[11.5px] text-gray-500">{doc.chunks} chunks indexed &middot; {doc.uploadedLabel}</p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                Indexed
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
