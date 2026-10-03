# Agent Guide

Za Skálou is a public Czech website for verified concerts involving František Skála.

## Non-Negotiables

- Publish automatically discovered events only when they pass the strict machine-verification rules in `scripts/auto-publish.ts`.
- Never fabricate event dates, venues, ticket URLs, or František Skála involvement.
- Unknown details stay `null`.
- Each public event must have at least one source URL.
- Candidates that do not pass machine verification stay in `data/event-candidates.json`.
- Use Czech text and `Europe/Prague` timezone behavior.
- Discovery uses the free watchlist in `data/watchlist.ts`.

## Event Research Source Preference

1. Artist or project source
2. Venue
3. Organiser
4. Ticket seller
5. Established event aggregator

## QA Before Finishing

Run the relevant subset of:

```bash
npm run typecheck
npm run validate:data
npm test
npm run build
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
