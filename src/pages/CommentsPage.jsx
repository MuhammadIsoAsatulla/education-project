import { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import CommentCard from '../components/common/CommentCard.jsx';
import CommentForm from '../components/common/CommentForm.jsx';
import OrnamentDivider from '../components/common/OrnamentDivider.jsx';
import useProgress from '../hooks/useProgress.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

const SECTION_LABELS = {
  allomalar: 'Allomalar',
  muzeylar: 'Muzeylar',
  musiqa: 'Musiqa',
  kinolar: 'Kinolar',
  kitoblar: 'Kitoblar',
};

export default function CommentsPage() {
  useScrollReveal();
  const { type, id } = useParams();
  const location = useLocation();
  const { state } = useProgress();
  const [sort, setSort] = useState('top'); // 'top' | 'newest'

  const contentKey = `${type}/${id}`;
  const all = state.comments?.[contentKey] || [];
  const contentTitle = location.state?.contentTitle || id;

  const sorted = useMemo(() => {
    const arr = [...all];
    if (sort === 'top') {
      arr.sort((a, b) => (b.likes || 0) - (a.likes || 0) || b.createdAt - a.createdAt);
    } else {
      arr.sort((a, b) => b.createdAt - a.createdAt);
    }
    return arr;
  }, [all, sort]);

  return (
    <article>
      <header
        className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(212,165,116,0.15), var(--bg-deep) 60%)' }}
      >
        <div className="absolute inset-0 bg-girih opacity-40 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <Link
            to={`/${type}/${id}`}
            className="inline-flex items-center gap-2 text-gold/70 hover:text-gold text-xs tracking-[2px] uppercase mb-6"
          >
            <svg
              viewBox="0 0 20 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-5 h-3 rotate-180"
            >
              <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
            </svg>
            {SECTION_LABELS[type] || type} ga qaytish
          </Link>
          <OrnamentDivider className="opacity-60 mb-5" />
          <div className="eyebrow mb-3">— BARCHA SHARHLAR —</div>
          <h1
            className="font-serif text-gold-gradient leading-[0.95] mb-3"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
          >
            {contentTitle}
          </h1>
          <p className="font-serif italic text-cream-soft text-lg">{all.length} ta fikr-mulohaza</p>
        </div>
      </header>

      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-3xl mx-auto">
        {/* Sort */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { id: 'top', label: 'Eng yoqgani' },
            { id: 'newest', label: 'Eng yangisi' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={`px-4 py-2 rounded-full text-xs tracking-[2px] uppercase transition ${
                sort === s.id
                  ? 'bg-gold text-bg-deep border border-gold'
                  : 'border border-gold/30 text-cream-soft/80 hover:text-gold hover:border-gold/70'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* New comment form */}
        <CommentForm contentKey={contentKey} onSubmitted={() => {}} />

        {/* Comments list */}
        <div className="space-y-4 mt-8">
          {sorted.length === 0 ? (
            <p className="text-center font-serif italic text-cream-soft/60 py-12">
              Hali sharhlar yo'q. Birinchi bo'lib siz fikr bildiring.
            </p>
          ) : (
            sorted.map((c) => <CommentCard key={c.id} comment={c} contentKey={contentKey} />)
          )}
        </div>
      </section>
    </article>
  );
}
