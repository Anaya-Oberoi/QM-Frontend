/**
 * src/pages/ProfilePage.jsx
 *
 * Displays the current user's profile (name, email, role) and provides
 * a form to change their password.
 *
 * DATA FLOW:
 *   - Profile is fetched from /auth/me on mount.
 *   - Password change calls PUT /auth/resetPassword/:email with the current
 *     and new passwords as query parameters.
 *
 * NOTE — Name editing is not implemented.
 *   The profile header shows the user's name but there is no edit field.
 *   To add name editing, you would need a PUT /auth/updateProfile endpoint
 *   and call refreshProfile() from AuthContext after a successful update
 *   so the Navbar reflects the new name.
 */

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PasswordInput from '../components/PasswordInput';
import { getProfile, resetPassword } from '../api/client';
import { useToast } from '../context/ToastContext';
import { isValidPassword, PASSWORD_HINT } from '../utils/validation';

export default function ProfilePage() {
  const [profile, setProfile]   = useState(null);
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass]   = useState('');
  const [loading, setLoading]   = useState(false);
  const toast = useToast();

  // Fetch profile on mount — separate from AuthContext so ProfilePage always
  // has fresh data even if the user edits their name in another tab.
  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(err => toast.show('Could not load profile: ' + err.message, 'error'));
  }, [toast]);

  async function handleSubmit(e) {
    e.preventDefault();
    // isValidPassword from shared utils — keeps password rules in one place
    if (!isValidPassword(newPass)) {
      toast.show(PASSWORD_HINT, 'error');
      return;
    }
    if (!profile?.email) {
      toast.show('Could not determine your email. Please refresh.', 'error');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(profile.email, currPass, newPass);
      toast.show('Password updated successfully!', 'success');
      // Clear form so the user doesn't accidentally resubmit
      setCurrPass('');
      setNewPass('');
    } catch (err) {
      toast.show(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  // Show the first letter of the name as an avatar placeholder
  const avatarLetter = (profile?.name || 'U').charAt(0).toUpperCase();

  return (
    <>
      <Navbar />
      <main className="profile-page">
        <div className="profile-card">

          {/* ── Profile header ── */}
          <div className="profile-header">
            <div className="profile-avatar">{avatarLetter}</div>
            <div className="profile-info">
              <h2>{profile?.name   || 'Loading…'}</h2>
              <p> {profile?.email  || 'Fetching from server…'}</p>
              {/* role defaults to 'USER' — matches backend default */}
              <div className="profile-role">{profile?.role || 'USER'}</div>
            </div>
          </div>

          <hr className="profile-divider" />

          {/* ── Change password form ── */}
          <h3 className="profile-section-title">Change Password</h3>
          <p className="profile-section-desc">You must provide your current password to set a new one.</p>

          <form className="profile-form" onSubmit={handleSubmit} noValidate>
            <div className="profile-field">
              <label htmlFor="curr-pass">Current Password</label>
              <PasswordInput
                id="curr-pass"
                className="field-input"
                value={currPass}
                onChange={e => setCurrPass(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="profile-field">
              <label htmlFor="new-pass">New Password</label>
              <PasswordInput
                id="new-pass"
                className="field-input"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                autoComplete="new-password"
              />
              {/* PASSWORD_HINT from shared utils — stays in sync with validation rules */}
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.35rem' }}>
                {PASSWORD_HINT}
              </div>
            </div>
            <button type="submit" className="btn-update" disabled={loading}>
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>

        </div>
      </main>
    </>
  );
}
