import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import defaultSource from '../data/allomalar.json';
import viktorinalar from '../data/viktorinalar.json';
import Typewriter from '../components/allomalar/Typewriter.jsx';
import Timeline from '../components/allomalar/Timeline.jsx';
import SmartImage from '../components/common/SmartImage.jsx';
import SectionHeading from '../components/common/SectionHeading.jsx';
import FavoriteButton from '../components/common/FavoriteButton.jsx';
import Quiz, { quizSessionSize } from '../components/common/Quiz.jsx';
import Comments from '../components/common/Comments.jsx';
import {
  InterestingFactsSection,
  LegacySection,
  LanguagesSection,
} from '../components/common/EnrichmentSections.jsx';
import useTextToSpeech from '../hooks/useTextToSpeech.js';
import useProgress from '../hooks/useProgress.js';

/**
 * Generic detail page for "person" sections. Used by both /allomalar/:slug
 * (classical scholars) and /jadidlar/:slug (early-20th-century reformers).
 * The two sections share the exact same UI and data schema — only the data
 * source, URL prefix, and section labels differ, so we parameterise those.
 */
export default function AllomaDetailPage({
  source = defaultSource,
  section = 'allomalar',
  basePath = '/allomalar',
  notFoundTitle = 'Alloma topilmadi',
  listLabel = "Allomalar ro'yxati",
  siblingsLabel = 'Boshqa Allomalar',
  achievement = 'alloma-do-st',
}) {
  const { slug } = useParams();
  const alloma = useMemo(() => source.find((a) => a.slug === slug), [slug, source]);
  const [parallaxY, setParallaxY] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const { speak, stop, speaking, available, voiceLabel } = useTextToSpeech();
  const { state: progressState, visit, submitQuiz } = useProgress();
  const quiz = useMemo(
    () => viktorinalar.find((v) => v.ownerType === section && v.ownerId === alloma?.slug),
    [alloma?.slug, section],
  );
  const previousQuizEntry = alloma ? progressState.quizScores[alloma.slug] : undefined;
  const previousQuizScore =
    typeof previousQuizEntry === 'number' ? previousQuizEntry : previousQuizEntry?.score;

  useEffect(() => {
    if (!alloma) return;
    visit(section, alloma.id, { points: 10, achievement });
  }, [alloma, visit, section, achievement]);

  useEffect(() => {
    const onScroll = () => setParallaxY(window.scrollY * 0.15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!alloma) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-cream text-4xl mb-4">{notFoundTitle}</h1>
        <Link to={basePath} className="gold-cta"><span>{listLabel}</span></Link>
      </section>
    );
  }

  const fullText = [alloma.shortBio, ...alloma.fullBio].join(' ');

  return (
    <article className="relative">
      {/* Hero band */}
      <header
        className="relative pt-24 sm:pt-28 pb-14 sm:pb-20 px-4 sm:px-6 md:px-12 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 70% 20%, ${alloma.accent}1a 0%, transparent 60%)`,
        }}
      >
        <div className="relative max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-14 items-center">
          {/* Portrait — single hairline border, layered shadow, rounded-2xl. */}
          <div
            className="relative aspect-[3/4] w-full max-w-[75vw] sm:max-w-[340px] lg:max-w-[380px] mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-white/[0.06]"
            style={{
              boxShadow:
                '0 32px 64px -16px rgba(0,0,0,0.55), 0 4px 14px -6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ transform: `translateY(${parallaxY}px)` }} className="absolute inset-0">
              <SmartImage
                src={alloma.image}
                alt={alloma.name}
                initial={alloma.initial}
                accent={alloma.accent}
                objectPosition={alloma.imagePosition || 'center top'}
              />
            </div>
            {/* Single bottom gradient + quiet caption — no inset frame */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[42%] pointer-events-none"
              style={{
                background:
                  'linear-gradient(0deg, rgba(8,18,30,0.92) 0%, rgba(8,18,30,0.45) 50%, transparent 100%)',
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
              <span className="text-gold/85 text-[10px] tracking-[3.5px] uppercase font-medium block mb-1">
                {alloma.era}
              </span>
              <p className="font-serif text-cream text-xl leading-tight">{alloma.birthplace}</p>
            </div>
          </div>

          <div>
            <Link
              to={basePath}
              className="inline-flex items-center gap-2 text-cream-soft/55 hover:text-gold text-[11px] tracking-[2.5px] uppercase mb-6 transition-colors"
            >
              <svg
                viewBox="0 0 20 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-4 h-3 rotate-180"
                aria-hidden="true"
              >
                <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
              </svg>
              {listLabel}
            </Link>
            <div className="flex items-start justify-between gap-4 mb-4">
              <p className="text-gold/75 text-[11px] tracking-[5px] uppercase font-medium">
                {alloma.field}
              </p>
              <FavoriteButton section={section} itemId={alloma.id} size="lg" />
            </div>
            <h1
              className="font-serif text-cream leading-[1.02] mb-3"
              style={{ fontSize: 'clamp(28px, 5vw, 72px)' }}
            >
              {alloma.name}
            </h1>
            <p className="text-cream-soft/55 text-sm tracking-[2px] mb-2">{alloma.years}</p>
            {alloma.fullName ? (
              <p className="text-cream-soft/55 text-[13px] tracking-wide mb-7">{alloma.fullName}</p>
            ) : null}

            {/* Quote — no italic, no gold left bar */}
            {alloma.quote ? (
              <blockquote
                className="font-serif text-cream/90 leading-snug mb-7 max-w-xl"
                style={{ fontSize: 'clamp(18px, 1.7vw, 24px)' }}
              >
                {`"${alloma.quote}"`}
              </blockquote>
            ) : null}

            <div className="flex flex-wrap gap-2 mb-8">
              {alloma.tags.map((t) => (
                <span
                  key={t}
                  className="px-3.5 py-1.5 border border-white/[0.08] hover:border-gold/40 text-cream-soft/85 hover:text-gold-bright text-[11px] tracking-[2px] uppercase rounded-full transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>

            {available && (
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => (speaking ? stop() : speak(fullText))}
                  className="gold-cta"
                >
                  <span className="flex items-center gap-3">
                    {speaking ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <rect x="6" y="5" width="4" height="14" />
                          <rect x="14" y="5" width="4" height="14" />
                        </svg>
                        To'xtatish
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                          <path d="M11 5L6 9H2v6h4l5 4V5z" />
                          <path d="M15 9a4 4 0 010 6M18 6a8 8 0 010 12" />
                        </svg>
                        Ovozli o'qish
                      </>
                    )}
                  </span>
                </button>
                {voiceLabel && voiceLabel !== "O'zbek ovozi" && (
                  <span className="text-cream-soft/55 text-xs">
                    Ovoz: {voiceLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Biography */}
      <section className="px-4 sm:px-6 md:px-12 py-14 sm:py-20 max-w-4xl mx-auto">
        <SectionHeading eyebrow="Hayot Yo'li" title="Tarjimai Hol" className="mb-10" />
        <Typewriter paragraphs={alloma.fullBio} startDelay={200} />
      </section>

      {/* Timeline */}
      <section className="relative px-4 sm:px-6 md:px-12 py-14 sm:py-20 max-w-[1300px] mx-auto">
        <SectionHeading eyebrow="Vaqt Chizig'i" title="Muhim Sanalari" className="mb-14" />
        <Timeline events={alloma.timeline} accent={alloma.accent} />
      </section>

      {/* Works */}
      <section
        className="relative px-4 sm:px-6 md:px-12 py-14 sm:py-20"
        style={{ background: `linear-gradient(180deg, transparent, ${alloma.accent}10, transparent)` }}
      >
        <div className="max-w-[1200px] mx-auto">
          <SectionHeading eyebrow="Boy Meros" title="Mashhur Asarlari" className="mb-14" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {alloma.works.map((w, i) => (
              <div
                key={w}
                className="group relative p-7 rounded-2xl border border-white/[0.06] hover:border-gold/30 bg-white/[0.02] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
                style={{
                  boxShadow:
                    '0 18px 36px -12px rgba(0,0,0,0.45), 0 4px 10px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <div className="text-gold/55 text-[11px] tracking-[3px] mb-3 tabular-nums font-medium">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-serif text-cream text-xl md:text-[22px] leading-tight group-hover:text-gold-bright transition-colors">
                  {w}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LanguagesSection languages={alloma.languages} />
      <InterestingFactsSection facts={alloma.interestingFacts} />
      <LegacySection text={alloma.legacy} />

      {/* Quiz */}
      {quiz && (
        <section className="px-4 sm:px-6 md:px-12 py-14 sm:py-20 max-w-4xl mx-auto">
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
              onComplete={(score, total) => submitQuiz(alloma.slug, score, total)}
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
              <div>
                <button onClick={() => setQuizOpen(true)} className="gold-cta">
                  <span className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                    {previousQuizScore !== undefined ? 'Qayta sinash' : 'Viktorinani boshlash'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      <Comments
        contentType={section}
        contentId={alloma.id}
        contentTitle={alloma.name}
      />

      {/* Siblings navigation */}
      <section className="px-4 sm:px-6 md:px-12 py-14 sm:py-20 border-t border-white/[0.05]">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeading title={siblingsLabel} className="mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {source
              .filter((a) => a.slug !== alloma.slug)
              .map((a) => (
                <Link
                  key={a.id}
                  to={`${basePath}/${a.slug}`}
                  className="group p-2.5 rounded-2xl border border-white/[0.06] hover:border-gold/30 bg-white/[0.02] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 overflow-hidden"
                  style={{
                    boxShadow:
                      '0 12px 24px -10px rgba(0,0,0,0.4), 0 3px 8px -3px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  <div className="aspect-[3/4] mb-3 rounded-xl overflow-hidden">
                    <SmartImage
                      src={a.image}
                      alt={a.name}
                      initial={a.initial}
                      accent={a.accent}
                      objectPosition={a.imagePosition || 'center top'}
                    />
                  </div>
                  <div className="font-serif text-cream text-sm text-center leading-tight">{a.name}</div>
                  <div className="text-cream-soft/50 text-[10px] tracking-[2px] mt-1 text-center">{a.years}</div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </article>
  );
}
