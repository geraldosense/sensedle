import { useState, type CSSProperties } from 'react';
import type { FamilyMember } from '../../types/game';

/** Zoom no rosto — fixo durante o jogo (sem pistas por erro). */
const SILHOUETTE_ZOOM = 2.45;
const SILHOUETTE_BLUR = 12;

interface MemberSilhouetteProps {
  member: FamilyMember;
  revealed?: boolean;
  celebrate?: boolean;
}

export function MemberSilhouette({
  member,
  revealed = false,
  celebrate = false,
}: MemberSilhouetteProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = member.image;
  const showImage = Boolean(imageSrc) && !imageError;

  const stageStyle = {
    '--zoom-scale': revealed ? 1 : SILHOUETTE_ZOOM,
    '--blur-amount': revealed ? '0px' : `${SILHOUETTE_BLUR}px`,
  } as CSSProperties;

  return (
    <div
      className={[
        'member-silhouette',
        revealed ? 'member-silhouette--revealed' : '',
        celebrate ? 'member-silhouette--celebrate' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="member-silhouette__frame">
        <div className="member-silhouette__stage" style={stageStyle}>
          {showImage ? (
            <img
              src={imageSrc}
              alt=""
              className="member-silhouette__image"
              decoding="async"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="member-silhouette__fallback">{member.name.charAt(0)}</div>
          )}
        </div>
        {!revealed && <div className="member-silhouette__vignette" aria-hidden="true" />}
      </div>

      {revealed && <p className="member-silhouette__label">{member.name}</p>}
    </div>
  );
}
