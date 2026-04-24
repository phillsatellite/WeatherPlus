import styles from './WeatherIcon.module.css';

// Inline SVG weather icons. Takes a description string like "Partly cloudy"
// and picks an icon. Uses isDay to swap sun for moon at night.

export default function WeatherIcon({ description = '', isDay = true, size = 96 }) {
  const kind = classify(description, isDay);

  return (
    <div className={styles.wrap} style={{ width: size, height: size }} aria-label={description}>
      {renderIcon(kind, size)}
    </div>
  );
}

// Match the description to an icon type. Order matters - check the more
// specific words first so "Thundery rain showers" picks thunder, not rain.
function classify(desc, isDay) {
  const d = desc.toLowerCase();

  if (/thunder|lightning/.test(d)) return 'thunder';
  if (/sleet|freezing rain|ice pellets/.test(d)) return 'sleet';
  if (/snow|blizzard|blowing/.test(d)) return 'snow';
  if (/drizzle/.test(d)) return 'drizzle';
  if (/rain|shower/.test(d)) return 'rain';
  if (/fog|mist|haze/.test(d)) return 'fog';
  if (/overcast/.test(d)) return 'overcast';
  if (/cloud/.test(d)) return isDay ? 'partlyCloudyDay' : 'partlyCloudyNight';
  if (/clear|sunny/.test(d)) return isDay ? 'sun' : 'moon';

  // Fallback to clear.
  return isDay ? 'sun' : 'moon';
}

// Returns the SVG for a given icon type.
function renderIcon(kind, size) {
  const common = {
    viewBox: '0 0 100 100',
    width: size,
    height: size,
    xmlns: 'http://www.w3.org/2000/svg',
  };

  switch (kind) {
    case 'sun':
      return (
        <svg {...common}>
          {/* rays */}
          <g stroke="#ffd97a" strokeWidth="4" strokeLinecap="round">
            <line x1="50" y1="8"  x2="50" y2="20" />
            <line x1="50" y1="80" x2="50" y2="92" />
            <line x1="8"  y1="50" x2="20" y2="50" />
            <line x1="80" y1="50" x2="92" y2="50" />
            <line x1="20" y1="20" x2="28" y2="28" />
            <line x1="72" y1="72" x2="80" y2="80" />
            <line x1="80" y1="20" x2="72" y2="28" />
            <line x1="28" y1="72" x2="20" y2="80" />
          </g>
          {/* Disk */}
          <circle cx="50" cy="50" r="18" fill="#ffd97a" />
        </svg>
      );

    case 'moon':
      return (
        <svg {...common}>
          <path
            d="M62 18c-3 0-6 .5-9 1.4 12 4 20 15 20 28.6 0 14-10 25.5-23 27.6 3 1 6 1.4 9 1.4 16 0 29-13 29-29s-13-30-29-30z"
            fill="#e5e7f5"
          />
        </svg>
      );

    case 'partlyCloudyDay':
      return (
        <svg {...common}>
          {/* Sun */}
          <circle cx="34" cy="36" r="14" fill="#ffd97a" />
          <g stroke="#ffd97a" strokeWidth="3" strokeLinecap="round">
            <line x1="34" y1="12" x2="34" y2="20" />
            <line x1="10" y1="36" x2="18" y2="36" />
            <line x1="17" y1="19" x2="23" y2="25" />
            <line x1="51" y1="19" x2="45" y2="25" />
          </g>
          {/* Cloud */}
          <path
            d="M44 46a14 14 0 0 1 27 3 12 12 0 0 1-3 23H38a12 12 0 0 1-2-24 14 14 0 0 1 8-2z"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.04)"
            strokeWidth="1"
          />
        </svg>
      );

    case 'partlyCloudyNight':
      return (
        <svg {...common}>
          {/* Moon */}
          <path
            d="M34 18c-2 0-4 .3-6 1 8 3 13 10 13 18s-5 15-13 18c2 .7 4 1 6 1 10 0 19-9 19-19s-9-19-19-19z"
            fill="#e5e7f5"
          />
          {/* Cloud */}
          <path
            d="M44 46a14 14 0 0 1 27 3 12 12 0 0 1-3 23H38a12 12 0 0 1-2-24 14 14 0 0 1 8-2z"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.04)"
            strokeWidth="1"
          />
        </svg>
      );

    case 'overcast':
    case 'cloud':
      return (
        <svg {...common}>
          <path
            d="M28 62a16 16 0 0 1 31-5 14 14 0 0 1 15 18H24a14 14 0 0 1 4-13z"
            fill="#d1d5db"
          />
          <path
            d="M32 52a16 16 0 0 1 31-5 14 14 0 0 1 15 18H28a14 14 0 0 1 4-13z"
            fill="#ffffff"
          />
        </svg>
      );

    case 'drizzle':
    case 'rain':
      return (
        <svg {...common}>
          {/* Cloud */}
          <path
            d="M26 44a16 16 0 0 1 31-5 14 14 0 0 1 15 18H22a14 14 0 0 1 4-13z"
            fill="#ffffff"
          />
          {/* Drops */}
          <g fill="#7dd3fc">
            <path d="M34 64l-4 10a4 4 0 0 0 8 0z" />
            <path d="M50 68l-4 10a4 4 0 0 0 8 0z" />
            <path d="M66 64l-4 10a4 4 0 0 0 8 0z" />
          </g>
        </svg>
      );

    case 'thunder':
      return (
        <svg {...common}>
          <path
            d="M26 44a16 16 0 0 1 31-5 14 14 0 0 1 15 18H22a14 14 0 0 1 4-13z"
            fill="#ffffff"
          />
          {/* Bolt */}
          <path
            d="M52 60l-12 18h8l-4 14 14-20h-8l4-12z"
            fill="#fbbf24"
          />
        </svg>
      );

    case 'snow':
      return (
        <svg {...common}>
          <path
            d="M26 44a16 16 0 0 1 31-5 14 14 0 0 1 15 18H22a14 14 0 0 1 4-13z"
            fill="#ffffff"
          />
          <g fill="#e0f2fe">
            <circle cx="34" cy="72" r="3" />
            <circle cx="50" cy="78" r="3" />
            <circle cx="66" cy="72" r="3" />
            <circle cx="42" cy="82" r="2.5" />
            <circle cx="58" cy="82" r="2.5" />
          </g>
        </svg>
      );

    case 'sleet':
      return (
        <svg {...common}>
          <path
            d="M26 44a16 16 0 0 1 31-5 14 14 0 0 1 15 18H22a14 14 0 0 1 4-13z"
            fill="#ffffff"
          />
          <g fill="#bae6fd">
            <path d="M34 64l-4 10a4 4 0 0 0 8 0z" />
            <circle cx="50" cy="76" r="3" />
            <path d="M66 64l-4 10a4 4 0 0 0 8 0z" />
          </g>
        </svg>
      );

    case 'fog':
      return (
        <svg {...common}>
          <g stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.9">
            <line x1="18" y1="38" x2="82" y2="38" />
            <line x1="12" y1="54" x2="88" y2="54" />
            <line x1="20" y1="70" x2="72" y2="70" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}

// Pick a background mood from the same description. WeatherCard uses this
// so the icon and the backdrop match.
export function moodFromDescription(desc = '', isDay = true) {
  const d = desc.toLowerCase();
  if (/thunder|lightning/.test(d)) return 'thunder';
  if (/snow|sleet|blizzard/.test(d)) return 'snow';
  if (/rain|drizzle|shower/.test(d)) return 'rain';
  if (/fog|mist|haze/.test(d)) return 'fog';
  if (/overcast/.test(d)) return 'overcast';
  if (/cloud/.test(d)) return isDay ? 'cloudyDay' : 'cloudyNight';
  return isDay ? 'clearDay' : 'clearNight';
}
