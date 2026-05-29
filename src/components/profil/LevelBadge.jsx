// Per-level visual config. Tier 1 is intentionally muted (you've just
// started — no rewards yet); each subsequent tier adds one specific kind of
// flair so the upgrade between two tiers is felt, not just read.
//
//   - text gradient gets richer (cream → multi-stop gold)
//   - the icon gets more "ceremonial"
//   - a halo / aura appears and grows
//   - shimmer animation activates from tier 3+
//   - tier 5 adds corner ornaments + a breathing aura
//
// Used by ProfilPage. The `progressGradient` is exported so the level-up
// progress bar can match the badge's colour temperament.
export const LEVEL_CONFIGS = {
  'Yangi sayyoh': {
    tier: 1,
    icon: <CompassIcon />,
    textGradient: 'linear-gradient(135deg, #e8d6a8 0%, #c4b08a 100%)',
    progressGradient: 'linear-gradient(90deg, #8b6b3a 0%, #b8893f 50%, #d4a574 100%)',
    border: 'rgba(212,165,116,0.3)',
    glow: null,
    aura: null,
    shimmer: false,
    ornaments: false,
    motto: "Bilim yo'lining boshlanishi",
  },
  "Ma'rifatchi": {
    tier: 2,
    icon: <FlameIcon />,
    textGradient: 'linear-gradient(135deg, #f5e4b8 0%, #d4a574 100%)',
    progressGradient: 'linear-gradient(90deg, #6b3a1a 0%, #b8893f 30%, #d4a574 65%, #e8c898 100%)',
    border: 'rgba(212,165,116,0.55)',
    glow: '0 0 14px rgba(212,165,116,0.35)',
    aura: 'radial-gradient(circle, rgba(212,165,116,0.18), transparent 65%)',
    shimmer: false,
    ornaments: false,
    motto: "Bilim olovi yondi",
  },
  "Bilim do'sti": {
    tier: 3,
    icon: <BookIcon />,
    textGradient: 'linear-gradient(135deg, #ffd28e 0%, #d4a574 50%, #b8893f 100%)',
    progressGradient: 'linear-gradient(90deg, #4a2a0a 0%, #8b6b3a 25%, #b8893f 50%, #d4a574 75%, #f5e4b8 100%)',
    border: 'rgba(212,165,116,0.75)',
    glow: '0 0 20px rgba(212,165,116,0.45)',
    aura: 'radial-gradient(circle, rgba(212,165,116,0.22), transparent 65%)',
    shimmer: true,
    ornaments: false,
    motto: "Bilim do'stligi",
  },
  'Olim shogirdi': {
    tier: 4,
    icon: <ScholarCapIcon />,
    textGradient:
      'linear-gradient(135deg, #ffe5b0 0%, #f5e4b8 25%, #d4a574 50%, #f5e4b8 75%, #ffe5b0 100%)',
    progressGradient:
      'linear-gradient(90deg, #3a1a06 0%, #6b3a1a 15%, #8b6b3a 30%, #b8893f 45%, #d4a574 60%, #f5e4b8 80%, #ffe5b0 100%)',
    border: 'rgba(245,228,184,0.95)',
    glow: '0 0 26px rgba(245,228,184,0.55), 0 0 50px rgba(212,165,116,0.25)',
    aura: 'radial-gradient(circle, rgba(245,228,184,0.28), transparent 65%)',
    shimmer: true,
    ornaments: true,
    motto: "Olim shogirdligi",
  },
  'Meros vorisi': {
    tier: 5,
    icon: <CrownIcon />,
    textGradient:
      'linear-gradient(135deg, #ffd28e 0%, #ffe5b0 20%, #fff2cf 40%, #ffd28e 60%, #ffe5b0 80%, #ffd28e 100%)',
    progressGradient:
      'linear-gradient(90deg, #4a2a0a, #8b6b3a 15%, #b8893f 30%, #d4a574 50%, #f5e4b8 70%, #ffe5b0 85%, #fff2cf 100%)',
    border: '#ffe5b0',
    glow:
      '0 0 38px rgba(255,229,176,0.7), 0 0 70px rgba(212,165,116,0.45), 0 0 110px rgba(212,165,116,0.22)',
    aura: 'radial-gradient(circle, rgba(255,229,176,0.4), transparent 60%)',
    shimmer: true,
    ornaments: true,
    breathing: true,
    motto: "Meros vorisi",
  },
};

export function getLevelConfig(levelName) {
  return LEVEL_CONFIGS[levelName] || LEVEL_CONFIGS['Yangi sayyoh'];
}

// ─────────────────────────────────────────────────────────────────────────
//  Icons — kept tiny + monochrome so the text gradient drives the colour.
// ─────────────────────────────────────────────────────────────────────────

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10" />
      <path d="M16.24 7.76L14.12 14.12 7.76 16.24l2.12-6.36z" fill="currentColor" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M12 3c0 5-4 6-4 10a4 4 0 0 0 8 0c0-2-2-3-2-5 0 2-2 3-2 5" />
      <path d="M12 3c2 4 6 5 6 10a6 6 0 1 1-12 0c0-3 2-4 3-7" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M4 5c3 0 5 1 8 3 3-2 5-3 8-3v13c-3 0-5 1-8 3-3-2-5-3-8-3V5z" />
      <path d="M12 8v13" />
    </svg>
  );
}

function ScholarCapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M2 10l10-4 10 4-10 4-10-4z" />
      <path d="M6 12v4c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5v-4" />
      <path d="M22 10v6" />
      <circle cx="22" cy="17" r="0.9" fill="currentColor" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 8l3 8h12l3-8-5 4-4-7-4 7-5-4z" />
      <path d="M5 19h14" />
      <circle cx="12" cy="6" r="1.2" fill="currentColor" />
      <circle cx="4" cy="9" r="0.9" fill="currentColor" />
      <circle cx="20" cy="9" r="0.9" fill="currentColor" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────────────────────────────────

export default function LevelBadge({ levelName, size = 'md' }) {
  const config = getLevelConfig(levelName);

  // Tier 2-5 names are longer than "Yangi sayyoh" AND those tiers carry
  // aura + glow that visually inflate the badge. To keep the frame from
  // looking oversized next to tier 1, we use a slightly tighter pad / icon
  // / text for the decorated tiers. Tier 1 stays at its original sizing
  // because it was already well-proportioned without decoration.
  const compact = config.tier >= 2;
  const sizes = compact
    ? {
        sm: { pad: 'px-2.5 py-0.5', icon: 'w-3 h-3', text: 'text-[9px]', gap: 'gap-1.5 sm:gap-2', tracking: 'tracking-[2px]' },
        md: { pad: 'px-3 py-1', icon: 'w-3.5 h-3.5', text: 'text-[11px]', gap: 'gap-1.5 sm:gap-2', tracking: 'tracking-[2px]' },
        lg: { pad: 'px-4 py-1.5', icon: 'w-4 h-4', text: 'text-xs', gap: 'gap-2 sm:gap-2.5', tracking: 'tracking-[2.5px]' },
      }
    : {
        sm: { pad: 'px-3 py-1', icon: 'w-3.5 h-3.5', text: 'text-[10px]', gap: 'gap-2 sm:gap-2.5', tracking: 'tracking-[3px]' },
        md: { pad: 'px-4 py-1.5', icon: 'w-4 h-4', text: 'text-xs', gap: 'gap-2 sm:gap-2.5', tracking: 'tracking-[3px]' },
        lg: { pad: 'px-5 py-2', icon: 'w-5 h-5', text: 'text-sm', gap: 'gap-2 sm:gap-2.5', tracking: 'tracking-[3px]' },
      };
  const s = sizes[size] || sizes.md;
  // Aura inset — pulled in from -m-6 (24px halo) to -m-3 (12px) so the glow
  // hugs the frame instead of doubling its perceived size.
  const auraInset = compact ? '-m-3' : '-m-6';

  return (
    <div className="relative inline-flex items-center">
      {/* Aura — radial gradient behind the badge that softly tints the
          surrounding background. Tier 5 breathes; lower tiers stay still. */}
      {config.aura && (
        <span
          aria-hidden
          className={`absolute inset-0 ${auraInset} rounded-full pointer-events-none ${
            config.breathing ? 'level-aura-breathe' : ''
          }`}
          style={{ background: config.aura }}
        />
      )}

      <span
        className={`relative inline-flex items-center ${s.gap} rounded-full border backdrop-blur ${s.pad}`}
        style={{
          borderColor: config.border,
          background: 'rgba(10, 20, 30, 0.55)',
          boxShadow: config.glow || 'none',
        }}
      >
        {/* Icon — coloured via currentColor so the gradient pseudo-classes
            from text don't fight with it. Slight pulse from tier 2 up. */}
        <span
          className={`flex-shrink-0 ${s.icon} ${config.tier >= 2 ? 'level-icon-pulse' : ''}`}
          style={{ color: '#d4a574' }}
        >
          {config.icon}
        </span>

        {/* Level name — gradient-clipped text. Tier 3+ adds an animated
            shimmer across the gradient. */}
        <span
          className={`font-amiri ${s.tracking} uppercase ${s.text} ${
            config.shimmer ? 'level-text-shimmer' : ''
          }`}
          style={{
            backgroundImage: config.textGradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            backgroundSize: config.shimmer ? '200% auto' : 'auto',
          }}
        >
          {levelName}
        </span>

        {/* Corner ornaments for tier 4-5 — the badge gets framed. */}
        {config.ornaments && (
          <>
            <span
              aria-hidden
              className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l"
              style={{ borderColor: config.border }}
            />
            <span
              aria-hidden
              className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r"
              style={{ borderColor: config.border }}
            />
            <span
              aria-hidden
              className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l"
              style={{ borderColor: config.border }}
            />
            <span
              aria-hidden
              className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r"
              style={{ borderColor: config.border }}
            />
          </>
        )}
      </span>

      {/* Scoped CSS for the three animations the badge can use. Inlined
          here so the component is self-contained and the keyframes don't
          leak into the global stylesheet. */}
      <style>{`
        @keyframes level-aura-breathe-kf {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.08); }
        }
        .level-aura-breathe {
          animation: level-aura-breathe-kf 4s ease-in-out infinite;
        }
        @keyframes level-icon-pulse-kf {
          0%, 100% { opacity: 0.85; }
          50%      { opacity: 1; filter: drop-shadow(0 0 4px currentColor); }
        }
        .level-icon-pulse {
          animation: level-icon-pulse-kf 3s ease-in-out infinite;
        }
        @keyframes level-text-shimmer-kf {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .level-text-shimmer {
          animation: level-text-shimmer-kf 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
