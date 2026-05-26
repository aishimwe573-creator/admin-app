'use client';

export default function ActivityLog() {
  const activities = [
    {
      id: 1,
      title: 'Login successful',
      time: '2 minutes ago',
      status: 'success',
    },
    {
      id: 2,
      title: 'Two-factor authentication verified',
      time: '10 minutes ago',
      status: 'verified',
    },
    {
      id: 3,
      title: 'New session started',
      time: '30 minutes ago',
      status: 'info',
    },
    {
      id: 4,
      title: 'Password updated',
      time: '1 day ago',
      status: 'warning',
    },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 bento-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Activity Log
          </h2>

          <p
            className="text-sm mt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            Recent account activities
          </p>
        </div>

        <div
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(240,165,0,0.1)',
            color: 'var(--gold-400)',
            border: '1px solid rgba(240,165,0,0.2)',
          }}
        >
          Live
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="rounded-2xl p-4 transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background:
                      activity.status === 'success'
                        ? '#22C55E'
                        : activity.status === 'verified'
                        ? '#3B82F6'
                        : activity.status === 'warning'
                        ? '#F59E0B'
                        : '#A855F7',
                  }}
                />

                <div>
                  <h3
                    className="font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {activity.title}
                  </h3>

                  <p
                    className="text-xs mt-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {activity.time}
                  </p>
                </div>
              </div>

              <button
                className="text-xs px-3 py-1 rounded-lg transition"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--text-secondary)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}