import styles from './HomeBackdrop.module.css';

// Decorative SVG shown behind the Home hero: sun, mountains, and ocean.
// Scales to fill whatever container it's in.

export default function HomeBackdrop() {
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Sky: blue fading to peach near the horizon. */}
        <linearGradient id="hb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="70%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>

        {/* Ocean: lighter on top, darker at the bottom. */}
        <linearGradient id="hb-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="1200" height="400" fill="url(#hb-sky)" />

      {/* Sun */}
      <circle cx="880" cy="110" r="42" fill="#fef3c7" opacity="0.95" />
      <circle cx="880" cy="110" r="64" fill="#fde68a" opacity="0.25" />

      {/* Back mountains */}
      <path
        d="M0,260 L60,190 L120,220 L200,140 L280,200 L360,160 L440,210 L520,240 L600,260 L1200,260 L1200,280 L0,280 Z"
        fill="#94a3b8"
        opacity="0.55"
      />

      {/* Middle mountains */}
      <path
        d="M0,300 L60,230 L140,260 L220,200 L300,250 L380,220 L460,260 L540,250 L620,280 L1200,280 L1200,320 L0,320 Z"
        fill="#64748b"
        opacity="0.7"
      />

      {/* Ocean */}
      <rect x="0" y="280" width="1200" height="120" fill="url(#hb-sea)" />
      <rect x="0" y="282" width="1200" height="2" fill="#ffffff" opacity="0.35" />

      {/* Front mountain on the left */}
      <path
        d="M0,400 L0,330 L40,280 L110,310 L170,260 L240,290 L300,270 L360,310 L420,330 L470,360 L500,400 Z"
        fill="#1e293b"
        opacity="0.8"
      />

      {/* Wave lines */}
      <path
        d="M620,340 Q700,335 780,340 T940,340 T1100,340"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M680,365 Q760,360 840,365 T1000,365 T1180,365"
        stroke="#ffffff"
        strokeOpacity="0.25"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
