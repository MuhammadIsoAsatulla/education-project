import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import kinolar from '../data/kinolar.json';
import viktorinalar from '../data/viktorinalar.json';
import SmartImage from '../components/common/SmartImage.jsx';
import SectionHeading from '../components/common/SectionHeading.jsx';
import Quiz, { quizSessionSize } from '../components/common/Quiz.jsx';
import Comments from '../components/common/Comments.jsx';
import MoviePlayer from '../components/kinolar/MoviePlayer.jsx';
import {
  CastSection,
  HistoricalContextSection,
  InterestingFactsSection,
} from '../components/common/EnrichmentSections.jsx';
import useProgress from '../hooks/useProgress.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function KinoDetailPage() {
  const { slug } = useParams();
  const movie = useMemo(() => kinolar.find((m) => m.slug === slug), [slug]);
  const [quizOpen, setQuizOpen] = useState(false);
  const { state: progressState, visit, submitQuiz } = useProgress();
  const quiz = useMemo(
    () => viktorinalar.find((v) => v.ownerType === 'kinolar' && v.ownerId === movie?.slug),
    [movie?.slug],
  );
  const previousQuizEntry = movie ? progressState.quizScores[movie.slug] : undefined;
  const previousQuizScore =
    typeof previousQuizEntry === 'number' ? previousQuizEntry : previousQuizEntry?.score;
  const cinemaRef = useRef(null);

  const scrollToCinema = () => {
    // Center the movie frame in the viewport — lands on the player, not on
    // the section heading above it.
    cinemaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useScrollReveal();

  // Visit-award is now deferred — it fires from MoviePlayer's onWatched
  // callback when the user has actually watched ≥70% of the movie. Opening
  // the page and immediately leaving no longer gives points.
  const onMovieWatched = () => {
    if (movie) visit('kinolar', movie.id, { points: 7, achievement: 'kinoshunos' });
  };

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
        className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 30% 20%, ${movie.accent}1a, transparent 60%)` }}
      >
        <div className="relative max-w-[1300px] mx-auto grid grid-cols-1 sm:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Poster — single hairline, layered shadow */}
          <div className="reveal max-w-[200px] sm:max-w-[240px] lg:max-w-[320px] mx-auto lg:mx-0 w-full">
            <div
              className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/[0.06]"
              style={{
                boxShadow:
                  '0 32px 64px -16px rgba(0,0,0,0.55), 0 4px 14px -6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              <SmartImage
                src={movie.poster}
                alt={movie.title}
                initial={movie.initial}
                accent={movie.accent}
              />
            </div>
          </div>

          <div>
            <Link to="/kinolar" className="inline-flex items-center gap-2 text-cream-soft/55 hover:text-gold text-[11px] tracking-[2.5px] uppercase mb-6 transition-colors">
              <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-3 rotate-180">
                <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
              </svg>
              Kinolar
            </Link>
            <p className="text-gold/75 text-[11px] tracking-[5px] uppercase font-medium mb-3">
              {movie.genre} · {movie.year}
            </p>
            <h1 className="font-serif text-cream leading-[1.02] mb-5"
                style={{ fontSize: 'clamp(28px, 5.5vw, 72px)' }}>
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-cream-soft/70 text-sm mb-6">
              <span className="text-gold font-medium">★ {movie.rating}/10</span>
              <span className="text-cream-soft/30">·</span>
              <span>{movie.duration}</span>
              <span className="text-cream-soft/30">·</span>
              <span className="text-cream-soft/55">Rejissyor: <span className="text-cream/90">{movie.director}</span></span>
            </div>
            <p className="text-cream/85 text-lg leading-relaxed mb-5 max-w-3xl">{movie.synopsis}</p>
            <p className="text-cream-soft/70 leading-relaxed mb-8 max-w-3xl">{movie.longDescription}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {movie.themes.map((t) => (
                <span
                  key={t}
                  className="px-3.5 py-1.5 border border-white/[0.08] hover:border-gold/40 text-cream-soft/85 hover:text-gold-bright text-[11px] tracking-[2px] uppercase rounded-full transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {movie.youtubeId ? (
                <button
                  type="button"
                  onClick={scrollToCinema}
                  className="gold-cta"
                  aria-label="Tomosha zaliga o'tish"
                >
                  <span className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Tomosha qilish
                  </span>
                </button>
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

      {/* Cinema Theater — embedded player */}
      {movie.youtubeId && (
        <section
          id="tomosha-zali"
          className="relative py-16 sm:py-24 px-4 sm:px-6 md:px-12 overflow-hidden"
          style={{
            background: `radial-gradient(ellipse at center, ${movie.accent}1a 0%, var(--bg-deep) 70%)`,
          }}
        >
          {/* Pattern + spotlight */}
          <div className="absolute inset-0 bg-girih opacity-40 pointer-events-none" />
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none blur-3xl"
            style={{ background: `radial-gradient(circle, ${movie.accent}33, transparent 60%)` }}
          />

          <div className="relative mb-10 sm:mb-12">
            <SectionHeading
              eyebrow="Tomosha Zali"
              title="Filmni Boshlash"
              description="Yorug'likni o'chiring, ovozni baland qiling — kino boshlanmoqda."
            />
          </div>

          {/* Cinema screen frame */}
          <div ref={cinemaRef} className="relative max-w-[1200px] mx-auto">
            {/* Side projection lights */}
            <div className="hidden md:block absolute -left-10 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold/60 animate-pulse" />
            <div className="hidden md:block absolute -right-10 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold/60 animate-pulse" />

            {/* Outer gold frame with ornate corners */}
            <div className="relative p-1.5 sm:p-2 rounded-sm shadow-[0_30px_100px_rgba(0,0,0,0.7),0_0_60px_rgba(212,165,116,0.15)]"
                 style={{ background: 'linear-gradient(135deg, #e8c898 0%, #d4a574 50%, #b8893f 100%)' }}>
              {/* Inner dark bezel */}
              <div className="relative p-1 sm:p-1.5 bg-bg-deep rounded-sm">
                {/* Marquee dots top */}
                <div className="absolute top-1 left-2 right-2 flex justify-between pointer-events-none">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <span key={i} className="block w-1 h-1 rounded-full bg-gold/40" />
                  ))}
                </div>
                {/* Marquee dots bottom */}
                <div className="absolute bottom-1 left-2 right-2 flex justify-between pointer-events-none">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <span key={i} className="block w-1 h-1 rounded-full bg-gold/40" />
                  ))}
                </div>

                {/* Actual video screen — wrapped in MoviePlayer so we can
                    track real watch progress via the YouTube IFrame API
                    and award points only when ≥70% has been watched. */}
                <div className="aspect-video bg-black rounded-sm overflow-hidden">
                  <MoviePlayer
                    youtubeId={movie.youtubeId}
                    title={movie.title}
                    startSeconds={movie.youtubeStart || 0}
                    watchThreshold={0.7}
                    onWatched={onMovieWatched}
                  />
                </div>
              </div>
            </div>

            {/* Corner ornaments */}
            <span className="absolute -top-3 -left-3 w-7 h-7 border-t-2 border-l-2 border-gold pointer-events-none" />
            <span className="absolute -top-3 -right-3 w-7 h-7 border-t-2 border-r-2 border-gold pointer-events-none" />
            <span className="absolute -bottom-3 -left-3 w-7 h-7 border-b-2 border-l-2 border-gold pointer-events-none" />
            <span className="absolute -bottom-3 -right-3 w-7 h-7 border-b-2 border-r-2 border-gold pointer-events-none" />
          </div>

          {/* Theater info strip */}
          <div className="relative max-w-[1100px] mx-auto mt-10 sm:mt-12">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              <StatBlock label="Reyting" value={`★ ${movie.rating}/10`} accent={movie.accent} />
              <StatBlock label="Yili" value={String(movie.year)} accent={movie.accent} />
              <StatBlock label="Davomiyligi" value={movie.duration} accent={movie.accent} />
              <StatBlock label="Janr" value={movie.genre} accent={movie.accent} />
            </div>

            <p className="text-center mt-8 text-cream-soft/60 text-xs sm:text-sm italic font-serif">
              Plyer'dagi to'liq ekran tugmasini bosib, kinozaldagi tatti bilan tomosha qiling.
            </p>
          </div>
        </section>
      )}

      {/* Cast + Crew + Awards */}
      <CastSection
        cast={movie.cast}
        crew={movie.crew}
        awards={movie.awards}
        accent={movie.accent}
      />

      {/* NEW: Historical context */}
      <HistoricalContextSection text={movie.historicalContext} accent={movie.accent} />

      {/* NEW: Interesting facts */}
      <InterestingFactsSection facts={movie.interestingFacts} accent={movie.accent} />

      {/* NEW: Quiz */}
      {quiz && (
        <section className="px-4 sm:px-6 md:px-12 py-16 sm:py-20 max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="Bilimlarni Sinash"
            title="Viktorina"
            description={`${quizSessionSize(quiz.questions.length)} ta savol. Har to'g'ri javob — bonus ball.`}
            className="mb-10"
          />

          {quizOpen ? (
            <Quiz
              questions={quiz.questions}
              previousBest={previousQuizScore ?? null}
              onComplete={(score, total) => submitQuiz(movie.slug, score, total)}
              onClose={() => setQuizOpen(false)}
            />
          ) : (
            <div className="text-center">
              {previousQuizScore !== undefined ? (
                <div
                  className="inline-block px-8 py-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] mb-6"
                  style={{
                    boxShadow:
                      '0 18px 36px -12px rgba(0,0,0,0.45), 0 4px 10px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  <p className="text-gold/75 text-[10px] tracking-[4px] uppercase font-medium mb-2">
                    Eng Yaxshi Natija
                  </p>
                  <div className="font-serif text-cream text-4xl sm:text-5xl mb-1">
                    {previousQuizScore} / {quizSessionSize(quiz.questions.length)}
                  </div>
                  {previousQuizScore === quiz.questions.length && (
                    <p className="text-gold/80 text-sm">Mukammal ★</p>
                  )}
                </div>
              ) : (
                <p className="text-cream-soft/65 text-base mb-6">
                  Hozirgacha bu viktorinani topshirmaganmisiz.
                </p>
              )}
              <button onClick={() => setQuizOpen(true)} className="gold-cta">
                <span>{previousQuizScore !== undefined ? 'Qayta sinash' : 'Viktorinani boshlash'}</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* NEW: Comments */}
      <Comments contentType="kinolar" contentId={movie.id} contentTitle={movie.title} />

      {/* Recommendations */}
      <RecommendationsSection recommendations={recommendations} />
    </article>
  );
}

function StatBlock({ label, value, accent }) {
  return (
    <div
      className="p-4 sm:p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center"
      style={{
        background: `linear-gradient(160deg, ${accent}10, rgba(255,255,255,0.02))`,
        boxShadow:
          '0 12px 24px -10px rgba(0,0,0,0.4), 0 3px 8px -3px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <div className="text-cream-soft/55 text-[10px] sm:text-xs tracking-[3px] uppercase mb-2 font-medium">
        {label}
      </div>
      <div className="font-serif text-cream text-lg sm:text-xl leading-tight">{value}</div>
    </div>
  );
}

function RecommendationsSection({ recommendations }) {
  return (
    <section className="px-4 sm:px-6 md:px-12 py-14 sm:py-20 border-t border-white/[0.05]">
      <div className="max-w-[1300px] mx-auto">
        <SectionHeading title="Boshqa Kinolar" className="mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {recommendations.map((m) => (
            <Link
              key={m.id}
              to={`/kinolar/${m.slug}`}
              className="group block aspect-[2/3] relative overflow-hidden rounded-2xl border border-white/[0.06] hover:border-gold/30 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
              style={{
                boxShadow:
                  '0 18px 36px -12px rgba(0,0,0,0.45), 0 4px 10px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <SmartImage src={m.poster} alt={m.title} initial={m.initial} accent={m.accent} />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
                style={{
                  background:
                    'linear-gradient(0deg, rgba(8,18,30,0.92) 0%, rgba(8,18,30,0.45) 50%, transparent 100%)',
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-serif text-cream text-sm leading-tight">{m.title}</p>
                <p className="text-cream-soft/55 text-[10px] tracking-[2px] mt-1">{m.year}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
