import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import muzeylar from '../data/muzeylar.json';
import VirtualTour from '../components/muzeylar/VirtualTour.jsx';
import SmartImage from '../components/common/SmartImage.jsx';
import OrnamentDivider from '../components/common/OrnamentDivider.jsx';
import useTextToSpeech from '../hooks/useTextToSpeech.js';
import useProgress from '../hooks/useProgress.js';

export default function MuzeyDetailPage() {
  const { slug } = useParams();
  const muzey = useMemo(() => muzeylar.find((m) => m.slug === slug), [slug]);
  const { speak, stop, speaking, available, voiceLabel } = useTextToSpeech();
  const { visit } = useProgress();

  useEffect(() => {
    if (muzey) visit('muzeylar', muzey.id, { points: 10, achievement: 'muzey-mehmoni' });
  }, [muzey, visit]);

  if (!muzey || muzey.status !== 'available') {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32">
        <h1 className="font-serif text-cream text-4xl mb-4">Muzey topilmadi</h1>
        <p className="text-cream-soft/70 mb-8">Bu muzeyning virtual sayohati hali tayyor emas.</p>
        <Link to="/muzeylar" className="gold-cta"><span>Muzeylar ro'yxati</span></Link>
      </section>
    );
  }

  const fullText = [muzey.shortDescription, ...(muzey.fullDescription || [])].join(' ');

  return (
    <article className="relative">
      {/* Hero with image */}
      <header className="relative pt-20 sm:pt-28 overflow-hidden">
        <div className="relative h-[50vh] sm:h-[60vh] min-h-[320px] sm:min-h-[420px] overflow-hidden">
          <SmartImage
            src={muzey.image}
            alt={muzey.name}
            initial={muzey.initial}
            accent={muzey.accent}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/40 via-bg-deep/60 to-bg-deep" />
        </div>

        <div className="absolute inset-x-0 bottom-0 px-4 sm:px-6 md:px-12 pb-6 sm:pb-10">
          <div className="max-w-[1300px] mx-auto text-center">
            <Link to="/muzeylar" className="inline-flex items-center gap-2 text-gold/70 hover:text-gold text-xs tracking-[2px] uppercase mb-4">
              <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-3 rotate-180">
                <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
              </svg>
              Muzeylar
            </Link>
            <div className="eyebrow mb-3">— {muzey.city} · {muzey.century} —</div>
            <h1 className="font-serif text-gold-gradient leading-[0.95] mb-4"
                style={{ fontSize: 'clamp(48px, 7vw, 96px)', letterSpacing: '2px' }}>
              {muzey.name}
            </h1>
            <p className="font-serif italic text-cream-soft text-xl max-w-2xl mx-auto">
              {muzey.shortDescription}
            </p>
          </div>
        </div>
      </header>

      {/* Virtual tour */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1400px] mx-auto py-8 sm:py-12">
        <div className="text-center mb-8">
          <div className="eyebrow mb-3">— 360° INTERAKTIV SAYOHAT —</div>
          <h2 className="section-title mb-3">Ichkariga Boqing</h2>
          <p className="font-serif italic text-cream-soft/80">
            {muzey.embed360
              ? 'Sahnani sichqoncha bilan suring, zoom qiling — Google Street View'
              : "Sahnani sichqoncha bilan suring · ✦-belgilarini bosing"}
          </p>
        </div>
        {muzey.embed360 ? (
          <Embed360
            src={muzey.embed360}
            title={muzey.name}
            accent={muzey.accent}
            hotspots={muzey.hotspots || []}
          />
        ) : (
          <VirtualTour scene={muzey.slug} accent={muzey.accent} hotspots={muzey.hotspots || []} />
        )}

        {available && (
          <div className="mt-8 flex items-center gap-4 justify-center flex-wrap">
            <button
              onClick={() => (speaking ? stop() : speak(fullText))}
              className="gold-cta"
            >
              <span className="flex items-center gap-3">
                {speaking ? "Audio gid · To'xtatish" : 'Audio gid · Boshlash'}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15 9a4 4 0 010 6M18 6a8 8 0 010 12" />
                </svg>
              </span>
            </button>
            {voiceLabel && voiceLabel !== "O'zbek ovozi" && (
              <span className="text-cream-soft/60 text-xs italic">Ovoz: {voiceLabel}</span>
            )}
          </div>
        )}
      </section>

      {/* About */}
      <section className="px-4 sm:px-6 md:px-12 py-16 sm:py-24 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <OrnamentDivider className="opacity-60 mb-6" />
          <div className="eyebrow mb-3">— TARIXIY MA'LUMOT —</div>
          <h2 className="section-title">Yodgorlik Haqida</h2>
        </div>
        <div className="space-y-5 text-cream-soft text-lg leading-relaxed">
          {(muzey.fullDescription || []).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Highlights */}
      {/* Hotspots info accordion (shown alongside Google Maps tour) */}
      {muzey.embed360 && muzey.hotspots?.length > 0 && (
        <section className="px-4 sm:px-6 md:px-12 py-12 max-w-[1200px] mx-auto">
          <div className="text-center mb-8">
            <OrnamentDivider className="opacity-60 mb-6" />
            <div className="eyebrow mb-3">— SAYOHAT NUQTALARI —</div>
            <h2 className="section-title">Diqqatga Sazovor Joylar</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {muzey.hotspots.map((h) => (
              <div
                key={h.id}
                className="p-6 border border-gold/20 hover:border-gold/70 rounded-sm bg-bg-mid/40 backdrop-blur transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center text-gold flex-shrink-0"
                    style={{ background: `${muzey.accent}33` }}
                  >
                    ✦
                  </span>
                  <h3 className="font-serif text-cream text-lg leading-tight">{h.label}</h3>
                </div>
                <p className="text-cream-soft/80 text-sm leading-relaxed">{h.info}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Highlights */}
      {muzey.highlights?.length > 0 && (
        <section className="px-4 sm:px-6 md:px-12 py-12 sm:py-20"
                 style={{ background: `linear-gradient(180deg, transparent, ${muzey.accent}1a, transparent)` }}>
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <OrnamentDivider className="opacity-60 mb-6" />
              <div className="eyebrow mb-3">— DIQQATGA SAZOVOR —</div>
              <h2 className="section-title">Asosiy Eksponatlar</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {muzey.highlights.map((h, i) => (
                <div
                  key={h.title}
                  className="p-7 border border-gold/20 hover:border-gold/70 rounded-sm bg-bg-mid/40 backdrop-blur transition-all"
                >
                  <div className="font-serif text-gold/60 text-sm tracking-[3px] mb-3">— {String(i + 1).padStart(2, '0')} —</div>
                  <h3 className="font-serif text-cream text-2xl mb-3">{h.title}</h3>
                  <p className="text-cream-soft/80 text-sm leading-relaxed">{h.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function Embed360({ src, title, accent, hotspots = [] }) {
  // Build viewpoints: main view + any hotspots that have their own embed360
  const viewpoints = useMemo(() => {
    const list = [{ id: '__main__', label: 'Asosiy ko\'rinish', src, info: null }];
    for (const h of hotspots) {
      if (h.embed360) {
        list.push({ id: h.id, label: h.label, src: h.embed360, info: h.info });
      }
    }
    return list;
  }, [src, hotspots]);

  const [activeId, setActiveId] = useState('__main__');
  const active = viewpoints.find((v) => v.id === activeId) || viewpoints[0];
  const hasMultiple = viewpoints.length > 1;

  return (
    <div className="relative">
      {/* View switcher tabs */}
      {hasMultiple && (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          {viewpoints.map((v) => {
            const isActive = v.id === activeId;
            return (
              <button
                key={v.id}
                onClick={() => setActiveId(v.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs tracking-[2px] uppercase transition-all ${
                  isActive
                    ? 'bg-gold text-bg-deep border border-gold shadow-[0_0_20px_rgba(212,165,116,0.4)]'
                    : 'border border-gold/30 text-cream-soft/80 hover:text-gold hover:border-gold/70'
                }`}
              >
                {v.id === '__main__' ? '✦ ' : ''}
                {v.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Ornate frame: gold outer + dark inner bezel */}
      <div
        className="relative p-1.5 sm:p-2 rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(212,165,116,0.15)]"
        style={{
          background: `linear-gradient(135deg, #e8c898 0%, ${accent || '#d4a574'} 50%, #b8893f 100%)`,
        }}
      >
        <div className="relative p-1 sm:p-1.5 bg-bg-deep rounded-sm">
          {/* Marquee dots (top) */}
          <div className="absolute top-1 left-2 right-2 flex justify-between pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className="block w-1 h-1 rounded-full bg-gold/30" />
            ))}
          </div>
          {/* Marquee dots (bottom) */}
          <div className="absolute bottom-1 left-2 right-2 flex justify-between pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className="block w-1 h-1 rounded-full bg-gold/30" />
            ))}
          </div>

          {/* The iframe — key ensures clean reload when switching views */}
          <div className="relative w-full aspect-video bg-black rounded-sm overflow-hidden">
            <iframe
              key={active.id}
              src={active.src}
              title={`${title} — ${active.label}`}
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>

      {/* Corner ornaments */}
      <span className="absolute -top-3 -left-3 w-7 h-7 border-t-2 border-l-2 border-gold pointer-events-none" />
      <span className="absolute -top-3 -right-3 w-7 h-7 border-t-2 border-r-2 border-gold pointer-events-none" />
      <span className="absolute -bottom-3 -left-3 w-7 h-7 border-b-2 border-l-2 border-gold pointer-events-none" />
      <span className="absolute -bottom-3 -right-3 w-7 h-7 border-b-2 border-r-2 border-gold pointer-events-none" />

      {/* Active view info (only for hotspot views) */}
      {active.info && active.id !== '__main__' && (
        <div
          key={`info-${active.id}`}
          className="mt-6 p-5 sm:p-6 rounded-sm border border-gold/30 bg-bg-mid/50 backdrop-blur max-w-3xl mx-auto animate-fade-in-up"
          style={{ animationDuration: '0.5s' }}
        >
          <div className="eyebrow text-xs mb-2">— ICHKARIDA —</div>
          <h4 className="font-serif text-cream text-xl sm:text-2xl mb-2">{active.label}</h4>
          <p className="text-cream-soft/85 text-sm sm:text-base leading-relaxed">{active.info}</p>
        </div>
      )}

      <p className="text-center mt-5 text-cream-soft/60 text-xs sm:text-sm italic font-serif">
        {hasMultiple
          ? "Yuqoridan ko'rinishni tanlang · Sahnani suring · ⛶ to'liq ekran rejimini bosing"
          : "Google Street View · Sahnani sichqoncha bilan suring · ⛶ to'liq ekran rejimini bosing"}
      </p>
    </div>
  );
}
