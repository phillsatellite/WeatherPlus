import styles from './FavoriteButton.module.css';
import { useFavorites } from '../context/FavoritesContext';

// Save/Saved button that adds or removes an airport from favorites.
export default function FavoriteButton({ airport }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(airport.iata);

  return (
    <button
      type="button"
      className={`${styles.btn} ${active ? styles.active : ''}`}
      onClick={() => toggleFavorite(airport)}
      aria-pressed={active}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span>{active ? 'Saved' : 'Save'}</span>
    </button>
  );
}
