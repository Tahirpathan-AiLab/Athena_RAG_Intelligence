import { useState } from 'react';
import {
  Brain,
  MessageSquarePlus,
  FileStack,
  Clock,
  BookOpenText,
  BarChart3,
  Users2,
  Settings,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import sevenSkysLogo from '../assets/Seven_Skys_Logo.png';

const NAV_ITEMS = [
  { key: 'documents', label: 'Documents', icon: FileStack },
  { key: 'history', label: 'Chat History', icon: Clock },
  { key: 'knowledge', label: 'Knowledge Base', icon: BookOpenText },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const {
    chats,
    activeChatId,
    stats,
    view,
    setView,
    createNewChat,
    openChat,
    deleteChat,
    sidebarCollapsed,
    setSidebarCollapsed,
    showToast,
    logout,
  } = useChat();
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoveredChat, setHoveredChat] = useState(null);

  const recentChats = chats.slice(0, 5);

  if (sidebarCollapsed) {
    return (
      <aside className="hidden md:flex w-[68px] shrink-0 flex-col items-center gap-3 border-r border-surface-border bg-surface-50 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700">
          <Brain size={18} className="text-white" />
        </div>
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="mt-2 flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-surface-200 hover:text-white"
          title="Expand sidebar"
        >
          <PanelLeftOpen size={18} />
        </button>
        <button
          onClick={createNewChat}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-600 text-white hover:bg-accent-500"
          title="New Chat"
        >
          <MessageSquarePlus size={17} />
        </button>
        <div className="mt-2 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              title={item.label}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${view === item.key
                  ? 'bg-accent-600/15 text-accent-400'
                  : 'text-gray-400 hover:bg-surface-200 hover:text-white light:text-gray-500'
                }`}
            >
              <item.icon size={17} />
            </button>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}
      <aside
        className={`${mobileOpen ? 'fixed inset-y-0 left-0 z-50 flex w-[264px] animate-fade-in' : 'hidden'
          } md:static md:z-auto md:flex w-[264px] shrink-0 flex-col border-r border-surface-border bg-surface-50 light:bg-white`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl ">
              <img img src={sevenSkysLogo} alt="Seven Skys Logo Image" className="h-[45px] w-[45px] object-contain" ></img>
            </div>
            <div className="leading-tight">
              <p className="text-[15px] font-bold text-white light:text-gray-900">Athena</p>
              <p className="text-[11px] text-gray-500">AI Knowledge Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-surface-200 hover:text-white md:flex"
            title="Collapse sidebar"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        <div className="themed-scroll flex-1 overflow-y-auto px-3">
          {/* New Chat */}
          <button
            onClick={() => {
              createNewChat();
              onMobileClose?.();
            }}
            className="mb-3 flex w-full items-center gap-2 rounded-xl bg-accent-600/15 px-3.5 py-2.5 text-[14px] font-semibold text-accent-400 ring-1 ring-inset ring-accent-600/30 transition-colors hover:bg-accent-600/25"
          >
            <MessageSquarePlus size={17} />
            New Chat
          </button>

          {/* Nav */}
          <nav className="mb-4 flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setView(item.key);
                  onMobileClose?.();
                }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-[13.5px] font-medium transition-colors ${view === item.key
                    ? 'bg-surface-200 text-white light:bg-gray-100 light:text-gray-900'
                    : 'text-gray-400 hover:bg-surface-200/70 hover:text-white light:text-gray-500 light:hover:bg-gray-100'
                  }`}
              >
                <item.icon size={16} className={view === item.key ? 'text-accent-400' : ''} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Knowledge Base Stats */}
          <div className="mb-4 rounded-xl border border-surface-border bg-surface-100 p-3.5 light:bg-gray-50">
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-accent-400">
              Knowledge Base Stats
            </p>
            <div className="flex flex-col gap-1.5 text-[13px]">
              <StatRow label="Documents" value={stats.documents} />
              <StatRow label="Chunks" value={stats.chunks.toLocaleString()} />
              <StatRow label="Embeddings" value={stats.embeddings.toLocaleString()} />
              <StatRow label="Storage Used" value={`${stats.storageMB.toFixed(1)} MB`} />
            </div>
          </div>

          {/* Recent Chats */}
          <div className="mb-3">
            <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-accent-400">
              Recent Chats
            </p>
            <div className="flex flex-col gap-0.5">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  onMouseEnter={() => setHoveredChat(chat.id)}
                  onMouseLeave={() => setHoveredChat(null)}
                  onClick={() => {
                    openChat(chat.id);
                    onMobileClose?.();
                  }}
                  className={`group flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${activeChatId === chat.id
                      ? 'bg-surface-200 text-white light:bg-gray-100 light:text-gray-900'
                      : 'text-gray-400 hover:bg-surface-200/60 hover:text-gray-200 light:text-gray-600 light:hover:bg-gray-50'
                    }`}
                >
                  <MessageSquarePlus size={13} className="shrink-0 opacity-50" />
                  <span className="flex-1 truncate">{chat.title}</span>
                  {hoveredChat === chat.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="shrink-0 rounded p-0.5 text-gray-500 hover:text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setView('history')}
              className="mt-2 w-full rounded-lg border border-surface-border bg-surface-100 py-2 text-[12.5px] font-medium text-gray-300 transition-colors hover:bg-surface-200 light:bg-white light:text-gray-600 light:hover:bg-gray-50"
            >
              View All Chats
            </button>
          </div>
        </div>

        {/* User profile */}
        <div className="relative border-t border-surface-border p-3">
          {profileOpen && (
            <div className="absolute bottom-[64px] left-3 right-3 z-20 animate-fade-in overflow-hidden rounded-xl border border-surface-border bg-surface-200 shadow-xl light:bg-white">
              <button
                onClick={() => {
                  setView('settings');
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[13px] text-gray-300 hover:bg-surface-300 light:text-gray-700 light:hover:bg-gray-50"
              >
                <UserIcon size={14} /> Profile Settings
              </button>
              
            </div>
          )}
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-surface-200 light:hover:bg-gray-100"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-accent-600 text-[13px] font-bold text-white">
              T
            </div>
            <div className="flex-1 text-left leading-tight">
              <p className="text-[13.5px] font-semibold text-white light:text-gray-900">Tahir</p>
              <p className="text-[11px] text-gray-500">Admin</p>
            </div>
            <ChevronDown size={15} className={`text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>
    </>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400 light:text-gray-500">{label}</span>
      <span className="font-semibold text-white light:text-gray-900">{value}</span>
    </div>
  );
}