import type { EventSource } from "../data/schema";

export type DedupeInput = {
  date: string | null;
  venue: string | null;
  city: string | null;
  project: string | null;
  title: string | null;
};

export function slugify(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildDedupeKey(input: DedupeInput): string {
  return [
    input.date ?? "unknown-date",
    slugify(input.venue),
    slugify(input.city),
    slugify(input.project),
    slugify(input.title)
  ].join("|");
}

export function mergeSources(existing: EventSource[], incoming: EventSource[]): EventSource[] {
  const byUrl = new Map<string, EventSource>();

  for (const source of [...existing, ...incoming]) {
    if (!source.url || !source.name) {
      continue;
    }
    byUrl.set(source.url, source);
  }

  return [...byUrl.values()];
}

export function candidateId(input: DedupeInput): string {
  return buildDedupeKey(input)
    .replace(/\|/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
