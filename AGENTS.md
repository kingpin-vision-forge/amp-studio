# figma-make-app

React + Next.js (App Router) + Tailwind CSS project, migrated from a Figma Make Vite scaffold.

## Development Server

Start the dev server with:

```bash
pnpm dev
```

- Preview URL: `http://localhost:3000` (or the port Next.js assigns if 3000 is busy)
- Hot reload: Changes to source files are reflected immediately (Turbopack)

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `app/layout.tsx` - Root layout; imports `app/globals.css` and renders `<html>`/`<body>`
- `app/page.tsx` - Root route; renders `src/App.tsx`
- `app/globals.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `src/App.tsx` - Top-level client component that crossfades `LoadingPage` into `Home`
- `src/LoadingPage.tsx` - Initial loading screen (shown for the first 3.8s)
- `src/Home.tsx` - Main marketing page content
- `src/imports/` - Static assets (e.g. the logo image) referenced by `src` components
- `next.config.ts` - Next.js configuration (remote image patterns for Unsplash, etc.)
- `postcss.config.mjs` - Tailwind CSS v4 PostCSS plugin configuration
- `package.json` - Project dependencies and the Next.js dev/build/start scripts
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Runtime: React 19 and React DOM 19
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss`
- Build tooling: TypeScript 5.7
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/postcss` PostCSS plugin configured in `postcss.config.mjs`. `app/globals.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `app/globals.css`. This scaffold does not need a Tailwind config file.

`app/layout.tsx` imports `app/globals.css`, so global font wiring belongs there. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

## Client vs. Server Components

`src/App.tsx`, `src/LoadingPage.tsx`, and `src/Home.tsx` all use React hooks (`useState`/`useEffect`/`useRef`) and are marked `"use client"`. `app/page.tsx` and `app/layout.tsx` remain server components.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings. An unescaped apostrophe in a single-quoted string breaks the build.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.
