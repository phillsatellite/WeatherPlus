import styles from './ErrorMessage.module.css';

// Simple error card with an optional "Try again" button.
export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className={styles.wrap} role="alert">
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.message}>{message}</p>}
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
