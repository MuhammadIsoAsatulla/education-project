/**
 * Restrained section heading used across detail pages.
 *
 *   ─────                <-- single hairline (gold/40, 48 px)
 *   EYEBROW              <-- caps, tracking-[5px], gold/75
 *   Display Title        <-- serif, clamp(28–46), text-cream
 *   description?         <-- optional supporting line
 *
 * Replaces the prior pattern of OrnamentDivider + `— EYEBROW —` + `.section-title`
 * which appeared 4–6 times per detail page and read as decoration spam.
 * One ornament per page is elegant; six is wallpaper.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}) {
  const isLeft = align === 'left';
  return (
    <div className={`${isLeft ? 'text-left' : 'text-center'} ${className}`}>
      <span
        aria-hidden="true"
        className={`block ${isLeft ? '' : 'mx-auto'} w-12 h-px bg-gold/40 mb-5`}
      />
      {eyebrow && (
        <p className="text-gold/75 text-[11px] tracking-[3px] sm:tracking-[5px] uppercase font-medium mb-3.5">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2
          className="font-serif text-cream leading-[1.05] mb-3"
          style={{ fontSize: 'clamp(22px, 3.4vw, 46px)' }}
        >
          {title}
        </h2>
      )}
      {description && (
        <p className="text-cream-soft/65 max-w-xl mx-auto leading-relaxed text-base">
          {description}
        </p>
      )}
    </div>
  );
}
