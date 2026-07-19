import { FamiliaSenseLogo } from './home/FamiliaSenseLogo';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  return (
    <div className="loading-screen">
      <div className="loading-screen__logo">
        <FamiliaSenseLogo size="hero" />
      </div>
      <p className="loading-screen__text">A carregar...</p>
      <div className="loading-screen__bar">
        <div className="loading-screen__bar-fill" onAnimationEnd={onComplete} />
      </div>
    </div>
  );
}
