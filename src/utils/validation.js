/**
 * src/utils/validation.js
 *
 * Shared validation helpers used across multiple pages.
 *
 * WHY THIS FILE EXISTS:
 *   The PASSWORD_PATTERN regex was copy-pasted into RegisterPage, ProfilePage,
 *   and ForgotPasswordPage. Duplicated logic is a bug waiting to happen — if
 *   the backend changes its password rules, you'd need to update 3 files.
 *   Centralise here so there is one source of truth.
 */

/**
 * Password strength requirements (must match backend validation rules).
 *
 * Rules:
 *   - At least 8 characters
 *   - At least one uppercase letter (A-Z)
 *   - At least one digit (0-9)
 *   - At least one special character from: @#$%^&*()+−=
 *
 * If backend rules change, update ONLY this regex and the error message below.
 */
export const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[@#$%^&*()+\-=])(?=.*[0-9]).{8,}$/;

/**
 * Human-readable description of the password rules.
 * Display this in error toasts and hint text so users know what's required.
 */
export const PASSWORD_HINT =
  'Password must be 8+ characters with at least 1 uppercase letter, 1 number, and 1 special character (@#$%^&*()+−=).';

/**
 * Returns true if the given password satisfies PASSWORD_PATTERN.
 *
 * @param {string} password
 * @returns {boolean}
 */
export function isValidPassword(password) {
  return PASSWORD_PATTERN.test(password);
}

/**
 * Loosely validates an email address (same check used in ForgotPasswordPage).
 * For strict validation, rely on the browser's type="email" or the backend.
 *
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return Boolean(email) && /\S+@\S+\.\S+/.test(email);
}
