import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import LocationCard from '../components/LocationCard';
import ErrorMessage from '../components/ErrorMessage';
import { getSuggestedAirports } from '../data/airports';
import styles from './Home.module.css';

// The suggested list never changes, so just grab it once.
const SUGGESTED = getSuggestedAirports();

// Home page: big search bar on top, suggested airports below.
export default function Home() {
  // SearchBar calls onNotFound(query) when a search doesn't match anything.
  // We stash the query here to show an error message.
  const [notFoundQuery, setNotFoundQuery] = useState(null);

  return (
    <>
      {/* Hero section - sits outside .container so the backdrop can go
          edge-to-edge. */}
      <section className={styles.hero}>
        <img
          src="/header.png"
          alt=""
          aria-hidden="true"
          className={styles.heroBackdrop}
        />

        <div className={styles.heroInner}>
          <h1 className={styles.headline}>
            <span className={styles.headlineTop}>Stop waiting</span>
            <span className={styles.headlineBottom}>Plan your next trip today</span>
          </h1>
          <p className={styles.subtitle}>
            Search any major airport to see live weather and departing flights.
          </p>
          <div className={styles.searchWrap}>
            <SearchBar
              onNotFound={(q) => setNotFoundQuery(q)}
            />
          </div>

          {notFoundQuery && (
            <div className={styles.errorWrap}>
              <ErrorMessage
                title="We couldn't find that location"
                message={`No airport matches "${notFoundQuery}". Try a major city or a 3-letter IATA code (e.g. "Tokyo" or "HND").`}
                onRetry={() => setNotFoundQuery(null)}
              />
            </div>
          )}
        </div>
      </section>

      {/* Suggested locations grid. */}
      <div className="container">
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Suggested Locations</h2>
          </div>

          <div className={styles.grid}>
            {SUGGESTED.map((a) => (
              <LocationCard key={a.iata} airport={a} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
