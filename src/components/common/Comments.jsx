import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CommentCard from './CommentCard.jsx';
import CommentForm from './CommentForm.jsx';
import OrnamentDivider from './OrnamentDivider.jsx';
import useProgress from '../../hooks/useProgress.js';

/**
 * Inline comments preview for a content item (alloma, kitob, kino, ...).
 * Shows top-3 most-liked + form + "see all" link to /sharhlar/:type/:id.
 */
export default function Comments({ contentType, contentId, contentTitle }) {
  const { state } = useProgress();
  const [formOpen, setFormOpen] = useState(false);
  const contentKey = `${contentType}/${contentId}`;
  const all = state.comments?.[contentKey] || [];

  const top3 = useMemo(() => {
    return [...all]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0) || b.createdAt - a.createdAt)
      .slice(0, 3);
  }, [all]);

  return (
    <section className="px-4 sm:px-6 md:px-12 py-12 sm:py-16 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <OrnamentDivider className="opacity-60 mb-5" />
        <div className="eyebrow mb-3">— FOYDALANUVCHILAR SHARHI —</div>
        <h2 className="section-title mb-3">Fikrlar va Mulohazalar</h2>
        <p className="font-serif italic text-cream-soft/70">
          {all.length > 0
            ? `${all.length} ta sharh — eng yoqgan ${top3.length} tasi`
            : 'Birinchi bo\'lib o\'z fikringizni qoldiring'}
        </p>
      </div>

      {/* Top liked preview */}
      {top3.length > 0 && (
        <div className="space-y-4 mb-6">
          {top3.map((c) => (
            <CommentCard key={c.id} comment={c} contentKey={contentKey} preview />
          ))}
        </div>
      )}

      {/* Form toggle */}
      {!formOpen ? (
        <button
          onClick={() => setFormOpen(true)}
          className="w-full p-4 border border-dashed border-gold/40 rounded-sm text-cream-soft/60 hover:text-gold hover:border-gold transition font-serif italic"
        >
          + Sharh qoldirish
        </button>
      ) : (
        <CommentForm
          contentKey={contentKey}
          onSubmitted={() => setFormOpen(false)}
          onCancel={() => setFormOpen(false)}
        />
      )}

      {/* See all link */}
      {all.length > 3 && (
        <div className="text-center mt-8">
          <Link
            to={`/sharhlar/${contentType}/${contentId}`}
            state={{ contentTitle }}
            className="inline-flex items-center gap-2 text-gold/80 hover:text-gold text-sm tracking-[2px] uppercase"
          >
            Barcha sharhlarni ko'rish ({all.length})
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
}
