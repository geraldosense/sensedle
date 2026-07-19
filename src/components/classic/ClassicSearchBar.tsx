import { useEffect, useRef, useState } from 'react';
import type { FamilyMember } from '../../types/game';
import { searchMembers } from '../../data/members';

interface ClassicSearchBarProps {
  onSubmit: (member: FamilyMember) => void;
  disabled: boolean;
  guessedIds: string[];
  onOpenChange?: (open: boolean) => void;
}

export function ClassicSearchBar({
  onSubmit,
  disabled,
  guessedIds,
  onOpenChange,
}: ClassicSearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FamilyMember[]>([]);
  const [highlight, setHighlight] = useState(0);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed) {
      setResults(searchMembers(query, guessedIds));
      setOpen(true);
      setHighlight(0);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query, guessedIds]);

  useEffect(() => {
    onOpenChange?.(open && results.length > 0);
  }, [open, results.length, onOpenChange]);

  function setDropdownOpen(next: boolean) {
    setOpen(next);
  }

  function selectMember(member: FamilyMember) {
    onSubmit(member);
    setQuery('');
    setDropdownOpen(false);
    inputRef.current?.focus();
  }

  function submitCurrent() {
    const matches = searchMembers(query, guessedIds);
    if (matches.length > 0) {
      selectMember(matches[Math.min(highlight, matches.length - 1)]);
    }
  }

  const canSubmit = !disabled && query.trim() && searchMembers(query, guessedIds).length > 0;
  const showDropdown = open && query.trim();

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitCurrent();
      return;
    }

    if (!open || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  }

  return (
    <div
      ref={rootRef}
      className={`classic-search ${showDropdown && results.length > 0 ? 'classic-search--open' : ''}`}
    >
      <div className="classic-search__box">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setDropdownOpen(true)}
          onBlur={() => setTimeout(() => setDropdownOpen(false), 180)}
          disabled={disabled}
          placeholder="Escreve um membro qualquer para começar"
          className="classic-search__input"
          autoComplete="off"
          spellCheck={false}
          aria-expanded={Boolean(showDropdown && results.length > 0)}
          aria-haspopup="listbox"
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={submitCurrent}
          disabled={!canSubmit}
          className="classic-search__submit"
          aria-label="Enviar palpite"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M2 21l21-9L2 3v7l15 2-15 2v7z"
              fill="#e85d04"
              stroke="#c44d00"
              strokeWidth="0.5"
            />
          </svg>
        </button>
      </div>

      {showDropdown && results.length > 0 && (
        <ul className="classic-search__dropdown" role="listbox">
          {results.map((member, i) => (
            <li key={member.id} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                onMouseDown={() => selectMember(member)}
                className={`classic-search__option ${i === highlight ? 'classic-search__option--active' : ''}`}
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt=""
                    className="classic-search__avatar classic-search__avatar--square"
                  />
                ) : (
                  <span className="classic-search__avatar classic-search__avatar--square classic-search__avatar--fallback">
                    {member.name.charAt(0)}
                  </span>
                )}
                <span className="classic-search__name">{member.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && results.length === 0 && (
        <div className="classic-search__dropdown classic-search__empty">
          Nenhum membro encontrado
        </div>
      )}
    </div>
  );
}
