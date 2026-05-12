const TIER_COLORS = {
  bronze: '#b8893f',
  silver: '#cbd5e1',
  gold: '#d4a574',
  platinum: '#a3e4ff',
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
    <>
      <path d="M3 21 H21 M5 21 V11 M19 21 V11 M9 21 V14 M15 21 V14 M3 9 L12 4 L21 9 Z" />
    </>
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
  const color = TIER_COLORS[badge.tier] || TIER_COLORS.bronze;
  return (
    <div
      className={`relative p-6 border rounded-sm transition-all duration-500 ${
        unlocked
          ? 'border-gold/60 bg-bg-mid/60 backdrop-blur shadow-[0_0_30px] shadow-gold/10'
          : 'border-gold/15 bg-bg-mid/30 grayscale opacity-60'
      }`}
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${
          unlocked ? 'animate-float-slow' : ''
        }`}
        style={{
          background: unlocked
            ? `radial-gradient(circle at 30% 30%, ${color}, ${color}44)`
            : 'rgba(255,255,255,0.04)',
          boxShadow: unlocked ? `0 0 20px ${color}66` : 'none',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={unlocked ? '#0a1f2e' : 'currentColor'}
          strokeWidth="1.5"
          className={`w-8 h-8 ${unlocked ? '' : 'text-gold/40'}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {ICONS[badge.icon] || ICONS.compass}
        </svg>
      </div>
      <h4 className="font-serif text-cream text-xl mb-1">{badge.name}</h4>
      <p className="text-cream-soft/70 text-sm leading-snug">{badge.description}</p>
      {unlocked && (
        <span className="absolute top-3 right-3 text-[10px] tracking-[2px] uppercase text-gold">
          ✦ Ochilgan
        </span>
      )}
    </div>
  );
}
