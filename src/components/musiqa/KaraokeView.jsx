import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Howl } from 'howler';
import SmartImage from '../common/SmartImage.jsx';
import { loadLRC } from '../../utils/lrc.js';

const STATUS = {
  CHECKING: 'checking',
  KARAOKE: 'karaoke', // audio + lyrics
  AUDIO_ONLY: 'audio_only', // audio without timed lyrics
  YOUTUBE: 'youtube', // no audio file, but YouTube video id available
  SEARCH: 'search', // nothing local — point to YouTube search
};

// How many seconds of REAL playback the user has to log before we credit
// the song as "listened to". Arrow-seek jumps don't count — only forward
// progression measured against wall clock. Tuned to "long enough to take in
// a verse or two" rather than "long enough to finish the song".
const LISTEN_THRESHOLD_SECONDS = 25;
// YouTube fallback can't be measured precisely (no iframe API plumbing here),
// so we use a coarser "modal open + tab visible" timer instead.
const YOUTUBE_FALLBACK_SECONDS = 30;

export default function KaraokeView({ song, onClose, onListened }) {
  const [status, setStatus] = useState(STATUS.CHECKING);
  const [lyrics, setLyrics] = useState([]);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const howlRef = useRef(null);
  const rafRef = useRef(null);
  const rootRef = useRef(null);
  const idleTimerRef = useRef(null);
  // Track REAL accumulated playback. `lastSeekRef` stores the previous tick's
  // playhead position so we only count forward, small-delta progress —
  // ignoring jumps from arrow-key seeks. `creditedRef` ensures onListened
  // fires at most once per KaraokeView lifetime.
  const playedSecondsRef = useRef(0);
  const lastSeekRef = useRef(0);
  const creditedRef = useRef(false);

  // Detect available media for this song
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Try audio first
      if (song.audio) {
        try {
          const audioRes = await fetch(song.audio, { method: 'HEAD' });
          if (!cancelled && audioRes.ok) {
            // Try LRC
            let timed = [];
            if (song.lrc) {
              timed = await loadLRC(song.lrc);
            }
            if (cancelled) return;
            setLyrics(timed);
            setStatus(timed.length ? STATUS.KARAOKE : STATUS.AUDIO_ONLY);
            return;
          }
        } catch {
          /* fall through */
        }
      }
      if (cancelled) return;
      if (song.youtubeId) setStatus(STATUS.YOUTUBE);
      else setStatus(STATUS.SEARCH);
    })();
    return () => { cancelled = true; };
  }, [song]);

  // Initialize Howl when in karaoke or audio-only mode
  useEffect(() => {
    if (status !== STATUS.KARAOKE && status !== STATUS.AUDIO_ONLY) return;
    const h = new Howl({
      src: [song.audio],
      html5: true,
      volume,
      onload: () => setDuration(h.duration()),
      onend: () => setPlaying(false),
      onplay: () => setPlaying(true),
      onpause: () => setPlaying(false),
      onloaderror: () => setStatus(song.youtubeId ? STATUS.YOUTUBE : STATUS.SEARCH),
    });
    howlRef.current = h;
    h.play();
    return () => {
      h.stop();
      h.unload();
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, song.audio]);

  // Time tracker (only when audio is playing). Also accumulates "real
  // listened" seconds for visit-credit gating: we only count forward jumps
  // of < 2s (normal playback) — anything bigger (arrow-seek, scrub) is a
  // seek and gets discarded. When the threshold is crossed, fire onListened
  // exactly once.
  useEffect(() => {
    if (!playing || !howlRef.current) return;
    lastSeekRef.current = howlRef.current?.seek?.() || 0;
    const tick = () => {
      const t = howlRef.current?.seek?.();
      if (typeof t === 'number') {
        const dt = t - lastSeekRef.current;
        if (dt > 0 && dt < 2) {
          playedSecondsRef.current += dt;
          if (
            !creditedRef.current &&
            playedSecondsRef.current >= LISTEN_THRESHOLD_SECONDS
          ) {
            creditedRef.current = true;
            onListened?.();
          }
        }
        lastSeekRef.current = t;
        setTime(t);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, onListened]);

  // YouTube fallback: we can't measure real playback through the iframe,
  // so we approximate with "modal open + tab visible for N seconds". Pauses
  // when the tab is hidden so background-tab abuse is mitigated.
  useEffect(() => {
    if (status !== STATUS.YOUTUBE || creditedRef.current) return undefined;
    let elapsed = 0;
    let intervalId = null;
    const start = () => {
      if (intervalId) return;
      intervalId = setInterval(() => {
        elapsed += 1;
        if (elapsed >= YOUTUBE_FALLBACK_SECONDS && !creditedRef.current) {
          creditedRef.current = true;
          onListened?.();
          stop();
        }
      }, 1000);
    };
    const stop = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
    };
    const onVis = () => {
      if (document.visibilityState === 'visible') start();
      else stop();
    };
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [status, onListened]);

  const togglePlay = () => {
    const h = howlRef.current;
    if (!h) return;
    if (h.playing()) h.pause();
    else h.play();
  };

  const onSeek = (val) => {
    setTime(val);
    howlRef.current?.seek(val);
  };

  const onVolume = (val) => {
    setVolume(val);
    howlRef.current?.volume(val);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      rootRef.current?.requestFullscreen?.();
    }
  };

  // Watch the browser's fullscreen state so the icon updates even when the
  // user exits fullscreen via Esc (which the browser handles before us).
  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  // Keyboard shortcuts — Space toggles play, arrows seek ±5s, F fullscreen,
  // Esc closes. Essential for presenter use where the mouse is across the
  // room. The effect re-binds when time/duration change so the seek math
  // captures the latest values.
  useEffect(() => {
    if (status !== STATUS.KARAOKE && status !== STATUS.AUDIO_ONLY) return undefined;
    const onKey = (e) => {
      // Don't hijack typing inside inputs (volume slider, etc.).
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onSeek(Math.max(0, time - 5));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onSeek(Math.min(duration || time + 5, time + 5));
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        // Let the browser handle Esc when in fullscreen — it'll exit
        // fullscreen instead of closing the karaoke.
        if (!document.fullscreenElement) {
          e.preventDefault();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, time, duration]);

  // Auto-hide the footer (and the mouse cursor) after 4s of stillness while
  // playing. Spotify-style "performance mode" — pure lyrics, no chrome.
  // Any mouse movement or keypress brings the controls back immediately.
  useEffect(() => {
    if (!playing) {
      setControlsVisible(true);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      return undefined;
    }
    const wake = () => {
      setControlsVisible(true);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setControlsVisible(false), 4000);
    };
    wake();
    window.addEventListener('mousemove', wake);
    window.addEventListener('keydown', wake);
    window.addEventListener('touchstart', wake);
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', wake);
      window.removeEventListener('keydown', wake);
      window.removeEventListener('touchstart', wake);
    };
  }, [playing]);

  const activeIndex = useMemo(() => {
    if (!lyrics.length) return -1;
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= time + 0.05) idx = i;
      else break;
    }
    return idx;
  }, [time, lyrics]);

  const fmt = (s) => {
    const m = Math.floor((s || 0) / 60);
    const ss = Math.floor((s || 0) % 60);
    return `${m}:${ss.toString().padStart(2, '0')}`;
  };

  const youtubeSearchUrl = song.youtubeQuery
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(song.youtubeQuery)}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(`${song.artist} ${song.title}`)}`;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[180] bg-bg-deep/98 backdrop-blur-xl flex flex-col"
      role="dialog"
      style={{ cursor: controlsVisible ? 'auto' : 'none' }}
    >
      {/* Ambient backdrop — heavily blurred song cover for atmospheric depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {song.image && (
          <div
            className="absolute -inset-[15%] transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${song.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(80px) saturate(1.35)',
              opacity: 0.24,
            }}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-girih opacity-25 pointer-events-none" />
      {/* Breathing accent halo — slow pulse that gives the room its rhythm */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none karaoke-breathe"
        style={{ background: `radial-gradient(circle, ${song.accent}33, transparent 62%)` }}
      />

      <header
        className="relative px-3 sm:px-6 md:px-12 py-3 sm:py-6 flex items-center justify-between gap-2 sm:gap-3 border-b border-gold/15 backdrop-blur-sm bg-bg-deep/30 transition-opacity duration-500"
        style={{ opacity: controlsVisible ? 1 : 0, pointerEvents: controlsVisible ? 'auto' : 'none' }}
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div
            className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-gold/40 flex-shrink-0 shadow-[0_0_30px] transition-all duration-500 ${
              playing ? 'karaoke-vinyl' : ''
            }`}
            style={{ boxShadow: `0 0 24px ${song.accent}55` }}
          >
            <SmartImage src={song.image} alt={song.title} initial={song.initial} accent={song.accent} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="eyebrow text-xs sm:text-sm mb-0.5 sm:mb-1">
              — {status === STATUS.KARAOKE ? 'KARAOKE' : status === STATUS.AUDIO_ONLY ? 'TINGLASH' : 'TAFSILOT'} —
            </div>
            <h2 className="font-serif text-cream text-base sm:text-2xl md:text-3xl leading-tight truncate">{song.title}</h2>
            <p className="text-cream-soft/70 text-sm sm:text-base md:text-lg truncate">{song.artist} · {song.genre}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-bg-deep transition hidden sm:flex items-center justify-center"
            aria-label={isFullscreen ? 'Oynadan chiqish' : "To'liq ekran (F)"}
            title={isFullscreen ? 'Oynadan chiqish (F)' : "To'liq ekran (F)"}
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5" />
              </svg>
            )}
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-bg-deep transition flex items-center justify-center"
            aria-label="Yopish"
            title="Yopish (Esc)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 sm:w-5 sm:h-5">
              <path d="M6 6 L18 18 M18 6 L6 18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content varies by status */}
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-6">
        {status === STATUS.CHECKING && <CheckingView />}

        {status === STATUS.KARAOKE && (
          <KaraokeLines
            lyrics={lyrics}
            activeIndex={activeIndex}
            accent={song.accent}
            onSeek={onSeek}
          />
        )}

        {status === STATUS.AUDIO_ONLY && (
          <AudioOnlyView song={song} youtubeSearchUrl={youtubeSearchUrl} />
        )}

        {status === STATUS.YOUTUBE && (
          <YouTubeView song={song} />
        )}

        {status === STATUS.SEARCH && (
          <SearchFallbackView song={song} youtubeSearchUrl={youtubeSearchUrl} />
        )}
      </div>

      {/* Player footer — only when audio is loaded. Fades out after 4s of
          stillness during playback so the lyrics get the full stage. */}
      {(status === STATUS.KARAOKE || status === STATUS.AUDIO_ONLY) && (
        <footer
          className="relative px-6 md:px-12 py-6 border-t border-gold/15 bg-bg-mid/40 backdrop-blur transition-opacity duration-500"
          style={{ opacity: controlsVisible ? 1 : 0, pointerEvents: controlsVisible ? 'auto' : 'none' }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-gold/80 text-xs tabular-nums min-w-[2.5rem] flex-shrink-0">{fmt(time)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0.1}
                step="0.1"
                value={time}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="flex-1 accent-[#d4a574]"
              />
              <span className="text-gold/80 text-xs tabular-nums min-w-[2.5rem] text-right flex-shrink-0">{fmt(duration)}</span>
            </div>

            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => onSeek(Math.max(0, time - 5))}
                className="w-11 h-11 rounded-full border border-gold/40 text-gold/80 hover:text-gold hover:border-gold transition"
                aria-label="-5s"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 mx-auto">
                  <path d="M11 19l-9-7 9-7v14zM22 19V5" />
                </svg>
              </button>

              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-gold text-bg-deep hover:scale-105 transition shadow-[0_0_30px] shadow-gold/30"
              >
                {playing ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 mx-auto">
                    <rect x="6" y="5" width="4" height="14" />
                    <rect x="14" y="5" width="4" height="14" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 mx-auto">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => onSeek(Math.min(duration, time + 5))}
                className="w-11 h-11 rounded-full border border-gold/40 text-gold/80 hover:text-gold hover:border-gold transition"
                aria-label="+5s"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 mx-auto">
                  <path d="M13 5l9 7-9 7V5zM2 19V5" />
                </svg>
              </button>

              <div className="hidden sm:flex items-center gap-2 ml-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gold/70">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15 9a4 4 0 010 6" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => onVolume(parseFloat(e.target.value))}
                  className="w-24 accent-[#d4a574]"
                />
              </div>
            </div>

            {/* Tiny keyboard-shortcut legend for performers — invites
                presenters to use the keyboard so they don't have to keep
                the laptop next to them. Hidden on phones (no keyboard). */}
            <div className="hidden md:flex items-center justify-center gap-4 mt-4 text-[10px] tracking-[2px] uppercase text-cream-soft/40">
              <span><kbd className="px-1.5 py-0.5 border border-gold/20 rounded text-cream-soft/70">Space</kbd> {playing ? "to'xtatish" : 'ijro'}</span>
              <span><kbd className="px-1.5 py-0.5 border border-gold/20 rounded text-cream-soft/70">← →</kbd> ±5s</span>
              <span><kbd className="px-1.5 py-0.5 border border-gold/20 rounded text-cream-soft/70">F</kbd> to'liq ekran</span>
              <span><kbd className="px-1.5 py-0.5 border border-gold/20 rounded text-cream-soft/70">Esc</kbd> chiqish</span>
            </div>
          </div>
        </footer>
      )}

      {/* Karaoke atmosphere keyframes — vinyl spin, breathing halo, active
          line shimmer, and scrollbar suppression. Scoped to the modal so they
          don't bleed into the rest of the app. */}
      <style>{`
        .karaoke-scroll::-webkit-scrollbar { display: none; }
        @keyframes karaoke-breathe {
          0%, 100% { opacity: 0.85; transform: translate(-50%, 0) scale(1); }
          50%      { opacity: 1;    transform: translate(-50%, 0) scale(1.08); }
        }
        .karaoke-breathe {
          animation: karaoke-breathe 7s ease-in-out infinite;
        }
        @keyframes karaoke-vinyl {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .karaoke-vinyl {
          animation: karaoke-vinyl 20s linear infinite;
        }
        @keyframes karaoke-active-glow {
          0%, 100% { letter-spacing: 0.005em; }
          50%      { letter-spacing: 0.025em; }
        }
        .karaoke-active-glow {
          animation: karaoke-active-glow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function CheckingView() {
  return (
    <div className="text-center">
      <div className="w-12 h-12 mx-auto mb-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      <p className="text-cream-soft/70 text-sm tracking-[2px] uppercase">Yuklanmoqda…</p>
    </div>
  );
}

function KaraokeLines({
  lyrics,
  activeIndex,
  accent = '#d4a574',
  onSeek,
}) {
  // The viewport is the masked rectangle; the inner list translates so the
  // active line lands at vertical center. GPU-composited, fully eased.
  const viewportRef = useRef(null);
  const lineRefs = useRef([]);
  const [offset, setOffset] = useState(0);

  // Center the active line in the viewport via translateY on the list.
  // useLayoutEffect ensures the measurement runs before the browser paints
  // the next frame — no flicker on the first line activation.
  useLayoutEffect(() => {
    const vp = viewportRef.current;
    const el = lineRefs.current[Math.max(0, activeIndex)];
    if (!vp || !el) return;
    const target = el.offsetTop + el.offsetHeight / 2 - vp.clientHeight / 2;
    setOffset(-target);
  }, [activeIndex, lyrics.length]);

  // Re-center if the window resizes while the karaoke is open.
  useEffect(() => {
    const onResize = () => {
      const vp = viewportRef.current;
      const el = lineRefs.current[Math.max(0, activeIndex)];
      if (!vp || !el) return;
      const target = el.offsetTop + el.offsetHeight / 2 - vp.clientHeight / 2;
      setOffset(-target);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeIndex]);

  return (
    <div
      ref={viewportRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        // Mask gradient gives a soft fade at top + bottom without a separate
        // overlay element. Cleaner than positioned gradient divs because the
        // underlying lines never "see" the fade — they just clip into it.
        maskImage:
          'linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)',
      }}
    >
      <div
        className="karaoke-list"
        style={{
          transform: `translate3d(0, ${offset}px, 0)`,
          // The slide curve from your reference — slight overshoot at the end
          // makes lines "settle" into place instead of stopping flat.
          transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
          padding: '40% 0',
          willChange: 'transform',
        }}
      >
        {lyrics.map((l, i) => {
          const isActive = i === activeIndex;
          const isPast = activeIndex >= 0 && i < activeIndex;

          // Shared base styles for every line, regardless of state.
          // Sizes tuned for back-of-the-class readability — visible on a
          // projector or a TV screen from 5-10 meters away while still
          // sane on a phone in the user's hand.
          const base = {
            fontWeight: 600,
            fontSize: 'clamp(28px, 4.5vw, 64px)',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
            textAlign: 'center',
            margin: '0 auto',
            padding: '16px 8px',
            maxWidth: '94%',
            cursor: 'pointer',
          };

          if (isActive) {
            // Line-by-line highlight: the whole active line lights up at
            // once in warm cream-white with an accent-tinted drop-shadow.
            // No word-level sweep — the LRC data only times line starts.
            return (
              <div
                key={i}
                ref={(el) => (lineRefs.current[i] = el)}
                className="karaoke-line font-serif"
                onClick={() => onSeek?.(l.time)}
                style={{
                  ...base,
                  transform: 'scale(1.0)',
                  color: '#fff5dc',
                  textShadow: `0 0 32px ${accent}99, 0 0 70px ${accent}55`,
                  filter: `drop-shadow(0 4px 24px ${accent}55)`,
                }}
              >
                {l.line}
              </div>
            );
          }

          return (
            <div
              key={i}
              ref={(el) => (lineRefs.current[i] = el)}
              className="karaoke-line font-serif"
              onClick={() => onSeek?.(l.time)}
              style={{
                ...base,
                color: isPast ? 'rgba(245,232,200,0.34)' : 'rgba(245,232,200,0.5)',
                transform: 'scale(0.92)',
                filter: 'blur(0.3px)',
                opacity: 0.9,
              }}
            >
              {l.line}
            </div>
          );
        })}
      </div>

      <style>{`
        /* Per-line transition tokens. Easing curve from the reference.
           opacity is slightly faster than transform so colour resolves first,
           then the line settles into its new scale. */
        .karaoke-line {
          transition:
            opacity 0.45s ease,
            filter 0.5s ease,
            transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
            color 0.45s ease;
        }
        .karaoke-line:hover {
          opacity: 0.85 !important;
        }
      `}</style>
    </div>
  );
}

function AudioOnlyView({ song, youtubeSearchUrl }) {
  return (
    <div className="text-center max-w-2xl">
      <div className="w-48 h-48 mx-auto mb-8 rounded-sm overflow-hidden border border-gold/30 shadow-[0_0_60px] shadow-gold/20">
        <SmartImage src={song.image} alt={song.title} initial={song.initial} accent={song.accent} />
      </div>
      <h3 className="font-serif text-cream text-3xl mb-3">{song.title}</h3>
      <p className="text-cream-soft/80 text-base leading-relaxed mb-6">{song.about}</p>
      <p className="text-cream-soft/50 text-sm italic mb-8">
        Vaqtga sinxron matn (LRC) hali qo'shilmagan — qo'shiq oddiy rejimda tinglanadi.
      </p>
      <a
        href={youtubeSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-gold/70 hover:text-gold text-xs tracking-[2px] uppercase"
      >
        YouTube'da ham qidirish
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
          <path d="M14 5h5v5M19 5L10 14M5 5h4v4M5 14v5h5" />
        </svg>
      </a>
    </div>
  );
}

function YouTubeView({ song }) {
  return (
    <div className="w-full max-w-4xl">
      <div className="aspect-video rounded-sm overflow-hidden border border-gold/30 bg-black shadow-2xl">
        <iframe
          src={`https://www.youtube.com/embed/${encodeURIComponent(song.youtubeId)}?autoplay=1${
            song.youtubeStart ? `&start=${encodeURIComponent(song.youtubeStart)}` : ''
          }&rel=0`}
          title={song.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <p className="text-cream-soft/70 text-sm leading-relaxed mt-6 max-w-2xl mx-auto text-center">{song.about}</p>
    </div>
  );
}

function SearchFallbackView({ song, youtubeSearchUrl }) {
  return (
    <div className="text-center max-w-2xl">
      <div className="w-56 h-56 mx-auto mb-8 rounded-sm overflow-hidden border border-gold/30 shadow-[0_0_60px] shadow-gold/20">
        <SmartImage src={song.image} alt={song.title} initial={song.initial} accent={song.accent} />
      </div>
      <h3 className="font-serif text-cream text-3xl md:text-4xl mb-2">{song.title}</h3>
      <p className="text-gold/80 mb-6">{song.artist} · {song.genre}{song.year ? ` · ${song.year}` : ''}</p>
      <p className="text-cream-soft/80 text-base leading-relaxed mb-8">{song.about}</p>

      <div className="inline-block p-5 bg-bg-mid/60 border border-gold/30 rounded-sm mb-6">
        <p className="text-cream-soft/70 text-sm mb-3">
          🎵 Audio fayl hali qo'shilmagan
        </p>
        <p className="text-cream-soft/50 text-xs italic">
          MP3 + LRC fayllarini <code className="text-gold">/public/musiqa/{song.slug}.mp3</code> manziliga qo'ying — karaoke avtomatik ishlay boshlaydi.
        </p>
      </div>

      <div>
        <a href={youtubeSearchUrl} target="_blank" rel="noopener noreferrer" className="gold-cta">
          <span className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M21.582 7.18a2.5 2.5 0 0 0-1.764-1.764C18.255 5 12 5 12 5s-6.255 0-7.818.416A2.5 2.5 0 0 0 2.418 7.18C2 8.736 2 12 2 12s0 3.264.418 4.82a2.5 2.5 0 0 0 1.764 1.764C5.745 19 12 19 12 19s6.255 0 7.818-.416a2.5 2.5 0 0 0 1.764-1.764C22 15.264 22 12 22 12s0-3.264-.418-4.82zM10 15V9l5 3-5 3z" />
            </svg>
            YouTube'da tinglash
          </span>
        </a>
      </div>
    </div>
  );
}
