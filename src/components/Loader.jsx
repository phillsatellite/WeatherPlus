import styles from './Loader.module.css';

// Small spinner shown while we're waiting on API requests.
export default function Loader({ label = 'Loading...' }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <span className={styles.label}>{label}</span>
    </div>
  );
}
