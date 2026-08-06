import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { SystemMessage, UserMessage, BotMessage, TypingIndicator } from './MessageBubble';

const SUGGESTIONS = [
  'What is Python?',
  'Explain lists in Python',
  'Python vs Java',
  'How does Python handle memory?',
];

export default function ChatArea() {
  const { activeChat, isBotTyping, sendMessage } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages?.length, isBotTyping]);

  if (!activeChat) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-600/15 ring-1 ring-accent-600/30">
          <Sparkles size={24} className="text-accent-400" />
        </div>
        <div>
          <p className="text-[16px] font-semibold text-white light:text-gray-900">Start a new conversation</p>
          <p className="mt-1 text-[13.5px] text-gray-500">Ask a question grounded in your uploaded documents.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="rounded-full border border-surface-border bg-surface-100 px-3.5 py-2 text-[12.5px] text-gray-300 transition-colors hover:bg-surface-200 hover:text-white light:bg-gray-50 light:text-gray-600"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="themed-scroll flex-1 overflow-y-auto px-4 py-5 md:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-5">
        {activeChat.messages.map((m) => {
          if (m.role === 'system') return <SystemMessage key={m.id} text={m.text} />;
          if (m.role === 'user') return <UserMessage key={m.id} text={m.text} time={m.time} />;
          return (
            <BotMessage
              key={m.id}
              text={m.text}
              time={m.time}
              sources={m.sources}
              similarity={m.similarity}
              chunks={m.notFound ? undefined : m.chunks}
              notFound={m.notFound}
            />
          );
        })}
        {isBotTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
