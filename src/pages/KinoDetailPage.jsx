import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import kinolar from '../data/kinolar.json';
import SmartImage from '../components/common/SmartImage.jsx';
import OrnamentDivider from '../components/common/OrnamentDivider.jsx';
import useProgress from '../hooks/useProgress.js';

export default function KinoDetailPage() {
  const { slug } = useParams();
  const movie = useMemo(() => kinolar.find((m) => m.slug === slug), [slug]);
  const { visit } = useProgress();

  useEffect(() => {
    if (movie) visit('kinolar', movie.id, { points: 7, achievement: 'kinoshunos' });
  }, [movie, visit]);

  if (!movie) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32">
        <h1 className="font-serif text-cream text-4xl mb-4">Kino topilmadi</h1>
        <Link to="/kinolar" className="gold-cta"><span>Kinolar</span></Link>
      </section>
    );
  }

  const recommendations = kinolar.filter((m) => m.slug !== movie.slug).slice(0, 4);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    movie.youtubeQuery || `${movie.title} ${movie.year} ${movie.director}`,
  )}`;

  return (
    <article className="relative">
      <header
        className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 30% 20%, ${movie.accent}33, var(--bg-deep) 60%)` }}
      >
        <div className="absolute inset-0 bg-girih opacity-40 pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto grid lg:grid-cols-[300px_1fr] xl:grid-cols-[360px_1fr] gap-8 lg:gap-12 items-start">
          {/* Poster */}
          <div className="reveal max-w-[240px] sm:max-w-[300px] lg:max-w-[360px] mx-auto lg:mx-0 w-full">
            <div className="relative aspect-[2/3] rounded-sm overflow-hidden border border-gold shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <SmartImage
                src={movie.poster}
                alt={movie.title}
                initial={movie.initial}
                accent={movie.accent}
              />
              <span className="absolute inset-0 border border-gold/20 m-2 pointer-events-none" />
              <div className="absolute top-0 bottom-0 left-0 w-2 bg-bg-deep flex flex-col justify-around py-2">
                {Array.from({ length: 18 }).map((_, i) => <span key={i} className="block w-1 h-1.5 mx-auto bg-gold/40 rounded-full" />)}
              </div>
              <div className="absolute top-0 bottom-0 right-0 w-2 bg-bg-deep flex flex-col justify-around py-2">
                {Array.from({ length: 18 }).map((_, i) => <span key={i} className="block w-1 h-1.5 mx-auto bg-gold/40 rounded-full" />)}
              </div>
            </div>
          </div>

          <div>
            <Link to="/kinolar" className="inline-flex items-center gap-2 text-gold/70 hover:text-gold text-xs tracking-[2px] uppercase mb-6">
              <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-3 rotate-180">
                <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
              </svg>
              Kinolar
            </Link>
            <div className="eyebrow mb-3">— {movie.genre} · {movie.year} —</div>
            <h1 className="font-serif text-gold-gradient leading-[0.95] mb-5"
                style={{ fontSize: 'clamp(48px, 7vw, 96px)', letterSpacing: '1px' }}>
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-cream-soft/80 text-sm mb-6">
              <span className="text-gold font-semibold">★ {movie.rating}/10</span>
              <span>·</span>
              <span>{movie.duration}</span>
              <span>·</span>
              <span>Rejissyor: <span className="text-cream">{movie.director}</span></span>
            </div>
            <p className="text-cream-soft text-lg leading-relaxed mb-6 max-w-3xl">{movie.synopsis}</p>
            <p className="text-cream-soft/80 leading-relaxed mb-8 max-w-3xl">{movie.longDescription}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {movie.themes.map((t) => (
                <span key={t} className="px-4 py-1.5 border border-gold/40 text-gold/90 text-xs tracking-[2px] uppercase rounded-full">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {movie.youtubeId ? (
                <a
                  href={`https://www.youtube.com/watch?v=${movie.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gold-cta"
                >
                  <span className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    YouTube'da ko'rish
                  </span>
                </a>
              ) : (
                <a
                  href={youtubeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gold-cta"
                >
                  <span className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    YouTube'da qidirish
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Embedded player when ID present */}
      {movie.youtubeId && (
        <section className="px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto pb-12 sm:pb-16">
          <div className="aspect-video rounded-sm overflow-hidden border border-gold/30 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${movie.youtubeId}`}
              title={movie.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </section>
      )}

      {/* Cast */}
      <section className="px-4 sm:px-6 md:px-12 py-12 sm:py-16 max-w-[1200px] mx-auto">
        <div className="text-center mb-10">
          <OrnamentDivider className="opacity-60 mb-6" />
          <div className="eyebrow mb-3">— ROLLAR ROYIHASI —</div>
          <h2 className="section-title">Aktyorlar</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {movie.cast.map((c, i) => (
            <div key={c} className="p-5 border border-gold/20 hover:border-gold/70 rounded-sm bg-bg-mid/40 backdrop-blur transition">
              <div className="font-serif text-gold/60 text-xs tracking-[3px] mb-2">— {String(i + 1).padStart(2, '0')} —</div>
              <p className="font-serif text-cream text-lg">{c}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section className="px-4 sm:px-6 md:px-12 py-12 sm:py-16 border-t border-gold/10">
        <div className="max-w-[1300px] mx-auto">
          <div className="eyebrow mb-6 text-center">— BOSHQA KINOLAR —</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {recommendations.map((m) => (
              <Link
                key={m.id}
                to={`/kinolar/${m.slug}`}
                className="group block aspect-[2/3] relative overflow-hidden rounded-sm border border-gold/20 hover:border-gold/70 transition"
              >
                <SmartImage src={m.poster} alt={m.title} initial={m.initial} accent={m.accent} />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-bg-deep to-transparent">
                  <p className="font-serif text-cream text-sm leading-tight">{m.title}</p>
                  <p className="text-gold/70 text-[10px] tracking-[2px] mt-1">{m.year}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
