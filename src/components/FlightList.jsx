import { useState } from 'react';
import styles from './FlightList.module.css';
import FlightRow from './FlightRow';
import FlightModal from './FlightModal';

// Table of arriving or departing flights. Clicking a row opens the modal
// with more details.
export default function FlightList({ flights, city, direction = 'departures' }) {
  // The flight shown in the modal, or null if closed.
  const [selectedFlight, setSelectedFlight] = useState(null);

  const isArrivals = direction === 'arrivals';
  const heading = isArrivals
    ? city
      ? `Arriving in ${city}`
      : 'Arriving flights'
    : city
    ? `Departing from ${city}`
    : 'Departing flights';

  if (!flights || flights.length === 0) {
    return (
      <section className={styles.empty}>
        <h3>
          {isArrivals ? 'No arriving flights found' : 'No departing flights found'}
        </h3>
        <p>Try a larger airport, or check back later — the list updates live.</p>
      </section>
    );
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.header}>
        <h2>{heading}</h2>
      </div>

      <div className={styles.list}>
        {/* Column headers. Grid matches FlightRow. */}
        <div className={styles.colHeaders}>
          <span>Flight</span>
          <span>Airline</span>
          <span>{isArrivals ? 'From' : 'To'}</span>
          <span>Scheduled</span>
          <span>Status</span>
        </div>

        {flights.map((flight, i) => (
          // No stable ID on flight records, so build one from flight number
          // and date.
          <FlightRow
            key={`${flight?.flight?.iata || 'n/a'}-${flight?.flight_date || i}-${i}`}
            flight={flight}
            direction={direction}
            onClick={setSelectedFlight}
          />
        ))}
      </div>

      {selectedFlight && (
        <FlightModal
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
        />
      )}
    </section>
  );
}
