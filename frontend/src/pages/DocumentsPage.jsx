import { useRef, useState } from 'react';
import { FileText, Trash2, UploadCloud, Search } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function DocumentsPage() {
  const { documents, addDocuments, deleteDocument } = useChat();
  const [query, setQuery] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const filtered = documents.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="themed-scroll flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full rounded-lg border border-surface-border bg-surface-100 py-2 pl-9 pr-3 text-[13.5px] text-white placeholder-gray-500 outline-none focus:border-accent-500 light:bg-white light:text-gray-900"
            />
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 px-3.5 py-2 text-[13px] font-semibold text-white shadow-md shadow-accent-600/20"
          >
            <UploadCloud size={15} /> Upload Document
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.txt,.docx"
            className="hidden"
            onChange={(e) => {
              if (e.target.files.length) addDocuments(Array.from(e.target.files));
              e.target.value = '';
            }}
          />
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files.length) addDocuments(Array.from(e.dataTransfer.files));
          }}
          className={`mb-6 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
            dragOver ? 'border-accent-500 bg-accent-600/10' : 'border-surface-border bg-surface-100 light:bg-gray-50'
          }`}
        >
          <p className="text-[13px] text-gray-400">Drop files anywhere in this zone to add them to your knowledge base</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col gap-3 rounded-xl border border-surface-border bg-surface-100 p-4 light:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/15">
                  <FileText size={18} className="text-red-400" />
                </div>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div>
                <p className="truncate text-[13.5px] font-semibold text-gray-100 light:text-gray-900">{doc.name}</p>
                <p className="mt-0.5 text-[12px] text-gray-500">
                  {doc.sizeMB} MB &middot; {doc.chunks} chunks
                </p>
                <p className="text-[11.5px] text-gray-500">{doc.uploadedLabel}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-[13.5px] text-gray-500">No documents match "{query}"</p>
        )}
      </div>
    </div>
  );
}
