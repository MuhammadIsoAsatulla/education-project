import { useState } from 'react';

/**
 * <img> with a graceful fallback. If the image fails to load (or src is empty),
 * a stylised initial-letter card is rendered instead. Latin script — never
 * Arabic — is used for the fallback so the card stays culturally consistent
 * with the modern Latin Uzbek typography of the rest of the UI.
 */
export default function SmartImage({
  src,
  alt = '',
  initial,
  accent = '#d4a574',
  className = '',
  imgClassName = '',
  fallbackClassName = '',
  rounded = false,
}) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover ${rounded ? 'rounded-sm' : ''} ${imgClassName}`}
        />
      ) : (
        <div
          className={`absolute inset-0 flex items-center justify-center ${fallbackClassName}`}
          style={{
            background: `linear-gradient(160deg, ${accent}55 0%, var(--teal) 50%, var(--bg-deep) 100%)`,
          }}
        >
          {/* Subtle decorative pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-25"
            viewBox="0 0 200 200"
            fill="none"
            stroke={accent}
            strokeWidth="0.5"
          >
            <circle cx="100" cy="100" r="40" />
            <circle cx="100" cy="100" r="60" />
            <circle cx="100" cy="100" r="80" />
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="0"
                x2="100"
                y2="200"
                transform={`rotate(${i * 30} 100 100)`}
              />
            ))}
          </svg>
          <span
            className="relative font-serif font-medium select-none"
            style={{
              fontSize: 'min(40%, 180px)',
              color: accent,
              letterSpacing: '4px',
              textShadow: '0 4px 30px rgba(0,0,0,0.5)',
            }}
          >
            {initial || alt?.[0]?.toUpperCase() || '✦'}
          </span>
        </div>
      )}
    </div>
  );
}
