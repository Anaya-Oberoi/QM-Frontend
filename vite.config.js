/**
 * vite.config.js
 *
 * Vite build tool configuration.
 *
 * ISSUE FIXED — PORT CONFLICT:
 *   package.json had: "dev": "vite --port 5173"
 *   This config had:  port: 3000
 *   CLI flags override vite.config, so the app was silently running on 5173
 *   while the config said 3000. Removed the CLI flag from package.json and
 *   set the canonical port here so there is one source of truth.
 *
 * FOR CI/CD:
 *   The dev server port only matters locally. In production, `vite build`
 *   produces a static dist/ folder that is served by Nginx/CDN — this config
 *   does not affect production at all.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    /*
     * Local development server port.
     * Change this if 5173 is taken on your machine.
     * The OAuth2 redirect URI registered in Google/GitHub Console must match
     * the actual URL you open in the browser (e.g. http://localhost:5173).
     */
    port: 5173,
    open: true, // auto-open browser tab on `npm run dev`
  },
});
