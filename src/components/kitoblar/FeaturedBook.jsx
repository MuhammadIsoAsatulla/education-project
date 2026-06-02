import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import BookCoverFace from './BookCoverFace.jsx';

const EASE = [0.22, 1, 0.36, 1];

/** Pull a short, clean quote from the book's first excerpt (or annotation). */
function quoteOf(book) {
  const raw = (book.excerpts?.[0]?.text || book.annotation || '').trim();
  const firstLine = raw.split('\n')[0];
  const m = firstLine.match(/^(.*?[.!?…])(\s|$)/);
  const sentence = m ? m[1] : firstLine;
  return sentence.replace(/^[«»"'\s]+|[«»"'\s]+$/g, '').trim();
}

export default function FeaturedBook({ book }) {
  const reduce = useReducedMotion();
  const fade = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -14 },
      };

  return (
    <div className="relative grid lg:grid-cols-[268px_1fr] gap-4 sm:gap-6 lg:gap-14 items-center">
      {/* Large cover */}
      <div className="mx-auto lg:mx-0" style={{ width: 268, maxWidth: 'min(70vw, 260px)' }}>
        <div className="relative" style={{ perspective: 1400 }}>
          {/* glow */}
          <div
            className="absolute -inset-6 rounded-3xl blur-2xl pointer-events-none"
            style={{ background: `radial-gradient(ellipse, ${book.accent}33, transparent 70%)` }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={book.id + '-cover'}
              {...fade}
              transition={{ duration: 0.45, ease: EASE }}
              className="relative"
              style={{ aspectRatio: '3 / 4.4' }}
            >
              <BookCoverFace book={book} lit large />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={book.id + '-text'}
          {...fade}
          transition={{ duration: 0.45, ease: EASE }}
          className="text-center lg:text-left"
        >
          <p className="text-gold uppercase font-semibold mb-3" style={{ fontSize: 12, letterSpacing: '3px' }}>
            {book.genre}
          </p>
          <h2 className="font-serif text-cream leading-tight mb-4" style={{ fontSize: 'clamp(22px, 4vw, 52px)' }}>
            {book.title}
          </h2>

          <blockquote
            className="font-serif italic text-gold-bright/90 mb-5"
            style={{ fontSize: 'clamp(18px, 2vw, 26px)', textShadow: '0 2px 14px rgba(0,0,0,0.4)' }}
          >
            “{quoteOf(book)}”
          </blockquote>

          <p className="text-cream-soft/80 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-7" style={{ fontSize: 16 }}>
            {book.annotation}
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link to={`/kitoblar/${book.slug}`} className="gold-cta">
              <span>O'qish</span>
            </Link>
          </div>

          <p className="text-cream-soft/45 mt-5" style={{ fontSize: 12.5 }}>
            {book.author} · {book.year} · {book.pages} bet · {book.language}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
