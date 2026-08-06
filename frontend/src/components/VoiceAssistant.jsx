import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import sevenSkysLogo from '../assets/Seven_Skys_Logo.png';
import FluidGlob from './FluidGlob';

const AMBIENT_DOTS = [
  { top: '14%', left: '38%', size: 6, color: '#5eead4', delay: '0s' },
  { top: '8%', left: '68%', size: 5, color: '#fbbf24', delay: '0.6s' },
  { top: '30%', left: '20%', size: 5, color: '#8b5cf6', delay: '1.1s' },
  { top: '68%', left: '18%', size: 6, color: '#5eead4', delay: '0.3s' },
  { top: '74%', left: '72%', size: 5, color: '#fb923c', delay: '0.9s' },
  { top: '40%', left: '82%', size: 6, color: '#a78bfa', delay: '1.4s' },
];

/**
 * Voice overlay for Athena, scoped to the middle chat column only
 * (sidebar, header and the right panel stay visible, matching the
 * product mock).
 *
 * Conversation loop: listen -> think -> speak -> back to listen,
 * automatically, until the user taps the close (X) button. No more
 * having to click the logo again for every turn.
 *
 * Caption box: fixed to ~2 lines. As Athena speaks, new words are
 * revealed on a steady clock timed against the estimated speaking
 * duration (SpeechSynthesis's `onboundary` event is unreliable
 * across browsers — on some it never fires, so the old boundary-
 * based reveal ended up dumping the full answer only at the very
 * end). The timer-based reveal always streams word-by-word in real
 * time, and the caption box auto-scrolls so only the latest couple
 * of lines stay on screen — older text scrolls away instead of
 * piling up into a wall of text.
 */
export default function VoiceAssistant() {
  const { voiceOpen, setVoiceOpen, sendMessage } = useChat();
  // listening | thinking | speaking | error | unsupported
  const [phase, setPhase] = useState('listening');
  const [displayText, setDisplayText] = useState('');
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const captionRef = useRef(null);
  const captionTimerRef = useRef(null);
  // true while we're deliberately stopping recognition ourselves
  // (final transcript captured / closing) vs. it ending on its own
  // (silence timeout) — lets us tell "should auto-restart" apart
  // from "we meant to stop it".
  const intentionalStopRef = useRef(false);
  const openRef = useRef(voiceOpen);
  openRef.current = voiceOpen;

  const stopRecognition = useCallback(() => {
    intentionalStopRef.current = true;
    try {
      recognitionRef.current?.stop();
    } catch {
      /* no-op */
    }
    recognitionRef.current = null;
  }, []);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    utteranceRef.current = null;
    if (captionTimerRef.current) {
      window.clearInterval(captionTimerRef.current);
      captionTimerRef.current = null;
    }
  }, []);

  const startRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setPhase('unsupported');
      return;
    }

    intentionalStopRef.current = false;
    setPhase('listening');
    setDisplayText('');

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (e) => {
      let finalText = '';
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const chunk = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += chunk;
        else interim += chunk;
      }
      if (finalText.trim()) {
        // eslint-disable-next-line no-use-before-define
        handleFinalTranscript(finalText.trim());
      } else {
        setDisplayText(interim);
      }
    };

    recognition.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return; // handled by onend
      setPhase('error');
    };

    recognition.onend = () => {
      if (intentionalStopRef.current) return; // we stopped it on purpose
      // ended on its own (e.g. a silence gap) — keep the conversation
      // going instead of dropping the user back to a dead overlay
      if (openRef.current) {
        window.setTimeout(() => {
          if (openRef.current) startRecognition();
        }, 250);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setPhase('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speak = useCallback(
    (text) => {
      if (!window.speechSynthesis || !text) {
        // nothing to say — just go back to listening for the next turn
        window.setTimeout(() => {
          if (openRef.current) startRecognition();
        }, 600);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;

      // Reveal captions word-by-word on our own steady clock instead of
      // relying on SpeechSynthesis's `onboundary` event — it doesn't
      // fire reliably (or at all) in every browser, which is why text
      // used to show up all at once at the end. We estimate the total
      // speaking time from word count at ~2.5 words/sec (rate = 1) and
      // reveal one word per that interval, so captions always stream
      // in real time alongside the voice.
      if (captionTimerRef.current) {
        window.clearInterval(captionTimerRef.current);
        captionTimerRef.current = null;
      }
      const words = text.split(/\s+/).filter(Boolean);
      const estimatedMs = Math.max(500, (words.length / 2.5) * 1000);
      const perWordMs = estimatedMs / words.length;
      let wordIndex = 0;
      setDisplayText('');
      captionTimerRef.current = window.setInterval(() => {
        wordIndex += 1;
        setDisplayText(words.slice(0, wordIndex).join(' '));
        if (wordIndex >= words.length && captionTimerRef.current) {
          window.clearInterval(captionTimerRef.current);
          captionTimerRef.current = null;
        }
      }, perWordMs);

      utterance.onend = () => {
        if (captionTimerRef.current) {
          window.clearInterval(captionTimerRef.current);
          captionTimerRef.current = null;
        }
        setDisplayText(text);
        // loop back into listening for the next turn automatically
        window.setTimeout(() => {
          if (openRef.current) startRecognition();
        }, 450);
      };
      utterance.onerror = () => {
        if (captionTimerRef.current) {
          window.clearInterval(captionTimerRef.current);
          captionTimerRef.current = null;
        }
        window.setTimeout(() => {
          if (openRef.current) startRecognition();
        }, 450);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    },
    [startRecognition]
  );

  const handleFinalTranscript = useCallback(
    (text) => {
      setPhase('thinking');
      setDisplayText(text);
      stopRecognition();
      sendMessage(text, {
        onAnswer: (answer) => {
          setPhase('speaking');
          setDisplayText('');
          speak(answer);
        },
        onFailure: (fallback) => {
          setPhase('speaking');
          setDisplayText('');
          speak(fallback);
        },
      });
    },
    [sendMessage, speak, stopRecognition]
  );

  useEffect(() => {
    if (!voiceOpen) return undefined;
    startRecognition();
    return () => {
      stopRecognition();
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceOpen]);

  // keep the caption box scrolled to the newest line, so only the last
  // couple of lines stay visible as text streams in
  useEffect(() => {
    const el = captionRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [displayText]);

  const handleClose = () => {
    openRef.current = false;
    stopRecognition();
    stopSpeaking();
    setVoiceOpen(false);
  };

  if (!voiceOpen) return null;

  const statusLabel =
    phase === 'listening'
      ? 'Listening...'
      : phase === 'thinking'
        ? 'Searching your knowledge base...'
        : phase === 'speaking'
          ? 'Speaking...'
          : phase === 'unsupported'
            ? 'Voice isn\u2019t supported in this browser'
            : 'Didn\u2019t catch that \u2014 tap to try again';

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center overflow-hidden bg-surface-0/70 backdrop-blur-xl animate-fade-in light:bg-white/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="va-bg-glow" />
        {AMBIENT_DOTS.map((dot, i) => (
          <span
            key={i}
            className="va-dot"
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              background: dot.color,
              animationDelay: dot.delay,
            }}
          />
        ))}
        <span className="va-orbit" />
      </div>

      <button
        onClick={handleClose}
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-surface-100/80 text-gray-400 backdrop-blur-md transition-colors hover:bg-surface-200 hover:text-white light:bg-white/80 light:text-gray-500"
        title="Close"
      >
        <X size={17} />
      </button>

      <div className="relative flex max-w-md flex-col items-center gap-6 px-6 text-center">
        <div className="va-blob-wrap">
          <div className="va-blob-glow" />
          <FluidGlob
            logo={sevenSkysLogo}
            size={200}
            active={phase === 'listening' || phase === 'speaking'}
          />
          {(phase === 'listening' || phase === 'speaking') && (
            <>
              <span className="va-ring va-ring-1" />
              <span className="va-ring va-ring-2" />
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-surface-border bg-surface-100/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400 light:bg-white/70 light:text-gray-500">
          <Volume2 size={12} className="text-teal-bot" />
          Athena
        </div>

        {/* fixed ~2-line caption window — new words stream in at the
            bottom, older ones scroll away instead of growing the box */}
        <div ref={captionRef} className="va-caption">
          <p className="va-caption-text">{displayText || '\u00A0'}</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          {(phase === 'listening' || phase === 'speaking') && (
            <div className="flex items-end gap-[3px]" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <span key={i} className="va-wave-bar" style={{ animationDelay: `${i * 0.09}s` }} />
              ))}
            </div>
          )}
          {phase === 'thinking' && (
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal-bot" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal-bot" style={{ animationDelay: '0.2s' }} />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal-bot" style={{ animationDelay: '0.4s' }} />
            </div>
          )}

          <span
            className={`flex items-center gap-2 text-[13px] font-medium ${
              phase === 'error' || phase === 'unsupported' ? 'text-amber-400' : 'text-gray-400'
            }`}
          >
            {phase === 'listening' ? <Mic size={14} className="text-teal-bot" /> : <MicOff size={14} />}
            {statusLabel}
          </span>

          {phase === 'error' && (
            <button
              onClick={startRecognition}
              className="rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 px-4 py-2 text-[13px] font-semibold text-white shadow-lg shadow-accent-600/20 hover:brightness-110"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Small ambient hint bubble that surfaces under the Seven Skys logo every
 * few minutes to nudge the user toward the voice assistant.
 */
const HINT_MESSAGES = [
  'Hii \u{1F44B}',
  'Talk to me',
  'I can tell you about this',
  'Click here to speak',
];

export function AssistantHint({ intervalMs = 5 * 60 * 1000, visibleMs = 4200 }) {
  const [visible, setVisible] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const showHint = () => {
      setMsgIndex((i) => (i + 1) % HINT_MESSAGES.length);
      setVisible(true);
      window.setTimeout(() => setVisible(false), visibleMs);
    };

    const interval = window.setInterval(showHint, intervalMs);
    return () => window.clearInterval(interval);
  }, [intervalMs, visibleMs]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute -top-3 left-0 z-20 -translate-y-full animate-hint-pop">
      <div className="hint-bubble pointer-events-auto flex items-center gap-2 px-3.5 py-2">
        <span className="hint-bubble-icon">
          <Sparkles size={11} />
        </span>
        <span className="text-[12.5px] font-medium leading-none text-gray-100 light:text-gray-800">
          {HINT_MESSAGES[msgIndex]}
        </span>
      </div>
      <div className="hint-bubble-tail" />
    </div>
  );
}
