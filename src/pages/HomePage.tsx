import {
  BackgroundScene,
  HomeFooter,
  HomeLogo,
  ModeButton,
} from '../components/home/HomeLayout';
import { HowToPlay } from '../components/WinModal';

interface HomePageProps {
  onPlayClassic: () => void;
  onShowHowTo?: () => void;
}

export function HomePage({ onPlayClassic, onShowHowTo }: HomePageProps) {
  return (
    <HomePageContent onPlayClassic={onPlayClassic} onShowHowTo={onShowHowTo} />
  );
}

function HomePageContent({ onPlayClassic, onShowHowTo }: HomePageProps) {
  return (
    <div className="home-page">
      <BackgroundScene />

      <div className="home-page__content">
        <header className="home-page__header">
          <HomeLogo onSettingsClick={onShowHowTo} />
          <h2 className="home-page__tagline">
            ADIVINHA OS MEMBROS DA <span className="text-sense-orange">FAMÍLIA</span>
          </h2>
        </header>

        <nav className="home-page__modes" aria-label="Modos de jogo">
          <ModeButton
            icon={<span className="text-xl font-black text-white">?</span>}
            iconBg="bg-[#3b82c4]"
            title="Clássico"
            description="Consiga pistas a cada tentativa"
            onClick={onPlayClassic}
          />
          <ModeButton
            icon={<SilhouetteIcon />}
            iconBg="bg-[#4ade80]"
            title="Silhueta"
            description="Adivinha com a silhueta do membro"
            disabled
          />
          <ModeButton
            icon={<QuoteIcon />}
            iconBg="bg-[#eab308]"
            title="Frases"
            description="Adivinha com uma frase típica"
            disabled
          />
          <ModeButton
            icon={<EyeIcon />}
            iconBg="bg-[#ef4444]"
            title="Memória"
            description="Adivinha com uma foto especial"
            disabled
          />
        </nav>

        <HomeFooter />
      </div>
    </div>
  );
}

export function HomePageWithHowTo({
  onPlayClassic,
  onShowHowTo,
  showHowTo,
  onCloseHowTo,
}: HomePageProps & { showHowTo: boolean; onCloseHowTo: () => void }) {
  return (
    <>
      <HomePageContent onPlayClassic={onPlayClassic} onShowHowTo={onShowHowTo} />
      {showHowTo && <HowToPlay onClose={onCloseHowTo} />}
    </>
  );
}

function SilhouetteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <circle cx="12" cy="8" r="4" />
      <path d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" fill="white" />
    </svg>
  );
}
