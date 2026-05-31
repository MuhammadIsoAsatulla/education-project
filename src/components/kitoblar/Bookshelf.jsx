import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import BookCover from './BookCover.jsx';

/** Varied heights/widths so the shelf feels organic — widths stay generous
 *  enough that every horizontal title remains readable. */
const SIZES = [
  { w: 174, h: 304 },
  { w: 162, h: 262 },
  { w: 178, h: 290 },
  { w: 160, h: 250 },
  { w: 170, h: 298 },
  { w: 166, h: 272 },
];

const NEIGHBOR_SHIFT = 46; // spread enough to reveal a book hidden by overlap
const OVERLAP = 0.22; // each book sits ~22% over its left neighbour
const PULL_MS = 680;

export default function Bookshelf({ books, onFeature }) {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [pulling, setPulling] = useState(null);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const enter = (i) => {
    if (pulling !== null) return;
    setHovered(i);
    onFeature(books[i]);
  };
  const leave = () => {
    if (pulling !== null) return;
    setHovered(null);
  };
  const activate = (i, book) => {
    if (pulling !== null) return;
    setPulling(i);
    onFeature(book);
    timer.current = setTimeout(
      () => navigate(`/kitoblar/${book.slug}`),
      reduceMotion ? 0 : PULL_MS
    );
  };

  return (
    <div className="relative">
      {/* Mobile: horizontal scroll shelf (native swipe). Desktop: centered row. */}
      <div className="no-scrollbar overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 pb-1">
        <div className="relative mx-auto" style={{ maxWidth: 1240, minWidth: 'min-content' }}>
          <ul
            className="flex items-end justify-start md:justify-center list-none m-0 p-0 pt-28 sm:pt-32 px-10"
            style={{ perspective: 1600 }}
          >
            {books.map((b, i) => {
              const sz = SIZES[i % SIZES.length];
              const isFront = pulling === i || hovered === i;
              const phase =
                pulling === i
                  ? 'pulling'
                  : hovered === null
                  ? 'idle'
                  : hovered === i
                  ? 'active'
                  : 'dim';
              const shiftX =
                hovered === null || hovered === i ? 0 : i < hovered ? -NEIGHBOR_SHIFT : NEIGHBOR_SHIFT;
              return (
                <li
                  key={b.id}
                  className="relative flex-shrink-0"
                  style={{
                    marginLeft: i === 0 ? 0 : -Math.round(sz.w * OVERLAP),
                    zIndex: isFront ? 50 : i + 1,
                  }}
                >
                  <BookCover
                    book={b}
                    index={i}
                    width={sz.w}
                    height={sz.h}
                    phase={phase}
                    shiftX={shiftX}
                    reduceMotion={reduceMotion}
                    onEnter={enter}
                    onLeave={leave}
                    onActivate={activate}
                  />
                </li>
              );
            })}
          </ul>

          <ShelfBoard />
        </div>
      </div>
    </div>
  );
}

/** Wooden luxury shelf with a gold reflective lip and depth shadow. */
function ShelfBoard() {
  return (
    <div className="relative select-none" aria-hidden="true">
      {/* Reflective gold lip */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      {/* Plank face */}
      <div
        className="relative h-6 sm:h-7 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #6d5029 0%, #4a3719 46%, #2c2010 100%)',
          boxShadow:
            'inset 0 1px 0 rgba(232,200,152,0.45), 0 22px 34px -12px rgba(0,0,0,0.75)',
        }}
      >
        {/* gold reflection on the top half */}
        <div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{ background: 'linear-gradient(180deg, rgba(232,200,152,0.30), transparent)' }}
        />
        {/* faint wood grain */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              'repeating-linear-gradient(90deg, rgba(0,0,0,0.14) 0 2px, transparent 2px 8px)',
          }}
        />
      </div>
      {/* Front edge depth */}
      <div className="h-2.5" style={{ background: 'linear-gradient(180deg, #1c1409, #0c0804)' }} />
      {/* Soft cast shadow */}
      <div className="h-7 bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
}
