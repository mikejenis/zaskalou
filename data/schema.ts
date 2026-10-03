export type EventStatus = "unverified" | "verified" | "rejected";
export type Confidence = "high" | "medium" | "low";
export type SourceType = "artist" | "venue" | "organiser" | "ticket_seller" | "aggregator" | "unknown";

export type EventSource = {
  name: string;
  url: string;
};

export type PublicEvent = {
  id: string;
  title: string;
  project: string;
  date: string;
  startTime: string | null;
  city: string;
  venue: string;
  ticketUrl: string | null;
  sources: EventSource[];
  status: "verified";
};

export type EventCandidate = {
  id: string;
  title: string;
  project: string;
  date: string | null;
  startTime: string | null;
  city: string | null;
  venue: string | null;
  ticketUrl: string | null;
  sourceUrl: string;
  sourceName: string;
  sourceType: SourceType;
  sources: EventSource[];
  discoveredAt: string;
  confidence: Confidence;
  evidence: string;
  status: EventStatus;
};
