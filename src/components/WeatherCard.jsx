import styles from './WeatherCard.module.css';
import WeatherIcon, { moodFromDescription } from './WeatherIcon';
import UnitToggle from './UnitToggle';
import { useUnits } from '../context/UnitsContext';
import { formatTemp } from '../utils/units';

// Weather display: colored hero with the temperature, plus a grid of detail
// pills below.

export default function WeatherCard({ data, airport }) {
  const loc = data?.location || {};
  const cur = data?.current || {};

  // User's C/F preference from context.
  const { units } = useUnits();

  const description = Array.isArray(cur.weather_descriptions)
    ? cur.weather_descriptions[0] || ''
    : '';
  const isDay = cur.is_day === 'yes';
  const mood = moodFromDescription(description, isDay);

  return (
    <section className={styles.card}>
      {/* Hero */}
      <div className={`${styles.hero} ${styles[mood] || styles.clearDay}`}>
        <div className={styles.heroTop}>
          <div>
            <h2 className={styles.place}>
              {airport?.city || loc.name}
              {airport?.country && (
                <span className={styles.country}>, {airport.country}</span>
              )}
            </h2>
            {airport?.name && (
              <p className={styles.airportName}>{airport.name}</p>
            )}
            <p className={styles.description}>{description || '—'}</p>
          </div>
        </div>

        <div className={styles.heroCenter}>
          <WeatherIcon description={description} isDay={isDay} size={120} />
          <div className={styles.tempBlock}>
            <span className={styles.temp}>
              {formatTemp(cur.temperature, units)}
              <span className={styles.deg}>°</span>
            </span>
            <span className={styles.feels}>
              Feels like {formatTemp(cur.feelslike, units)}°
            </span>
            <div className={styles.unitToggleSlot}>
              <UnitToggle variant="hero" />
            </div>
          </div>
        </div>
      </div>

      {/* Detail pills */}
      <div className={styles.pills}>
        <Pill label="Wind" value={`${cur.wind_speed} km/h`} sub={cur.wind_dir} />
        <Pill label="Humidity" value={`${cur.humidity}%`} />
        <Pill label="UV Index" value={cur.uv_index} sub={uvLabel(cur.uv_index)} />
        <Pill label="Visibility" value={`${cur.visibility} km`} />
        <Pill label="Pressure" value={`${cur.pressure} mb`} />
        <Pill label="Cloud cover" value={`${cur.cloudcover}%`} />
        <Pill label="Precipitation" value={`${cur.precip} mm`} />
        <Pill label="Wind bearing" value={`${cur.wind_degree}°`} />
      </div>

    </section>
  );
}

function Pill({ label, value, sub }) {
  return (
    <div className={styles.pill}>
      <span className={styles.pillLabel}>{label}</span>
      <span className={styles.pillValue}>{value ?? '—'}</span>
      {sub && <span className={styles.pillSub}>{sub}</span>}
    </div>
  );
}

// Turn a UV number into a friendly label.
function uvLabel(uv) {
  const n = Number(uv);
  if (Number.isNaN(n)) return '';
  if (n < 3) return 'Low';
  if (n < 6) return 'Moderate';
  if (n < 8) return 'High';
  if (n < 11) return 'Very High';
  return 'Extreme';
}
