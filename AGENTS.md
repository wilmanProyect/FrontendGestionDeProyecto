# AGENTS.md

## Essential Commands
- `npm run dev` - Start dev server (port 5173)
- `npm run build` - Typecheck + build (runs `tsc -b && vite build`)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Setup Requirements
- **Backend required**: Must run at `http://localhost:3001/api`
- Copy `.env.example` to `.env.local` (or use existing `.env`)
- Required vars: `VITE_API_BASE_URL`, `VITE_ENABLE_2FA`, `VITE_ENABLE_EMAIL_VERIFICATION`

## Architecture
- **Screaming Architecture**: Organize by features, not by file type
- **Features** (`src/features/`): auth, project modules (each has pages/, components/, hooks/, store/, api/, types/, constants/, utils/)
- **Shared** (`src/shared/`): reusable components, API config
- **Config** (`src/config/`): router
- Path alias: `@/*` → `src/*`

## Auth Token Storage
- Tokens stored in localStorage: `accessToken`, `refreshToken`, `authUser`
- Auto-refresh on 401 via axios interceptors

## Testing
- No test framework configured (no jest/vitest in package.json)

## Lint
- Uses flat ESLint config (`eslint.config.js`), not legacy