import { useEffect, useRef, useState } from 'react';
import { Paperclip, Mic, SendHorizontal, Square } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import sevenSkysLogo from '../assets/Seven_Skys_Logo.png';
import { AssistantHint } from './VoiceAssistant';


export default function ChatInput({ onUploadClick }) {
  const { sendMessage, isBotTyping, showToast, setVoiceOpen } = useChat();
  const [value, setValue] = useState('');
  const [listening, setListening] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }, [value]);

  const handleSend = () => {
    if (!value.trim() || isBotTyping) return;
    sendMessage(value);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice input is not supported in this browser', 'error');
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setValue((prev) => (prev ? prev + ' ' + transcript : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  return (
    <div className="border-t border-surface-border bg-surface-0 px-4 py-3.5 md:px-6 light:bg-white">
      <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-2xl border border-surface-border bg-surface-100 p-2 shadow-lg light:bg-gray-50">
        <div className="relative shrink-0">
          <AssistantHint />
          <button
            onClick={() => setVoiceOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-surface-200 hover:text-white"
            title="Talk to Athena"
          >
            < img src={sevenSkysLogo} alt="Talk to Athena" className="h-[35px] w-[35px] object-contain" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type your question here..."
          className="themed-scroll max-h-[140px] flex-1 resize-none bg-transparent py-2 text-[14px] text-white placeholder-gray-500 outline-none light:text-gray-900"
        />

        <button
          onClick={handleMic}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${listening
            ? 'border-red-500/40 bg-red-500/20 text-red-400 animate-pulse shadow-md shadow-red-500/20 scale-105'
            : 'border-accent-500/30 bg-accent-500/10 text-accent-400 hover:border-accent-500/50 hover:bg-accent-500/20 hover:text-accent-300'
            }`}
          title="Voice input"
        >
          {listening ? <Square size={15} /> : <Mic size={17} />}
        </button>

        <button
          onClick={handleSend}
          disabled={!value.trim() || isBotTyping}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 text-white shadow-md shadow-accent-600/20 transition-all enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          title="Send"
        >
          <SendHorizontal size={16} />
        </button>
      </div>
      <p className="mt-2.5 text-center text-[11px] text-gray-500">
        RAG System &nbsp;•&nbsp; FastAPI &nbsp;•&nbsp; PostgreSQL + pgvector &nbsp;•&nbsp; Groq LLM
      </p>
    </div>
  );
}