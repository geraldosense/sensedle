export function AnimatedStreakFlame() {
  return (
    <span className="classic-utility-bar__flame" aria-hidden="true">
      <svg className="classic-flame-icon" viewBox="0 0 32 40" width="24" height="30">
        <defs>
          <linearGradient id="streak-flame-outer" x1="16" y1="38" x2="16" y2="2" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c1121c" />
            <stop offset="45%" stopColor="#e85d04" />
            <stop offset="78%" stopColor="#f48c06" />
            <stop offset="100%" stopColor="#ffba08" />
          </linearGradient>
          <linearGradient id="streak-flame-inner" x1="16" y1="34" x2="16" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff6b00" />
            <stop offset="55%" stopColor="#ffb703" />
            <stop offset="100%" stopColor="#ffe066" />
          </linearGradient>
          <radialGradient id="streak-flame-core" cx="16" cy="26" r="7" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fffef0" />
            <stop offset="45%" stopColor="#ffe066" />
            <stop offset="100%" stopColor="#ffb703" stopOpacity="0" />
          </radialGradient>
          <filter id="streak-flame-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="classic-flame-icon__group" filter="url(#streak-flame-glow)">
          <path
            className="classic-flame-icon__body"
            d="M16 38C9.5 38 5 33 5.5 25.5C5.8 21 7.5 17 9.5 13.5C10.8 11.2 11.5 8.5 12 5.5C12.3 3.8 12.6 1.8 13 0.5C13.4 2.2 13.8 4.5 14.5 7C15.2 9.2 15.8 9.8 16.5 8.5C17.2 6.8 17.8 3.5 18.2 1C18.6 2.8 19 5.2 19.8 8C20.5 10.5 21.2 12 22 14C24 17.5 26 21 26.5 25.5C27 33 22.5 38 16 38Z"
            fill="url(#streak-flame-outer)"
          />
          <path
            className="classic-flame-icon__tongue classic-flame-icon__tongue--left"
            d="M11 34C9 31 8.5 27 9.5 23.5C10 21.5 10.8 19.8 11.8 18.2C12.2 17.5 12.5 16.5 12.7 15.2C12.9 16.8 13 18.5 12.8 20.2C12.4 23.5 11.8 26.5 11 29.5C10.6 31 10.8 32.8 11 34Z"
            fill="url(#streak-flame-inner)"
          />
          <path
            className="classic-flame-icon__tongue classic-flame-icon__tongue--right"
            d="M21 34C23 31 23.5 27 22.5 23.5C22 21.5 21.2 19.8 20.2 18.2C19.8 17.5 19.5 16.5 19.3 15.2C19.1 16.8 19 18.5 19.2 20.2C19.6 23.5 20.2 26.5 21 29.5C21.4 31 21.2 32.8 21 34Z"
            fill="url(#streak-flame-inner)"
          />
          <path
            className="classic-flame-icon__inner"
            d="M16 35C12.5 35 10.5 31.5 11 27C11.3 24.5 12.5 22.5 13.5 20.5C14.2 19.2 14.6 17.5 15 15.5C15.3 17.2 15.6 19 16 20.5C16.4 19 16.7 17.2 17 15.5C17.4 17.5 17.8 19.2 18.5 20.5C19.5 22.5 20.7 24.5 21 27C21.5 31.5 19.5 35 16 35Z"
            fill="url(#streak-flame-inner)"
          />
          <ellipse className="classic-flame-icon__core" cx="16" cy="26" rx="4.2" ry="5.5" fill="url(#streak-flame-core)" />
        </g>
      </svg>
    </span>
  );
}
