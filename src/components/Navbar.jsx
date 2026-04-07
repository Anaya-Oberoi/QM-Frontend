import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!profile;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const firstName = profile?.name?.split(' ')[0] || '';

  return (
    <nav className="main-navbar">
      <NavLink className="nav-brand" to="/dashboard">
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path d="M12 2 L3 20 L21 20 Z" />
          <circle cx="12" cy="2" r="1.5" fill="currentColor" />
          <circle cx="3" cy="20" r="1.5" fill="currentColor" />
          <circle cx="21" cy="20" r="1.5" fill="currentColor" />
          <line x1="12" y1="3.5" x2="12" y2="20" strokeWidth="2" />
        </svg>
        Quantity Measurement
      </NavLink>

      <ul className="nav-links">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/measure" className={({ isActive }) => isActive ? 'active' : ''}>
            Measure
          </NavLink>
        </li>
        {isLoggedIn && (
          <>
            <li>
              <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>
                History
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                Profile
              </NavLink>
            </li>
          </>
        )}
      </ul>

      <div className="nav-right">
        {isLoggedIn ? (
          <>
            <button className="nav-user-btn" onClick={() => navigate('/profile')}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{firstName}</span>
            </button>
            <button className="nav-logout-btn" onClick={handleLogout}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="nav-user-btn" onClick={() => navigate('/login')}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Login</span>
            </button>
            <button className="nav-signup-btn" onClick={() => navigate('/register')}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
