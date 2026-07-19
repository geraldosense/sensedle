interface WinCelebrationProps {
  className?: string;
}

const PARTICLES = Array.from({ length: 20 }, (_, index) => ({
  left: `${6 + ((index * 17) % 88)}%`,
  delay: `${(index * 0.05) % 0.55}s`,
  duration: `${0.85 + (index % 4) * 0.12}s`,
  drift: `${-28 + (index % 7) * 8}px`,
  hue: index % 3 === 0 ? 142 : index % 3 === 1 ? 45 : 350,
  size: 5 + (index % 3) * 2,
}));

export function WinCelebration({ className = '' }: WinCelebrationProps) {
  return (
    <div className={`win-celebration ${className}`.trim()} aria-hidden="true">
      <span className="win-celebration__ring win-celebration__ring--one" />
      <span className="win-celebration__ring win-celebration__ring--two" />
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="win-celebration__particle"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
            ['--particle-drift' as string]: particle.drift,
            background: `hsl(${particle.hue} 72% 54%)`,
          }}
        />
      ))}
    </div>
  );
}

interface WinBannerProps {
  label?: string;
  className?: string;
}

export function WinBanner({ label = 'Parabéns!', className = '' }: WinBannerProps) {
  return (
    <div className={`win-banner ${className}`.trim()} role="status" aria-live="polite">
      <span className="win-banner__glow" aria-hidden="true" />
      <span className="win-banner__text">{label}</span>
      <span className="win-banner__emoji" aria-hidden="true">
        🎉
      </span>
    </div>
  );
}
