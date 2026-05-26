'use client';

import React, { useState } from 'react';
import { Shield, Smartphone, CheckCircle, Key, Users, RefreshCw, LogIn, Filter } from 'lucide-react';

// BACKEND INTEGRATION POINT: Fetch from Supabase activity_logs table with user_id filter
const allLogs = [
  { id: 'log-001', type: 'login', icon: LogIn, message: 'Successful login', detail: 'Chrome · macOS · San Francisco', time: '07:14 UTC', status: 'success' },
  { id: 'log-002', type: 'otp', icon: Shield, message: 'OTP verified (SMS)', detail: '+1 (•••) •••-4821', time: '07:15 UTC', status: 'success' },
  { id: 'log-003', type: 'kyc', icon: CheckCircle, message: 'KYC document uploaded', detail: 'Passport · 2.3MB', time: '06:42 UTC', status: 'success' },
  { id: 'log-004', type: 'security', icon: Users, message: 'Security Circle member added', detail: 'Priya Nair joined circle', time: '2026-04-10 22:11 UTC', status: 'success' },
  { id: 'log-005', type: 'migration', icon: RefreshCw, message: 'Migration Phase 2 started', detail: 'Identity lock initiated', time: '2026-04-10 18:30 UTC', status: 'info' },
  { id: 'log-006', type: 'login', icon: LogIn, message: 'Failed login attempt', detail: 'Unknown device · Berlin, DE', time: '2026-04-10 14:22 UTC', status: 'danger' },
  { id: 'log-007', type: 'otp', icon: Key, message: 'OTP resent (email)', detail: 'a•••n@pinetwork.io', time: '2026-04-10 14:20 UTC', status: 'warning' },
  { id: 'log-008', type: 'security', icon: Shield, message: 'Password changed', detail: 'Via account settings', time: '2026-04-09 11:05 UTC', status: 'info' },
  { id: 'log-009', type: 'kyc', icon: CheckCircle, message: 'KYC review started', detail: 'Automated scan initiated', time: '2026-04-09 09:30 UTC', status: 'info' },
  { id: 'log-010', type: 'migration', icon: RefreshCw, message: 'Migration Phase 1 completed', detail: 'Wallet sync confirmed', time: '2026-04-08 16:45 UTC', status: 'success' },
  { id: 'log-011', type: 'security', icon: Smartphone, message: 'New device registered', detail: 'Pi Browser · iPhone 15 Pro', time: '2026-04-07 08:20 UTC', status: 'warning' },
  { id: 'log-012', type: 'login', icon: LogIn, message: 'Successful login', detail: 'Pi Browser · iOS · San Francisco', time: '2026-04-06 19:03 UTC', status: 'success' },
];

const filterTypes = [
  { key: 'all', label: 'All' },
  { key: 'login', label: 'Login' },
  { key: 'otp', label: 'OTP' },
  { key: 'kyc', label: 'KYC' },
  { key: 'security', label: 'Security' },
  { key: 'migration', label: 'Migration' },
];

const statusStyle: Record<string, string> = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
};

const statusColors: Record<string, string> = {
  success: 'var(--pi-success)',
  warning: 'var(--pi-warning)',
  danger: 'var(--pi-danger)',
  info: 'var(--pi-info)',
};

export default function ActivityLog() {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = filter === 'all' ? allLogs : allLogs.filter((l) => l.type === filter);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div
      className="glass-card rounded-3xl p-6 bento-card h-full flex flex-col"
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-600" style={{ color: 'var(--text-primary)' }}>
          Activity Log
        </h3>
        <div className="flex items-center gap-1.5">
          <Filter size={12} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Filter</span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {filterTypes.map((f) => (
          <button
            key={`filter-${f.key}`}
            onClick={() => { setFilter(f.key); setPage(1); }}
            className="px-2.5 py-1 rounded-lg text-xs font-600 transition-all"
            style={{
              background: filter === f.key ? 'rgba(240,165,0,0.12)' : 'rgba(255,255,255,0.04)',
              color: filter === f.key ? 'var(--gold-400)' : 'var(--text-muted)',
              border: filter === f.key ? '1px solid rgba(240,165,0,0.25)' : '1px solid transparent',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Log entries */}
      <div className="flex-1 space-y-1 overflow-hidden">
        {paged.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32">
            <Shield size={24} style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              No {filter} events recorded
            </p>
          </div>
        ) : (
          paged.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 px-3 py-2.5 rounded-xl table-row-hover cursor-default"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: `${statusColors[log.status]}18`,
                  border: `1px solid ${statusColors[log.status]}30`,
                }}
              >
                <log.icon size={13} style={{ color: statusColors[log.status] }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-600 truncate" style={{ color: 'var(--text-primary)' }}>
                    {log.message}
                  </p>
                  <span className={`badge ${statusStyle[log.status]} flex-shrink-0`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                    {log.status}
                  </span>
                </div>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                  {log.detail}
                </p>
                <p className="text-xs mt-0.5 tabular-nums" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                  {log.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} events
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={`page-${i + 1}`}
                onClick={() => setPage(i + 1)}
                className="w-6 h-6 rounded-lg text-xs font-600 transition-all"
                style={{
                  background: page === i + 1 ? 'rgba(240,165,0,0.15)' : 'rgba(255,255,255,0.04)',
                  color: page === i + 1 ? 'var(--gold-400)' : 'var(--text-muted)',
                  border: page === i + 1 ? '1px solid rgba(240,165,0,0.25)' : '1px solid transparent',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}