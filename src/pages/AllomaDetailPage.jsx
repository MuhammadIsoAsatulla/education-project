import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import allomalar from '../data/allomalar.json';
import viktorinalar from '../data/viktorinalar.json';
import Typewriter from '../components/allomalar/Typewriter.jsx';
import Timeline from '../components/allomalar/Timeline.jsx';
import SmartImage from '../components/common/SmartImage.jsx';
import OrnamentDivider from '../components/common/OrnamentDivider.jsx';
import FavoriteButton from '../components/common/FavoriteButton.jsx';
import Quiz from '../components/common/Quiz.jsx';
import useTextToSpeech from '../hooks/useTextToSpeech.js';
import useProgress from '../hooks/useProgress.js';

export default function AllomaDetailPage() {
  const { slug } = useParams();
  const alloma = useMemo(() => allomalar.find((a) => a.slug === slug), [slug]);
  const [parallaxY, setParallaxY] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const { speak, stop, speaking, available, voiceLabel } = useTextToSpeech();
  const { state: progressState, visit, submitQuiz } = useProgress();
  const quiz = useMemo(
    () => viktorinalar.find((v) => v.ownerType === 'allomalar' && v.ownerId === alloma?.slug),
    [alloma?.slug],
  );
  const previousQuizScore = alloma ? progressState.quizScores[alloma.slug] : undefined;

  useEffect(() => {
    if (!alloma) return;
    visit('allomalar', alloma.id, { points: 10, achievement: 'alloma-do-st' });
  }, [alloma, visit]);

  useEffect(() => {
    const onScroll = () => setParallaxY(window.scrollY * 0.15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!alloma) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-cream text-4xl mb-4">Alloma topilmadi</h1>
        <Link to="/allomalar" className="gold-cta"><span>Allomalar ro'yxati</span></Link>
      </section>
    );
  }

  const fullText = [alloma.shortBio, ...alloma.fullBio].join(' ');

  return (
    <article className="relative">
      {/* Hero band */}
      <header
        className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 70% 20%, ${alloma.accent}33 0%, var(--bg-deep) 60%)`,
        }}
      >
        <div className="absolute inset-0 bg-girih opacity-60 pointer-events-none" />
        <div className="relative max-w-[1300px] mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-12 items-center">
          {/* Portrait */}
          <div className="relative aspect-[3/4] w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] mx-auto lg:mx-0 rounded-sm overflow-hidden border border-gold shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <div style={{ transform: `translateY(${parallaxY}px)` }} className="absolute inset-0">
              <SmartImage
                src={alloma.image}
                alt={alloma.name}
                initial={alloma.initial}
                accent={alloma.accent}
                objectPosition={alloma.imagePosition || 'center top'}
              />
            </div>
            <div className="absolute inset-3 border border-gold/40 pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-deep via-bg-deep/70 to-transparent z-10">
              <div className="eyebrow text-xs mb-2">— {alloma.era} —</div>
              <p className="font-serif text-cream text-2xl">{alloma.birthplace}</p>
            </div>
          </div>

          <div>
            <Link to="/allomalar" className="inline-flex items-center gap-2 text-gold/70 hover:text-gold text-xs tracking-[2px] uppercase mb-6">
              <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-3 rotate-180">
                <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
              </svg>
              Allomalar ro'yxati
            </Link>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="eyebrow">— {alloma.field} —</div>
              <FavoriteButton section="allomalar" itemId={alloma.id} size="lg" />
            </div>
            <h1 className="font-serif text-gold-gradient leading-[0.95] mb-3"
                style={{ fontSize: 'clamp(48px, 7vw, 96px)', letterSpacing: '2px' }}>
              {alloma.name}
            </h1>
            <p className="font-amiri text-gold text-lg tracking-[3px] mb-2">— {alloma.years} —</p>
            <p className="text-cream-soft/80 text-sm tracking-wide mb-8">{alloma.fullName}</p>

            <blockquote className="font-serif italic text-cream text-2xl md:text-3xl leading-snug border-l-2 border-gold pl-6 mb-8">
              “{alloma.quote}”
            </blockquote>

            <div className="flex flex-wrap gap-3 mb-8">
              {alloma.tags.map((t) => (
                <span key={t} className="px-4 py-1.5 border border-gold/40 text-gold/90 text-xs tracking-[2px] uppercase rounded-full">
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
                  <span className="text-cream-soft/60 text-xs italic">
                    Ovoz: {voiceLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Biography */}
      <section className="px-4 sm:px-6 md:px-12 py-16 sm:py-24 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <OrnamentDivider className="opacity-60 mb-6" />
          <div className="eyebrow mb-3">— HAYOT YO'LI —</div>
          <h2 className="section-title">Tarjimai Hol</h2>
        </div>
        <Typewriter paragraphs={alloma.fullBio} speed={14} startDelay={300} />
      </section>

      {/* Timeline */}
      <section className="relative px-4 sm:px-6 md:px-12 py-16 sm:py-24 max-w-[1300px] mx-auto">
        <div className="text-center mb-16">
          <OrnamentDivider className="opacity-60 mb-6" />
          <div className="eyebrow mb-3">— VAQT CHIZIG'I —</div>
          <h2 className="section-title">Muhim Sanalari</h2>
        </div>
        <Timeline events={alloma.timeline} accent={alloma.accent} />
      </section>

      {/* Works */}
      <section className="relative px-4 sm:px-6 md:px-12 py-16 sm:py-24"
               style={{ background: `linear-gradient(180deg, transparent, ${alloma.accent}1a, transparent)` }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <OrnamentDivider className="opacity-60 mb-6" />
            <div className="eyebrow mb-3">— BOY MEROS —</div>
            <h2 className="section-title">Mashhur Asarlari</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alloma.works.map((w, i) => (
              <div
                key={w}
                className="group relative p-8 border border-gold/20 hover:border-gold rounded-sm bg-bg-mid/40 backdrop-blur transition-all duration-500"
              >
                <div className="font-serif text-gold/60 text-sm tracking-[3px] mb-4">— {String(i + 1).padStart(2, '0')} —</div>
                <h3 className="font-serif text-cream text-2xl leading-tight group-hover:text-gold-gradient transition-colors">
                  {w}
                </h3>
                <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-gold transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz section */}
      {quiz && (
        <section className="px-4 sm:px-6 md:px-12 py-16 sm:py-24 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <OrnamentDivider className="opacity-60 mb-6" />
            <div className="eyebrow mb-3">— BILIMLARNI SINASH —</div>
            <h2 className="section-title">Viktorina</h2>
            <p className="font-serif italic text-cream-soft/80 mt-3">
              {quiz.questions.length} ta savol. Har to'g'ri javob — bonus ball.
            </p>
          </div>

          {quizOpen ? (
            <Quiz
              questions={quiz.questions}
              previousBest={previousQuizScore ?? null}
              onComplete={(score) => submitQuiz(alloma.slug, score)}
              onClose={() => setQuizOpen(false)}
            />
          ) : (
            <div className="text-center">
              {previousQuizScore !== undefined ? (
                <div className="inline-block p-6 sm:p-8 border border-gold/30 rounded-sm bg-bg-mid/50 backdrop-blur mb-6">
                  <div className="eyebrow text-xs mb-2">— ENG YAXSHI NATIJA —</div>
                  <div className="font-serif text-gold-gradient text-4xl sm:text-5xl mb-1">
                    {previousQuizScore} / {quiz.questions.length}
                  </div>
                  {previousQuizScore === quiz.questions.length && (
                    <p className="text-gold/80 text-sm italic">Mukammal! ✦</p>
                  )}
                </div>
              ) : (
                <p className="font-serif italic text-cream-soft text-lg mb-6">
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

      {/* Other allomas navigation */}
      <section className="px-4 sm:px-6 md:px-12 py-12 sm:py-20 border-t border-gold/10">
        <div className="max-w-[1200px] mx-auto">
          <div className="eyebrow mb-6 text-center">— BOSHQA ALLOMALAR —</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
            {allomalar
              .filter((a) => a.slug !== alloma.slug)
              .map((a) => (
                <Link
                  key={a.id}
                  to={`/allomalar/${a.slug}`}
                  className="group p-3 border border-gold/20 hover:border-gold/80 rounded-sm transition-all overflow-hidden"
                >
                  <div className="aspect-[3/4] mb-3 rounded-sm overflow-hidden">
                    <SmartImage
                      src={a.image}
                      alt={a.name}
                      initial={a.initial}
                      accent={a.accent}
                      objectPosition={a.imagePosition || 'center top'}
                    />
                  </div>
                  <div className="font-serif text-cream text-sm text-center">{a.name}</div>
                  <div className="text-gold/60 text-[10px] tracking-[2px] mt-1 text-center">{a.years}</div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </article>
  );
}
