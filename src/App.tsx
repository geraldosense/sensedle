import { useEffect, useState } from 'react';
import type { GameMode } from './types/game';
import { HomePage } from './pages/HomePage';
import { ClassicPage } from './pages/ClassicPage';
import { LoadingScreen } from './components/LoadingScreen';
import { HowToPlay } from './components/WinModal';

type View = 'home' | 'game';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('home');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [showHowTo, setShowHowTo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  function startGame(mode: GameMode) {
    setGameMode(mode);
    setView('game');
  }

  return (
    <div className="app-root">
      {loading ? (
        <LoadingScreen onComplete={() => setLoading(false)} />
      ) : view === 'game' ? (
        <ClassicPage
          mode={gameMode}
          onBack={() => setView('home')}
          onModeChange={setGameMode}
        />
      ) : (
        <>
          <HomePage
            onPlayClassic={() => startGame('classic')}
            onPlaySilhouette={() => startGame('silhouette')}
            onPlayQuote={() => startGame('quote')}
            onShowHowTo={() => setShowHowTo(true)}
          />
          {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} />}
        </>
      )}
    </div>
  );
}
