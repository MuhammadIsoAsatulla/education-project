import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import kitoblar from '../data/kitoblar.json';
import viktorinalar from '../data/viktorinalar.json';
import SmartImage from '../components/common/SmartImage.jsx';
import OrnamentDivider from '../components/common/OrnamentDivider.jsx';
import ReadingCTA from '../components/kitoblar/ReadingCTA.jsx';
import Quiz from '../components/common/Quiz.jsx';
import Comments from '../components/common/Comments.jsx';
import {
  CharactersSection,
  HistoricalContextSection,
  InterestingFactsSection,
} from '../components/common/EnrichmentSections.jsx';
import useProgress from '../hooks/useProgress.js';
import useScrollReveal from '../hooks/useScrollReveal.js';
import useTextToSpeech from '../hooks/useTextToSpeech.js';

// Lazy load the heavy PDF reader — only loaded when user clicks "Mutolaa"
const BookReader = lazy(() => import('../components/kitoblar/BookReader.jsx'));

export default function KitobDetailPage() {
  const { slug } = useParams();
  const book = useMemo(() => kitoblar.find((b) => b.slug === slug), [slug]);
  const [opened, setOpened] = useState(false);
  const [excerptIndex, setExcerptIndex] = useState(0);
  const [readerOpen, setReaderOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const { state: progressState, visit, clearReadingProgress, submitQuiz } = useProgress();
  const quiz = useMemo(
    () => viktorinalar.find((v) => v.ownerType === 'kitoblar' && v.ownerId === book?.slug),
    [book?.slug],
  );
  const previousQuizEntry = book ? progressState.quizScores[book.slug] : undefined;
  const previousQuizScore =
    typeof previousQuizEntry === 'number' ? previousQuizEntry : previousQuizEntry?.score;
  const { speak, stop, speaking, available, voiceLabel } = useTextToSpeech();
  const readingProgress = book ? progressState.readingProgress[book.slug] : undefined;
  useScrollReveal();

  useEffect(() => {
    if (book) visit('kitoblar', book.id, { points: 7, achievement: 'kitobxon' });
  }, [book, visit]);

  useEffect(() => {
    const t = setTimeout(() => setOpened(true), 400);
    return () => clearTimeout(t);
  }, []);

  if (!book) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32">
        <h1 className="font-serif text-cream text-4xl mb-4">Kitob topilmadi</h1>
        <Link to="/kitoblar" className="gold-cta"><span>Kitoblar</span></Link>
      </section>
    );
  }

  const currentExcerpt = book.excerpts?.[excerptIndex];

  return (
    <article className="relative">
      <header
        className="relative pt-24 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 md:px-12 overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 50% 10%, ${book.accent}33, var(--bg-deep) 60%)` }}
      >
        <div className="absolute inset-0 bg-girih opacity-40 pointer-events-none" />
        <div className="relative max-w-[1300px] mx-auto">
          <Link to="/kitoblar" className="inline-flex items-center gap-2 text-gold/70 hover:text-gold text-xs tracking-[2px] uppercase mb-6 sm:mb-8">
            <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-3 rotate-180">
              <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
            </svg>
            Kitoblar
          </Link>

          {/* Open book layout */}
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-12 items-stretch perspective">
            {/* Left page (cover) */}
            <div
              className={`relative origin-right transition-transform duration-700 ease-out ${
                opened ? 'rotate-y-0' : '-rotate-y-30'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative aspect-[3/4.2] rounded-sm overflow-hidden border border-gold shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                <SmartImage
                  src={book.cover}
                  alt={book.title}
                  initial={book.initial}
                  accent={book.accent}
                />
                {/* Cover frame overlay (only visible if image is present, but harmless on fallback too) */}
                <span className="absolute inset-3 border border-gold/40 pointer-events-none" />
                <span className="absolute inset-6 border border-gold/20 pointer-events-none" />
                {/* Bottom title strip */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-deep via-bg-deep/85 to-transparent">
                  <div className="text-center">
                    <h1 className="font-serif text-cream text-2xl md:text-3xl tracking-wide mb-2 leading-tight">
                      {book.title}
                    </h1>
                    <div className="w-12 h-px bg-gold mx-auto mb-2" />
                    <p className="font-amiri text-gold tracking-[2px] text-xs">— {book.author} —</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right "page" — annotation + excerpts */}
            <div
              className={`relative bg-cream/95 text-bg-deep rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-700 ${
                opened ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
              style={{
                backgroundImage:
                  "linear-gradient(0deg, rgba(212,165,116,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
                backgroundSize: '100% 28px, 28px 100%',
              }}
            >
              <div className="absolute top-0 right-0 w-12 h-12">
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[48px] border-l-transparent border-b-[48px] border-b-cream-soft/40" />
              </div>

              <div className="p-6 sm:p-8 md:p-12">
                <div className="text-bg-deep/50 text-xs tracking-[3px] uppercase mb-2 font-sans">— {book.genre} —</div>
                <h2 className="font-serif text-bg-deep text-3xl md:text-4xl mb-4">{book.title}</h2>
                <p className="font-serif italic text-bg-deep/70 mb-6 text-lg">— {book.author}, {book.year} —</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-sm mb-6 pb-6 border-b border-bg-deep/20">
                  <div>
                    <div className="text-bg-deep/40 text-[10px] tracking-[2px] uppercase mb-1">Sahifa</div>
                    <div className="font-serif text-bg-deep text-xl">{book.pages}</div>
                  </div>
                  <div>
                    <div className="text-bg-deep/40 text-[10px] tracking-[2px] uppercase mb-1">Til</div>
                    <div className="font-serif text-bg-deep text-base">{book.language}</div>
                  </div>
                  <div>
                    <div className="text-bg-deep/40 text-[10px] tracking-[2px] uppercase mb-1">Yil</div>
                    <div className="font-serif text-bg-deep text-xl">{book.year}</div>
                  </div>
                </div>
                <h3 className="font-serif text-bg-deep text-lg mb-2">Annotatsiya</h3>
                <p className="text-bg-deep/80 leading-relaxed mb-4">{book.annotation}</p>
                <p className="text-bg-deep/70 leading-relaxed mb-6">{book.longDescription}</p>

                <div className="flex flex-wrap gap-2">
                  {book.themes.map((t) => (
                    <span key={t} className="px-3 py-1 border border-bg-deep/30 text-bg-deep/80 text-[11px] tracking-[2px] uppercase rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Full PDF reader CTA */}
      {book.pdf && (
        <ReadingCTA
          book={book}
          progress={readingProgress}
          onOpen={() => setReaderOpen(true)}
          onRestart={() => clearReadingProgress(book.slug)}
        />
      )}

      {/* Excerpt reader */}
      {book.excerpts?.length > 0 && currentExcerpt && (
        <section className="px-4 sm:px-6 md:px-12 py-12 sm:py-20 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <OrnamentDivider className="opacity-60 mb-6" />
            <div className="eyebrow mb-3">— ASAR PARCHALARI —</div>
            <h2 className="section-title">O'qib Ko'ring</h2>
          </div>

          <div className="bg-cream/95 text-bg-deep rounded-sm border border-gold/20 shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 md:p-12 relative">
              <span className="absolute top-4 left-4 right-4 h-px bg-bg-deep/10" />
              <span className="absolute bottom-4 left-4 right-4 h-px bg-bg-deep/10" />

              <h3 className="font-serif text-bg-deep text-2xl mb-5">{currentExcerpt.title}</h3>
              <p className="font-serif text-bg-deep/85 text-lg leading-loose whitespace-pre-line italic">
                «{currentExcerpt.text}»
              </p>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-bg-deep/15 flex-wrap gap-3">
                <span className="text-bg-deep/50 text-xs tracking-[2px] uppercase">
                  Parcha {excerptIndex + 1} / {book.excerpts.length}
                </span>
                <div className="flex gap-2 flex-wrap">
                  {available && (
                    <button
                      onClick={() =>
                        speaking ? stop() : speak(`${currentExcerpt.title}. ${currentExcerpt.text}`)
                      }
                      className="px-4 py-2 border border-bg-deep/40 text-bg-deep text-xs tracking-[2px] uppercase hover:bg-bg-deep hover:text-cream transition rounded-sm"
                      title={voiceLabel || ''}
                    >
                      {speaking ? "To'xtatish" : 'Tinglash'}
                    </button>
                  )}
                  <button
                    onClick={() => setExcerptIndex((i) => (i - 1 + book.excerpts.length) % book.excerpts.length)}
                    className="px-4 py-2 border border-bg-deep/40 text-bg-deep text-xs tracking-[2px] uppercase hover:bg-bg-deep hover:text-cream transition rounded-sm"
                  >
                    ‹ Oldingi
                  </button>
                  <button
                    onClick={() => setExcerptIndex((i) => (i + 1) % book.excerpts.length)}
                    className="px-4 py-2 border border-bg-deep/40 text-bg-deep text-xs tracking-[2px] uppercase hover:bg-bg-deep hover:text-cream transition rounded-sm"
                  >
                    Keyingi ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* NEW: Characters */}
      <CharactersSection characters={book.characters} accent={book.accent} />

      {/* NEW: Historical context */}
      <HistoricalContextSection text={book.historicalContext} accent={book.accent} />

      {/* NEW: Interesting facts */}
      <InterestingFactsSection facts={book.interestingFacts} accent={book.accent} />

      {/* NEW: Quiz */}
      {quiz && (
        <section className="px-4 sm:px-6 md:px-12 py-16 sm:py-20 max-w-4xl mx-auto">
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
              onComplete={(score, total) => submitQuiz(book.slug, score, total)}
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
              <button onClick={() => setQuizOpen(true)} className="gold-cta">
                <span>{previousQuizScore !== undefined ? 'Qayta sinash' : 'Viktorinani boshlash'}</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* NEW: Comments */}
      <Comments contentType="kitoblar" contentId={book.id} contentTitle={book.title} />

      {/* Other books */}
      <section className="px-4 sm:px-6 md:px-12 py-12 sm:py-16 border-t border-gold/10">
        <div className="max-w-[1200px] mx-auto">
          <div className="eyebrow mb-6 text-center">— BOSHQA KITOBLAR —</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {kitoblar.filter((b) => b.slug !== book.slug).slice(0, 5).map((b) => (
              <Link
                key={b.id}
                to={`/kitoblar/${b.slug}`}
                className="group block rounded-sm border border-gold/20 hover:border-gold/70 overflow-hidden transition"
              >
                <div className="aspect-[3/4]">
                  <SmartImage src={b.cover} alt={b.title} initial={b.initial} accent={b.accent} />
                </div>
                <div className="p-3 text-center">
                  <div className="font-serif text-cream text-sm leading-tight">{b.title}</div>
                  <div className="text-gold/60 text-[10px] tracking-[2px] mt-1">{b.author}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Full-screen PDF reader (lazy loaded) */}
      {readerOpen && book.pdf && (
        <Suspense fallback={<ReaderLoadingFallback />}>
          <BookReader
            book={book}
            initialPage={readingProgress?.lastPage || 1}
            onClose={() => setReaderOpen(false)}
          />
        </Suspense>
      )}

      <style>{`
        .perspective { perspective: 1600px; }
        .rotate-y-0 { transform: rotateY(0deg); }
        .-rotate-y-30 { transform: rotateY(-30deg); }
      `}</style>
    </article>
  );
}

function ReaderLoadingFallback() {
  return (
    <div className="fixed inset-0 z-[90] bg-bg-deep/98 backdrop-blur-xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="text-cream-soft/70 text-sm tracking-[2px] uppercase">Reader yuklanmoqda…</p>
      </div>
    </div>
  );
}
