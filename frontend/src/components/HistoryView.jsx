import React, { useMemo, useState } from "react";
import { MessageSquare, Search, Trash2, FolderOpen, History as HistoryIcon } from "lucide-react";

export default function HistoryView({ sessions, onOpenSession, onDeleteSession, onClearAll }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) => s.title.toLowerCase().includes(q));
  }, [sessions, query]);

  return (
    <div className="view-page">
      <header className="view-page__header">
        <div>
          <h1>Chat history</h1>
          <p>Every past conversation, saved locally so you can pick up where you left off.</p>
        </div>
        {sessions.length > 0 && (
          <button className="ghost-btn ghost-btn--danger" onClick={onClearAll}>
            <Trash2 size={14} />
            Clear all
          </button>
        )}
      </header>

      <div className="view-page__toolbar">
        <div className="search-box">
          <Search size={14} />
          <input
            placeholder="Search past conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span className="view-page__count">
          {filtered.length} of {sessions.length} conversation{sessions.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="history-list">
        {filtered.map((session) => (
          <div className="history-card" key={session.id}>
            <div className="history-card__icon">
              <MessageSquare size={16} />
            </div>
            <div className="history-card__body">
              <p className="history-card__title">{session.title}</p>
              <p className="history-card__meta">
                {session.messageCount} message{session.messageCount === 1 ? "" : "s"} &middot; {session.when}
              </p>
            </div>
            <div className="history-card__actions">
              <button className="ghost-btn ghost-btn--small" onClick={() => onOpenSession(session.id)}>
                <FolderOpen size={13} />
                Open
              </button>
              <button
                className="icon-btn icon-btn--danger"
                aria-label="Delete conversation"
                onClick={() => onDeleteSession(session.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && sessions.length > 0 && (
          <p className="panel-empty">No conversations match "{query}".</p>
        )}

        {sessions.length === 0 && (
          <div className="empty-state">
            <HistoryIcon size={28} />
            <p>No saved conversations yet.</p>
            <p className="panel-empty">Starting a "New chat" will archive your current conversation here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
