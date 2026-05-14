const RARITY_CONFIG = {
  common: {
    label: 'Oddiy',
    border: 'border-gold/40',
    glow: '',
    badge: 'bg-gold/15 text-gold border-gold/30',
    stars: 1,
  },
  rare: {
    label: 'Kamyob',
    border: 'border-[#7c3aed]/60',
    glow: 'shadow-[0_0_20px_rgba(124,58,237,0.25)]',
    badge: 'bg-purple-900/40 text-purple-300 border-purple-500/40',
    stars: 2,
  },
  legendary: {
    label: 'Afsonaviy',
    border: 'border-amber-400/70',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.35)]',
    badge: 'bg-amber-900/40 text-amber-300 border-amber-400/50',
    stars: 3,
  },
};

export default function HeroCard({ hero, owned, size = 'md', onClick }) {
  const cfg = RARITY_CONFIG[hero.rarity] || RARITY_CONFIG.common;
  const isLocked = !owned && hero.rarity === 'legendary';
  const isSmall = size === 'sm';

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col rounded-xl border-2 overflow-hidden transition-all duration-300 select-none
        ${cfg.border} ${cfg.glow}
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${owned ? 'opacity-100' : isLocked ? 'opacity-60' : 'opacity-90 hover:opacity-100'}
        ${isSmall ? 'w-28' : 'w-full'}
      `}
      style={{ background: `linear-gradient(160deg, #0d2b3e 0%, ${hero.accent}22 100%)` }}
    >
      {/* Owned badge */}
      {owned && (
        <div className="absolute top-2 right-2 z-10 px-1.5 py-0.5 bg-emerald-900/80 border border-emerald-500/50 rounded text-emerald-400 text-[10px] font-medium">
          Mavjud
        </div>
      )}

      {/* Locked overlay */}
      {isLocked && !owned && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 rounded-xl">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white/50">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Card art */}
      <div
        className={`relative flex items-center justify-center overflow-hidden ${isSmall ? 'h-20' : 'h-32'}`}
        style={{ background: `radial-gradient(circle at 50% 60%, ${hero.accent}35 0%, transparent 70%)` }}
      >
        {hero.rarity === 'legendary' && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${hero.accent} 0px, ${hero.accent} 1px, transparent 1px, transparent 12px)`,
            }}
          />
        )}
        <span
          className={`font-serif font-bold z-10 ${isSmall ? 'text-3xl' : 'text-5xl'}`}
          style={{ color: hero.accent, textShadow: `0 0 30px ${hero.accent}60` }}
        >
          {hero.initial}
        </span>
      </div>

      {/* Card info */}
      <div className={`flex flex-col ${isSmall ? 'p-2 gap-1' : 'p-3 gap-2'}`}>
        <div className="flex items-start justify-between gap-1">
          <div>
            <p className={`text-cream font-semibold leading-tight ${isSmall ? 'text-[11px]' : 'text-sm'}`}>
              {hero.name}
            </p>
            {!isSmall && (
              <p className="text-cream/50 text-[11px] mt-0.5">{hero.title}</p>
            )}
          </div>
          <span className={`flex-shrink-0 px-1.5 py-0.5 rounded border text-[9px] font-medium ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>

        {!isSmall && (
          <p className="text-cream/60 text-[11px] leading-relaxed border-t border-white/10 pt-2">
            <span className="text-gold/70">⚡ </span>{hero.ability}
          </p>
        )}
      </div>
    </div>
  );
}
