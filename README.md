# Za Skálou

Public Czech concert tracker for verified live music performances involving František Skála.

## Data Model

- `data/events.ts` contains public verified events.
- `data/event-candidates.json` contains discovered candidates that were not safe enough to publish automatically.
- Automated discovery publishes only strict machine-verified events backed by an artist, venue, or organiser source from the free watchlist in `data/watchlist.ts`.

## Local Development

```bash
npm install
npm run dev
```

## Event Discovery

The discovery script uses free HTTP fetching of the configured watchlist in `data/watchlist.ts`. It preserves source URLs and leaves unknown details as `null`.

```bash
npm run discover:events
npm run validate:data
```

Discovery automatically publishes a candidate only when all of these are true:

- `confidence` is `high`
- `sourceType` is `artist`, `venue`, or `organiser`
- date, city, venue, and source URL are known
- the primary source URL is HTTPS and included in the event sources

Everything else stays in `data/event-candidates.json` and remains unpublished.

To monitor another venue or organiser, add its page to `data/watchlist.ts`.

## QA

```bash
npm run qa
```

## Codex Automation Alternative

A supplementary Codex Automation may periodically run:

> Find newly announced František Skála concerts and concerts involving Třaskavá směs, M.T.O. Universal, Finský Barok and František Skála & Provodovjané. Compare them with the existing Za Skálou event database and report only genuinely new candidates with sources.

This is only a secondary monitoring aid. The production-safe mechanism is the GitHub Actions workflow in `.github/workflows/discover-events.yml`, because it does not depend on a user's computer being online.
