/**
 * src/context/AuthContext.jsx
 *
 * React Context that holds the authenticated user's profile and exposes
 * auth-related actions (logout, refreshProfile) to the entire component tree.
 *
 * HOW IT WORKS:
 *   On mount, if a JWT is found in localStorage, we immediately fetch
 *   /auth/me to validate it and load the user profile into state.
 *   While this fetch is in progress, `loading` is true — ProtectedRoute
 *   should wait for loading to be false before rendering or redirecting.
 *
 * STATE:
 *   profile  {object|null}  — The user object from /auth/me, or null if not
 *                             logged in.
 *   loading  {boolean}      — True while the initial token validation is
 *                             in progress. Check this before redirecting to
 *                             avoid a flash of the login page.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, clearToken, getProfile } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);

  /*
   * `loading` starts true so ProtectedRoute does not flash the login page
   * before we know whether a stored token is still valid.
   */
  const [loading, setLoading] = useState(true);

  /*
   * On first render: validate the stored token by calling /auth/me.
   *
   * BUG FIXED — previously the catch was empty (`catch(() => {})`).
   * If the token was expired or revoked the API would fail, but the token
   * would remain in localStorage. The user would appear "logged in" to
   * ProtectedRoute (which only checks for token presence) but every API
   * call would silently fail with 401.
   *
   * Fix: clear the token on /auth/me failure so the user is sent back to login.
   */
  useEffect(() => {
    if (getToken()) {
      getProfile()
        .then((p) => setProfile(p))
        .catch(() => {
          // Token exists but is invalid/expired — remove it so the user
          // is redirected to login rather than stuck in a broken state.
          clearToken();
        })
        .finally(() => setLoading(false));
    } else {
      // No token stored — skip the network call and unblock rendering.
      setLoading(false);
    }
  }, []);

  /**
   * Log out the current user.
   * Removes the JWT from localStorage and clears profile state.
   * Call navigate('/login') after this in the component.
   */
  function logout() {
    clearToken();
    setProfile(null);
  }

  /**
   * Re-fetch /auth/me and update the profile in context.
   * Useful after the user changes their name or email in ProfilePage.
   *
   * @returns {Promise<object>} The updated profile
   */
  function refreshProfile() {
    return getProfile().then((p) => {
      setProfile(p);
      return p;
    });
  }

  return (
    <AuthContext.Provider value={{ profile, loading, logout, refreshProfile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth state and actions anywhere in the app.
 *
 * Usage:
 *   const { profile, loading, logout, refreshProfile } = useAuth();
 */
export function useAuth() {
  return useContext(AuthContext);
}
