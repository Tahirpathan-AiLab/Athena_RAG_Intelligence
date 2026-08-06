import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Timer, Target, MessagesSquare } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function AnalyticsPage() {
  const { chats, theme, stats } = useChat();
  const totalMessages = chats.reduce((sum, c) => sum + c.messages.filter((m) => m.role === 'user').length, 0);
  const isLight = theme === 'light';
  const gridStroke = isLight ? '#e5e5ec' : '#232330';
  const axisStroke = isLight ? '#8a8a96' : '#6b6b78';
  const tooltipBg = isLight ? '#ffffff' : '#17171f';
  const tooltipBorder = isLight ? '#e5e5ec' : '#232330';
  const tooltipText = isLight ? '#16161f' : '#f4f4f6';

  const cards = [
    { icon: MessagesSquare, label: 'Total Queries', value: totalMessages || stats.totalQueries || 0, color: 'text-accent-400', bg: 'bg-accent-600/15' },
    { icon: Target, label: 'Avg Similarity', value: (stats.avgSimilarity || 0).toFixed(2), color: 'text-amber-400', bg: 'bg-amber-500/15' },
    { icon: Timer, label: 'Avg Response Time', value: `${stats.avgResponseMs || 0} ms`, color: 'text-teal-400', bg: 'bg-teal-500/15' },
    { icon: Activity, label: 'System Uptime', value: '99.9%', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  ];

  return (
    <div className="themed-scroll flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl border border-surface-border bg-surface-100 p-4 light:bg-gray-50">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${c.bg}`}>
                <c.icon size={17} className={c.color} />
              </div>
              <p className="text-[20px] font-bold text-white light:text-gray-900">{c.value}</p>
              <p className="text-[12px] text-gray-500">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-xl border border-surface-border bg-surface-100 p-4 light:bg-gray-50">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[13px] font-bold text-white light:text-gray-900">Queries This Week</p>
            <span className="rounded-full bg-accent-600/15 px-2.5 py-1 text-[11px] font-semibold text-accent-400">
              {(stats.weeklyQueries || []).reduce((sum, d) => sum + (d.queries || 0), 0)} total
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyQueries || []} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="queriesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="day" stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} width={32} />
                <Tooltip
                  contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: tooltipText }}
                  itemStyle={{ color: tooltipText }}
                  cursor={{ fill: 'rgba(139,92,246,0.08)' }}
                />
                <Bar dataKey="queries" fill="url(#queriesGradient)" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-100 p-4 light:bg-gray-50">
          <p className="mb-3 text-[13px] font-bold text-white light:text-gray-900">Top Questions</p>
          <div className="flex flex-col gap-2.5">
            {(stats.topQuestions || []).map((q, i) => (
              <div key={q.q} className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-[12px] font-semibold text-gray-500">{i + 1}</span>
                <span className="flex-1 truncate text-[13px] text-gray-200 light:text-gray-700">{q.q}</span>
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-300 light:bg-gray-200">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-accent-500 to-accent-700"
                    style={{ width: `${(q.count / Math.max((stats.topQuestions?.[0]?.count || 1), 1)) * 100}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-[12px] text-gray-500">{q.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
