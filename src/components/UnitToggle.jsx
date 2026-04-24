import styles from './UnitToggle.module.css';
import { useUnits } from '../context/UnitsContext';

// Two buttons in a pill for picking Celsius or Fahrenheit. Clicking either
// sets it directly so it reads like a radio group.
export default function UnitToggle({ variant = 'default' }) {
  const { units, setUnits } = useUnits();
  const wrapClass =
    variant === 'hero' ? `${styles.wrap} ${styles.hero}` : styles.wrap;

  return (
    <div className={wrapClass} role="group" aria-label="Temperature units">
      <button
        type="button"
        className={`${styles.btn} ${units === 'C' ? styles.active : ''}`}
        onClick={() => setUnits('C')}
        aria-pressed={units === 'C'}
      >
        °C
      </button>
      <button
        type="button"
        className={`${styles.btn} ${units === 'F' ? styles.active : ''}`}
        onClick={() => setUnits('F')}
        aria-pressed={units === 'F'}
      >
        °F
      </button>
    </div>
  );
}
