import React, { useState } from "react";
import { Moon, Sun, Wifi, WifiOff, Loader2, Download, Trash2, AlertTriangle } from "lucide-react";

const MODEL_OPTIONS = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile"];
const TOP_K_OPTIONS = [2, 4, 6, 8];
const TEMPERATURE_OPTIONS = [0, 0.2, 0.5, 0.8];

export default function SettingsView({
  isDark,
  onToggleTheme,
  settings,
  onSettingsChange,
  apiUrl,
  onCheckHealth,
  onClearKnowledgeBase,
  onExportChats,
  documentCount,
  sessionCount,
}) {
  const [healthState, setHealthState] = useState({ status: "idle" }); // idle | checking | ok | error
  const [confirmClear, setConfirmClear] = useState(false);

  async function handleCheckHealth() {
    setHealthState({ status: "checking" });
    try {
      const ok = await onCheckHealth();
      setHealthState(ok ? { status: "ok" } : { status: "error" });
    } catch {
      setHealthState({ status: "error" });
    }
  }

  function handleClearClick() {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    setConfirmClear(false);
    onClearKnowledgeBase();
  }

  return (
    <div className="view-page">
      <header className="view-page__header">
        <div>
          <h1>Settings</h1>
          <p>Tune the model, retrieval behaviour, and appearance of your assistant.</p>
        </div>
      </header>

      <section className="settings-section">
        <p className="settings-section__title">Appearance</p>
        <div className="settings-card">
          <label className="settings-row settings-row--toggle">
            <span className="settings-row__label">
              {isDark ? <Moon size={15} /> : <Sun size={15} />}
              Dark mode
            </span>
            <button
              role="switch"
              aria-checked={isDark}
              className={`toggle ${isDark ? "toggle--on" : ""}`}
              onClick={onToggleTheme}
            >
              <span className="toggle__thumb" />
            </button>
          </label>
        </div>
      </section>

      <section className="settings-section">
        <p className="settings-section__title">Model &amp; retrieval</p>
        <div className="settings-card">
          <label className="settings-row">
            <span className="settings-row__label">Model</span>
            <select
              value={settings.model}
              onChange={(e) => onSettingsChange({ ...settings, model: e.target.value })}
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <label className="settings-row">
            <span className="settings-row__label">Top K (retrieval)</span>
            <select
              value={settings.topK}
              onChange={(e) => onSettingsChange({ ...settings, topK: Number(e.target.value) })}
            >
              {TOP_K_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>

          <label className="settings-row">
            <span className="settings-row__label">Temperature</span>
            <select
              value={settings.temperature}
              onChange={(e) => onSettingsChange({ ...settings, temperature: Number(e.target.value) })}
            >
              {TEMPERATURE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="settings-row settings-row--toggle">
            <span className="settings-row__label">Conversation memory</span>
            <button
              role="switch"
              aria-checked={settings.memory}
              className={`toggle ${settings.memory ? "toggle--on" : ""}`}
              onClick={() => onSettingsChange({ ...settings, memory: !settings.memory })}
            >
              <span className="toggle__thumb" />
            </button>
          </label>
        </div>
      </section>

      <section className="settings-section">
        <p className="settings-section__title">Connection</p>
        <div className="settings-card">
          <div className="settings-row">
            <span className="settings-row__label">Backend URL</span>
            <code className="settings-code">{apiUrl}</code>
          </div>
          <div className="settings-row">
            <span className="settings-row__label">Status</span>
            <button className="ghost-btn ghost-btn--small" onClick={handleCheckHealth}>
              {healthState.status === "checking" ? (
                <Loader2 size={13} className="spin" />
              ) : healthState.status === "ok" ? (
                <Wifi size={13} />
              ) : healthState.status === "error" ? (
                <WifiOff size={13} />
              ) : (
                <Wifi size={13} />
              )}
              {healthState.status === "checking"
                ? "Checking..."
                : healthState.status === "ok"
                ? "Connected"
                : healthState.status === "error"
                ? "Unreachable"
                : "Check connection"}
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <p className="settings-section__title">Data</p>
        <div className="settings-card">
          <div className="settings-row">
            <span className="settings-row__label">Export chat history</span>
            <button className="ghost-btn ghost-btn--small" onClick={onExportChats} disabled={sessionCount === 0}>
              <Download size={13} />
              Export JSON
            </button>
          </div>
          <div className="settings-row">
            <span className="settings-row__label">
              Clear knowledge base
              <span className="settings-row__hint">Deletes all {documentCount} ingested document(s) permanently.</span>
            </span>
            <button
              className={`ghost-btn ghost-btn--small ghost-btn--danger ${confirmClear ? "ghost-btn--confirming" : ""}`}
              onClick={handleClearClick}
              disabled={documentCount === 0}
            >
              {confirmClear ? <AlertTriangle size={13} /> : <Trash2 size={13} />}
              {confirmClear ? "Click again to confirm" : "Clear all"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
