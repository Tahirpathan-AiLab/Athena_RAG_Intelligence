import { useState } from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import RightPanel from './components/RightPanel';
import Toast from './components/Toast';
import VoiceAssistant from './components/VoiceAssistant';
import DocumentsPage from './pages/DocumentsPage';
import HistoryPage from './pages/HistoryPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import AnalyticsPage from './pages/AnalyticsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';

function Shell() {
  const { view } = useChat();
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const showRightPanel = view === 'chat';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-0 light:bg-gray-50">
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onUploadClick={() => setRightPanelOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <div className="flex min-h-0 flex-1">
          <div className="relative flex min-w-0 flex-1 flex-col">
            {view === 'chat' && (
              <>
                <ChatArea />
                <ChatInput onUploadClick={() => setRightPanelOpen(true)} />
                <VoiceAssistant />
              </>
            )}
            {view === 'documents' && <DocumentsPage />}
            {view === 'history' && <HistoryPage />}
            {view === 'knowledge' && <KnowledgeBasePage />}
            {view === 'analytics' && <AnalyticsPage />}
            {view === 'users' && <UsersPage />}
            {view === 'settings' && <SettingsPage />}
          </div>

          {showRightPanel && (
            <RightPanel open={rightPanelOpen} onClose={() => setRightPanelOpen(false)} />
          )}
        </div>
      </div>

      <Toast />
    </div>
  );
}

function Gate() {
  const { user } = useChat();
  if (!user) return <AuthPage />;
  return <Shell />;
}

export default function App() {
  return (
    <ChatProvider>
      <Gate />
    </ChatProvider>
  );
}
