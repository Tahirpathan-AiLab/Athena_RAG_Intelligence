import React from "react";
import { Moon, Sun, Upload } from "lucide-react";

const VIEW_COPY = {
  chat: {
    title: "Knowledge base chat",
    subtitle: "Ask questions about your documents. Answers are grounded in your knowledge base.",
  },
  "knowledge-base": {
    title: "Knowledge base",
    subtitle: "Manage every document the assistant can draw on.",
  },
  history: {
    title: "Chat history",
    subtitle: "Browse and reopen your past conversations.",
  },
  settings: {
    title: "Settings",
    subtitle: "Configure the model, retrieval, and appearance.",
  },
};

export default function TopBar({ isDark, onToggleTheme, onUploadClick, view }) {
  const copy = VIEW_COPY[view] || VIEW_COPY.chat;

  return (
    <header className="topbar">
      <div>
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
      </div>

      <div className="topbar__actions">
        <button className="topbar__theme-toggle" onClick={onToggleTheme}>
          {isDark ? <Moon size={15} /> : <Sun size={15} />}
          {isDark ? "Dark" : "Light"}
        </button>
        <button className="topbar__upload" onClick={onUploadClick}>
          <Upload size={15} />
          Upload document
        </button>
      </div>
    </header>
  );
}
