/**
 * Universal Muhr icon — inline SVG that supports the 3 currency tiers
 * (bronze, silver, gold) via CSS filters from `tiers.css`.
 *
 * If the user has placed a custom muhr at /public/icons/muhr.svg, that image
 * is used (with CSS tier filter applied). Otherwise a stylised default SVG
 * is rendered — an octagonal seal with concentric ornament.
 */
import { useState } from 'react';

const FALLBACK_URL = '/muhr/muhr.svg';

export default function MuhrIcon({ type = 'bronze', size = 32, className = '' }) {
  const [imgFailed, setImgFailed] = useState(false);
  const filterClass = type === 'gold' ? 'muhr-gold' : type === 'silver' ? 'muhr-silver' : 'muhr-bronze';

  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {!imgFailed ? (
        <img
          src={FALLBACK_URL}
          alt={`${type} muhr`}
          onError={() => setImgFailed(true)}
          className={filterClass}
          style={{ width: size, height: size, objectFit: 'contain' }}
        />
      ) : (
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: size, height: size }}
          className={filterClass}
        >
          {/* Octagonal seal — Sharq uslubidagi muhr */}
          <defs>
            <linearGradient id={`muhr-${type}-grad`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e8c898" />
              <stop offset="50%" stopColor="#d4a574" />
              <stop offset="100%" stopColor="#b8893f" />
            </linearGradient>
          </defs>
          {/* Outer octagon */}
          <polygon
            points="50,8 75,18 92,42 92,58 75,82 50,92 25,82 8,58 8,42 25,18"
            fill={`url(#muhr-${type}-grad)`}
            stroke="#0a1f2e"
            strokeWidth="2"
          />
          {/* Inner ring */}
          <circle cx="50" cy="50" r="30" fill="none" stroke="#0a1f2e" strokeWidth="1.5" opacity="0.6" />
          <circle cx="50" cy="50" r="24" fill="none" stroke="#0a1f2e" strokeWidth="1" opacity="0.4" />
          {/* Central star (8-point Islamic star) */}
          <g transform="translate(50,50)" fill="#0a1f2e" opacity="0.8">
            <polygon points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" />
            <polygon
              points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3"
              transform="rotate(22.5)"
              fill="#d4a574"
              opacity="0.9"
            />
          </g>
          {/* Decorative dots around */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const r = 36;
            const cx = 50 + Math.cos(angle) * r;
            const cy = 50 + Math.sin(angle) * r;
            return <circle key={i} cx={cx} cy={cy} r="1.5" fill="#0a1f2e" opacity="0.7" />;
          })}
        </svg>
      )}
    </span>
  );
}
