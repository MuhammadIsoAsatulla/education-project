import { motion, AnimatePresence } from 'framer-motion';
import BookCoverFace from './BookCoverFace.jsx';

const EASE = [0.22, 1, 0.36, 1];

/**
 * A single book standing on the shelf.
 *
 * Interaction is driven entirely by `phase` (idle | active | dim | pulling) and
 * `shiftX`, which the parent <Bookshelf> derives from the currently hovered
 * index — this keeps one source of truth and avoids hover races between the
 * cover and its floating info card. The whole unit is a real <a href> so
 * right-click / open-in-new-tab and keyboard activation all work; the click is
 * intercepted only to play the pull-out animation before navigating.
 */
export default function BookCover({
  book,
  index,
  width,
  height,
  phase,
  shiftX,
  reduceMotion,
  onEnter,
  onLeave,
  onActivate,
}) {
  const active = phase === 'active';
  const dim = phase === 'dim';
  const pulling = phase === 'pulling';

  // Thickness of the book (depth in 3D space). Varies a bit per book so the
  // shelf doesn't look like a row of identical objects.
  const depth = 12 + ((index * 5) % 8); // 12–19 px
  // Books stand straight at rest. The previous design gave each book an
  // ±3-5° idle tilt for "lived-in" feel, but with 22% overlap between
  // neighbours the tilted top corners poke out from behind the front book
  // (CSS 3D has no pixel-level z-buffer, only stacking order). Straight
  // books cleanly occlude their neighbours — the spine on the left + cast
  // shadow gives all the 3D feel we need without the intersection bug.

  const coverAnim = reduceMotion
    ? {}
    : pulling
    ? { y: -54, scale: 1.12, rotateY: -13 }
    : active
    ? { y: -22, scale: 1.06, rotateY: 0 }
    : { y: 0, scale: 1, rotateY: 0 };

  // Non-hovered books shift sideways to reveal the active one, but their
  // opacity stays at 1 — dropping opacity to 0.78 (as the previous version
  // did) made the books actually translucent, so the user saw through one
  // ornate cover to the next ornate cover behind it ("Temur Tuzuklari"
  // visible through "Jaloliddin Manguberdi", etc.). The sideways shift
  // alone communicates the dim/inactive state without breaking opacity.
  const wrapAnim = reduceMotion ? {} : { x: dim ? shiftX : 0, opacity: 1 };

  return (
    <motion.div
      className="relative flex-shrink-0"
      style={{ width, perspective: 1500 }}
      animate={wrapAnim}
      transition={{ duration: 0.42, ease: EASE }}
      onMouseEnter={() => onEnter(index)}
      onMouseLeave={onLeave}
    >
      {/* Contact shadow — stays on the shelf while the book lifts */}
      <motion.span
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          bottom: -9,
          width: width * 0.84,
          height: 15,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6), transparent 72%)',
          filter: 'blur(3px)',
          zIndex: 0,
        }}
        animate={
          reduceMotion
            ? {}
            : { opacity: active || pulling ? 0.9 : 0.5, scaleX: active || pulling ? 1.12 : 1 }
        }
        transition={{ duration: 0.42, ease: EASE }}
      />

      {/* The book itself — a real 3D box: front cover + right pages edge
          + top edge, all positioned in 3D space (preserve-3d). The idle
          rotateY tilt makes those side faces actually visible. */}
      <motion.a
        href={`/kitoblar/${book.slug}`}
        aria-label={`${book.title} — ${book.author}. ${book.genre}. Mutolaani ochish.`}
        className="relative block rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
        style={{
          height,
          transformStyle: 'preserve-3d',
          transformOrigin: 'bottom center',
        }}
        animate={coverAnim}
        transition={{ duration: pulling ? 0.62 : 0.42, ease: EASE }}
        onFocus={() => onEnter(index)}
        onBlur={onLeave}
        onClick={(e) => {
          e.preventDefault();
          onActivate(index, book);
        }}
      >
        {/* PAGES EDGE — the right face of the book, rotated 90° so it sits
            perpendicular to the front cover. The cream→tan gradient with
            fine horizontal lines reads as a stack of paper pages. */}
        <span
          aria-hidden
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            right: 0,
            width: depth,
            transform: `translateX(${depth / 2}px) rotateY(90deg)`,
            transformOrigin: 'left center',
            background:
              'linear-gradient(180deg, #f4e4be 0%, #e6d29b 22%, #d9bf80 55%, #c8a866 100%)',
            backgroundImage:
              'repeating-linear-gradient(180deg, rgba(120,80,30,0.18) 0 1px, transparent 1px 4px), linear-gradient(180deg, #f4e4be 0%, #e6d29b 22%, #d9bf80 55%, #c8a866 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(140,100,50,0.35)',
            borderRadius: '0 2px 2px 0',
          }}
        />

        {/* TOP EDGE — gives the book real height when viewed slightly from
            above. Same paper colour, rotated about the X axis. */}
        <span
          aria-hidden
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: 0,
            height: depth,
            transform: `translateY(-${depth / 2}px) rotateX(90deg)`,
            transformOrigin: 'center bottom',
            background:
              'linear-gradient(90deg, #2c2010 0%, #4a3719 14%, #f4e4be 18%, #e6d29b 92%, #4a3719 96%, #2c2010 100%)',
          }}
        />

        <BookCoverFace book={book} lit={active || pulling} />

        {/* LEFT SPINE OVERLAY — a wider dark band painted ON TOP of the
            cover face's left edge. This is THE separator between adjacent
            books on the shelf: when the next book overlaps the previous
            one, this strip lands exactly at the boundary and reads as a
            clean book-spine gutter. Without it, two ornate covers with
            similar artwork (e.g. Layli va Majnun next to Saddi Iskandariy)
            visually blend across the overlap and look transparent. */}
        <span
          aria-hidden
          className="absolute top-0 bottom-0 left-0 pointer-events-none transition-opacity duration-300"
          style={{
            width: 9,
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.18) 88%, transparent 100%)',
            opacity: active || pulling ? 0 : 1,
          }}
        />

        {/* RIGHT-EDGE CAST SHADOW — when this book is the leftmost / not
            covered by another, its own right edge still gets a soft
            shadow so the shelf reads as 3D (the trailing rightmost book
            looks recessed against the dark page). Fades when lifted. */}
        <span
          aria-hidden
          className="absolute top-0 bottom-0 right-0 pointer-events-none transition-opacity duration-300"
          style={{
            width: '18%',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0.28) 100%)',
            opacity: active || pulling ? 0 : 1,
          }}
        />
      </motion.a>

      {/* Persistent caption below the book — small museum-placard with title
          + author. Lives in normal flow so it claims its own vertical space
          and never overlaps the next shelf. Visible at rest so users can
          identify each book on the shelf without hovering. */}
      <div
        className="text-center select-none pointer-events-none px-1"
        style={{ marginTop: 14, minHeight: 32 }}
      >
        <p className="font-serif text-cream/85 text-[11px] leading-tight line-clamp-2">
          {book.title}
        </p>
        <p className="text-cream-soft/45 text-[9.5px] mt-0.5 tracking-[1.5px] uppercase truncate">
          {book.author}
        </p>
      </div>

      {/* Floating glass info card (hover / focus). Lives inside the wrapper so
          moving the pointer onto it does not trigger mouseleave. */}
      <AnimatePresence>
        {active && !pulling && (
          <motion.div
            key="info"
            className="absolute left-1/2 z-40 -translate-x-1/2 hidden sm:block"
            style={{ bottom: 'calc(100% - 8px)', width: 234 }}
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.26, ease: EASE }}
          >
            <InfoCard book={book} onRead={() => onActivate(index, book)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InfoCard({ book, onRead }) {
  return (
    <div className="relative rounded-xl border border-gold/30 bg-bg-deep/85 backdrop-blur-md shadow-[0_22px_55px_rgba(0,0,0,0.6)] p-4 text-left">
      <p
        className="text-gold uppercase font-semibold"
        style={{ fontSize: 10, letterSpacing: '2.5px' }}
      >
        {book.genre}
      </p>
      <h4 className="font-serif text-cream text-lg leading-tight mt-1">{book.title}</h4>
      <p className="text-cream-soft/70 text-xs mt-0.5 mb-2">— {book.author}</p>
      <p className="text-cream-soft/80 leading-relaxed line-clamp-3" style={{ fontSize: 12.5 }}>
        {book.annotation}
      </p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onRead();
        }}
        className="mt-3 inline-flex items-center gap-1.5 text-gold hover:text-gold-bright transition-colors font-semibold uppercase"
        style={{ fontSize: 11, letterSpacing: '2px' }}
      >
        O'qish
        <span aria-hidden="true">→</span>
      </button>

      {/* Pointer toward the book */}
      <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 rotate-45 bg-bg-deep/85 border-r border-b border-gold/30" />
    </div>
  );
}
