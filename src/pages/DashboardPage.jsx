import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { operationCount } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { profile } = useAuth();
  const navigate    = useNavigate();
  const isLoggedIn  = !!profile;

  const [stats, setStats] = useState({ convert: '—', compare: '—', arithmetic: '—' });

  useEffect(() => {
    if (!isLoggedIn) return;

    async function load() {
      async function fetchCount(op) {
        try { return await operationCount(op); }
        catch { return null; }
      }
      const [convert, compare, add, subtract, divide] = await Promise.all([
        fetchCount('convert'), fetchCount('compare'),
        fetchCount('add'), fetchCount('subtract'), fetchCount('divide'),
      ]);
      const arith = (add ?? 0) + (subtract ?? 0) + (divide ?? 0);
      setStats({ convert: convert ?? '—', compare: compare ?? '—', arithmetic: arith });
    }
    load();
  }, [isLoggedIn]);

  const firstName = profile?.name?.split(' ')[0] || '';

  return (
    <>
      <Navbar />
      <main className="dashboard-page">

        <div className="dash-header">
          <h1>{isLoggedIn ? `Welcome Back, ${firstName}!` : 'Welcome to Quantity Measurement!'}</h1>
          <p>{isLoggedIn
            ? "Here's a snapshot of your measurement activity."
            : 'Compare, convert, and calculate quantities with precision. Log in to track your history.'
          }</p>
        </div>

        {/* Stats cards — only for logged-in users */}
        {isLoggedIn && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ color: '#3B82F6', background: '#DBEAFE' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="16 3 20 7 16 11" /><line x1="4" y1="7" x2="20" y2="7" />
                  <polyline points="8 21 4 17 8 13" /><line x1="20" y1="17" x2="4" y2="17" />
                </svg>
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Conversions</p>
                <h2 className="stat-value">{stats.convert}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ color: '#F59E0B', background: '#FEF3C7' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Comparisons</p>
                <h2 className="stat-value">{stats.compare}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ color: '#10B981', background: '#D1FAE5' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Arithmetic</p>
                <h2 className="stat-value">{stats.arithmetic}</h2>
              </div>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <h2 className="dash-section-title">Quick Actions</h2>
        <div className="quick-actions-grid">

          <div className="qa-card">
            <div className="qa-icon" style={{ background: '#DBEAFE', color: '#3B82F6' }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h3>Measurement Calculator</h3>
            <p>Compare, convert, and perform arithmetic on lengths, weights, temperatures, and volumes.</p>
            <button className="btn-qa btn-qa-primary" onClick={() => navigate('/measure')}>
              Open Calculator
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>

          {isLoggedIn ? (
            <div className="qa-card">
              <div className="qa-icon" style={{ background: '#FEF3C7', color: '#F59E0B' }}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h3>Measurement History</h3>
              <p>Review all past calculations. Filter by operation type or measurement category.</p>
              <button className="btn-qa btn-qa-outline" onClick={() => navigate('/history')}>
                View History
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          ) : (
            <div className="qa-card">
              <div className="qa-icon" style={{ background: '#FEF3C7', color: '#F59E0B' }}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h3>Track Your History</h3>
              <p>Log in to save your calculations and review them anytime with powerful filters.</p>
              <button className="btn-qa btn-qa-outline" onClick={() => navigate('/login')}>
                Login to Track
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          )}

          <div className="qa-card">
            <div className="qa-icon" style={{ background: '#EDE9FE', color: '#7C3AED' }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3>{isLoggedIn ? 'Your Profile' : 'Create Account'}</h3>
            <p>{isLoggedIn
              ? 'Update your display name and change your password to keep your account secure.'
              : 'Sign up to save your measurement history and access your profile.'
            }</p>
            <button className="btn-qa btn-qa-outline" onClick={() => navigate(isLoggedIn ? '/profile' : '/register')}>
              {isLoggedIn ? 'Go to Profile' : 'Sign Up'}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>

        </div>
      </main>
    </>
  );
}
