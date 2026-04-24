import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';
import { useFavorites } from '../context/FavoritesContext';
import ThemeToggle from './ThemeToggle';

// Top nav bar. "My Favorites" opens a dropdown of saved airports.
export default function NavBar() {
  const { favorites, removeFavorite } = useFavorites();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Ref for the dropdown so we can detect clicks outside it.
  const rootRef = useRef(null);

  // Close the dropdown whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return;

    function handleClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  function openAirport(iata) {
    navigate(`/location/${iata}`);
  }

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        {/* Theme toggle on the left. */}
        <div className={styles.leftSlot}>
          <ThemeToggle />
        </div>

        <nav className={styles.links}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Home
          </NavLink>

          {/* Favorites dropdown. Disabled when there are no favorites. */}
          <div className={styles.dropdownRoot} ref={rootRef}>
            <button
              type="button"
              className={`${styles.link} ${open ? styles.open : ''} ${
                favorites.length === 0 ? styles.disabled : ''
              }`}
              onClick={() => setOpen((v) => !v)}
              disabled={favorites.length === 0}
              aria-haspopup="menu"
              aria-expanded={open}
            >
              My Favorites
              <span className={styles.caret} aria-hidden>▾</span>
            </button>

            {open && favorites.length > 0 && (
              <div className={styles.menu} role="menu">
                <ul className={styles.list}>
                  {favorites.map((a) => (
                    <li key={a.iata} className={styles.item}>
                      <button
                        type="button"
                        className={styles.itemMain}
                        onClick={() => openAirport(a.iata)}
                        role="menuitem"
                      >
                        <span className={styles.iata}>{a.iata}</span>
                        <span className={styles.city}>{a.city}</span>
                        <span className={styles.country}>{a.country}</span>
                      </button>

                      <button
                        type="button"
                        className={styles.remove}
                        onClick={(e) => {
                          // Don't let the click bubble up and open the airport.
                          e.stopPropagation();
                          removeFavorite(a.iata);
                        }}
                        aria-label={`Remove ${a.city} from favorites`}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
