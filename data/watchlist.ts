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
    name: "GoOut – František Skála",
    url: "https://goout.net/cs/frantisek-skala/pztya/",
    sourceType: "aggregator",
    city: null,
    venue: null,
    projectHint: "František Skála"
  },
  {
    name: "GoOut – Třaskavá směs",
    url: "https://goout.net/cs/traskava-smes/pzthyhg/",
    sourceType: "aggregator",
    city: null,
    venue: null,
    projectHint: "František Skála & Třaskavá směs"
  },
  {
    name: "GoOut – František Skála & Provodovjané",
    url: "https://goout.net/cs/frantisek-skala-and-provodovjane/ezbswhh/",
    sourceType: "aggregator",
    city: null,
    venue: null,
    projectHint: "František Skála & Provodovjané"
  },
  {
    name: "Ticketportal",
    url: "https://www.ticketportal.cz/",
    sourceType: "ticket_seller",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "Ticketmaster CZ",
    url: "https://www.ticketmaster.cz/",
    sourceType: "ticket_seller",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "Divadlo Dobeška",
    url: "https://www.divadlodobeska.cz/",
    sourceType: "venue",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "Čítárna Unijazz",
    url: "https://www.unijazz.cz/",
    sourceType: "venue",
    city: null,
    venue: null,
    projectHint: null
  },
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
    name: "Palác Akropolis – program",
    url: "https://www.palacakropolis.cz/",
    sourceType: "venue",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "Lucerna Music Bar",
    url: "https://www.musicbar.cz/",
    sourceType: "venue",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "Lucerna",
    url: "https://www.lucerna.cz/",
    sourceType: "venue",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "Zach's Pub Plzeň",
    url: "https://www.zachspub.cz/",
    sourceType: "venue",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "KUPE Opava",
    url: "https://kupecko.cz/",
    sourceType: "venue",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "Opava – městský program",
    url: "https://www.opava-city.cz/",
    sourceType: "organiser",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "Venuše ve Švehlovce",
    url: "https://venuse-ve-svehlovce.cz/",
    sourceType: "venue",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "Forum Karlín",
    url: "https://www.forumkarlin.cz/",
    sourceType: "venue",
    city: null,
    venue: null,
    projectHint: null
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
    name: "Kulturní dům Barikádníků – program",
    url: "https://www.kdbarikadniku.cz/",
    sourceType: "venue",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "Litomyšl Fest",
    url: "https://www.litomyslfest.cz/",
    sourceType: "organiser",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "PONAVA FEST",
    url: "https://www.ponavafest.cz/",
    sourceType: "organiser",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "Prague Open Air",
    url: "https://pragueopenair.cz/",
    sourceType: "organiser",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "Rock for People",
    url: "https://rockforpeople.cz/",
    sourceType: "organiser",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "Provodovjané",
    url: "https://provodovjane.cz/",
    sourceType: "artist",
    city: null,
    venue: null,
    projectHint: "František Skála & Provodovjané"
  },
  {
    name: "ČT art – Kulturní přehled",
    url: "https://art.ceskatelevize.cz/kulturni-prehled/",
    sourceType: "aggregator",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "Festivaly.eu",
    url: "https://www.festivaly.eu/",
    sourceType: "aggregator",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "BuyTickets.cz",
    url: "https://www.buytickets.cz/",
    sourceType: "ticket_seller",
    city: null,
    venue: null,
    projectHint: null
  },
  {
    name: "GoOut – search fallback",
    url: "https://goout.net/cs/frantisek-skala/pztya/",
    sourceType: "aggregator",
    city: null,
    venue: null,
    projectHint: "František Skála"
  }
];
