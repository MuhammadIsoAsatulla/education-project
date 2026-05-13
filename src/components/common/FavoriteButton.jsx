import useProgress from '../../hooks/useProgress.js';

export default function FavoriteButton({ section, itemId, size = 'md', className = '' }) {
  const { state, toggleFavorite } = useProgress();
  const isFav = (state.favorites?.[section] || []).includes(itemId);

  const dim = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(section, itemId);
      }}
      aria-label={isFav ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
      aria-pressed={isFav}
      className={`relative rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur border ${
        isFav
          ? 'bg-crimson/30 border-crimson/60 text-crimson hover:bg-crimson/50'
          : 'bg-bg-deep/60 border-gold/40 text-cream-soft/80 hover:text-crimson hover:border-crimson/60'
      } ${className}`}
      style={{ width: dim, height: dim }}
    >
      <svg
        viewBox="0 0 24 24"
        fill={isFav ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
        style={{ width: dim * 0.5, height: dim * 0.5 }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
