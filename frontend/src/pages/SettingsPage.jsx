import { useState } from 'react';
import { Moon, Sun, Bell, Shield, Sliders } from 'lucide-react';
import { useChat } from '../context/ChatContext';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-accent-600' : 'bg-surface-300'}`}
    >
      <span
        className={`absolute top-0.5 left-1 h-5 w-5.2 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, setTheme, user, updateProfile } = useChat();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [threshold, setThreshold] = useState(30);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  return (
    <div className="themed-scroll flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-5">
        {/* Account */}
        <section className="rounded-xl border border-surface-border bg-surface-100 p-5 light:bg-gray-50">
          <p className="mb-4 text-[13.5px] font-bold text-white light:text-gray-900">Account</p>
          <div className="mb-3 flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-gray-400">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-surface-border bg-surface-0 px-3 py-2 text-[13.5px] text-white outline-none focus:border-accent-500 light:bg-white light:text-gray-900"
            />
          </div>
          <div className="mb-4 flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-gray-400">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-surface-border bg-surface-0 px-3 py-2 text-[13.5px] text-white outline-none focus:border-accent-500 light:bg-white light:text-gray-900"
            />
          </div>
          <button
            onClick={() => updateProfile({ name, email })}
            className="rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 px-4 py-2 text-[13px] font-semibold text-white shadow-md shadow-accent-600/20"
          >
            Save Changes
          </button>
        </section>

        {/* Appearance */}
        <section className="rounded-xl border border-surface-border bg-surface-100 p-5 light:bg-gray-50">
          <p className="mb-4 text-[13.5px] font-bold text-white light:text-gray-900">Appearance</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme('dark')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-[13px] font-medium transition-colors ${
                theme === 'dark' ? 'border-accent-500 bg-accent-600/15 text-accent-400' : 'border-surface-border text-gray-400'
              }`}
            >
              <Moon size={15} /> Dark
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-[13px] font-medium transition-colors ${
                theme === 'light' ? 'border-accent-500 bg-accent-600/15 text-accent-400' : 'border-surface-border text-gray-400'
              }`}
            >
              <Sun size={15} /> Light
            </button>
          </div>
        </section>

        {/* RAG settings */}
        <section className="rounded-xl border border-surface-border bg-surface-100 p-5 light:bg-gray-50">
          <p className="mb-4 flex items-center gap-2 text-[13.5px] font-bold text-white light:text-gray-900">
            <Sliders size={15} className="text-accent-400" /> Retrieval Settings
          </p>
          <div className="mb-1 flex items-center justify-between text-[12.5px]">
            <span className="text-gray-400">Similarity threshold</span>
            <span className="font-semibold text-gray-200 light:text-gray-800">{(threshold / 100).toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-accent-600"
          />
          <p className="mt-1.5 text-[11.5px] text-gray-500">
            Answers are only generated when a matching chunk scores above this threshold.
          </p>
        </section>

        {/* Notifications */}
        <section className="rounded-xl border border-surface-border bg-surface-100 p-5 light:bg-gray-50">
          <p className="mb-4 flex items-center gap-2 text-[13.5px] font-bold text-white light:text-gray-900">
            <Bell size={15} className="text-accent-400" /> Preferences
          </p>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-gray-200 light:text-gray-800">Email notifications</p>
              <p className="text-[11.5px] text-gray-500">Get notified when uploads finish indexing</p>
            </div>
            <Toggle checked={notifications} onChange={setNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-gray-200 light:text-gray-800">Autosave conversations</p>
              <p className="text-[11.5px] text-gray-500">Keep every chat in your history automatically</p>
            </div>
            <Toggle checked={autoSave} onChange={setAutoSave} />
          </div>
        </section>

        <section className="rounded-xl border border-red-500/25 bg-red-500/5 p-5">
          <p className="mb-1 flex items-center gap-2 text-[13.5px] font-bold text-red-400">
            <Shield size={15} /> Danger Zone
          </p>
          <p className="mb-3 text-[12px] text-gray-500">
            This clears all local chats and documents from this browser.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('rag-chats');
              localStorage.removeItem('rag-documents');
              window.location.reload();
            }}
            className="rounded-lg border border-red-500/40 px-4 py-2 text-[13px] font-semibold text-red-400 hover:bg-red-500/10"
          >
            Reset Workspace
          </button>
        </section>
      </div>
    </div>
  );
}
