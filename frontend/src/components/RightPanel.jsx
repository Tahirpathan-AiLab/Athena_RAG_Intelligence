import { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  MoreVertical,
  Quote,
  Gauge,
  History,
  FolderCog,
  UserCog,
  BarChart3,
  CheckCircle2,
  Trash2,
  X,
  Mic,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { productionFeatures } from '../data/mockData';

const ICONS = { Quote, Gauge, History, FolderCog, UserCog, BarChart3, Mic };

export default function RightPanel({ open, onClose }) {
  const { documents, addDocuments, deleteDocument, setView } = useChat();
  const [dragOver, setDragOver] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const inputRef = useRef(null);

  const recentDocs = documents.slice(0, 4);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);

    if (!files.length) return;

    try {
      await addDocuments(files);
    } catch (error) {
      console.error(error);
      alert(`Failed to upload ${files.map((file) => file.name).join(', ')}`);
    }
  };
  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" />
      )}
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-[320px] shrink-0 transform overflow-y-auto border-l border-surface-border bg-surface-50 p-4 transition-transform duration-200 md:static md:z-auto md:translate-x-0 md:w-[300px] xl:w-[320px] themed-scroll light:bg-white ${open ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <button
          onClick={onClose}
          className="mb-2 ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-surface-200 md:hidden"
        >
          <X size={16} />
        </button>

        {/* Upload dropzone */}
        <p className="mb-2.5 text-[13px] font-bold text-white light:text-gray-900">Upload Document</p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`mb-5 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors ${dragOver
              ? 'border-accent-500 bg-accent-600/10'
              : 'border-surface-border bg-surface-100 light:bg-gray-50'
            }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-600/15">
            <UploadCloud size={19} className="text-accent-400" />
          </div>
          <p className="text-[13px] text-gray-300 light:text-gray-600">
            Drag &amp; drop your files here
            <br />
            or{' '}
            <button onClick={() => inputRef.current?.click()} className="font-semibold text-accent-400 hover:underline">
              click to browse
            </button>
          </p>
          <p className="text-[11px] text-gray-500">Supports: PDF, TXT, DOCX</p>
          <p className="text-[11px] text-gray-500">Max file size: 50MB</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.txt,.docx"
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {/* Recent documents */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[13px] font-bold text-white light:text-gray-900">Recent Documents</p>
          <button
            onClick={() => setView('documents')}
            className="text-[12px] font-semibold text-accent-400 hover:underline"
          >
            View All
          </button>
        </div>
        <div className="mb-6 flex flex-col gap-2">
          {recentDocs.length === 0 && (
            <p className="rounded-lg border border-dashed border-surface-border p-3 text-center text-[12px] text-gray-500">
              No documents yet
            </p>
          )}
          {recentDocs.map((doc) => (
            <div
              key={doc.id}
              className="group relative flex items-start gap-2.5 rounded-lg border border-surface-border bg-surface-100 p-2.5 light:bg-gray-50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-500/15">
                <FileText size={15} className="text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-medium text-gray-200 light:text-gray-800">{doc.name}</p>
                <p className="text-[11px] text-gray-500">
                  {doc.sizeMB} MB &middot; {doc.uploadedLabel}
                </p>
              </div>
              <div className="relative shrink-0">
                <button
                  onClick={() => setOpenMenuId(openMenuId === doc.id ? null : doc.id)}
                  className="rounded p-1 text-gray-500 hover:bg-surface-300 hover:text-gray-200"
                >
                  <MoreVertical size={14} />
                </button>
                {openMenuId === doc.id && (
                  <div className="absolute right-0 top-7 z-10 w-32 animate-fade-in overflow-hidden rounded-lg border border-surface-border bg-surface-200 shadow-xl light:bg-white">
                    <button
                      onClick={() => {
                        deleteDocument(doc.id);
                        setOpenMenuId(null);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-red-400 hover:bg-surface-300 light:hover:bg-gray-50"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Production features */}
        <p className="mb-2.5 text-[13px] font-bold text-white light:text-gray-900">Production Features</p>
        <div className="mb-6 flex flex-col gap-3">
          {productionFeatures.map((f) => {
            const Icon = ICONS[f.icon];
            return (
              <div key={f.title} className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-200 light:bg-gray-100">
                  <Icon size={14} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[12.5px] font-semibold text-gray-200 light:text-gray-800">{f.title}</p>
                  <p className="text-[11.5px] leading-snug text-gray-500">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* System status */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-3">
          <div>
            <p className="text-[12.5px] font-semibold text-emerald-400">System Status: Healthy</p>
            <p className="text-[11.5px] text-emerald-500/80">All systems operational</p>
          </div>
          <CheckCircle2 size={18} className="text-emerald-400" />
        </div>
      </aside>
    </>
  );
}
