import { Link } from 'react-router-dom';
import styles from './LocationCard.module.css';

// Small card that links to an airport's detail page. Pass onRemove to show
// an X in the corner.
export default function LocationCard({ airport, onRemove }) {
  return (
    <div className={styles.card}>
      <Link to={`/location/${airport.iata}`} className={styles.link}>
        <span className={styles.iata}>{airport.iata}</span>
        <span className={styles.city}>{airport.city}</span>
        <span className={styles.country}>{airport.country}</span>
        <span className={styles.airportName}>{airport.name}</span>
      </Link>

      {onRemove && (
        <button
          type="button"
          className={styles.remove}
          onClick={() => onRemove(airport.iata)}
          aria-label={`Remove ${airport.city}`}
        >
          &times;
        </button>
      )}
    </div>
  );
}
