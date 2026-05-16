import OrnamentDivider from './OrnamentDivider.jsx';

function Section({ eyebrow, title, children, accent = '#d4a574' }) {
  return (
    <section
      className="px-4 sm:px-6 md:px-12 py-12 sm:py-16 max-w-4xl mx-auto reveal"
    >
      <div className="text-center mb-8">
        <OrnamentDivider className="opacity-60 mb-5" />
        <div className="eyebrow mb-3">— {eyebrow} —</div>
        <h2 className="section-title">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function InterestingFactsSection({ facts, accent }) {
  if (!facts || facts.length === 0) return null;
  return (
    <Section eyebrow="QIZIQARLI MA'LUMOTLAR" title="Bilarmidingiz?" accent={accent}>
      <div className="grid sm:grid-cols-2 gap-3">
        {facts.map((fact, i) => (
          <div
            key={i}
            className="p-4 rounded-sm border border-gold/20 bg-bg-mid/40 backdrop-blur hover:border-gold/50 transition flex gap-3"
          >
            <span className="text-gold/80 font-serif flex-shrink-0 text-lg leading-none">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="text-cream-soft text-sm leading-relaxed">{fact}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function HistoricalContextSection({ text, accent }) {
  if (!text) return null;
  return (
    <Section eyebrow="TARIXIY KONTEKST" title="O'sha davr" accent={accent}>
      <div
        className="p-6 sm:p-8 rounded-sm border border-gold/25 bg-bg-mid/40 backdrop-blur"
        style={{ background: `linear-gradient(135deg, ${accent}11, transparent)` }}
      >
        <p className="font-serif text-cream-soft text-base sm:text-lg leading-relaxed italic">
          {text}
        </p>
      </div>
    </Section>
  );
}

export function LegacySection({ text, accent }) {
  if (!text) return null;
  return (
    <Section eyebrow="QOLDIRGAN MEROSI" title="Bugungi kunda" accent={accent}>
      <div className="p-6 sm:p-8 rounded-sm border border-gold/25 bg-bg-mid/40 backdrop-blur">
        <p className="font-serif text-cream-soft text-base sm:text-lg leading-relaxed">{text}</p>
      </div>
    </Section>
  );
}

export function CharactersSection({ characters, accent }) {
  if (!characters || characters.length === 0) return null;
  return (
    <Section eyebrow="ASOSIY QAHRAMONLAR" title="Asar Qahramonlari" accent={accent}>
      <div className="space-y-2">
        {characters.map((char, i) => {
          const [name, ...rest] = char.split('—');
          const desc = rest.join('—').trim();
          return (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-sm border border-gold/15 bg-bg-mid/30 backdrop-blur hover:border-gold/40 transition"
            >
              <span className="w-9 h-9 flex-shrink-0 rounded-full border border-gold/40 flex items-center justify-center font-serif text-gold text-sm">
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

export function LanguagesSection({ languages, accent }) {
  if (!languages || languages.length === 0) return null;
  return (
    <Section eyebrow="BILGAN TILLAR" title={`${languages.length} ta Til`} accent={accent}>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {languages.map((lang) => (
          <span
            key={lang}
            className="px-5 py-2 border border-gold/40 rounded-full font-serif text-cream text-sm tracking-wide hover:border-gold hover:text-gold transition"
          >
            {lang}
          </span>
        ))}
      </div>
    </Section>
  );
}

export function ArchitecturalDetailsSection({ details, accent }) {
  if (!details || details.length === 0) return null;
  return (
    <Section eyebrow="ME'MORCHILIK TAFSILOTI" title="Tarixiy Faktlar" accent={accent}>
      <ul className="space-y-3">
        {details.map((detail, i) => (
          <li
            key={i}
            className="flex items-start gap-3 p-4 rounded-sm border border-gold/15 bg-bg-mid/30 backdrop-blur"
          >
            <span className="text-gold flex-shrink-0">◆</span>
            <p className="text-cream-soft text-sm leading-relaxed">{detail}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function InstrumentsSection({ instruments, accent }) {
  if (!instruments || instruments.length === 0) return null;
  return (
    <Section eyebrow="CHOLG'ULAR" title="Asarda Ishlatilgan" accent={accent}>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {instruments.map((inst) => (
          <span
            key={inst}
            className="px-5 py-2 border border-gold/40 bg-bg-mid/30 rounded-full font-serif text-cream text-sm tracking-wide hover:border-gold transition"
          >
            ♪ {inst}
          </span>
        ))}
      </div>
    </Section>
  );
}

export function CastSection({ cast, crew, awards, accent }) {
  if (!cast && !crew && !awards) return null;
  return (
    <Section eyebrow="FILM HAYRATLARI" title="Aktyorlar va Mukofotlar" accent={accent}>
      <div className="grid md:grid-cols-2 gap-6">
        {cast && cast.length > 0 && (
          <div className="p-5 rounded-sm border border-gold/20 bg-bg-mid/40 backdrop-blur">
            <h4 className="eyebrow text-[10px] mb-4">— AKTYORLAR —</h4>
            <ul className="space-y-2">
              {cast.map((c, i) => {
                const [name, ...rest] = c.split('—');
                return (
                  <li key={i} className="text-cream-soft text-sm">
                    <span className="text-gold font-medium">{name.trim()}</span>
                    {rest.length > 0 && (
                      <span className="text-cream-soft/60"> — {rest.join('—').trim()}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <div className="space-y-4">
          {crew && (
            <div className="p-5 rounded-sm border border-gold/20 bg-bg-mid/40 backdrop-blur">
              <h4 className="eyebrow text-[10px] mb-4">— MUALLIFLAR —</h4>
              <ul className="space-y-2 text-sm">
                {crew.director && (
                  <li>
                    <span className="text-cream-soft/60">Rejissyor:</span>{' '}
                    <span className="text-cream">{crew.director}</span>
                  </li>
                )}
                {crew.scriptwriter && (
                  <li>
                    <span className="text-cream-soft/60">Stsenariy:</span>{' '}
                    <span className="text-cream">{crew.scriptwriter}</span>
                  </li>
                )}
                {crew.composer && (
                  <li>
                    <span className="text-cream-soft/60">Bastakor:</span>{' '}
                    <span className="text-cream">{crew.composer}</span>
                  </li>
                )}
                {crew.studio && (
                  <li>
                    <span className="text-cream-soft/60">Studiya:</span>{' '}
                    <span className="text-cream">{crew.studio}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
          {awards && awards.length > 0 && (
            <div className="p-5 rounded-sm border border-gold/30 bg-gold/5 backdrop-blur">
              <h4 className="eyebrow text-[10px] mb-4 text-gold">— MUKOFOTLAR —</h4>
              <ul className="space-y-2">
                {awards.map((a, i) => (
                  <li key={i} className="text-cream-soft text-sm flex items-start gap-2">
                    <span className="text-gold flex-shrink-0">🏆</span>
                    {a}
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

export function PerformerBioSection({ bio, accent }) {
  if (!bio) return null;
  return (
    <Section eyebrow="IJROCHI HAQIDA" title="Sanatkor Bio" accent={accent}>
      <div className="p-6 sm:p-8 rounded-sm border border-gold/20 bg-bg-mid/40 backdrop-blur">
        <p className="font-serif text-cream text-base sm:text-lg leading-relaxed">{bio}</p>
      </div>
    </Section>
  );
}
