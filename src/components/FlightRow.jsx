import styles from './FlightRow.module.css';
import { deriveFlightStatus } from '../utils/flightStatus';

// One row in the flight list. Shows the flight number, airline, the other
// end of the route, the time, and the status.
export default function FlightRow({ flight, direction = 'departures', onClick }) {
  const number = flight?.flight?.iata || flight?.flight?.number || '—';
  const airline = flight?.airline?.name || '—';

  // For departures we want the arrival airport and departure time.
  // For arrivals, flip it.
  const isArrivals = direction === 'arrivals';
  const partner = isArrivals ? flight?.departure : flight?.arrival;
  const partnerCity = partner?.airport || '—';
  const partnerIata = partner?.iata || '';
  const scheduled = formatTime(
    isArrivals ? flight?.arrival?.scheduled : flight?.departure?.scheduled
  );
  // Use the corrected status so landed flights don't still say "active".
  const status = deriveFlightStatus(flight);

  const relationWord = isArrivals ? 'from' : 'to';

  // Only the Details button opens the modal. Whole-row clicks weren't
  // discoverable on mobile.
  return (
    <div className={styles.row}>
      <span className={styles.flightNumber}>{number}</span>

      <span className={styles.airline}>{airline}</span>

      <span
        className={styles.to}
        title={partnerIata ? `${partnerCity} (${partnerIata})` : partnerCity}
      >
        <span className={styles.toCity}>{partnerCity}</span>
        {partnerIata && <span className={styles.iata}>({partnerIata})</span>}
      </span>

      <span className={styles.time}>{scheduled}</span>

      <span className={`${styles.status} ${styles[status] || ''}`}>{status}</span>

      <button
        type="button"
        className={styles.detailsBtn}
        onClick={() => onClick?.(flight)}
        aria-label={`View details for flight ${number} ${relationWord} ${partnerCity}`}
      >
        Details
      </button>
    </div>
  );
}

// Format an ISO timestamp as "14:30" in the user's local time. Falls back
// to the raw string if it can't parse.
function formatTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}
