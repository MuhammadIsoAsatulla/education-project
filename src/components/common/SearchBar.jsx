import { useEffect, useRef } from 'react';

/**
 * Slim themed input for filtering a section's listing in place. Controlled —
 * parent owns the `value` and passes `onChange` so the same query can drive
 * a useMemo filter on the underlying array.
 *
 *  <SearchBar value={q} onChange={setQ} placeholder="..." />
 *
 * `count` (optional) shows "N ta natija" once the user has typed, so an
 * empty result doesn't feel broken.
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Qidirish...',
  count,
  total,
  autoFocus = false,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // "/" anywhere on the page focuses this search. GitHub / YouTube / Twitter
  // all use this shortcut, so the keystroke is already in many users' muscle
  // memory. We guard against firing while the user is typing in another
  // input/textarea/contenteditable so it doesn't hijack normal keystrokes,
  // and against typed-in-some-other-modal cases (we only act if no other
  // text input has focus).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const el = document.activeElement;
      if (el) {
        const tag = el.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (el.isContentEditable) return;
      }
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const trimmed = (value || '').trim();
  const showCount = trimmed.length > 0 && typeof count === 'number';

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        {/* Magnifying glass icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70 pointer-events-none"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>

        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          title="Qidirish (/)"
          className="w-full bg-bg-deep/60 backdrop-blur border border-gold/30 hover:border-gold/50 focus:border-gold/80 focus:outline-none focus:ring-2 focus:ring-gold/20 rounded-full pl-11 pr-14 py-2.5 sm:py-3 text-base font-serif text-cream-soft placeholder:text-cream-soft/40 transition-all"
        />

        {/* Clear button or "/" hint — mutually exclusive on the right side */}
        {trimmed.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Tozalash"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-cream-soft/60 hover:text-gold hover:bg-gold/10 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <kbd
            aria-hidden="true"
            className="hidden sm:inline-flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center w-5 h-5 rounded border border-gold/20 text-cream-soft/45 text-[11px] font-medium pointer-events-none"
          >
            /
          </kbd>
        )}
      </div>

      {showCount && (
        <p className="text-center text-xs text-cream-soft/60 mt-2 font-serif italic">
          {count === 0
            ? 'Hech narsa topilmadi'
            : `${count}${typeof total === 'number' ? ' / ' + total : ''} ta natija`}
        </p>
      )}
    </div>
  );
}
