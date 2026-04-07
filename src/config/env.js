/**
 * src/config/env.js
 *
 * Single source of truth for every environment variable the app reads.
 *
 * WHY THIS FILE EXISTS:
 *   Without it, `import.meta.env.VITE_*` calls are sprinkled across the
 *   codebase. When a variable name changes, or a new environment is added,
 *   you have to grep for every call site. This file centralises that access:
 *   one place to read, validate, document, and fall back.
 *
 * ADDING A NEW VARIABLE:
 *   1. Add `VITE_MY_VAR=value` to .env (committed default) or .env.local
 *      (personal / secret override).
 *   2. Export a named constant from this file:
 *        export const MY_VAR = import.meta.env.VITE_MY_VAR ?? 'default';
 *   3. Import that constant wherever you need it — never call
 *      import.meta.env directly from feature code.
 */

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

/**
 * Base URL of the Spring Boot backend (no trailing slash).
 *
 * Set VITE_API_URL in your environment:
 *   Local dev   → .env already defaults to http://localhost:8080
 *   Docker      → http://backend:8080  (docker-compose service name)
 *   Production  → https://api.yourdomain.com  (CI/CD secret / OS env var)
 *
 * In CI/CD (GitHub Actions example):
 *   env:
 *     VITE_API_URL: ${{ secrets.PROD_API_URL }}
 *   run: npm run build
 */

const url = import.meta.env.VITE_API_URL;

if (!url) {
  throw new Error(
    "[env] VITE_API_URL is not set. Check your .env or CI environment.",
  );
}

export const API_BASE_URL = url;
