const STATS = [
  { num: '25+', label: 'Allomalar' },
  { num: '12', label: 'Muzeylar' },
  { num: '100+', label: 'Asarlar' },
  { num: '∞', label: 'Bilim' },
];

export default function Stats() {
  return (
    <section className="px-6 md:px-12 py-24 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center reveal">
        {STATS.map((s, i) => (
          <div key={s.label} className="relative px-2 md:px-6 py-4">
            {i < STATS.length - 1 && (
              <span className="hidden md:block absolute -right-6 top-[30%] bottom-[30%] w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
            )}
            <div className="font-serif text-gold font-medium leading-none mb-3"
                 style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>
              {s.num}
            </div>
            <div className="font-sans text-[13px] text-cream-soft tracking-[3px] uppercase opacity-75">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
