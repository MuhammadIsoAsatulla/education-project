import avatars from '../../data/avatars.json';

const PATTERNS = {
  stars: (
    <g fill="none" stroke="currentColor" strokeWidth="0.8">
      <circle cx="50" cy="50" r="32" />
      <circle cx="50" cy="50" r="22" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1="50" y1="14" x2="50" y2="86" transform={`rotate(${i * 22.5} 50 50)`} />
      ))}
    </g>
  ),
  octagon: (
    <g fill="none" stroke="currentColor" strokeWidth="0.9">
      <polygon points="50,16 70,24 80,44 80,56 70,76 50,84 30,76 20,56 20,44 30,24" />
      <polygon points="50,24 64,30 72,44 72,56 64,70 50,76 36,70 28,56 28,44 36,30" />
      <circle cx="50" cy="50" r="10" />
    </g>
  ),
  vine: (
    <g fill="none" stroke="currentColor" strokeWidth="0.8">
      <path d="M20 50 Q35 20 50 50 Q65 80 80 50" />
      <path d="M20 50 Q35 80 50 50 Q65 20 80 50" />
      <circle cx="50" cy="50" r="5" />
      <circle cx="30" cy="50" r="3" />
      <circle cx="70" cy="50" r="3" />
    </g>
  ),
  dome: (
    <g fill="none" stroke="currentColor" strokeWidth="0.9">
      <path d="M22 75 L22 50 Q22 28 50 28 Q78 28 78 50 L78 75 Z" />
      <line x1="50" y1="28" x2="50" y2="14" />
      <circle cx="50" cy="12" r="2.5" fill="currentColor" />
      <path d="M30 75 L30 55 Q30 42 50 42 Q70 42 70 55 L70 75" />
    </g>
  ),
  music: (
    <g fill="none" stroke="currentColor" strokeWidth="0.9">
      <ellipse cx="40" cy="68" rx="10" ry="7" />
      <path d="M50 68 L50 28 L72 24" />
      <ellipse cx="62" cy="60" rx="10" ry="7" />
      <path d="M72 60 L72 24" />
      <path d="M50 36 L72 32" />
    </g>
  ),
  tower: (
    <g fill="none" stroke="currentColor" strokeWidth="0.9">
      <path d="M40 80 L40 30 L60 30 L60 80 Z" />
      <ellipse cx="50" cy="24" rx="14" ry="10" />
      <line x1="40" y1="42" x2="60" y2="42" />
      <line x1="40" y1="55" x2="60" y2="55" />
      <line x1="40" y1="68" x2="60" y2="68" />
      <line x1="50" y1="24" x2="50" y2="12" />
      <circle cx="50" cy="10" r="2.5" fill="currentColor" />
    </g>
  ),
  book: (
    <g fill="none" stroke="currentColor" strokeWidth="0.9">
      <path d="M20 28 L20 76 Q35 70 50 76 L50 28 Q35 22 20 28 Z" />
      <path d="M50 28 Q65 22 80 28 L80 76 Q65 70 50 76" />
      <line x1="50" y1="28" x2="50" y2="76" />
    </g>
  ),
  crescent: (
    <g fill="none" stroke="currentColor" strokeWidth="0.9">
      <circle cx="50" cy="50" r="28" />
      <path d="M58 26 A28 28 0 1 0 58 74 A22 22 0 1 1 58 26 Z" fill="currentColor" />
      <circle cx="78" cy="34" r="2" fill="currentColor" />
    </g>
  ),
};

export default function Avatar({ avatarId = 'girih-1', initial = 'M', size = 80, className = '' }) {
  const avatar = avatars.find((a) => a.id === avatarId) || avatars[0];
  const pattern = PATTERNS[avatar.pattern] || PATTERNS.stars;
  const px = `${size}px`;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden border-2 border-gold shadow-[0_0_40px_rgba(212,165,116,0.25)] ${className}`}
      style={{
        width: px,
        height: px,
        background: `radial-gradient(circle at 30% 30%, ${avatar.accent}, var(--bg-deep) 80%)`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full opacity-50"
        style={{ color: avatar.accent }}
      >
        {pattern}
      </svg>
      <span
        className="relative font-serif font-medium text-cream select-none"
        style={{
          fontSize: size * 0.4 + 'px',
          letterSpacing: '2px',
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}
      >
        {initial}
      </span>
    </div>
  );
}
