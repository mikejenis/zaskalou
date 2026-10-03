"use client";

import { useState, useMemo } from "react";
import { events } from "../data/events";
import { createGoogleCalendarUrl, formatEventDate } from "../lib/calendar";
import type { PublicEvent } from "../data/schema";

const CZECH_MONTHS: Record<string, string> = {
  "01": "ledna", "02": "února", "03": "března", "04": "dubna",
  "05": "května", "06": "června", "07": "července", "08": "srpna",
  "09": "září", "10": "října", "11": "listopadu", "12": "prosince"
};

const CZECH_MONTHS_SHORT: Record<string, string> = {
  "01": "led", "02": "úno", "03": "bře", "04": "dub",
  "05": "kvě", "06": "čvn", "07": "čvc", "08": "srp",
  "09": "zář", "10": "říj", "11": "lis", "12": "pro"
};

function parseDateParts(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return { year, month, day };
}

function isUpcoming(event: PublicEvent): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return event.date >= today;
}

function isPast(event: PublicEvent): boolean {
  return !isUpcoming(event);
}

function DateBlock({ date, size = "compact" }: { date: string; size?: "featured" | "compact" }) {
  const { year, month, day } = parseDateParts(date);
  if (size === "featured") {
    return (
      <div className="featured-date">
        <span className="featured-date-day">{parseInt(day, 10)}</span>
        <span className="featured-date-month">{CZECH_MONTHS[month]}</span>
        <span className="featured-date-year">{year}</span>
      </div>
    );
  }
  return (
    <div className="event-date-block">
      <span className="event-date-day">{parseInt(day, 10)}</span>
      <span className="event-date-month">{CZECH_MONTHS_SHORT[month]}</span>
    </div>
  );
}

function EventCard({ event }: { event: PublicEvent }) {
  return (
    <li>
      <div className="event-card">
        <DateBlock date={event.date} size="compact" />
        <div className="event-body">
          <p className="event-project">{event.project}</p>
          <p className="event-title">{event.title}</p>
          <p className="event-venue">{event.venue} · {event.city} · {event.startTime ?? "19:00"}</p>
        </div>
        <div className="event-actions">
          {event.ticketUrl && (
            <a className="btn-primary" href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
              Lístky
            </a>
          )}
          <a className="btn-secondary" href={createGoogleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
            Kalendář
          </a>
          <a className="btn-ghost" href={event.sources[0].url} target="_blank" rel="noopener noreferrer">
            Zdroj ↗
          </a>
        </div>
      </div>
    </li>
  );
}

function FeaturedEvent({ event }: { event: PublicEvent }) {
  return (
    <div className="featured-card">
      <DateBlock date={event.date} size="featured" />
      <div className="featured-body">
        <p className="featured-project">{event.project}</p>
        <h2 className="featured-title">{event.title}</h2>
        <p className="featured-meta">{event.venue} · {event.city}</p>
        <p className="featured-time">{formatEventDate(event)}</p>
      </div>
      <div className="featured-actions">
        {event.ticketUrl && (
          <a className="btn-primary" href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
            Koupit lístky
          </a>
        )}
        <a className="btn-secondary" href={createGoogleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
          Přidat do kalendáře
        </a>
        <a className="btn-ghost" href={event.sources[0].url} target="_blank" rel="noopener noreferrer">
          Detail ↗
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  const verified = useMemo(
    () =>
      events
        .filter((e) => e.status === "verified")
        .sort((a, b) =>
          `${a.date}T${a.startTime ?? "00:00"}`.localeCompare(`${b.date}T${b.startTime ?? "00:00"}`)
        ),
    []
  );

  const upcoming = useMemo(() => verified.filter(isUpcoming), [verified]);
  const past = useMemo(() => verified.filter(isPast).reverse(), [verified]);

  const projects = useMemo(() => {
    const set = new Set(upcoming.map((e) => e.project));
    return Array.from(set).sort();
  }, [upcoming]);

  const [activeProject, setActiveProject] = useState<string | null>(null);

  const nextConcert = upcoming[0] ?? null;
  const restUpcoming = upcoming.slice(1);

  const filteredRest = activeProject
    ? restUpcoming.filter((e) => e.project === activeProject)
    : restUpcoming;

  const filteredNext = activeProject && nextConcert?.project !== activeProject ? null : nextConcert;

  return (
    <>
      {/* Navigation */}
      <nav className="site-nav">
        <div className="site-nav-inner">
          <span className="site-wordmark">Za Skálou</span>
          <span className="nav-eyebrow">Přehled</span>
        </div>
      </nav>

      <main className="page-wrap">
        {/* Hero */}
        <header className="hero">
          <div className="hero-text">
            <p className="hero-eyebrow">Koncertní přehled</p>
            <h1>Za Skálou</h1>
            <p className="hero-subtitle">
              Veřejný archiv a aktuální přehled živých vystoupení, kde je doložené zapojení
              Františka Skály nebo jeho hudebních projektů.
            </p>
          </div>
          <div className="hero-photo-wrap">
            <img
              src="/frantisek-skala.jpg"
              alt="František Skála"
              width={280}
              height={350}
            />
          </div>
        </header>

        {/* Next Concert */}
        {(filteredNext ?? (!activeProject && nextConcert)) && (
          <section className="featured-section" aria-labelledby="next-concert-label">
            <p className="section-label" id="next-concert-label">Příští koncert</p>
            <FeaturedEvent event={filteredNext ?? nextConcert!} />
          </section>
        )}

        {/* Upcoming Concerts */}
        <section className="page-section" aria-labelledby="upcoming-label">
          <div className="section-head">
            <h2 id="upcoming-label">Nadcházející koncerty</h2>
            {projects.length > 1 && (
              <div className="filter-row" role="group" aria-label="Filtrovat projekt">
                <button
                  className={`filter-pill${activeProject === null ? " active" : ""}`}
                  onClick={() => setActiveProject(null)}
                >
                  Vše
                </button>
                {projects.map((project) => (
                  <button
                    key={project}
                    className={`filter-pill${activeProject === project ? " active" : ""}`}
                    onClick={() => setActiveProject(activeProject === project ? null : project)}
                  >
                    {project}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredRest.length === 0 && !filteredNext ? (
            <div className="empty-state">
              {upcoming.length === 0
                ? "Zatím nejsou schválené žádné nadcházející termíny."
                : "Žádné další termíny pro vybraný projekt."}
            </div>
          ) : (
            <ol className="event-list">
              {filteredRest.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </ol>
          )}
        </section>

        {/* Past Concerts */}
        {past.length > 0 && (
          <section className="page-section past-section" aria-labelledby="past-label">
            <div className="section-head">
              <h2 id="past-label">Minulé koncerty</h2>
            </div>
            <ol className="event-list">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </ol>
          </section>
        )}

        {/* Missing Concert Submission */}
        <section className="page-section" aria-labelledby="submission-label">
          <div className="submission-section">
            <h2 id="submission-label">Chybí vám nějaký termín?</h2>
            <p>
              Pokud víte o vystoupení, které tu není, napište nám. Každý přidaný termín
              ověřujeme a dohledáváme zdroj.
            </p>
            <a
              className="btn-primary"
              href="https://github.com/sauwage/zaskalou/issues/new?title=Chyb%C4%9Bj%C3%ADc%C3%AD+term%C3%ADn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nahlásit chybějící termín
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p className="footer-copy">© {new Date().getFullYear()} Za Skálou. Data ověřena ze zdrojů.</p>
          <a
            className="footer-link"
            href="https://github.com/michaeljenis/zaskalou"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </footer>
    </>
  );
}
