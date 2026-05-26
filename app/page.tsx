'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Shield, ChevronRight, AlertCircle, KeyRound, FileText } from 'lucide-react';
import { supabase } from './lib/supabase';
import AtmosphericBackground from './components/AtmosphericBackground';
import PiLogo from './components/PiLogo';

export default function UserPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'request'>('login');
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) { setError('Please enter your passphrase'); return; }
    setIsLoading(true);
    setError('');

    const { data, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('passphrase', passphrase.trim())
      .single();

    if (queryError || !data) {
      setError('Passphrase not found. Submit a request first.');
      setIsLoading(false);
      return;
    }
    if (data.status === 'pending') { setError('Your request is still pending admin approval.'); setIsLoading(false); return; }
    if (data.status === 'denied') { setError('Your request was denied. Contact admin.'); setIsLoading(false); return; }

    localStorage.setItem('pi_user', JSON.stringify(data));
    router.push('/dashboard');
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) { setError('Please enter a passphrase'); return; }
    setIsLoading(true);
    setError('');

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('passphrase', passphrase.trim())
      .single();

    if (existing) { setError('This passphrase already exists. Try signing in.'); setIsLoading(false); return; }

    const { error: insertError } = await supabase
      .from('users')
      .insert([{ passphrase: passphrase.trim(), message: message.trim() || 'No message', status: 'pending' }]);

    if (insertError) { setError('Something went wrong.'); setIsLoading(false); return; }

    setSubmitted(true);
    setIsLoading(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px) scale(1.02)`;
  };
  const handleMouseLeave = () => { if (btnRef.current) btnRef.current.style.transform = ''; };

  if (submitted) {
    return (
      <div className="min-h-screen flex relative overflow-hidden" style={{ background: 'var(--navy-950)' }}>
        <AtmosphericBackground />
        <div className="flex-1 flex items-center justify-center relative z-10 p-6">
          <div className="glass-card-bright rounded-3xl p-10 w-full max-w-md text-center" style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(74, 222, 128, 0.1)', border: '2px solid rgba(74, 222, 128, 0.3)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--pi-success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Request Submitted</h2>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>Your passphrase has been sent for admin approval.</p>
            <div className="rounded-xl p-4 mt-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Your passphrase:</p>
              <p className="font-mono text-lg font-bold" style={{ color: 'var(--gold-400)' }}>{passphrase}</p>
            </div>
            <button onClick={() => { setMode('login'); setSubmitted(false); setPassphrase(''); setMessage(''); }}
              className="btn-gold w-full mt-6 h-12 text-sm font-600">Back to Sign In</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: 'var(--navy-950)' }}>
      <AtmosphericBackground />

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative z-10 p-12 xl:p-16">
        <div className="flex items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <PiLogo size={44} />
          <div>
            <span className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              PiSecure<span style={{ color: 'var(--gold-500)' }}>2FA</span>
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--pi-success)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--pi-success)' }}>Passphrase Authentication Active</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(240, 165, 0, 0.1)', border: '1px solid rgba(240, 165, 0, 0.25)' }}>
              <Shield size={13} style={{ color: 'var(--gold-500)' }} />
              <span className="text-xs font-600" style={{ color: 'var(--gold-400)' }}>Secure Passphrase Authentication</span>
            </div>
            <h1 className="font-display text-5xl xl:text-6xl font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
              Secure access with{' '}
              <span style={{ background: 'linear-gradient(135deg, #F0A500, #FFD166)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your passphrase</span>.
            </h1>
            <p className="text-lg leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
              Submit a passphrase request, get approved by an admin, and securely access your dashboard.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 bento-card">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold" style={{ background: 'rgba(240, 165, 0, 0.15)', color: 'var(--gold-500)' }}>P</div>
              <div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>"PiSecure2FA gave me peace of mind during the entire KYC process."</p>
                <span className="text-xs font-600 mt-2 block" style={{ color: 'var(--text-primary)' }}>Pi Pioneer</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2"><Shield size={13} style={{ color: 'var(--text-muted)' }} /><span className="text-xs" style={{ color: 'var(--text-muted)' }}>Supabase Secured</span></div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-6 lg:p-12">
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <PiLogo size={36} />
          <span className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>PiSecure<span style={{ color: 'var(--gold-500)' }}>2FA</span></span>
        </div>

        <div className="w-full max-w-md opacity-0 animate-scale-in delay-200" style={{ animationFillMode: 'forwards' }}>
          <div className="glass-card-bright rounded-3xl p-8 xl:p-10" style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
            {/* Mode Toggle */}
            <div className="flex rounded-2xl p-1 mb-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <button onClick={() => { setMode('login'); setError(''); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-600 transition-all"
                style={{ background: mode === 'login' ? 'var(--gold-500)' : 'transparent', color: mode === 'login' ? '#060D1F' : 'var(--text-muted)' }}>
                <KeyRound size={14} /> Sign In
              </button>
              <button onClick={() => { setMode('request'); setError(''); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-600 transition-all"
                style={{ background: mode === 'request' ? 'rgba(240,165,0,0.15)' : 'transparent', color: mode === 'request' ? 'var(--gold-400)' : 'var(--text-muted)', border: mode === 'request' ? '1px solid rgba(240,165,0,0.25)' : '1px solid transparent' }}>
                <FileText size={14} /> Request
              </button>
            </div>

            <div className="mb-6 text-center">
              <h2 className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {mode === 'login' ? 'Sign in with passphrase' : 'Request Access'}
              </h2>
              <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                {mode === 'login' ? 'Enter the passphrase you submitted for approval' : 'Create a passphrase for admin approval'}
              </p>
            </div>

            <form onSubmit={mode === 'login' ? handleLogin : handleRequest} noValidate className="space-y-5">
              {/* Passphrase Input */}
              <div>
                <label className="block text-sm font-500 mb-2" style={{ color: 'var(--text-secondary)' }}>Passphrase</label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input type={showPassphrase ? 'text' : 'password'} value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder={mode === 'login' ? 'Enter your passphrase' : 'Create a passphrase'}
                    className="field-input pl-11 pr-11" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
                  <button type="button" onClick={() => setShowPassphrase(!showPassphrase)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
                    style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                    {showPassphrase ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Message Input (only for request mode) */}
              {mode === 'request' && (
                <div>
                  <label className="block text-sm font-500 mb-2" style={{ color: 'var(--text-secondary)' }}>Message (optional)</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="Why do you need access?" rows={3}
                    className="field-input resize-none"
                    style={{ minHeight: '80px' }} />
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl p-3.5" style={{ background: 'rgba(255, 90, 110, 0.08)', border: '1px solid rgba(255,90,110,0.2)' }}>
                  <AlertCircle size={15} style={{ color: 'var(--pi-danger)', flexShrink: 0, marginTop: 1 }} />
                  <p className="text-sm" style={{ color: 'var(--pi-danger)' }}>{error}</p>
                </div>
              )}

              <button ref={btnRef} type="submit" disabled={isLoading}
                className="btn-gold w-full h-14 flex items-center justify-center gap-2.5"
                onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                {isLoading ? (
                  <><div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(6,13,31,0.3)', borderTopColor: '#060D1F' }} /><span>Processing...</span></>
                ) : (
                  <><span>{mode === 'login' ? 'Access Dashboard' : 'Submit Request'}</span><ChevronRight size={18} /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Protected by PiSecure2FA</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
              {mode === 'login' ? "Don't have a passphrase?" : "Already have access?"}{' '}
              <button onClick={() => { setMode(mode === 'login' ? 'request' : 'login'); setError(''); }}
                className="font-600 transition-opacity hover:opacity-80" style={{ color: 'var(--gold-500)' }}>
                {mode === 'login' ? 'Request Access' : 'Sign In'}
              </button>
            </p>
          </div>

          <p className="text-center text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}