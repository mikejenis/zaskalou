import type { EventCandidate, PublicEvent, SourceType } from "../data/schema";
import { buildDedupeKey } from "./discovery-utils";

const AUTHORITATIVE_SOURCE_TYPES = new Set<SourceType>(["artist", "venue", "organiser"]);

export type AutoPublishResult = {
  publicEvents: PublicEvent[];
  remainingCandidates: EventCandidate[];
  publishedEvents: PublicEvent[];
};

export function canAutoPublish(candidate: EventCandidate): boolean {
  return (
    candidate.status === "unverified" &&
    candidate.confidence === "high" &&
    AUTHORITATIVE_SOURCE_TYPES.has(candidate.sourceType) &&
    candidate.date !== null &&
    candidate.city !== null &&
    candidate.venue !== null &&
    candidate.sources.length > 0 &&
    candidate.sourceUrl.startsWith("https://") &&
    candidate.sources.some((source) => source.url === candidate.sourceUrl)
  );
}

function toPublicEvent(candidate: EventCandidate): PublicEvent {
  if (!candidate.date || !candidate.city || !candidate.venue) {
    throw new Error(`Candidate ${candidate.id} is missing required public event fields.`);
  }

  return {
    id: candidate.id,
    title: candidate.title,
    project: candidate.project,
    date: candidate.date,
    startTime: candidate.startTime,
    city: candidate.city,
    venue: candidate.venue,
    ticketUrl: candidate.ticketUrl,
    sources: candidate.sources,
    status: "verified"
  };
}

export function autoPublishCandidates(events: PublicEvent[], candidates: EventCandidate[]): AutoPublishResult {
  const eventByKey = new Map(events.map((event) => [buildDedupeKey(event), event]));
  const remainingCandidates: EventCandidate[] = [];
  const publishedEvents: PublicEvent[] = [];

  for (const candidate of candidates) {
    if (!canAutoPublish(candidate)) {
      remainingCandidates.push(candidate);
      continue;
    }

    const publicEvent = toPublicEvent(candidate);
    const key = buildDedupeKey(publicEvent);
    if (eventByKey.has(key)) {
      continue;
    }

    eventByKey.set(key, publicEvent);
    publishedEvents.push(publicEvent);
  }

  return {
    publicEvents: [...eventByKey.values()].sort((left, right) =>
      `${left.date}T${left.startTime ?? "00:00"}`.localeCompare(`${right.date}T${right.startTime ?? "00:00"}`)
    ),
    remainingCandidates,
    publishedEvents
  };
}

export function renderEventsFile(publicEvents: PublicEvent[]): string {
  return [
    'import type { PublicEvent } from "./schema";',
    "",
    `export const events: PublicEvent[] = ${JSON.stringify(publicEvents, null, 2)};`,
    ""
  ].join("\n");
}
