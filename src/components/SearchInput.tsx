import { useEffect, useRef, useState } from 'react';
import type { FamilyMember } from '../types/game';
import { searchMembers } from '../data/members';

interface SearchInputProps {
  onSubmit: (member: FamilyMember) => void;
  disabled: boolean;
  guessedIds: string[];
}

export function SearchInput({ onSubmit, disabled, guessedIds }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FamilyMember[]>([]);
  const [highlight, setHighlight] = useState(0);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (query.trim()) {
      setResults(searchMembers(query, guessedIds));
      setOpen(true);
      setHighlight(0);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query, guessedIds]);

  function selectMember(member: FamilyMember) {
    onSubmit(member);
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) {
      if (e.key === 'Enter' && results.length === 1) {
        e.preventDefault();
        selectMember(results[0]);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectMember(results[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          disabled={disabled}
          placeholder="Escreve o nome de um membro..."
          className="w-full rounded-xl border-2 border-sense-border bg-sense-surface px-4 py-3 pr-10 text-base text-white placeholder-gray-500 outline-none transition focus:border-sense-orange disabled:cursor-not-allowed disabled:opacity-50"
          autoComplete="off"
          spellCheck={false}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          🔍
        </span>
      </div>

      {open && results.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-sense-border bg-sense-surface shadow-xl"
        >
          {results.map((member, i) => (
            <li key={member.id}>
              <button
                type="button"
                onMouseDown={() => selectMember(member)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-sense-orange/10 ${
                  i === highlight ? 'bg-sense-orange/15' : ''
                }`}
              >
                <MemberAvatar member={member} />
                <span className="font-semibold text-white">{member.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-sense-border bg-sense-surface px-4 py-3 text-sm text-gray-400 shadow-xl">
          Nenhum membro encontrado
        </div>
      )}
    </div>
  );
}

function MemberAvatar({ member }: { member: FamilyMember }) {
  if (member.image) {
    return (
      <img
        src={member.image}
        alt={member.name}
        className="h-9 w-9 rounded-full object-cover ring-2 ring-sense-border"
      />
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sense-border text-sm font-bold text-gray-300">
      {member.name.charAt(0).toUpperCase()}
    </div>
  );
}
