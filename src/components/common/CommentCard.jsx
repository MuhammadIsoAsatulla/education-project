import { useState } from 'react';
import Avatar from '../profil/Avatar.jsx';
import useProgress from '../../hooks/useProgress.js';

function relativeTime(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'hozirgina';
  if (diff < 3600) return `${Math.floor(diff / 60)} daq oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} kun oldin`;
  return new Date(ts).toLocaleDateString('uz-UZ');
}

export default function CommentCard({ comment, contentKey, preview = false }) {
  const { state, likeComment, deleteComment } = useProgress();
  const [pulsing, setPulsing] = useState(false);
  const isLiked = state.likedComments?.includes(comment.id);
  const isMine = comment.author?.name === state.name;
  const initial = (comment.author?.name || 'M').trim().charAt(0).toUpperCase();

  const onLike = () => {
    setPulsing(true);
    likeComment(contentKey, comment.id);
    setTimeout(() => setPulsing(false), 500);
  };

  return (
    <article className="flex gap-3 p-4 rounded-sm border border-gold/15 bg-bg-mid/40 backdrop-blur hover:border-gold/35 transition">
      <Avatar avatarId={comment.author?.avatar || 'girih-1'} initial={initial} size={44} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-serif text-cream text-sm font-medium truncate">
              {comment.author?.name || 'Mehmon'}
            </span>
            {comment.rating ? (
              <span className="text-gold text-xs">
                {'★'.repeat(comment.rating)}
                <span className="text-gold/20">{'★'.repeat(5 - comment.rating)}</span>
              </span>
            ) : null}
          </div>
          <span className="text-cream-soft/40 text-[10px] tracking-[1px] uppercase flex-shrink-0">
            {relativeTime(comment.createdAt)}
          </span>
        </div>

        <p
          className={`font-serif text-cream-soft text-sm leading-relaxed mb-3 ${
            preview ? 'line-clamp-3' : ''
          }`}
        >
          {comment.text}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onLike}
            className={`inline-flex items-center gap-1.5 text-xs transition ${
              isLiked ? 'text-crimson' : 'text-cream-soft/50 hover:text-crimson'
            } ${pulsing ? 'heart-pulse' : ''}`}
            aria-label="Yoqtirish"
          >
            <svg
              viewBox="0 0 24 24"
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-4 h-4"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21l8.84-8.61a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="tabular-nums">{comment.likes || 0}</span>
          </button>

          {isMine && (
            <button
              onClick={() => deleteComment(contentKey, comment.id)}
              className="text-cream-soft/30 hover:text-crimson text-[10px] tracking-[2px] uppercase transition"
            >
              O'chirish
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
