/**
 * src/pages/RegisterPage.jsx
 *
 * New user registration form.
 *
 * FORM FIELDS: Full Name, Email, Password, Confirm Password
 *
 * VALIDATION (client-side):
 *   - Password strength is shown in real-time via a strength bar.
 *   - On submit: passwords must match and satisfy PASSWORD_PATTERN.
 *   - Server-side validation is the source of truth; any backend error is
 *     surfaced via toast.
 *
 * OAUTH2:
 *   The Google/GitHub buttons are plain <a> tags — they navigate the browser
 *   to the Spring Security OAuth2 authorization endpoint, which redirects
 *   back to /oauth2/callback with a token on success.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthBrand from '../components/AuthBrand';
import PasswordInput from '../components/PasswordInput';
import { register, API_BASE } from '../api/client';
import { useToast } from '../context/ToastContext';
import { isValidPassword, PASSWORD_HINT } from '../utils/validation';

// ── Password strength helper ─────────────────────────────────────────────────

/*
 * Returns a { w (width%), c (colour), t (label) } object based on how many
 * strength criteria the password satisfies. Used to drive the strength bar UI.
 */
function getStrength(val) {
  if (!val) return { w: '0%', c: '#E2E8F0', t: '' };
  let score = 0;
  if (val.length >= 8)          score++;
  if (/[A-Z]/.test(val))        score++;
  if (/[0-9]/.test(val))        score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  if (val.length >= 12)         score++;  // bonus for extra length
  const levels = [
    { w: '0%',   c: '#E2E8F0', t: '' },
    { w: '25%',  c: '#EF4444', t: 'Weak' },
    { w: '50%',  c: '#F59E0B', t: 'Fair' },
    { w: '75%',  c: '#10B981', t: 'Strong' },
    { w: '100%', c: '#059669', t: 'Very Strong' },
  ];
  return levels[Math.min(score, 4)];
}

// ── OAuth2 brand icons ────────────────────────────────────────────────────────
// These are inline SVGs to avoid an icon-library dependency.

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#1E293B" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast    = useToast();

  const strength = getStrength(password);
  const mismatch = confirm.length > 0 && password !== confirm;

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      toast.show('Passwords do not match.', 'error');
      return;
    }
    // isValidPassword imported from shared utils — no more duplicated regex
    if (!isValidPassword(password)) {
      toast.show(PASSWORD_HINT, 'error');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.show('Account created! Redirecting…', 'success');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      toast.show(err.message, 'error');
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <AuthBrand />
        <div className="auth-form-panel">
          <div className="auth-tabs">
            <button className="auth-tab" onClick={() => navigate('/login')}>Login</button>
            <button className="auth-tab active">Sign Up</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="field-label" htmlFor="reg-name">Full Name</label>
              <input className="field-input" type="text" id="reg-name" placeholder="e.g. John Doe"
                autoComplete="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="field-label" htmlFor="reg-email">Email Address</label>
              <input className="field-input" type="email" id="reg-email" placeholder="name@example.com"
                autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="field-label" htmlFor="reg-pass">Password</label>
              <PasswordInput id="reg-pass" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
              {/* Strength bar: width and colour driven by getStrength() */}
              <div className="strength-track">
                <div className="strength-fill" style={{ width: strength.w, backgroundColor: strength.c }} />
              </div>
              <div className="strength-label" style={{ color: strength.c }}>{strength.t}</div>
            </div>
            <div>
              <label className="field-label" htmlFor="reg-confirm">Confirm Password</label>
              <PasswordInput id="reg-confirm" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" />
              {mismatch && <div className="field-error visible">Passwords do not match</div>}
            </div>
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          {/*
           * OAuth2 sign-up: these links go to the Spring Security OAuth2
           * authorization endpoint. On success, the backend redirects to
           * /oauth2/callback?token=... which OAuth2CallbackPage handles.
           * API_BASE is imported from src/api/client.js which reads it from src/config/env.js.
           */}
          <div className="social-grid">
            <a className="btn-social" href={`${API_BASE}/oauth2/authorization/google`}><GoogleIcon /> Google</a>
            <a className="btn-social" href={`${API_BASE}/oauth2/authorization/github`}><GitHubIcon /> GitHub</a>
          </div>

          <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
