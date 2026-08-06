import React, { useMemo, useRef, useState } from "react";
import { UploadCloud, FileText, Trash2, Search, Database, Layers, HardDrive, RefreshCw } from "lucide-react";

export default function KnowledgeBaseView({
  documents,
  stats,
  uploadStatus,
  onFilesSelected,
  onDeleteDocument,
  onRefresh,
  isRefreshing,
}) {
  const fileInputRef = useRef(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [query, setQuery] = useState("");
  const [deletingSource, setDeletingSource] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter((d) => d.name.toLowerCase().includes(q));
  }, [documents, query]);

  function handleDrop(e) {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files?.length) onFilesSelected(e.dataTransfer.files);
  }

  async function handleDelete(name) {
    setDeletingSource(name);
    try {
      await onDeleteDocument(name);
    } finally {
      setDeletingSource(null);
    }
  }

  return (
    <div className="view-page">
      <header className="view-page__header">
        <div>
          <h1>Knowledge base</h1>
          <p>Every document that's been chunked, embedded, and made searchable for the assistant.</p>
        </div>
        <button className="ghost-btn" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw size={14} className={isRefreshing ? "spin" : ""} />
          Refresh
        </button>
      </header>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--accent">
            <FileText size={16} />
          </div>
          <div>
            <p className="stat-card__value">{stats.documents}</p>
            <p className="stat-card__label">Documents</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--teal">
            <Layers size={16} />
          </div>
          <div>
            <p className="stat-card__value">{stats.chunks}</p>
            <p className="stat-card__label">Chunks indexed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--pink">
            <HardDrive size={16} />
          </div>
          <div>
            <p className="stat-card__value">{stats.storageUsed}</p>
            <p className="stat-card__label">Storage used</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--accent">
            <Database size={16} />
          </div>
          <div>
            <p className="stat-card__value">pgvector</p>
            <p className="stat-card__label">Vector store</p>
          </div>
        </div>
      </div>

      <div
        className={`dropzone dropzone--wide ${isDraggingOver ? "dropzone--active" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud size={26} />
        <p>
          Drag and drop files here or <span>click to browse</span>
        </p>
        <p className="dropzone__hint">Supports .txt and .md · chunked and embedded on upload</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md"
          multiple
          hidden
          onChange={(e) => e.target.files?.length && onFilesSelected(e.target.files)}
        />
      </div>
      {uploadStatus && <p className="dropzone__status dropzone__status--standalone">{uploadStatus}</p>}

      <div className="view-page__toolbar">
        <div className="search-box">
          <Search size={14} />
          <input
            placeholder="Search documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span className="view-page__count">
          {filtered.length} of {documents.length} document{documents.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="doc-grid">
        {filtered.map((doc) => (
          <div className="doc-card" key={doc.name}>
            <div className="doc-card__icon">
              <FileText size={18} />
            </div>
            <div className="doc-card__body">
              <p className="doc-card__name" title={doc.name}>
                {doc.name}
              </p>
              <p className="doc-card__meta">
                {doc.size} &middot; {doc.chunks != null ? `${doc.chunks} chunks` : "—"} &middot; {doc.when}
              </p>
            </div>
            <button
              className="doc-card__delete"
              aria-label={`Delete ${doc.name}`}
              onClick={() => handleDelete(doc.name)}
              disabled={deletingSource === doc.name}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && documents.length > 0 && (
          <p className="panel-empty">No documents match "{query}".</p>
        )}
        {documents.length === 0 && (
          <div className="empty-state">
            <Database size={28} />
            <p>No documents ingested yet.</p>
            <p className="panel-empty">Upload a .txt or .md file above to start building your knowledge base.</p>
          </div>
        )}
      </div>
    </div>
  );
}
