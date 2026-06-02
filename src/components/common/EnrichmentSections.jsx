import SectionHeading from './SectionHeading.jsx';

/**
 * Supplementary content sections used across detail pages:
 *   - Bilarmidingiz? (interesting facts)
 *   - O'sha davr (historical context)
 *   - Bugungi kunda (legacy)
 *   - Asar Qahramonlari (characters)
 *   - Bilgan Tillar
 *   - Tarixiy Faktlar (architectural details)
 *   - Cholg'ular (instruments)
 *   - Aktyorlar va Mukofotlar (cast/crew/awards)
 *   - Ijrochi Bio (performer bio)
 *
 * All share the restrained heading vocabulary (hairline + spaced caps + plain
 * serif title) and the unified card vocabulary (rounded-2xl, hairline border,
 * layered shadow with inset top highlight).
 */

const CARD_BASE =
  'rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-colors';
const CARD_SHADOW = {
  boxShadow:
    '0 16px 32px -12px rgba(0,0,0,0.45), 0 4px 10px -4px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.05)',
};

function Section({ eyebrow, title, children }) {
  return (
    <section className="px-4 sm:px-6 md:px-12 py-14 sm:py-20 max-w-4xl mx-auto">
      <SectionHeading eyebrow={eyebrow} title={title} className="mb-10" />
      {children}
    </section>
  );
}

export function InterestingFactsSection({ facts }) {
  if (!facts || facts.length === 0) return null;
  return (
    <Section eyebrow="Qiziqarli Ma'lumotlar" title="Bilarmidingiz?">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {facts.map((fact, i) => (
          <div
            key={i}
            className={`${CARD_BASE} hover:border-gold/25 p-5 flex gap-3.5`}
            style={CARD_SHADOW}
          >
            <span className="text-gold/75 font-serif flex-shrink-0 text-base leading-none tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="text-cream-soft/85 text-[14px] leading-relaxed">{fact}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function HistoricalContextSection({ text, accent }) {
  if (!text) return null;
  return (
    <Section eyebrow="Tarixiy Kontekst" title="O'sha davr">
      <div
        className={`${CARD_BASE} p-7 sm:p-9`}
        style={{
          ...CARD_SHADOW,
          background: accent
            ? `linear-gradient(135deg, ${accent}10 0%, rgba(255,255,255,0.02) 100%)`
            : 'rgba(255,255,255,0.02)',
        }}
      >
        <p className="font-serif text-cream/90 text-base sm:text-lg leading-relaxed">
          {text}
        </p>
      </div>
    </Section>
  );
}

export function LegacySection({ text }) {
  if (!text) return null;
  return (
    <Section eyebrow="Qoldirgan Merosi" title="Bugungi kunda">
      <div className={`${CARD_BASE} p-7 sm:p-9`} style={CARD_SHADOW}>
        <p className="font-serif text-cream/90 text-base sm:text-lg leading-relaxed">
          {text}
        </p>
      </div>
    </Section>
  );
}

export function CharactersSection({ characters }) {
  if (!characters || characters.length === 0) return null;
  return (
    <Section eyebrow="Asosiy Qahramonlar" title="Asar Qahramonlari">
      <div className="space-y-2.5">
        {characters.map((char, i) => {
          const [name, ...rest] = char.split('—');
          const desc = rest.join('—').trim();
          return (
            <div
              key={i}
              className={`${CARD_BASE} hover:border-gold/25 flex items-start gap-4 p-4`}
              style={CARD_SHADOW}
            >
              <span className="w-9 h-9 flex-shrink-0 rounded-full border border-gold/30 flex items-center justify-center font-serif text-gold/85 text-sm">
                {(name || '?').trim().charAt(0)}
              </span>
              <div className="flex-1">
                <h4 className="font-serif text-cream text-base mb-0.5">{name.trim()}</h4>
                {desc && <p className="text-cream-soft/70 text-sm leading-snug">{desc}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export function LanguagesSection({ languages }) {
  if (!languages || languages.length === 0) return null;
  return (
    <Section eyebrow="Bilgan Tillar" title={`${languages.length} ta Til`}>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {languages.map((lang) => (
          <span
            key={lang}
            className="px-4 py-1.5 border border-white/[0.08] rounded-full font-serif text-cream/85 text-sm hover:border-gold/40 hover:text-gold-bright transition-colors"
          >
            {lang}
          </span>
        ))}
      </div>
    </Section>
  );
}

export function ArchitecturalDetailsSection({ details }) {
  if (!details || details.length === 0) return null;
  return (
    <Section eyebrow="Me'morchilik Tafsiloti" title="Tarixiy Faktlar">
      <ul className="space-y-3">
        {details.map((detail, i) => (
          <li
            key={i}
            className={`${CARD_BASE} flex items-start gap-3 p-4`}
            style={CARD_SHADOW}
          >
            <span className="text-gold/70 flex-shrink-0 mt-0.5 text-xs">◆</span>
            <p className="text-cream-soft/85 text-[14px] leading-relaxed">{detail}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function InstrumentsSection({ instruments }) {
  if (!instruments || instruments.length === 0) return null;
  return (
    <Section eyebrow="Cholg'ular" title="Asarda Ishlatilgan">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {instruments.map((inst) => (
          <span
            key={inst}
            className="px-4 py-1.5 border border-white/[0.08] rounded-full font-serif text-cream/85 text-sm hover:border-gold/40 hover:text-gold-bright transition-colors"
          >
            ♪ {inst}
          </span>
        ))}
      </div>
    </Section>
  );
}

export function CastSection({ cast, crew, awards }) {
  if (!cast && !crew && !awards) return null;
  return (
    <Section eyebrow="Film Hay'ati" title="Aktyorlar va Mukofotlar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cast && cast.length > 0 && (
          <div className={`${CARD_BASE} p-5`} style={CARD_SHADOW}>
            <h4 className="text-gold/75 text-[10px] tracking-[4px] uppercase font-medium mb-4">
              Aktyorlar
            </h4>
            <ul className="space-y-2">
              {cast.map((c, i) => {
                const [name, ...rest] = c.split('—');
                return (
                  <li key={i} className="text-cream-soft text-sm">
                    <span className="text-gold/90 font-medium">{name.trim()}</span>
                    {rest.length > 0 && (
                      <span className="text-cream-soft/55"> — {rest.join('—').trim()}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <div className="space-y-5">
          {crew && (
            <div className={`${CARD_BASE} p-5`} style={CARD_SHADOW}>
              <h4 className="text-gold/75 text-[10px] tracking-[4px] uppercase font-medium mb-4">
                Mualliflar
              </h4>
              <ul className="space-y-2 text-sm">
                {crew.director && (
                  <li>
                    <span className="text-cream-soft/55">Rejissyor:</span>{' '}
                    <span className="text-cream">{crew.director}</span>
                  </li>
                )}
                {crew.scriptwriter && (
                  <li>
                    <span className="text-cream-soft/55">Stsenariy:</span>{' '}
                    <span className="text-cream">{crew.scriptwriter}</span>
                  </li>
                )}
                {crew.composer && (
                  <li>
                    <span className="text-cream-soft/55">Bastakor:</span>{' '}
                    <span className="text-cream">{crew.composer}</span>
                  </li>
                )}
                {crew.studio && (
                  <li>
                    <span className="text-cream-soft/55">Studiya:</span>{' '}
                    <span className="text-cream">{crew.studio}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
          {awards && awards.length > 0 && (
            <div
              className={`${CARD_BASE} p-5`}
              style={{
                ...CARD_SHADOW,
                background:
                  'linear-gradient(135deg, rgba(212,165,116,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              }}
            >
              <h4 className="text-gold/85 text-[10px] tracking-[4px] uppercase font-medium mb-4">
                Mukofotlar
              </h4>
              <ul className="space-y-2">
                {awards.map((a, i) => (
                  <li key={i} className="text-cream-soft text-sm flex items-start gap-2">
                    <span className="text-gold/80 flex-shrink-0">★</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

export function PerformerBioSection({ bio }) {
  if (!bio) return null;
  return (
    <Section eyebrow="Ijrochi Haqida" title="Sanatkor Bio">
      <div className={`${CARD_BASE} p-7 sm:p-9`} style={CARD_SHADOW}>
        <p className="font-serif text-cream/90 text-base sm:text-lg leading-relaxed">{bio}</p>
      </div>
    </Section>
  );
}
