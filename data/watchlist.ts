import type { SourceType } from "./schema";

export type WatchlistSource = {
  name: string;
  url: string;
  sourceType: SourceType;
  city: string | null;
  venue: string | null;
  projectHint: string | null;
  titleHint?: string;
  dateHint?: string;
  startTimeHint?: string;
};

export const watchlistSources: WatchlistSource[] = [
  {
    name: "Palác Akropolis",
    url: "https://palacakropolis.cz/?event_id=41254&genre=1&page_id=42027",
    sourceType: "venue",
    city: "Praha",
    venue: "Palác Akropolis",
    projectHint: "František Skála & Třaskavá směs",
    titleHint: "FRANTIŠEK SKÁLA & TŘASKAVÁ SMĚS ► KŘEST NOVÉHO ALBA ZKLAMAL",
    dateHint: "2026-12-04",
    startTimeHint: "19:30"
  },
  {
    name: "Kulturní dům Barikádníků",
    url: "https://kdbarikadniku.cz/koncerty-a-akce/frantisek-skala-provodovjane-predvanocni-koncert-s-tancovackou/",
    sourceType: "venue",
    city: "Praha",
    venue: "Kulturní dům Barikádníků (KD Barikádníků)",
    projectHint: "František Skála & Provodovjané",
    titleHint: "František Skála & Provodovjané – předvánoční koncert s tancovačkou",
    dateHint: "2026-12-01",
    startTimeHint: "20:00"
  },
  {
    name: "GoOut",
    url: "https://goout.net/cs/frantisek-skala/pztya/",
    sourceType: "aggregator",
    city: null,
    venue: null,
    projectHint: "František Skála"
  }
];
