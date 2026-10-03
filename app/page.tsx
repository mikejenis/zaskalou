import { events } from "../data/events";
import { createGoogleCalendarUrl, formatEventDate } from "../lib/calendar";

export default function Home() {
  const publicEvents = events
    .filter((event) => event.status === "verified")
    .sort((left, right) => `${left.date}T${left.startTime ?? "00:00"}`.localeCompare(`${right.date}T${right.startTime ?? "00:00"}`));

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Ověřený koncertní přehled</p>
        <h1>Za Skálou</h1>
        <p>
          Veřejný archiv a aktuální přehled živých vystoupení, kde je doložené zapojení Františka Skály nebo jeho hudebních projektů.
        </p>
      </header>

      <section aria-labelledby="events-heading" className="events">
        <div className="section-heading">
          <h2 id="events-heading">Nadcházející ověřené koncerty</h2>
          <p>{publicEvents.length === 0 ? "Zatím nejsou schválené žádné veřejné termíny." : "Každá položka má uložený zdroj."}</p>
        </div>

        {publicEvents.length === 0 ? (
          <div className="empty">Automatické vyhledávání ukládá nové nálezy pouze jako kandidáty k ručnímu ověření.</div>
        ) : (
          <ol className="event-list">
            {publicEvents.map((event) => (
              <li className="event" key={event.id}>
                <div>
                  <p className="project">{event.project}</p>
                  <h3>{event.title}</h3>
                  <p>{formatEventDate(event)}</p>
                  <p>{`${event.venue}, ${event.city}`}</p>
                </div>
                <div className="event-actions">
                  <a href={event.sources[0].url}>Zdroj</a>
                  <a href={createGoogleCalendarUrl(event)}>Přidat do kalendáře</a>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
