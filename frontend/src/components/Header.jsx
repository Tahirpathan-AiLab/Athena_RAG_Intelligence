import { useState, useRef } from 'react';
import { Moon, Sun, ChevronDown, UploadCloud, LogOut, Menu, Gem } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const TITLES = {
  chat: {
    title: 'Hello, Tahir ',
    subtitle: 'Ask anything about your documents. Answers are grounded in your knowledge base.',
  },
  documents: {
    title: 'Documents',
    subtitle: 'Manage the files powering your knowledge base.',
  },
  history: {
    title: 'Chat History',
    subtitle: 'Browse and reopen your past conversations.',
  },
  knowledge: {
    title: 'Knowledge Base',
    subtitle: 'Overview of everything your assistant has learned.',
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Track usage and system performance.',
  },
  users: {
    title: 'Users',
    subtitle: 'Manage who has access to this workspace.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Configure your assistant and account preferences.',
  },
};

export default function Header({ onUploadClick, onOpenMobileNav }) {
  const { theme, setTheme, view, showToast, logout } = useChat();
  const [themeOpen, setThemeOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const closeTimer = useRef(null);

  const meta = TITLES[view] || TITLES.chat;

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-surface-border bg-surface-0 px-4 py-4 md:px-6 light:bg-white">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-surface-200 md:hidden"
        >
          <Menu size={19} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[19px] font-bold text-white light:text-gray-900">{meta.title}</h1>
          <p className="hidden truncate text-[12.5px] text-gray-500 sm:block">{meta.subtitle}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        {/* Theme toggle */}
        <div className="relative">
          <button
            onClick={() => setThemeOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface-100 px-2.5 py-2 text-[13px] font-medium text-gray-200 hover:bg-surface-200 light:bg-white light:text-gray-700"
          >
            {theme === 'dark' ? <Moon size={15} className="text-accent-400" /> : <Sun size={15} className="text-amber-400" />}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            <ChevronDown size={13} className="text-gray-500" />
          </button>
          {themeOpen && (
            <div className="absolute right-0 top-11 z-30 w-32 animate-fade-in overflow-hidden rounded-lg border border-surface-border bg-surface-200 shadow-xl light:bg-white">
              <button
                onClick={() => {
                  setTheme('dark');
                  setThemeOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] hover:bg-surface-300 light:hover:bg-gray-50 ${theme === 'dark' ? 'text-accent-400' : 'text-gray-300 light:text-gray-700'
                  }`}
              >
                <Moon size={14} /> Dark
              </button>
              <button
                onClick={() => {
                  setTheme('light');
                  setThemeOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] hover:bg-surface-300 light:hover:bg-gray-50 ${theme === 'light' ? 'text-accent-400' : 'text-gray-300 light:text-gray-700'
                  }`}
              >
                <Sun size={14} /> Light
              </button>
            </div>
          )}
        </div>

        {/* pro version */}
        <button
          onClick={onUploadClick}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 px-3 py-2 text-[13px] font-semibold text-white shadow-lg shadow-accent-600/20 transition-transform hover:brightness-110 active:scale-[0.98]"
        >
          <Gem size={15} className="text-white" />
          <span className="hidden sm:inline">Upgrade to Pro</span>
        </button>

        {/* Logout */}
        <div className="relative">
          <button
            onClick={() => setConfirmLogout((v) => !v)}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-surface-border bg-surface-100 text-gray-400 hover:bg-surface-200 hover:text-red-400 light:bg-white"
            title="Log out"
          >
            <LogOut size={15} />
          </button>
          {confirmLogout && (
            <div className="absolute right-0 top-11 z-30 w-52 animate-fade-in rounded-lg border border-surface-border bg-surface-200 p-3 shadow-xl light:bg-white">

              <p className="mb-2.5 text-[12.5px] text-gray-300 light:text-gray-700">Log out of Athena?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="flex-1 rounded-md border border-surface-border py-1.5 text-[12px] text-gray-300 hover:bg-surface-300 light:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setConfirmLogout(false);
                    logout();
                  }}
                  className="flex-1 rounded-md bg-red-500/90 py-1.5 text-[12px] font-semibold text-white hover:bg-red-500"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}