import TierParticles from './TierParticles.jsx';

const TIER_LABELS = {
  common: 'Oddiy',
  rare: 'Nodir',
  epic: 'Buyuk',
  legendary: 'Afsonaviy',
  mythic: 'Asotirim',
  sohibqiron: 'Sohibqiron',
};

const TIER_COLORS = {
  common: '#b8893f',
  rare: '#cbd5e1',
  epic: '#6680c8',
  legendary: '#d4a574',
  mythic: '#e8c898',
  sohibqiron: '#ffce6b',
};

const ICONS = {
  compass: (
    <path d="M12 2 L12 6 M12 18 L12 22 M2 12 L6 12 M18 12 L22 12 M16 8 L13 12 L16 16 M8 8 L11 12 L8 16" />
  ),
  scroll: (
    <>
      <path d="M5 5 H17 V19 H5 Z" />
      <path d="M8 9 H14 M8 12 H14 M8 15 H12" />
    </>
  ),
  telescope: (
    <>
      <path d="M3 18 L8 7 L21 11 L17 16 Z" />
      <path d="M9 22 L11 18 M15 20 L13 18" />
    </>
  ),
  landmark: (
    <path d="M3 21 H21 M5 21 V11 M19 21 V11 M9 21 V14 M15 21 V14 M3 9 L12 4 L21 9 Z" />
  ),
  music: (
    <>
      <path d="M9 18 V6 L19 4 V16" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="16" r="2" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M7 5 V19 M17 5 V19 M3 9 H7 M3 14 H7 M17 9 H21 M17 14 H21" />
    </>
  ),
  'book-open': (
    <path d="M2 5 C7 5 10 6 12 8 C14 6 17 5 22 5 V19 C17 19 14 20 12 22 C10 20 7 19 2 19 Z M12 8 V22" />
  ),
  crown: (
    <path d="M3 18 H21 M3 18 L5 8 L9 13 L12 6 L15 13 L19 8 L21 18 M5 18 V21 H19 V18" />
  ),
};

export default function AchievementBadge({ badge, unlocked }) {
  const tier = badge.tier || 'common';
  const color = TIER_COLORS[tier];
  const tierLabel = TIER_LABELS[tier];
  const isHighTier = ['legendary', 'mythic', 'sohibqiron'].includes(tier);

  return (
    <div
      className={`relative p-5 sm:p-6 border rounded-sm transition-all duration-500 group ${
        unlocked ? `tier-${tier}` : ''
      } ${
        unlocked
          ? 'bg-bg-mid/60 backdrop-blur'
          : 'border-gold/10 bg-bg-mid/20 grayscale opacity-50'
      }`}
      style={
        unlocked
          ? {
              borderColor: tier === 'mythic' || tier === 'sohibqiron' ? 'transparent' : color,
              background:
                tier === 'mythic' || tier === 'sohibqiron'
                  ? 'rgba(10, 31, 46, 0.7)'
                  : `linear-gradient(135deg, ${color}10, rgba(10,31,46,0.6))`,
            }
          : undefined
      }
    >
      {/* Floating particles for high tiers */}
      {unlocked && isHighTier && <TierParticles tier={tier} count={tier === 'sohibqiron' ? 10 : 6} />}

      {/* Tier badge in corner */}
      {unlocked && (
        <span
          className="absolute top-2.5 right-2.5 text-[9px] tracking-[2px] uppercase px-2 py-0.5 rounded-full font-medium z-10"
          style={{
            background: `${color}22`,
            color,
            border: `1px solid ${color}66`,
          }}
        >
          {tierLabel}
        </span>
      )}

      {/* Icon */}
      <div className="relative z-[1]">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 ${
            unlocked ? 'animate-float-slow' : ''
          }`}
          style={{
            background: unlocked
              ? `radial-gradient(circle at 30% 30%, ${color}, ${color}33)`
              : 'rgba(255,255,255,0.04)',
            boxShadow: unlocked ? `0 0 20px ${color}66` : 'none',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={unlocked ? '#0a1f2e' : 'currentColor'}
            strokeWidth="1.5"
            className={`w-7 h-7 sm:w-8 sm:h-8 ${unlocked ? '' : 'text-gold/40'}`}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ICONS[badge.icon] || ICONS.compass}
          </svg>
        </div>

        <h4 className="font-serif text-cream text-lg sm:text-xl mb-1 leading-tight">
          {badge.name}
        </h4>
        <p className="text-cream-soft/70 text-xs sm:text-sm leading-snug">{badge.description}</p>

        {unlocked && (
          <div
            className="mt-3 pt-3 border-t flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase"
            style={{ borderColor: `${color}33`, color }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <path d="M5 13l4 4L19 7" />
            </svg>
            Ochilgan
          </div>
        )}
      </div>
    </div>
  );
}
