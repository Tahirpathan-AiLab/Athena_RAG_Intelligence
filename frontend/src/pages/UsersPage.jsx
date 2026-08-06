import { useState } from 'react';
import { UserPlus, Search, MoreVertical, Shield } from 'lucide-react';
import { mockUsers } from '../data/mockData';

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [query, setQuery] = useState('');
  const [menuId, setMenuId] = useState(null);

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
  );

  const removeUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setMenuId(null);
  };

  return (
    <div className="themed-scroll flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-lg border border-surface-border bg-surface-100 py-2 pl-9 pr-3 text-[13.5px] text-white placeholder-gray-500 outline-none focus:border-accent-500 light:bg-white light:text-gray-900"
            />
          </div>
          <button className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 px-3.5 py-2 text-[13px] font-semibold text-white shadow-md shadow-accent-600/20">
            <UserPlus size={15} /> Invite User
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-surface-border">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-100 text-[11.5px] uppercase tracking-wide text-gray-500 light:bg-gray-50">
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Role</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Queries</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-surface-border bg-surface-0 light:bg-white">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-accent-600 text-[12px] font-bold text-white">
                        {u.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-gray-100 light:text-gray-900">{u.name}</p>
                        <p className="truncate text-[11.5px] text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="flex items-center gap-1 text-[12.5px] text-gray-300 light:text-gray-600">
                      {u.role === 'Admin' && <Shield size={12} className="text-accent-400" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-[12.5px] text-gray-300 md:table-cell light:text-gray-600">{u.queries}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        u.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="relative px-4 py-3 text-right">
                    <button
                      onClick={() => setMenuId(menuId === u.id ? null : u.id)}
                      className="rounded p-1 text-gray-500 hover:bg-surface-200 hover:text-gray-200"
                    >
                      <MoreVertical size={15} />
                    </button>
                    {menuId === u.id && (
                      <div className="absolute right-4 top-10 z-10 w-32 animate-fade-in overflow-hidden rounded-lg border border-surface-border bg-surface-200 shadow-xl light:bg-white">
                        <button
                          onClick={() => removeUser(u.id)}
                          className="w-full px-3 py-2 text-left text-[12px] text-red-400 hover:bg-surface-300 light:hover:bg-gray-50"
                        >
                          Remove access
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
