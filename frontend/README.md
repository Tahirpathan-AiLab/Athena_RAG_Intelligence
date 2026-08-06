# RAG Chat — Frontend

Production-ready React + Vite + Tailwind CSS frontend for the RAG (Retrieval-Augmented Generation) Knowledge Base Chat interface.

## Stack
- React 19 + Vite
- Tailwind CSS v4
- lucide-react (icons)
- recharts (analytics charts)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

## Connecting to your backend

All API/data logic is centralized in `src/context/ChatContext.jsx` and `src/data/mockData.js`.
Currently it simulates RAG answers locally (`findAnswer` in ChatContext.jsx) and persists
state to `localStorage`. To wire up your real backend:

1. Replace `sendMessage` in `ChatContext.jsx` with a `fetch`/`axios` call to your chat endpoint.
2. Replace `addDocuments` with an upload call (FormData) to your documents endpoint.
3. Replace `initialChats` / `initialDocuments` loading with API calls on mount (e.g. in a `useEffect`).
4. Update `mockUsers` in `UsersPage.jsx` and `analyticsData` in `AnalyticsPage.jsx` similarly.

## Folder Structure

```
src/
  components/   Reusable UI pieces (Sidebar, Header, ChatArea, ChatInput, RightPanel, MessageBubble, Toast)
  pages/        Documents, Chat History, Knowledge Base, Analytics, Users, Settings
  context/      ChatContext.jsx — global state (chats, documents, theme, view)
  data/         mockData.js — sample data / knowledge base used for demo answers
```

## Features
- Full working chat: send message, simulated RAG answer with source citations & similarity score
- Drag & drop document upload (updates live stats)
- Dark / Light theme toggle
- Responsive: desktop, tablet, mobile (slide-in sidebar & right panel)
- Voice input (Web Speech API) on supported browsers
- Chat history, document management, analytics dashboard, user management, settings — all functional with local state


✅ Streaming Responses (ChatGPT typing effect)
File Upload from UI (PDF upload)
Upload Progress Bar
Multiple Document Support
Source Citations
Conversation History
Delete Documents
Search History
Settings Panel
Dark / Light Theme
Analytics Dashboard
Authentication (Login)
Docker
CI/CD
Deployment (Render/Railway/Fly.io)
Monitoring & Logging
Rate Limiting
Caching
Production Security

LISTEN CARE FULLY DEKHO MERE IS PROJECT MAI JAHA PR MAI text likhta hu input box and microphonr and a seven skys logo hai mai usmai thoda update krna chahta hu jab mai us input text box wale logo pr click karu tab puri screen ko ek blur acreen cover kr le or bich mai ek glob float kr raha ho mere seven scky logo jaisa or vo fluid type hona chaiyr understand waht i mean and mai chahta hu ki mtum muje vo bana kr do uska kaam meri woice ko sun na or data base mai se uska reply dena hoga mai mera backend ka kaam kr luga tum bas frountend dekho or muje is voice assistant athena ka interface bana kr do or sari fie mat bana na ba s vo jo jaruri hai or us se related hai last but related files mai bhi purana code perfectly same to same hona chaiye donot change old code on your own bas naya add kr dena or har 5 minuts mai seven skys ke logo ke niche ek chota popup hona chaiye jaise ki hii, talk to me , i can tell you about this , cleack here etc samaj mai aaya ya nahi muje files bana kr do
