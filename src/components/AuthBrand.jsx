/**
 * src/components/AuthBrand.jsx
 *
 * Left panel shown on all auth pages (Login, Register, ForgotPassword).
 * Displays the app logo, name, and tagline.
 *
 * This is a pure presentational component — no props, no state, no side effects.
 * To update the branding, edit this file only. The SVG logo is inline to avoid
 * an extra network request on the auth pages.
 */

import React from 'react';

export default function AuthBrand() {
  return (
    <div className="auth-brand">
      <div className="auth-brand-inner">
        <svg className="auth-brand-svg" width="96" height="96" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 44 L32 16 L52 44" fill="none" stroke="white" strokeWidth="4" strokeLinejoin="round" />
          <circle cx="32" cy="16" r="6" fill="white" />
          <circle cx="12" cy="44" r="6" fill="white" />
          <circle cx="52" cy="44" r="6" fill="white" />
          <line x1="8" y1="56" x2="56" y2="56" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <line x1="32" y1="22" x2="32" y2="56" stroke="white" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <h2>Quantity Measurement</h2>
        <p>Precision, Simplified.</p>
      </div>
    </div>
  );
}
