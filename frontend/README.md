# Frontend

React + Vite client for the HealthNexus app. Provides public pages and authenticated dashboard views, and talks to the Express backend API.

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS 4
- Axios
- React Router
- Framer Motion

## Requirements

- Node.js (LTS recommended)
- npm

## Setup

```bash
npm install
```

## Run (Dev)

```bash
npm run dev
```

Vite runs at http://localhost:5173 by default.

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## API Configuration

The API base URL is defined in `src/config/Api.jsx`.

Current default:

```js
baseURL: "http://localhost:4500";
```

If your backend runs on a different host or port, update this value. The backend defaults to port 5000 unless overridden with `PORT`.

## Project Structure

```
src/
	assets/
	components/
		Common/
		Dashboard/
	config/
	context/
	Layout/
	modals/
	pages/
		auth/
		Dashboard/
	Services/
	Utils/
```

## Notes

- If you change the frontend port, update CORS in the backend to allow the new origin.
