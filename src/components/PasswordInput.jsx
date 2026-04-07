/**
 * src/components/PasswordInput.jsx
 *
 * A controlled password input with a show/hide toggle button.
 *
 * PROPS:
 *   All standard <input> props are forwarded (id, value, onChange, autoComplete, etc.).
 *   The `type` prop is managed internally and should NOT be passed by the caller.
 *
 * USAGE:
 *   <PasswordInput
 *     id="my-pass"
 *     value={password}
 *     onChange={e => setPassword(e.target.value)}
 *     autoComplete="current-password"
 *   />
 */

import React, { useState } from 'react';

const EyeOpen = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosed = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function PasswordInput({ id, placeholder, value, onChange, className = 'field-input', autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="pw-wrapper">
      <input
        id={id}
        className={className}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder || '••••••••'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required
      />
      <button type="button" className="pw-eye" onClick={() => setVisible(v => !v)} aria-label="Toggle password">
        {visible ? <EyeClosed /> : <EyeOpen />}
      </button>
    </div>
  );
}
