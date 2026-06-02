import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import musiqa from '../data/musiqa.json';
import viktorinalar from '../data/viktorinalar.json';
import SmartImage from '../components/common/SmartImage.jsx';
import SectionHeading from '../components/common/SectionHeading.jsx';
import FavoriteButton from '../components/common/FavoriteButton.jsx';
import Quiz, { quizSessionSize } from '../components/common/Quiz.jsx';
import Comments from '../components/common/Comments.jsx';
import KaraokeView from '../components/musiqa/KaraokeView.jsx';
import {
  HistoricalContextSection,
  InstrumentsSection,
  InterestingFactsSection,
  PerformerBioSection,
} from '../components/common/EnrichmentSections.jsx';
import useProgress from '../hooks/useProgress.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function MusiqaDetailPage() {
  const { slug } = useParams();
  const song = useMemo(() => musiqa.find((m) => m.slug === slug), [slug]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [karaokeOpen, setKaraokeOpen] = useState(false);
  const { state: progressState, visit, submitQuiz } = useProgress();
  useScrollReveal();

  // Only credit a "visit" when the user has genuinely listened to the song
  // via the karaoke player (real cumulative playback ≥ 25s, or 30s of
  // active YouTube fallback). This stops the old exploit where opening the
  // page or arrow-skipping through karaoke instantly granted +7 points.
  const handleListened = () => {
    if (!song) return;
    visit('musiqa', song.id, { points: 7, achievement: 'maqomshunos' });
  };

  const quiz = useMemo(
    () => viktorinalar.find((v) => v.ownerType === 'musiqa' && v.ownerId === song?.slug),
    [song?.slug],
  );
  const previousQuizEntry = song ? progressState.quizScores[song.slug] : undefined;
  const previousQuizScore =
    typeof previousQuizEntry === 'number' ? previousQuizEntry : previousQuizEntry?.score;

  // No eager visit() on mount any more — the visit fires from handleListened
  // when KaraokeView reports real playback.

  if (!song) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32">
        <h1 className="font-serif text-cream text-4xl mb-4">Asar topilmadi</h1>
        <Link to="/musiqa" className="gold-cta">
          <span>Musiqa</span>
        </Link>
      </section>
    );
  }

  return (
    <article className="relative">
      {/* Hero */}
      <header
        className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 50% 20%, ${song.accent}1a, transparent 60%)` }}
      >
        <div className="relative max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Album art — single hairline border, layered shadow */}
          <div className="reveal w-full max-w-[200px] sm:max-w-[260px] md:max-w-[300px] mx-auto md:mx-0">
            <div
              className="relative aspect-square rounded-2xl overflow-hidden border border-white/[0.06]"
              style={{
                boxShadow:
                  '0 32px 64px -16px rgba(0,0,0,0.55), 0 4px 14px -6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              <SmartImage src={song.image} alt={song.title} initial={song.initial} accent={song.accent} />
            </div>
          </div>

          <div>
            <Link
              to="/musiqa"
              className="inline-flex items-center gap-2 text-cream-soft/55 hover:text-gold text-[11px] tracking-[2.5px] uppercase mb-6 transition-colors"
            >
              <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-3 rotate-180">
                <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
              </svg>
              Musiqa
            </Link>
            <div className="flex items-start justify-between gap-4 mb-3">
              <p className="text-gold/75 text-[11px] tracking-[5px] uppercase font-medium">
                {song.genre}
              </p>
              <FavoriteButton section="musiqa" itemId={song.id} size="lg" />
            </div>
            <h1
              className="font-serif text-cream leading-[1.02] mb-3"
              style={{ fontSize: 'clamp(26px, 5vw, 64px)' }}
            >
              {song.title}
            </h1>
            <p className="text-cream-soft/55 text-sm tracking-[2px] mb-6">{song.artist}</p>

            <p className="font-serif text-cream/85 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl">
              {song.about}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => setKaraokeOpen(true)} className="gold-cta">
                <span className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Karaoke rejimi
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* About — long */}
      {song.aboutFull?.length > 0 && (
        <section className="px-4 sm:px-6 md:px-12 py-16 sm:py-20 max-w-4xl mx-auto reveal">
          <SectionHeading eyebrow="Asar Haqida" title="Batafsil" className="mb-10" />
          <div className="space-y-5 text-cream-soft text-base sm:text-lg leading-relaxed">
            {song.aboutFull.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* Performer bio */}
      <PerformerBioSection bio={song.performerBio} accent={song.accent} />

      {/* Instruments */}
      <InstrumentsSection instruments={song.instruments} accent={song.accent} />

      {/* Historical context */}
      <HistoricalContextSection text={song.historicalContext} accent={song.accent} />

      {/* Interesting facts */}
      <InterestingFactsSection facts={song.interestingFacts} accent={song.accent} />

      {/* Quiz */}
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
              onComplete={(score, total) => submitQuiz(song.slug, score, total)}
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

      {/* Comments */}
      <Comments contentType="musiqa" contentId={song.id} contentTitle={song.title} />

      {/* Other songs */}
      <section className="px-4 sm:px-6 md:px-12 py-14 sm:py-20 border-t border-white/[0.05]">
        <div className="max-w-[1300px] mx-auto">
          <SectionHeading title="Boshqa Asarlar" className="mb-10" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {musiqa
              .filter((m) => m.slug !== song.slug)
              .map((m) => (
                <Link
                  key={m.id}
                  to={`/musiqa/${m.slug}`}
                  className="group block rounded-2xl border border-white/[0.06] hover:border-gold/30 bg-white/[0.02] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
                  style={{
                    boxShadow:
                      '0 12px 24px -10px rgba(0,0,0,0.4), 0 3px 8px -3px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  <div className="aspect-square">
                    <SmartImage src={m.image} alt={m.title} initial={m.initial} accent={m.accent} />
                  </div>
                  <div className="p-3 text-center">
                    <div className="font-serif text-cream text-sm leading-tight truncate">{m.title}</div>
                    <div className="text-cream-soft/50 text-[10px] tracking-[2px] mt-1 truncate">{m.artist}</div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {karaokeOpen && (
        <KaraokeView
          song={song}
          onClose={() => setKaraokeOpen(false)}
          onListened={handleListened}
        />
      )}
    </article>
  );
}
