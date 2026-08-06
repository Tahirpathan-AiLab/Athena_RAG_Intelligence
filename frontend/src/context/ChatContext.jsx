import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { initialChats, analyticsData } from '../data/mockData';
import { askQuestion, deleteDocument as deleteDocumentApi, getAnalytics, getDocuments, uploadDocuments } from '../lib/api';

const ChatContext = createContext(null);

function uid(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function ChatProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('rag-theme') || 'dark');

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rag-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem('rag-chats');
      return saved ? JSON.parse(saved) : initialChats;
    } catch {
      return initialChats;
    }
  });
  const [activeChatId, setActiveChatId] = useState(() => chats[0]?.id ?? null);
  const [documents, setDocuments] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [view, setView] = useState('chat'); // chat | documents | history | knowledge | analytics | users | settings
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [analytics, setAnalytics] = useState(analyticsData);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.classList.add('light');
    else root.classList.remove('light');
    localStorage.setItem('rag-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('rag-chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    let ignore = false;

    async function loadBackendData() {
      try {
        const [documentData, analyticsData] = await Promise.all([getDocuments(), getAnalytics()]);
        if (!ignore) {
          setDocuments(documentData.documents || []);
          setAnalytics(analyticsData);
        }
      } catch (error) {
        if (!ignore) {
          console.error(error);
          setAnalytics((prev) => prev ?? analyticsData);
        }
      }
    }

    loadBackendData();
    return () => {
      ignore = true;
    };
  }, []);

  const showToast = useCallback((message, kind = 'success') => {
    setToast({ message, kind, id: uid('toast') });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) || null,
    [chats, activeChatId]
  );

  const stats = useMemo(() => ({
    documents: analytics?.documents ?? 0,
    chunks: analytics?.chunks ?? 0,
    embeddings: analytics?.embeddings ?? 0,
    storageMB: analytics?.storageMB ?? 0,
    totalQueries: analytics?.totalQueries ?? 0,
    avgSimilarity: analytics?.avgSimilarity ?? 0,
    avgResponseMs: analytics?.avgResponseMs ?? 0,
    weeklyQueries: analytics?.weeklyQueries ?? [],
    topQuestions: analytics?.topQuestions ?? [],
  }), [analytics]);

  // ---------- AUTH ----------
  const signup = useCallback(({ name, email, password }) => {
    const users = JSON.parse(localStorage.getItem('rag-users') || '[]');

    if (users.some((u) => u.email === email)) {
      throw new Error('An account with this email already exists');
    }

    const newUser = { id: uid('user'), name, email, password };
    users.push(newUser);
    localStorage.setItem('rag-users', JSON.stringify(users));

    const { password: _pw, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem('rag-user', JSON.stringify(safeUser));
    showToast(`Welcome, ${name}!`, 'success');
  }, [showToast]);

  const login = useCallback(({ email, password }) => {
    const users = JSON.parse(localStorage.getItem('rag-users') || '[]');
    const found = users.find((u) => u.email === email && u.password === password);

    if (!found) {
      throw new Error('Invalid email or password');
    }

    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('rag-user', JSON.stringify(safeUser));
    showToast(`Welcome back, ${found.name}!`, 'success');
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('rag-user');
    showToast('Logged out', 'info');
  }, [showToast]);
  // ---------- END AUTH ----------

  const createNewChat = useCallback(() => {
    const chat = {
      id: uid('chat'),
      title: 'New Chat',
      createdAt: Date.now(),
      messages: [
        {
          id: uid('m'),
          role: 'system',
          text: 'I will answer your questions only using the information from your uploaded documents.\n\nIf the answer is not found, I will let you know.',
        },
      ],
    };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
    setView('chat');
    return chat.id;
  }, []);

  const openChat = useCallback((id) => {
    setActiveChatId(id);
    setView('chat');
  }, []);

  const deleteChat = useCallback((id) => {
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== id);
      return next;
    });
    setActiveChatId((prevActive) => {
      if (prevActive !== id) return prevActive;
      return null;
    });
    showToast('Chat deleted', 'info');
  }, [showToast]);

  const sendMessage = useCallback(
    (text, callbacks = {}) => {
      const { onAnswer, onFailure } = callbacks;
      if (!text.trim()) return;
      let chatId = activeChatId;

      setChats((prev) => {
        let list = prev;
        let targetId = chatId;
        if (!targetId || !list.find((c) => c.id === targetId)) {
          const chat = {
            id: uid('chat'),
            title: text.slice(0, 40),
            createdAt: Date.now(),
            messages: [
              {
                id: uid('m'),
                role: 'system',
                text: 'I will answer your questions only using the information from your uploaded documents.\n\nIf the answer is not found, I will let you know.',
              },
            ],
          };
          list = [chat, ...list];
          targetId = chat.id;
          chatId = chat.id;
          setActiveChatId(chat.id);
        }

        return list.map((c) => {
          if (c.id !== targetId) return c;
          const isFirstUserMsg = !c.messages.some((m) => m.role === 'user');
          return {
            ...c,
            title: isFirstUserMsg ? text.slice(0, 48) : c.title,
            messages: [
              ...c.messages,
              { id: uid('m'), role: 'user', text, time: formatTime() },
            ],
          };
        });
      });

      setIsBotTyping(true);
      askQuestion(text)
        .then((data) => {
          setChats((prev) =>
            prev.map((c) => {
              if (c.id !== chatId) return c;
              const botMsg = {
                id: uid('m'),
                role: 'bot',
                time: formatTime(),
                text: data.answer,
                sources: data.sources || [],
                similarity: data.similarity,
                chunks: data.chunks,
              };
              return { ...c, messages: [...c.messages, botMsg] };
            })
          );
          onAnswer?.(data.answer);
        })
        .catch(() => {
          const fallbackText =
            "I couldn't reach the backend server.\n\nMake sure the FastAPI server is running (uvicorn) and reachable at the configured API URL.";
          setChats((prev) =>
            prev.map((c) => {
              if (c.id !== chatId) return c;
              const botMsg = {
                id: uid('m'),
                role: 'bot',
                time: formatTime(),
                text: fallbackText,
                notFound: true,
              };
              return { ...c, messages: [...c.messages, botMsg] };
            })
          );
          showToast('Could not reach the backend server', 'error');
          onFailure?.(fallbackText);
        })
        .finally(() => setIsBotTyping(false));
    },
    [activeChatId, showToast]
  );

  const addDocuments = useCallback(
    async (files) => {
      if (!files?.length) return;

      setIsUploading(true);

      try {
        const result = await uploadDocuments(files);

        // Refresh documents list
        const refreshed = await getDocuments();
        setDocuments(refreshed.documents || []);

        // Refresh analytics
        const analyticsData = await getAnalytics();
        setAnalytics(analyticsData);

        showToast(
          result.count === 1
            ? `${files[0].name} uploaded and indexed`
            : `${result.count} documents uploaded and indexed`,
          "success"
        );
      } catch (error) {
        console.error(error);
        showToast(error.message || "Document upload failed", "error");
      } finally {
        setIsUploading(false);
      }
    },
    [showToast]
  );

  const deleteDocument = useCallback(
    async (id) => {
      try {
        await deleteDocumentApi(id);
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        showToast('Document deleted', 'info');
      } catch (error) {
        console.error(error);
        showToast('Could not delete document', 'error');
      }
    },
    [showToast]
  );

  const value = {
    theme,
    setTheme,
    user,
    login,
    signup,
    logout,
    chats,
    setChats,
    activeChat,
    activeChatId,
    setActiveChatId,
    documents,
    stats,
    isBotTyping,
    isUploading,
    view,
    setView,
    sidebarCollapsed,
    setSidebarCollapsed,
    rightPanelOpen,
    setRightPanelOpen,
    voiceOpen,
    setVoiceOpen,
    createNewChat,
    openChat,
    deleteChat,
    sendMessage,
    addDocuments,
    deleteDocument,
    toast,
    showToast,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}