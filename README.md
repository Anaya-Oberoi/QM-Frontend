# QuantityMeasurementApp — Frontend

React + Vite frontend for the Quantity Measurement application. Lets users input values, select units, and perform accurate conversions via the Spring Boot backend API.

---

## Tech stack

- **React 18** with React Router v6
- **Vite 5** (dev server + build tool)
- **Axios** for API calls
- JWT stored in `localStorage` (`qm_token`)

---

## Prerequisites

- Node.js 18+
- npm 9+
- Backend running at `http://localhost:8080` (or set `VITE_API_BASE_URL`)

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local and set VITE_API_BASE_URL if needed

# 3. Start dev server (opens at http://localhost:3000)
npm run dev
```

---

## Environment variables

All variables must be prefixed with `VITE_` to be available in the browser.

| Variable            | Default                 | Description                         |
| ------------------- | ----------------------- | ----------------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:8080` | Base URL of the Spring Boot backend |

Set this in `.env.local` for local development. In production, inject it as an OS environment variable in your CI/CD pipeline before running `npm run build`.

> Variables are embedded at **build time**. Changing them after a build has no effect — you must rebuild.

---

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start local dev server on port 3000  |
| `npm run build`   | Production build → `dist/`           |
| `npm run preview` | Preview the production build locally |

---

## Project structure

```
src/
├── api/
│   └── client.js          # Axios instance + all API calls
├── components/
│   ├── AuthBrand.jsx
│   ├── Navbar.jsx
│   ├── PasswordInput.jsx
│   └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx
│   └── ToastContext.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── MeasurePage.jsx
│   ├── HistoryPage.jsx
│   ├── ProfilePage.jsx
│   ├── ForgotPasswordPage.jsx
│   └── OAuth2CallbackPage.jsx
└── utils/
    └── validation.js
```

---

## API endpoints used

All requests go to `{VITE_API_BASE_URL}/api/v1`.

| Method | Endpoint                                   | Purpose                     |
| ------ | ------------------------------------------ | --------------------------- |
| POST   | `/auth/register`                           | Register new user           |
| POST   | `/auth/login`                              | Login, returns JWT          |
| GET    | `/auth/me`                                 | Get current user profile    |
| POST   | `/auth/otp/send`                           | Send OTP to email           |
| POST   | `/auth/otp/verify`                         | Verify OTP                  |
| PUT    | `/auth/forgotPassword/:email`              | Reset password (forgot)     |
| PUT    | `/auth/resetPassword/:email`               | Change password (logged in) |
| POST   | `/quantities/:operation`                   | Perform a measurement       |
| GET    | `/quantities/history/operation/:operation` | History by operation        |
| GET    | `/quantities/history/type/:type`           | History by measurement type |
| GET    | `/quantities/count/:operation`             | Count by operation          |

---

## Authentication

Login and register responses return an `accessToken` which is stored in `localStorage` under the key `qm_token`. It is attached automatically to every subsequent request via an Axios request interceptor. Clearing `localStorage` logs the user out.
