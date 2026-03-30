# Planora

Planora is a React Router application for turning 2D floor plans into AI-generated top-down 3D architectural renders. Users sign in with Puter, upload a JPG or PNG floor plan, generate a render with Puter AI, and revisit saved projects from the dashboard.

## What It Does

- Upload floor plans from the home page
- Authenticate users with Puter
- Generate 3D visualizations from 2D plans using `puter.ai.txt2img`
- Save source and rendered images through Puter hosting and a Puter worker backend
- View saved projects in a dashboard
- Compare original and rendered images with a before/after slider
- Export rendered images as `.png`

## Stack

- React 19
- React Router 7
- TypeScript
- Vite
- Tailwind CSS v4
- Puter SDK
- `react-compare-slider`
- `lucide-react`

## Project Structure

```text
app/
  root.tsx                 App shell, auth context, global layout
  routes/home.tsx          Landing page, upload flow, projects list
  routes/visualizer.$id.tsx Project visualizer and render screen
components/
  Navbar.tsx               Header and auth actions
  Upload.tsx               File upload and progress UI
lib/
  ai.action.ts             AI image generation flow
  puter.action.ts          Auth and project persistence helpers
  puter.hosting.ts         Puter hosting helpers
public/
  favicon.ico              App favicon
```

## Environment

Create a local env file from the example:

```bash
cp .env.example .env.local
```

Set the following variable:

```env
VITE_PUTER_WORKER_URL=
```

`VITE_PUTER_WORKER_URL` should point to the Puter worker that serves the project APIs used by the app:

- `GET /api/projects/list`
- `GET /api/projects/get?id=...`
- `POST /api/projects/save`

Without this value, project history and save/load behavior are skipped.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

By default, the app runs at `http://localhost:5173`.

## Available Scripts

```bash
npm run dev        # Start the React Router dev server
npm run build      # Create a production build
npm run start      # Serve the production build
npm run typecheck  # Generate route types and run TypeScript
```

## Application Flow

1. Sign in with Puter from the navbar.
2. Upload a floor plan image from the home page.
3. Planora creates a project record and opens the visualizer route.
4. The visualizer fetches the project and triggers AI generation if no render exists yet.
5. The generated image is saved back to Puter-backed storage through the worker.
6. Users can compare before/after, revisit saved projects, and export the generated render.

## Notes

- Accepted upload formats are `.jpg`, `.jpeg`, and `.png`.
- The upload UI enforces sign-in before file processing begins.
- Generated images are requested as `1024 x 1024`.
- The current UI uses Puter hosting plus a worker-backed API for persistence.

## Production Build

Build the app:

```bash
npm run build
```

Serve the compiled output:

```bash
npm run start
```

The production server serves the generated files from `build/client` and `build/server`.
