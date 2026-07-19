import { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { ClassicPage } from './pages/ClassicPage';
import { LoadingScreen } from './components/LoadingScreen';
import { HowToPlay } from './components/WinModal';

type View = 'home' | 'classic';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('home');
  const [showHowTo, setShowHowTo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-root">
      {loading ? (
        <LoadingScreen onComplete={() => setLoading(false)} />
      ) : view === 'classic' ? (
        <ClassicPage onBack={() => setView('home')} />
      ) : (
        <>
          <HomePage
            onPlayClassic={() => setView('classic')}
            onShowHowTo={() => setShowHowTo(true)}
          />
          {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} />}
        </>
      )}
    </div>
  );
}
