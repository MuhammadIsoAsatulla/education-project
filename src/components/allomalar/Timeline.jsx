import { useState } from 'react';

export default function Timeline({ events = [], accent = '#d4a574' }) {
  const [active, setActive] = useState(0);
  if (!events.length) return null;

  return (
    <div className="relative">
      {/* track */}
      <div className="hidden md:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-10">
        {events.map((e, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="group flex flex-col items-center text-center"
          >
            <span
              className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center font-serif font-medium transition-all duration-500 ${
                i === active
                  ? 'bg-gold text-bg-deep shadow-[0_0_30px] shadow-gold/40 scale-110'
                  : 'border border-gold/40 text-gold hover:border-gold'
              }`}
            >
              <span className="text-xs">{e.year}</span>
            </span>
            <span
              className={`mt-3 text-[11px] uppercase tracking-[2px] transition-colors ${
                i === active ? 'text-gold' : 'text-cream-soft/60 group-hover:text-cream-soft'
              }`}
            >
              {e.title}
            </span>
          </button>
        ))}
      </div>

      <div
        key={active}
        className="bg-bg-mid/60 border border-gold/20 rounded-sm p-6 md:p-8 backdrop-blur-sm relative overflow-hidden"
        style={{ animation: 'fadeInUp 0.5s ease forwards' }}
      >
        <span
          className="absolute top-0 left-0 w-1 h-full"
          style={{ background: `linear-gradient(to bottom, ${accent}, transparent)` }}
        />
        <div className="font-serif text-3xl md:text-4xl text-gold-gradient mb-2">{events[active].year}</div>
        <h4 className="font-serif text-cream text-xl md:text-2xl mb-3">{events[active].title}</h4>
        <p className="text-cream-soft/85 leading-relaxed">{events[active].text}</p>
      </div>
    </div>
  );
}
