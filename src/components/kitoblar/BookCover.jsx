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

  const coverAnim = reduceMotion
    ? {}
    : pulling
    ? { y: -54, scale: 1.12, rotateY: -13 }
    : active
    ? { y: -22, scale: 1.06, rotateY: 0 }
    : { y: 0, scale: 1, rotateY: 0 };

  const wrapAnim = reduceMotion ? {} : { x: dim ? shiftX : 0, opacity: dim ? 0.78 : 1 };

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

      {/* The book itself */}
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
        <BookCoverFace book={book} lit={active || pulling} />
      </motion.a>

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
