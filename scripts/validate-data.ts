import candidatesJson from "../data/event-candidates.json" with { type: "json" };
import { events } from "../data/events";
import type { EventCandidate } from "../data/schema";

const VALID_STATUSES = new Set(["unverified", "verified", "rejected"]);
const VALID_CONFIDENCE = new Set(["high", "medium", "low"]);
const VALID_SOURCE_TYPES = new Set(["artist", "venue", "organiser", "ticket_seller", "aggregator", "unknown"]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function isTime(value: string): boolean {
  return /^\d{2}:\d{2}$/.test(value);
}

for (const event of events) {
  assert(event.status === "verified", `Public event ${event.id} must be verified`);
  assert(event.sources.length > 0, `Public event ${event.id} must include at least one source`);
  assert(event.sources.every((source) => source.url.startsWith("https://")), `Public event ${event.id} has an invalid source URL`);
  assert(isIsoDate(event.date), `Public event ${event.id} has an invalid date`);
  assert(event.startTime === null || isTime(event.startTime), `Public event ${event.id} has an invalid startTime`);
}

const candidates = candidatesJson as EventCandidate[];
const ids = new Set<string>();

for (const candidate of candidates) {
  assert(candidate.id && !ids.has(candidate.id), `Candidate has missing or duplicate id: ${candidate.id}`);
  ids.add(candidate.id);
  assert(VALID_STATUSES.has(candidate.status), `Candidate ${candidate.id} has invalid status`);
  assert(candidate.status !== "verified", `Candidate ${candidate.id} must not be auto-approved inside event-candidates.json`);
  assert(VALID_CONFIDENCE.has(candidate.confidence), `Candidate ${candidate.id} has invalid confidence`);
  assert(VALID_SOURCE_TYPES.has(candidate.sourceType), `Candidate ${candidate.id} has invalid sourceType`);
  assert(candidate.sourceUrl.startsWith("https://"), `Candidate ${candidate.id} has invalid sourceUrl`);
  assert(candidate.sources.length > 0, `Candidate ${candidate.id} must include sources`);
  assert(candidate.sources.some((source) => source.url === candidate.sourceUrl), `Candidate ${candidate.id} sourceUrl must appear in sources`);
  assert(candidate.date === null || isIsoDate(candidate.date), `Candidate ${candidate.id} has invalid date`);
  assert(candidate.startTime === null || isTime(candidate.startTime), `Candidate ${candidate.id} has invalid startTime`);
  assert(candidate.evidence.trim().length > 0, `Candidate ${candidate.id} needs evidence`);
}

console.log(`Validated ${events.length} public events and ${candidates.length} candidates.`);
