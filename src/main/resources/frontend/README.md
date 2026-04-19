# All-In-One Frontend

React + Vite + Material UI v9 frontend for the `all-in-one` Spring Boot backend.

## Quick start

```bash
# from src/main/resources/frontend
npm install
npm run dev
```

The app will open at **http://localhost:3000** and proxy all `/api/*` requests to the Spring Boot backend on `http://localhost:8080` (configured in `vite.config.js`), so CORS isn't an issue in development.

Make sure the backend is running first:

```bash
# from project root
./mvnw spring-boot:run
```

### Default admin credentials

The backend's `DataInitializer` seeds an admin user on first startup:

- **Username:** `admin`
- **Password:** `amishohan`

Log in with those to see the admin dashboard.

## Hot reload

Vite ships with Hot Module Replacement out of the box. Save any `.jsx` / `.css` file and the browser updates in-place — no full reload, no extra plugin needed. That's what replaces the "auto-reload package" you were looking for.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server on port 3000 with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the built bundle locally (port 3000) |

## Project structure

```
src/
├── api/              ← axios client + one file per backend resource
│   ├── client.js       (baseURL + JWT interceptor + 401 handling)
│   ├── auth.js
│   ├── blogs.js
│   ├── projects.js
│   ├── messages.js
│   ├── users.js
│   └── serviceRequests.js
├── components/       ← reusable UI bits
│   ├── Navbar.jsx            (auth-aware top bar)
│   ├── Layout.jsx            (page shell)
│   ├── RouteGuards.jsx       (<ProtectedRoute>, <AdminRoute>)
│   └── UnderMaintenance.jsx
├── contexts/
│   └── AuthContext.jsx       (login, register, logout, isAdmin)
├── pages/            ← one per route
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── UserDashboard.jsx     (profile + app usage + service requests)
│   ├── AdminDashboard.jsx    (users, requests, messages in tabs)
│   ├── Blogs.jsx             (placeholder)
│   ├── Services.jsx          (placeholder)
│   ├── Projects.jsx          (placeholder)
│   ├── Contact.jsx           (functional — POSTs to /api/messages)
│   └── NotFound.jsx
├── theme/
│   └── theme.js              (MUI palette + typography)
├── utils/
│   └── storage.js            (platform-agnostic storage wrapper)
├── App.jsx                   (routes)
├── main.jsx                  (entry point)
└── index.css
```

## Route map

| Path | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Home / landing page |
| `/login` | Public | Log in |
| `/register` | Public | Sign up |
| `/services` | Public | Services (placeholder) |
| `/projects` | Public | Portfolio (placeholder) |
| `/blog` | Public | Blog (placeholder) |
| `/contact` | Public | Contact form → `/api/messages` |
| `/dashboard` | Authenticated | User dashboard + service requests |
| `/admin` | `ROLE_ADMIN` only | Admin dashboard (users, requests, messages) |

## React Native migration path

The codebase is structured so that a future React Native port only needs to replace the view layer. Business logic stays put.

**Portable as-is (no changes needed):**

- `src/api/*` — pure JS using axios, works identically in RN
- `src/contexts/AuthContext.jsx` — logic only, no DOM
- `src/utils/storage.js` — async API, swap the three internals to use `@react-native-async-storage/async-storage`

**Needs replacing:**

- `src/pages/*` and `src/components/*` — swap MUI components for `react-native-paper` (the closest Material Design equivalent for RN) or `@rneui/themed`
- `src/theme/theme.js` — convert to `react-native-paper`'s theme format (same concepts, slightly different keys)
- React Router → React Navigation
- `main.jsx` → `App.js` with navigation container

The split isn't accidental — keeping API calls, auth state, and storage out of the JSX layer means ~60% of this code ships unchanged to the mobile app.

## Environment variables

Copy `.env.example` to `.env.local` to override defaults:

```
VITE_API_BASE_URL=/api      # dev default (uses Vite proxy)
VITE_API_BASE_URL=https://api.yourdomain.com   # production
```

## Production build + Spring Boot integration (optional)

If you eventually want Spring Boot to serve the built frontend:

```bash
npm run build
# copy dist/* into src/main/resources/static/
```

Spring Boot will then serve the SPA from `/` alongside the API at `/api/*`.

For the SPA to handle deep links correctly, you'll want a small Spring MVC forwarding controller that routes unknown paths (that aren't `/api/**`) back to `index.html`. Happy to add that when you're ready to ship.
