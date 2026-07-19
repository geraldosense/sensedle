import type { MemberQuote } from '../../types/game';
import { getQuoteText } from '../../data/quotes';

interface QuoteDisplayProps {
  quote: MemberQuote;
}

export function QuoteDisplay({ quote }: QuoteDisplayProps) {
  const fullText = getQuoteText(quote);

  return (
    <div className="quote-display">
      <blockquote className="quote-display__blockquote">
        <p className="quote-display__text">«{fullText}»</p>
      </blockquote>
    </div>
  );
}

interface QuoteFullRevealProps {
  quote: MemberQuote;
  speakerName: string;
}

/** Reservado — vitória no modo Frases usa só QuoteSpeakerPortrait. */
export function QuoteFullReveal({ quote, speakerName }: QuoteFullRevealProps) {
  const fullText = getQuoteText(quote);

  return (
    <div className="quote-full-reveal">
      <p className="quote-full-reveal__label">Quem disse</p>
      <p className="quote-full-reveal__speaker">
        <strong>{speakerName}</strong>
      </p>
      <blockquote className="quote-full-reveal__text">
        <p>«{fullText}»</p>
      </blockquote>
    </div>
  );
}
