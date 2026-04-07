/**
 * src/context/ToastContext.jsx
 *
 * Global notification (toast) system.
 *
 * USAGE:
 *   Any component can call useToast().show(message, type, duration) to display
 *   a notification. No prop drilling required — the provider sits at the top of
 *   the tree in App.jsx.
 *
 *   import { useToast } from '../context/ToastContext';
 *   const toast = useToast();
 *   toast.show('Saved!', 'success');
 *   toast.show('Something went wrong.', 'error');
 *   toast.show('FYI: your session expires soon.', 'info', 8000);
 *
 * TOAST TYPES:
 *   'success' — green, checkmark icon
 *   'error'   — red, X icon
 *   'info'    — neutral, info icon (default)
 *
 * AUTO-DISMISS:
 *   Toasts dismiss automatically after `duration` ms (default 4000).
 *   Pass duration=0 to keep a toast on screen until the user closes it.
 *
 * ID GENERATION:
 *   A module-level counter (idCounter) generates unique IDs. This is safe
 *   because the counter only resets on a full page reload, and toast IDs
 *   only need to be unique within a single session.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /** Remove a toast by its ID. */
  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  /**
   * Display a toast notification.
   *
   * @param {string} message  - Text to display.
   * @param {'success'|'error'|'info'} [type='info'] - Visual style.
   * @param {number} [duration=4000] - Auto-dismiss delay in ms. 0 = never.
   */
  const show = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++idCounter;
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

/**
 * Hook to access the toast system from any component.
 * Returns { show } — call show() to fire a toast.
 */
export function useToast() {
  return useContext(ToastContext);
}

// ── Internal icon helper ─────────────────────────────────────────────────────

/** Returns the appropriate SVG icon for a given toast type. */
function iconSvg(type) {
  if (type === 'success')
    return (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  if (type === 'error')
    return (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    );
  // default: 'info'
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ── Internal container component ─────────────────────────────────────────────

/**
 * Renders all active toasts. Positioned fixed via CSS class 'toast-container'.
 * This component is intentionally kept private to this file — external code
 * should only interact via useToast().show().
 */
function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{iconSvg(t.type)}</span>
          <span className="toast-msg">{t.message}</span>
          <span className="toast-close" onClick={() => onDismiss(t.id)}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        </div>
      ))}
    </div>
  );
}
