// Mock data for Documents/History/Users/Analytics pages — the backend only exposes
// POST /ask, so these pages have no real endpoint to wire up and stay local-only.
// Chat answers themselves come from the real backend, see src/lib/api.js.

export const initialDocuments = [
  {
    id: 'doc-1',
    name: 'python_intro.pdf',
    sizeMB: 2.4,
    uploadedLabel: 'Uploaded 2 hours ago',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 2,
    chunks: 312,
    topic: 'python',
  },
  {
    id: 'doc-2',
    name: 'python_advanced.pdf',
    sizeMB: 1.8,
    uploadedLabel: 'Uploaded 1 day ago',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 24,
    chunks: 248,
    topic: 'python',
  },
  {
    id: 'doc-3',
    name: 'datascience_python.pdf',
    sizeMB: 3.2,
    uploadedLabel: 'Uploaded 2 days ago',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 48,
    chunks: 401,
    topic: 'python',
  },
  {
    id: 'doc-4',
    name: 'python_tutorial.pdf',
    sizeMB: 4.1,
    uploadedLabel: 'Uploaded 3 days ago',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 72,
    chunks: 287,
    topic: 'python',
  },
];

export const initialChats = [
  {
    id: 'chat-1',
    title: 'What is Python?',
    createdAt: Date.now() - 1000 * 60 * 30,
    messages: [
      {
        id: 'm-1',
        role: 'system',
        text: 'I will answer your questions only using the information from your uploaded documents.\n\nIf the answer is not found, I will let you know.',
      },
      {
        id: 'm-2',
        role: 'user',
        text: 'What is Python?',
        time: '10:30 AM',
      },
      {
        id: 'm-3',
        role: 'bot',
        time: '10:30 AM',
        text: "Python is a high-level, interpreted programming language known for its simple and readable syntax. It was created by Guido van Rossum and first released in 1991. Python supports multiple programming paradigms, including object-oriented, procedural, and functional programming.",
        sources: [
          { doc: 'python_intro.pdf', page: 'Page 1' },
          { doc: 'python_features.pdf', page: 'Page 2' },
        ],
        similarity: 0.91,
        chunks: 4,
      },
      {
        id: 'm-4',
        role: 'user',
        text: 'Who is the President of India?',
        time: '10:32 AM',
      },
      {
        id: 'm-5',
        role: 'bot',
        time: '10:32 AM',
        text: "I couldn't find the answer in the provided documents.\n\nThe uploaded knowledge base does not contain information about this question.",
        sources: [],
        notFound: true,
      },
    ],
  },
  { id: 'chat-2', title: 'Python features', createdAt: Date.now() - 1000 * 60 * 60 * 5, messages: [] },
  { id: 'chat-3', title: 'Python vs Java', createdAt: Date.now() - 1000 * 60 * 60 * 20, messages: [] },
  { id: 'chat-4', title: 'Explain lists in Python', createdAt: Date.now() - 1000 * 60 * 60 * 30, messages: [] },
  { id: 'chat-5', title: 'How does Python handle memory?', createdAt: Date.now() - 1000 * 60 * 60 * 40, messages: [] },
];

export const productionFeatures = [
  {
    icon: 'Mic',
    title: 'Voice Assistant',
    desc: 'Ask & hear answers using your voice',
  },
  {
    icon: 'Quote',
    title: 'Source Citations',
    desc: 'Answers include relevant sources',
  },
  {
    icon: 'Gauge',
    title: 'Similarity Threshold',
    desc: 'Answers only if relevant (min 0.30)',
  },
  {
    icon: 'History',
    title: 'Chat History',
    desc: 'All your conversations saved',
  },
  {
    icon: 'FolderCog',
    title: 'Document Management',
    desc: 'Upload, delete & manage documents',
  },
  {
    icon: 'UserCog',
    title: 'User Authentication',
    desc: 'Secure access for multiple users',
  },
  {
    icon: 'BarChart3',
    title: 'Analytics Dashboard',
    desc: 'Track usage & system performance',
  },
  
];

export const mockUsers = [
  { id: 'u-1', name: 'Tahir', role: 'Admin', email: 'tahir@ragchat.ai', status: 'Active', queries: 128 },
];

export const analyticsData = {
  weeklyQueries: [
    { day: 'Mon', queries: 42 },
    { day: 'Tue', queries: 58 },
    { day: 'Wed', queries: 39 },
    { day: 'Thu', queries: 71 },
    { day: 'Fri', queries: 64 },
    { day: 'Sat', queries: 28 },
    { day: 'Sun', queries: 22 },
  ],
  topQuestions: [
    { q: 'What is Python?', count: 34 },
    { q: 'Python vs Java', count: 21 },
    { q: 'Explain lists in Python', count: 18 },
    { q: 'How does Python handle memory?', count: 15 },
    { q: 'Python features', count: 12 },
  ],
  avgSimilarity: 0.86,
  avgResponseMs: 740,
};
