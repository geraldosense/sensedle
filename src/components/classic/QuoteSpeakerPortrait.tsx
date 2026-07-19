import type { FamilyMember } from '../../types/game';
import { WinCelebration } from './WinCelebration';

interface QuoteSpeakerPortraitProps {
  member: FamilyMember;
  celebrate?: boolean;
}

export function QuoteSpeakerPortrait({ member, celebrate = false }: QuoteSpeakerPortraitProps) {
  return (
    <div className={`quote-speaker-portrait ${celebrate ? 'quote-speaker-portrait--celebrate' : ''}`}>
      {celebrate && <WinCelebration className="win-celebration--card" />}
      <div className="quote-speaker-portrait__frame">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="quote-speaker-portrait__photo"
            decoding="async"
          />
        ) : (
          <div className="quote-speaker-portrait__fallback">{member.name.charAt(0)}</div>
        )}
      </div>
    </div>
  );
}

