const TRAIL_PATH =
  "M 40 260 C 120 248, 160 236, 200 218 S 280 192, 320 204 S 400 162, 440 176 S 500 152, 520 166 S 600 122, 640 128 S 720 92, 760 102 S 840 52, 880 36 S 940 22, 970 26";

const FILL_PATH = `${TRAIL_PATH} L 970 320 L 40 320 Z`;

export function ElevationProfile() {
  return (
    <svg
      viewBox="0 0 1000 320"
      role="img"
      aria-label="Elevation profile climbing toward a summit"
      className="h-auto w-full max-w-3xl"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="trail-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--contour-sage)" />
          <stop offset="55%" stopColor="var(--switchback-gold)" />
          <stop offset="100%" stopColor="var(--trail-blaze)" />
        </linearGradient>
        <linearGradient id="fill-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--contour-sage)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--contour-sage)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g stroke="var(--slate-fog)" strokeOpacity="0.2" strokeWidth="1" fill="none">
        <path d="M 0 240 Q 250 220, 500 200 T 1000 160" />
        <path d="M 0 200 Q 300 185, 600 170 T 1000 140" />
        <path d="M 0 160 Q 350 150, 700 135 T 1000 110" />
      </g>

      <path d={FILL_PATH} fill="url(#fill-gradient)" />

      <path
        d={TRAIL_PATH}
        fill="none"
        stroke="url(#trail-gradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        className="trail-line"
      />

      <g fill="var(--switchback-gold)" opacity="0.8">
        <circle cx="200" cy="218" r="5" />
        <circle cx="440" cy="176" r="5" />
        <circle cx="640" cy="128" r="5" />
        <circle cx="880" cy="36" r="5" />
      </g>

      <g transform="translate(970, 26)">
        <g className="trail-summit">
          <polygon
            points="0,0 14,28 -14,28"
            fill="var(--trail-blaze)"
            stroke="var(--basecamp-ink)"
            strokeWidth="1.5"
          />
          <rect x="-2" y="28" width="4" height="10" fill="var(--basecamp-ink)" />
          <circle cx="0" cy="-6" r="5" fill="var(--switchback-gold)" />
        </g>
      </g>
    </svg>
  );
}
