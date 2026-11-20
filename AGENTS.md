<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Testing

- While iterating: `npm run test:related` runs only the `lib/*.test.ts` files affected by your uncommitted changes (`scripts/test-related.mjs`; pass a ref to compare against it instead, e.g. `npm run test:related -- origin/main`). Changes outside `lib/` (app, components, config, package.json) fall back to the full suite; `*.md` changes are ignored.
- Once at the end: `npm test` (full suite), `npm run typecheck` (`next typegen` then `tsc --noEmit`, so it also works in a fresh checkout with no `.next/types`) and `npm run lint`.
- Test workers are capped at 2 (`TEST_WORKERS=4 npm test` to override) so a run cannot overload the machine.
- Run `npm run build` (`next build`) only when the change touches build/config/routing (next.config.ts, proxy.ts, app/ route structure, package.json, tsconfig) or before a deploy. Never delete `.next/cache` in a script.
