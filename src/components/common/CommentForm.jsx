import { useState } from 'react';
import useProgress from '../../hooks/useProgress.js';

export default function CommentForm({ contentKey, onSubmitted, onCancel }) {
  const { addComment } = useProgress();
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const submit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed.length < 3) return;
    addComment(contentKey, { text: trimmed, rating: rating || null });
    setText('');
    setRating(0);
    onSubmitted?.();
  };

  return (
    <form
      onSubmit={submit}
      className="p-5 rounded-sm border border-gold/30 bg-bg-mid/50 backdrop-blur"
    >
      {/* Star rating */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-cream-soft/70 text-xs tracking-[2px] uppercase">Reyting:</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="px-0.5 text-2xl leading-none transition-transform hover:scale-110 min-h-9 min-w-9 flex items-center justify-center"
              aria-label={`${n} yulduz`}
            >
              <span className={(hover || rating) >= n ? 'text-gold' : 'text-gold/20'}>
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        maxLength={500}
        placeholder="Fikr-mulohazangizni yozing..."
        className="w-full bg-bg-deep/50 border border-gold/20 rounded-sm p-3 text-cream font-serif text-base sm:text-base md:text-lg outline-none focus:border-gold/60 transition resize-none placeholder:text-cream-soft/40"
      />

      <div className="flex items-center justify-between mt-3">
        <span className="text-cream-soft/40 text-xs">
          {text.length} / 500
        </span>
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-cream-soft/60 hover:text-gold text-xs tracking-[2px] uppercase transition min-h-9 min-w-9 flex items-center justify-center"
            >
              Bekor qilish
            </button>
          )}
          <button
            type="submit"
            disabled={text.trim().length < 3}
            className="gold-cta disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Sharh qoldirish</span>
          </button>
        </div>
      </div>
    </form>
  );
}
