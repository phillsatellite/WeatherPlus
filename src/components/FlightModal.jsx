import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './FlightModal.module.css';
import { deriveFlightStatus } from '../utils/flightStatus';

// Modal with flight details. Opens when the user clicks a row in FlightList.
// Closes on backdrop click or Escape. Rendered via a portal so it escapes
// any parent's overflow clipping.

export default function FlightModal({ flight, onClose }) {
  const airlineName = flight?.airline?.name || 'Unknown airline';
  const flightNumber = flight?.flight?.iata || flight?.flight?.number || '—';
  // Corrected status so landed flights don't still say "active".
  const status = deriveFlightStatus(flight);

  // Lock background scroll + close on Esc.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="flight-modal-title"
    >
      {/* Clicks inside the panel shouldn't close the modal. */}
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <h2 id="flight-modal-title" className={styles.title}>
              <span className={styles.flightNumber}>{flightNumber}</span>
              <span className={styles.airlineName}>{airlineName}</span>
            </h2>
            <span className={`${styles.status} ${styles[status] || ''}`}>{status}</span>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close flight details"
          >
            &times;
          </button>
        </header>

        <div className={styles.body}>
          <Route flight={flight} />
        </div>
      </div>
    </div>,
    document.body
  );
}

// "DEP -> ARR" block at the top of the modal.
function Route({ flight }) {
  const dep = flight?.departure || {};
  const arr = flight?.arrival || {};

  return (
    <section className={styles.route}>
      <Endpoint
        label="Departure"
        iata={dep.iata}
        airport={dep.airport}
        terminal={dep.terminal}
        gate={dep.gate}
        scheduled={dep.scheduled}
        estimated={dep.estimated}
        actual={dep.actual}
        delay={dep.delay}
      />
      <div className={styles.arrow} aria-hidden="true">→</div>
      <Endpoint
        label="Arrival"
        iata={arr.iata}
        airport={arr.airport}
        terminal={arr.terminal}
        gate={arr.gate}
        baggage={arr.baggage}
        scheduled={arr.scheduled}
        estimated={arr.estimated}
        actual={arr.actual}
        delay={arr.delay}
      />
    </section>
  );
}

// One side of the route: airport, times, gate info.
function Endpoint({
  label,
  iata,
  airport,
  terminal,
  gate,
  baggage,
  scheduled,
  estimated,
  actual,
  delay,
}) {
  return (
    <div className={styles.endpoint}>
      <div className={styles.endpointLabel}>{label}</div>
      <div className={styles.endpointIata}>{iata || '—'}</div>
      <div className={styles.endpointAirport}>{airport || '—'}</div>

      <dl className={styles.kv}>
        {scheduled && <KV k="Scheduled" v={formatDateTime(scheduled)} />}
        {estimated && <KV k="Estimated" v={formatDateTime(estimated)} />}
        {actual && <KV k="Actual" v={formatDateTime(actual)} />}
        {terminal && <KV k="Terminal" v={terminal} />}
        {gate && <KV k="Gate" v={gate} />}
        {baggage && <KV k="Baggage" v={baggage} />}
        {Number.isFinite(delay) && delay > 0 && (
          <KV k="Delay" v={`${delay} min`} highlight />
        )}
      </dl>
    </div>
  );
}

function KV({ k, v, highlight }) {
  return (
    <div className={`${styles.kvRow} ${highlight ? styles.kvHighlight : ''}`}>
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

// Format an ISO string like "May 8, 14:30" in the user's local time.
function formatDateTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const date = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${date}, ${time}`;
  } catch {
    return iso;
  }
}
