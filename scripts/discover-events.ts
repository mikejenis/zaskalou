import fs from "node:fs/promises";
import path from "node:path";
import candidatesJson from "../data/event-candidates.json" with { type: "json" };
import { events } from "../data/events";
import type { EventCandidate, EventSource, PublicEvent } from "../data/schema";
import { watchlistSources, type WatchlistSource } from "../data/watchlist";
import { autoPublishCandidates, renderEventsFile } from "./auto-publish";
import { buildDedupeKey, candidateId, mergeSources } from "./discovery-utils";

const ROOT = process.cwd();
const CANDIDATES_PATH = path.join(ROOT, "data", "event-candidates.json");
const EVENTS_PATH = path.join(ROOT, "data", "events.ts");
const SUMMARY_PATH = process.env.DISCOVERY_SUMMARY_PATH ?? path.join(ROOT, "discovery-summary.md");

const PROJECT_PATTERNS = [
  {
    project: "František Skála & Třaskavá směs",
    pattern: /franti[sš]ek\s+sk[aá]la.{0,80}t[řr]askav[aá]\s+sm[eě]s|t[řr]askav[aá]\s+sm[eě]s.{0,80}franti[sš]ek\s+sk[aá]la/i
  },
  {
    project: "František Skála & Provodovjané",
    pattern: /franti[sš]ek\s+sk[aá]la.{0,80}provodovjan[eé]|provodovjan[eé].{0,80}franti[sš]ek\s+sk[aá]la/i
  },
  { project: "M.T.O. Universal Praha", pattern: /m\.?\s*t\.?\s*o\.?\s+universal/i },
  { project: "Finský Barok", pattern: /finsk[yý]\s+barok/i },
  { project: "František Skála", pattern: /franti[sš]ek\s+sk[aá]la/i }
];

const MONTHS: Record<string, string> = {
  ledna: "01",
  února: "02",
  unora: "02",
  března: "03",
  brezna: "03",
  dubna: "04",
  května: "05",
  kvetna: "05",
  června: "06",
  cervna: "06",
  července: "07",
  cervence: "07",
  srpna: "08",
  září: "09",
  zari: "09",
  října: "10",
  rijna: "10",
  listopadu: "11",
  prosince: "12"
};

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function stripHtml(html: string): string {
  return cleanText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
  );
}

function inferProject(text: string, source: WatchlistSource): string | null {
  for (const item of PROJECT_PATTERNS) {
    if (item.pattern.test(text)) {
      return item.project;
    }
  }

  return source.projectHint;
}

function findIsoDate(text: string): string | null {
  const numeric = text.match(/\b(\d{1,2})\.\s*(\d{1,2})\.\s*(20\d{2})\b/);
  if (numeric) {
    const [, day, month, year] = numeric;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const named = text.match(/\b(\d{1,2})\.\s*([A-Za-zÁ-ž]+)\s+(20\d{2})\b/i);
  if (named) {
    const [, day, monthName, year] = named;
    const month = MONTHS[monthName.toLowerCase()];
    return month ? `${year}-${month}-${day.padStart(2, "0")}` : null;
  }

  return null;
}

function findStartTime(text: string): string | null {
  const time = text.match(/\b([01]?\d|2[0-3])[:.](\d{2})\b/);
  if (!time) {
    return null;
  }

  return `${time[1].padStart(2, "0")}:${time[2]}`;
}

function inferTitle(text: string, project: string): string {
  const projectIndex = text.toLowerCase().indexOf(project.toLowerCase());
  if (projectIndex === -1) {
    return project;
  }

  return cleanText(text.slice(projectIndex, projectIndex + 120)).replace(/\s+[|•].*$/, "") || project;
}

function hasRelevantEvidence(text: string): boolean {
  return PROJECT_PATTERNS.some((item) => item.pattern.test(text));
}

function buildCandidate(source: WatchlistSource, text: string, discoveredAt: string): EventCandidate | null {
  if (!hasRelevantEvidence(text)) {
    return null;
  }

  const project = inferProject(text, source);
  if (!project) {
    return null;
  }

  const date = source.dateHint ?? findIsoDate(text);
  const startTime = source.startTimeHint ?? findStartTime(text);
  const title = source.titleHint ?? inferTitle(text, project);
  const sources: EventSource[] = [{ name: source.name, url: source.url }];

  return {
    id: candidateId({ date, venue: source.venue, city: source.city, project, title }),
    title,
    project,
    date,
    startTime,
    city: source.city,
    venue: source.venue,
    ticketUrl: null,
    sourceUrl: source.url,
    sourceName: source.name,
    sourceType: source.sourceType,
    sources,
    discoveredAt,
    confidence: source.sourceType === "artist" || source.sourceType === "venue" || source.sourceType === "organiser" ? "high" : "medium",
    evidence: cleanText(text.slice(0, 500)),
    status: "unverified"
  };
}

function existingKeys(candidates: EventCandidate[]): Set<string> {
  return new Set([...events.map((event) => buildDedupeKey(event)), ...candidates.map((candidate) => buildDedupeKey(candidate))]);
}

function existingSourceUrls(candidates: EventCandidate[]): Set<string> {
  return new Set([
    ...events.flatMap((event) => event.sources.map((source) => source.url)),
    ...candidates.flatMap((candidate) => candidate.sources.map((source) => source.url))
  ]);
}

function renderSummary(newCandidates: EventCandidate[], publishedEvents: PublicEvent[]): string {
  if (newCandidates.length === 0 && publishedEvents.length === 0) {
    return "# Za Skálou discovery\n\nNo new event candidates found.\n";
  }

  return [
    "# Za Skálou discovery",
    "",
    ...publishedEvents.map((event) =>
      [
        "## AUTO-PUBLISHED VERIFIED CONCERT",
        "",
        `Project: ${event.project}`,
        `Date: ${event.date}`,
        `Venue: ${event.venue}`,
        `City: ${event.city}`,
        `Source: ${event.sources[0]?.name ?? "unknown"} (${event.sources[0]?.url ?? "unknown"})`,
        ""
      ].join("\n")
    ),
    ...newCandidates.map((candidate) =>
      [
        "## UNPUBLISHED CANDIDATE",
        "",
        `Project: ${candidate.project}`,
        `Date: ${candidate.date ?? "unknown"}`,
        `Venue: ${candidate.venue ?? "unknown"}`,
        `City: ${candidate.city ?? "unknown"}`,
        `Source: ${candidate.sourceName} (${candidate.sourceUrl})`,
        `Source type: ${candidate.sourceType}`,
        `Confidence: ${candidate.confidence}`,
        ""
      ].join("\n")
    )
  ].join("\n");
}

async function fetchSource(source: WatchlistSource): Promise<string> {
  const response = await fetch(source.url, {
    headers: {
      "user-agent": "ZaSkalouBot/1.0 (+https://github.com/sauwage/zaskalou)"
    }
  });

  if (!response.ok) {
    throw new Error(`${source.name} returned HTTP ${response.status}`);
  }

  return stripHtml(await response.text());
}

async function main(): Promise<void> {
  const discoveredAt = new Date().toISOString();
  const currentCandidates = candidatesJson as EventCandidate[];
  const keys = existingKeys(currentCandidates);
  const sourceUrls = existingSourceUrls(currentCandidates);
  const updatedCandidates = [...currentCandidates];
  const newCandidates: EventCandidate[] = [];

  for (const source of watchlistSources) {
    try {
      const text = await fetchSource(source);
      const candidate = buildCandidate(source, text, discoveredAt);
      if (!candidate) {
        continue;
      }

      const key = buildDedupeKey(candidate);
      if (sourceUrls.has(candidate.sourceUrl)) {
        continue;
      }

      const existing = updatedCandidates.find((item) => buildDedupeKey(item) === key);
      if (existing) {
        existing.sources = mergeSources(existing.sources, candidate.sources);
        for (const source of candidate.sources) {
          sourceUrls.add(source.url);
        }
        continue;
      }

      if (keys.has(key)) {
        continue;
      }

      keys.add(key);
      sourceUrls.add(candidate.sourceUrl);
      updatedCandidates.push(candidate);
      newCandidates.push(candidate);
    } catch (error) {
      console.warn(`Skipping ${source.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const publication = autoPublishCandidates(events, updatedCandidates);
  if (newCandidates.length > 0 || publication.publishedEvents.length > 0) {
    await fs.writeFile(CANDIDATES_PATH, `${JSON.stringify(publication.remainingCandidates, null, 2)}\n`);
  }
  if (publication.publishedEvents.length > 0) {
    await fs.writeFile(EVENTS_PATH, renderEventsFile(publication.publicEvents));
  }

  const unpublishedNewCandidates = newCandidates.filter((candidate) =>
    publication.remainingCandidates.some((remaining) => remaining.id === candidate.id)
  );
  const summary = renderSummary(unpublishedNewCandidates, publication.publishedEvents);
  await fs.writeFile(SUMMARY_PATH, summary);

  if (process.env.GITHUB_STEP_SUMMARY) {
    await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `\n${summary}\n`);
  }

  console.log(`Discovery complete. New candidates: ${newCandidates.length}. Auto-published: ${publication.publishedEvents.length}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
