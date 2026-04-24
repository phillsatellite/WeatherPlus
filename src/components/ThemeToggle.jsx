import styles from './ThemeToggle.module.css';
import { useTheme } from '../context/ThemeContext';

// Button that flips between light and dark mode. Shows the icon for the
// mode you'd switch to.
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* \uFE0E forces text-style rendering so iOS doesn't turn these into color emoji. */}
      <span aria-hidden>{isDark ? '☀\uFE0E' : '☾\uFE0E'}</span>
    </button>
  );
}
