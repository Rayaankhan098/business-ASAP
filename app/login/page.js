'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = searchParams.get('from') || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push(from);
        router.refresh();
      } else {
        setError(data.message || 'Incorrect password.');
        setPassword('');
      }
    } catch (_) {
      setError('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: 'var(--bg2)',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--r2)',
        padding: '40px 36px',
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: 'var(--font-head)',
          fontSize: '20px',
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: '8px',
        }}>
          business-ASAP<span style={{ color: 'var(--accent)' }}>.</span>
        </div>
        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginBottom: '32px',
        }}>
          Admin Access
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--muted)',
              marginBottom: '8px',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              required
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: `0.5px solid ${error ? 'rgba(255,106,61,0.6)' : 'var(--border2)'}`,
                borderRadius: 'var(--r)',
                color: 'var(--text)',
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                padding: '12px 16px',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div style={{
              fontSize: '13px',
              color: '#ff6a3d',
              marginBottom: '16px',
              padding: '10px 14px',
              background: 'rgba(255,106,61,0.08)',
              borderRadius: '10px',
              border: '0.5px solid rgba(255,106,61,0.2)',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="btn-primary"
            style={{
              width: '100%',
              textAlign: 'center',
              opacity: loading || !password ? 0.6 : 1,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
