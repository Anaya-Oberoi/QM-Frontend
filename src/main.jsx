/**
 * src/main.jsx
 *
 * Application entry point — mounts the React app into the #root div defined
 * in index.html.
 *
 * React.StrictMode:
 *   Enabled in development only (Vite strips it in production builds).
 *   It intentionally double-invokes render functions and effects to help catch
 *   side-effect bugs early. If you see unexpected double API calls in dev,
 *   that is StrictMode at work — not a bug in your code.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
