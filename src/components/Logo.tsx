interface LogoProps {
  size?: 'sm' | 'lg';
}

export function Logo({ size = 'lg' }: LogoProps) {
  const isLarge = size === 'lg';

  return (
    <div className={`flex items-center gap-3 ${isLarge ? 'justify-center' : ''}`}>
      <div
        className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sense-orange to-sense-orange-light shadow-lg shadow-sense-orange/30 ${
          isLarge ? 'h-14 w-14' : 'h-9 w-9'
        }`}
      >
        <span className={`font-extrabold text-white ${isLarge ? 'text-2xl' : 'text-lg'}`}>S</span>
      </div>
      <div className={isLarge ? 'text-left' : ''}>
        <h1
          className={`font-extrabold leading-tight tracking-tight text-white ${
            isLarge ? 'text-3xl sm:text-4xl' : 'text-lg'
          }`}
        >
          Família <span className="text-sense-orange-light">Sense</span>
        </h1>
        {isLarge && (
          <p className="text-sm text-gray-400">Adivinha o membro da família do dia</p>
        )}
      </div>
    </div>
  );
}
