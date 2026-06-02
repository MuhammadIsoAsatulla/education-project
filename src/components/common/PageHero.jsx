/**
 * Restrained page hero — used by every section list page.
 *
 *   [section icon] | [hairline]    <-- accent: icon if provided, else hairline
 *   EYEBROW                        <-- caps, tracking-[5px], gold/75
 *   Display Title                  <-- serif, clamp(36–60), text-cream
 *   description?                   <-- optional supporting line
 *
 * `sectionIcon` (optional ReactNode) takes the slot the hairline would
 * normally occupy, sized at 36 × 36 with the gold tint. Replaces — rather
 * than supplements — the hairline so we never stack two ornaments.
 *
 * `accent` (boolean) keeps the existing soft warm radial glow above the
 * title. Pass for hero-tier pages, omit for compact ones.
 */
export default function PageHero({ eyebrow, title, description, accent, sectionIcon }) {
  return (
    <section className="relative pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-12 text-center overflow-hidden">
      {accent && (
        <div
          aria-hidden="true"
          className="absolute left-1/2 -top-24 -translate-x-1/2 w-[720px] h-[460px] rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse, rgba(212,165,116,0.10), transparent 70%)',
          }}
        />
      )}
      <div className="relative max-w-3xl mx-auto">
        {sectionIcon ? (
          <div
            aria-hidden="true"
            className="mx-auto mb-5 sm:mb-6 w-9 h-9 text-gold/65"
          >
            {sectionIcon}
          </div>
        ) : (
          <span
            aria-hidden="true"
            className="block mx-auto w-12 h-px bg-gold/40 mb-5 sm:mb-6"
          />
        )}
        {eyebrow && (
          <p className="text-gold/75 text-[11px] sm:text-xs tracking-[5px] uppercase font-medium mb-4 sm:mb-5">
            {eyebrow}
          </p>
        )}
        <h1
          className="font-serif text-cream leading-[1.05] mb-4 sm:mb-5 mx-auto"
          style={{ fontSize: 'clamp(36px, 4.5vw, 60px)' }}
        >
          {title}
        </h1>
        {description && (
          <p className="text-cream-soft/65 max-w-xl mx-auto leading-relaxed text-base md:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
