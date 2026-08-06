import { Bot, User, Sparkles, CheckCircle2, ShieldAlert, FileText } from 'lucide-react';

// Renders **bold** markdown segments inside plain text without pulling in a
// full markdown library. Splits on **...** and wraps matches in <strong>.
function renderFormattedText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// Renders a text block as either a bullet list (when its lines start with
// "* ") or a normal paragraph, applying bold-text formatting either way.
function renderBlock(block, key, textClassName) {
  const lines = block.split('\n');
  const isList = lines.length > 0 && lines.every((line) => /^\s*\*\s+/.test(line.trim()));

  if (isList) {
    return (
      <ul key={key} className="mb-2 list-disc space-y-1 pl-5 last:mb-0">
        {lines.map((line, i) => (
          <li key={i} className={textClassName}>
            {renderFormattedText(line.trim().replace(/^\*\s+/, ''))}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p key={key} className={`mb-2 last:mb-0 ${textClassName}`}>
      {renderFormattedText(block)}
    </p>
  );
}

export function SystemMessage({ text }) {
  return (
    <div className="flex animate-fade-in gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-600/15 ring-1 ring-accent-600/30">
        <Sparkles size={16} className="text-accent-400" />
      </div>
      <div className="max-w-2xl rounded-2xl rounded-tl-sm border border-surface-border bg-surface-100 px-4 py-3.5 light:bg-gray-50">
        <p className="mb-1 text-[13px] font-bold text-white light:text-gray-900">System</p>
        {text.split('\n\n').map((para, i) =>
          renderBlock(para, i, 'text-[13.5px] leading-relaxed text-gray-300 light:text-gray-600')
        )}
      </div>
    </div>
  );
}

export function UserMessage({ text, time }) {
  return (
    <div className="flex animate-fade-in items-start justify-end gap-3">
      <div className="max-w-2xl rounded-2xl rounded-tr-sm bg-gradient-to-br from-accent-500 to-accent-700 px-4 py-3 shadow-lg shadow-accent-600/10">
        <p className="mb-1 text-right text-[11px] text-white/70">{time}</p>
        <p className="text-[14px] leading-relaxed text-white">{text}</p>
      </div>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-300 light:bg-gray-200">
        <User size={16} className="text-gray-300 light:text-gray-600" />
      </div>
    </div>
  );
}

export function BotMessage({ text, time, sources = [], similarity, chunks, notFound }) {
  return (
    <div className="flex animate-fade-in flex-col gap-1.5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500/15 ring-1 ring-teal-500/30">
          <Bot size={16} className="text-teal-400" />
        </div>
        <div className="max-w-2xl flex-1 rounded-2xl rounded-tl-sm border border-surface-border bg-surface-100 px-4 py-3.5 light:bg-gray-50">
          <p className="mb-1.5 text-[11px] text-gray-500">{time}</p>
          {text.split('\n\n').map((para, i) =>
            renderBlock(para, i, 'text-[14px] leading-relaxed text-gray-200 light:text-gray-700')
          )}

          {sources.length > 0 && (
            <>
              <div className="my-3 h-px bg-surface-border light:bg-gray-200" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-[12px] font-medium text-gray-400">
                  <FileText size={13} className="text-accent-400" />
                  Sources ({sources.length})
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {sources.map((s, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface-200 px-2.5 py-1.5 text-[12px] text-gray-300 light:bg-white light:text-gray-600"
                  >
                    <FileText size={11} className="text-red-400" />
                    <span className="font-medium text-gray-200 light:text-gray-800">
                      {s.doc || s.document || 'Unknown'}
                    </span>
                    <span className="text-gray-500">
                      {s.page ?? (s.chunk_index !== undefined ? `Chunk ${s.chunk_index}` : '')}
                    </span>
                  </span>
                ))}
              </div>
            </>
          )}

          {notFound && (
            <div className="mt-2 flex items-center gap-1.5 text-[12px] text-gray-500">
              <FileText size={13} />
              Sources
            </div>
          )}
        </div>
      </div>

      {(similarity !== undefined || chunks !== undefined) && (
        <div className="ml-12 flex flex-wrap items-center gap-4 px-1 text-[12px]">
          {chunks !== undefined && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 size={13} />
              Answer generated using {chunks} relevant chunk{chunks === 1 ? '' : 's'}
            </span>
          )}
          {similarity !== undefined && (
            <span className="flex items-center gap-1.5 text-amber-400">
              <ShieldAlert size={13} />
              Similarity Score: {similarity.toFixed(2)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex animate-fade-in items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500/15 ring-1 ring-teal-500/30">
        <Bot size={16} className="text-teal-400" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-surface-border bg-surface-100 px-4 py-3.5 light:bg-gray-50">
        <span className="typing-dot h-2 w-2 rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
        <span className="typing-dot h-2 w-2 rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
        <span className="typing-dot h-2 w-2 rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}