import fs from "node:fs/promises";
import path from "node:path";
import candidatesJson from "../data/event-candidates.json" with { type: "json" };
import { events } from "../data/events";
import type { EventCandidate } from "../data/schema";
import { autoPublishCandidates, renderEventsFile } from "./auto-publish";

const ROOT = process.cwd();
const CANDIDATES_PATH = path.join(ROOT, "data", "event-candidates.json");
const EVENTS_PATH = path.join(ROOT, "data", "events.ts");

const candidates = candidatesJson as EventCandidate[];
const result = autoPublishCandidates(events, candidates);

if (result.publishedEvents.length > 0) {
  await fs.writeFile(EVENTS_PATH, renderEventsFile(result.publicEvents));
  await fs.writeFile(CANDIDATES_PATH, `${JSON.stringify(result.remainingCandidates, null, 2)}\n`);
}

console.log(`Auto-published verified events: ${result.publishedEvents.length}`);
