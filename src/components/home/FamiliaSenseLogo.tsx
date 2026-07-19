interface FamiliaSenseLogoProps {
  className?: string;
  size?: 'hero' | 'compact';
}

export function FamiliaSenseLogo({ className = '', size = 'hero' }: FamiliaSenseLogoProps) {
  return (
    <h1 className={`familia-sense-logo familia-sense-logo--${size} ${className}`.trim()}>
      <span className="familia-sense-logo__familia">FAMÍLIA</span>
      <span className="familia-sense-logo__sense">SENSE</span>
    </h1>
  );
}
