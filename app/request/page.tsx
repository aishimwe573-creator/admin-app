'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function RequestAccessPage() {
  const [passphrase, setPassphrase] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedPassphrase, setSubmittedPassphrase] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!passphrase.trim()) {
      setError('Please enter a passphrase');
      setLoading(false);
      return;
    }

    // Check if passphrase already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('passphrase', passphrase.trim())
      .single();

    if (existing) {
      setError('This passphrase already exists. Try logging in.');
      setLoading(false);
      return;
    }

    // Insert new user with passphrase and message
    const { error: insertError } = await supabase.from('users').insert([
      {
        passphrase: passphrase.trim(),
        message: message.trim() || 'No message provided',
        status: 'pending',
      },
    ]);

    if (insertError) {
      console.error('Insert error:', insertError);
      setError('Something went wrong: ' + insertError.message);
      setLoading(false);
      return;
    }

    setSubmittedPassphrase(passphrase.trim());
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Request Submitted</h1>
          <p className="text-gray-500 mt-2">
            Your passphrase request has been sent to the admin.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 mt-4">
            <p className="text-xs text-gray-500">Your passphrase:</p>
            <p className="font-mono text-lg font-bold text-gray-900 break-all">{submittedPassphrase}</p>
          </div>
          <p className="text-xs text-gray-400 mt-2">Save this passphrase — you'll need it to log in after approval.</p>
          <a
            href="/login"
            className="inline-block mt-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Request Access</h1>
          <p className="text-gray-500 mt-2">Submit your passphrase for admin approval</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Passphrase <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="e.g. my-secret-key-2026"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Why do you need access?"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have access?{' '}
          <a href="/login" className="text-amber-600 hover:underline font-medium">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}