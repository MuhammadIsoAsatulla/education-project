import OrnamentDivider from './OrnamentDivider.jsx';

export default function PageHero({ eyebrow, title, description, accent }) {
  return (
    <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 text-center bg-gradient-to-b from-bg-deep via-bg-mid to-bg-deep overflow-hidden">
      <div className="absolute inset-0 bg-girih opacity-50 pointer-events-none" />
      {accent && (
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />
      )}
      <div className="relative max-w-4xl mx-auto">
        <OrnamentDivider className="opacity-60 mb-4 sm:mb-6" />
        {eyebrow && <div className="eyebrow mb-3 sm:mb-4 text-[11px] sm:text-sm">— {eyebrow} —</div>}
        <h1 className="section-title text-gold-gradient mb-4 sm:mb-6">{title}</h1>
        {description && (
          <p className="font-serif italic text-base sm:text-lg md:text-xl text-cream-soft/80 max-w-2xl mx-auto px-2">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
