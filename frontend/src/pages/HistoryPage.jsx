import { MessageSquareText, Trash2, ArrowRight } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function HistoryPage() {
  const { chats, openChat, deleteChat } = useChat();

  return (
    <div className="themed-scroll flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-2.5">
        {chats.length === 0 && (
          <p className="mt-10 text-center text-[13.5px] text-gray-500">No conversations yet. Start a new chat.</p>
        )}
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => openChat(chat.id)}
            className="group flex cursor-pointer items-center gap-3 rounded-xl border border-surface-border bg-surface-100 p-4 transition-colors hover:bg-surface-200 light:bg-gray-50 light:hover:bg-gray-100"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-600/15">
              <MessageSquareText size={17} className="text-accent-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-gray-100 light:text-gray-900">{chat.title}</p>
              <p className="text-[12px] text-gray-500">
                {chat.messages.filter((m) => m.role !== 'system').length} messages &middot;{' '}
                {new Date(chat.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
              className="shrink-0 rounded-lg p-2 text-gray-500 opacity-0 hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
            >
              <Trash2 size={15} />
            </button>
            <ArrowRight size={15} className="shrink-0 text-gray-600" />
          </div>
        ))}
      </div>
    </div>
  );
}
