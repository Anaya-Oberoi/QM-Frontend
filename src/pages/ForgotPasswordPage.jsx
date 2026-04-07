import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthBrand from '../components/AuthBrand';
import PasswordInput from '../components/PasswordInput';
import { sendOtp, verifyOtp, forgotPassword } from '../api/client';
import { useToast } from '../context/ToastContext';
import { isValidPassword, isValidEmail, PASSWORD_HINT } from '../utils/validation';

export default function ForgotPasswordPage() {
  const [step, setStep]         = useState(1);
  const [email, setEmail]       = useState('');
  const [otp, setOtp]           = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const toast    = useToast();
  const navigate = useNavigate();

  // ── STEP 1: Send OTP (real backend call) ──
  async function handleSendOTP() {
    if (!isValidEmail(email)) {
      toast.show('Please enter a valid email address.', 'error');
      return;
    }
    setLoading(true);
    try {
      await sendOtp(email);
      toast.show('Verification code sent to your email!', 'success');
      setStep(2);
    } catch (err) {
      toast.show(err.message || 'Failed to send verification code.', 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 2: Verify OTP (real backend call) ──
  async function handleVerifyOTP() {
    if (!otp || otp.length < 4) {
      toast.show('Please enter the verification code.', 'error');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      toast.show('Code verified! Set your new password.', 'success');
      setStep(3);
    } catch (err) {
      toast.show(err.message || 'Invalid verification code.', 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 3: Set New Password ──
  async function handleResetPassword() {
    if (!password) {
      toast.show('Please enter a new password.', 'error');
      return;
    }
    if (password !== confirm) {
      toast.show('Passwords do not match.', 'error');
      return;
    }
    if (!isValidPassword(password)) {
      toast.show(PASSWORD_HINT, 'error');
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email, password);
      toast.show('Password reset! Please log in.', 'success');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      toast.show(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <AuthBrand />
        <div className="auth-form-panel">

          <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
            {step === 1 ? 'Forgot Password' : step === 2 ? 'Enter Code' : 'New Password'}
          </h2>

          {/* Step 1 */}
          {step === 1 && (
            <div className="auth-form">
              <div>
                <label className="field-label" htmlFor="fp-email">Email Address</label>
                <input className="field-input" type="email" id="fp-email" placeholder="name@example.com"
                  autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button className="btn-auth" onClick={handleSendOTP} disabled={loading}>
                {loading ? 'Sending…' : 'Send Verification Code'}
              </button>
              <p className="auth-footer"><Link to="/login">← Back to Login</Link></p>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="auth-form">
              <p style={{ fontSize: '.9rem', color: 'var(--text-muted)', marginBottom: '.5rem' }}>
                Enter the 6-digit code sent to <strong>{email}</strong>.
              </p>
              <div>
                <label className="field-label" htmlFor="fp-otp">Verification Code</label>
                <input className="field-input" type="text" id="fp-otp" placeholder="123456"
                  inputMode="numeric" maxLength={6} value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} />
              </div>
              <button className="btn-auth" onClick={handleVerifyOTP} disabled={loading}>
                {loading ? 'Verifying…' : 'Verify Code'}
              </button>
              <p className="auth-footer">
                <button className="forgot-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => { setOtp(''); handleSendOTP(); }}>
                  Resend code
                </button>
              </p>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="auth-form">
              <div>
                <label className="field-label" htmlFor="fp-pass">New Password</label>
                <PasswordInput id="fp-pass" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
              </div>
              <div>
                <label className="field-label" htmlFor="fp-confirm">Confirm Password</label>
                <PasswordInput id="fp-confirm" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" />
                {confirm.length > 0 && password !== confirm && (
                  <div className="field-error visible">Passwords do not match</div>
                )}
              </div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{PASSWORD_HINT}</div>
              <button className="btn-auth" onClick={handleResetPassword} disabled={loading}>
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
