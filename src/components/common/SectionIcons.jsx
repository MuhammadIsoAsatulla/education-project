/**
 * Per-section glyphs used by PageHero as the section-identity accent.
 *
 * Each is a 64×64 viewBox monoline SVG (strokeWidth 1.2) sized at the call
 * site. `currentColor` so they inherit text colour from the parent — let
 * PageHero tint them via its gold-tone wrapper.
 *
 * Restraint rules:
 *   - One single glyph per section (don't combine multiple metaphors)
 *   - Monoline, no fills, no shadows — they sit at small sizes (~36px)
 *   - Visually distinct between adjacent sections (allomalar vs. jadidlar,
 *     allomalar vs. kitoblar) so users can tell them apart at a glance
 */

// Allomalar — classical scholarship. A scroll/manuscript with stacked text lines.
export function AllomalarIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M14 10 L46 10 Q50 10 50 14 L50 50 Q50 54 46 54 L18 54 Q14 54 14 50 Z" />
      <path d="M20 18 L42 18 M20 24 L42 24 M20 30 L42 30 M20 36 L36 36" />
      <circle cx="32" cy="46" r="2.5" fill="currentColor" />
    </svg>
  );
}

// Jadidlar — torch (ma'rifat / enlightenment). Same motif as the home grid.
export function JadidlarIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M32 6 C26 14 22 20 22 28 C22 34 26 38 32 38 C38 38 42 34 42 28 C42 20 38 14 32 6 Z" />
      <path d="M32 14 C29 19 27 23 27 28 C27 31 29 33 32 33" />
      <path d="M28 38 L28 50 L36 50 L36 38" />
      <path d="M24 42 L40 42" />
      <path d="M26 50 L38 50 L36 58 L28 58 Z" />
    </svg>
  );
}

// Muzeylar — dome + base of a madrasa / mosque.
export function MuzeylarIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M32 6 L32 14" />
      <circle cx="32" cy="14" r="1.6" fill="currentColor" />
      <path d="M14 36 Q14 16 32 16 Q50 16 50 36" />
      <path d="M8 36 L56 36" />
      <path d="M14 36 L14 52 M22 36 L22 52 M30 36 L30 52 M34 36 L34 52 M42 36 L42 52 M50 36 L50 52" />
      <path d="M8 52 L56 52" />
    </svg>
  );
}

// Musiqa — tanbur (long-necked Uzbek lute).
export function MusiqaIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <ellipse cx="22" cy="44" rx="14" ry="12" />
      <path d="M30 36 L52 14" />
      <path d="M52 10 L56 6 L58 8 L54 12 Z" />
      <path d="M22 32 L22 56" strokeOpacity="0.5" />
      <path d="M26 32 L26 56" strokeOpacity="0.5" />
      <circle cx="22" cy="44" r="3" />
    </svg>
  );
}

// Kinolar — film reel (35mm head-on).
export function KinolarIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <circle cx="32" cy="32" r="22" />
      <circle cx="32" cy="32" r="5" />
      <circle cx="32" cy="14" r="3" fill="currentColor" />
      <circle cx="50" cy="32" r="3" fill="currentColor" />
      <circle cx="32" cy="50" r="3" fill="currentColor" />
      <circle cx="14" cy="32" r="3" fill="currentColor" />
    </svg>
  );
}

// Kitoblar — open book (deliberately different from allomalar's scroll).
export function KitoblarIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M8 16 Q20 12 32 16 L32 50 Q20 46 8 50 Z" />
      <path d="M32 16 Q44 12 56 16 L56 50 Q44 46 32 50 Z" />
      <path d="M14 24 L26 25 M14 30 L26 31 M14 36 L26 37" />
      <path d="M38 25 L50 24 M38 31 L50 30 M38 37 L50 36" />
    </svg>
  );
}

// Profil — a single-stroke star (the "Mening Ziyom" emblem from the home grid).
export function ProfilIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M32 8 L36 24 L52 24 L40 34 L44 50 L32 40 L20 50 L24 34 L12 24 L28 24 Z" />
    </svg>
  );
}
