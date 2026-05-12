import { useEffect, useMemo, useRef, useState } from 'react';
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

export default function KaraokeView({ song, onClose }) {
  const [status, setStatus] = useState(STATUS.CHECKING);
  const [lyrics, setLyrics] = useState([]);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const howlRef = useRef(null);
  const rafRef = useRef(null);

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

  // Time tracker (only when audio is playing)
  useEffect(() => {
    if (!playing || !howlRef.current) return;
    const tick = () => {
      const t = howlRef.current?.seek?.();
      if (typeof t === 'number') setTime(t);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

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
    <div className="fixed inset-0 z-[80] bg-bg-deep/98 backdrop-blur-xl flex flex-col" role="dialog">
      <div className="absolute inset-0 bg-girih opacity-30 pointer-events-none" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${song.accent}22, transparent 60%)` }}
      />

      <header className="relative px-4 sm:px-6 md:px-12 py-4 sm:py-6 flex items-center justify-between gap-3 border-b border-gold/15">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-sm overflow-hidden border border-gold/40 flex-shrink-0">
            <SmartImage src={song.image} alt={song.title} initial={song.initial} accent={song.accent} />
          </div>
          <div className="min-w-0">
            <div className="eyebrow text-[10px] sm:text-xs mb-0.5 sm:mb-1">
              — {status === STATUS.KARAOKE ? 'KARAOKE' : status === STATUS.AUDIO_ONLY ? 'TINGLASH' : 'TAFSILOT'} —
            </div>
            <h2 className="font-serif text-cream text-lg sm:text-2xl md:text-3xl leading-tight truncate">{song.title}</h2>
            <p className="text-cream-soft/70 text-xs sm:text-sm truncate">{song.artist} · {song.genre}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-bg-deep transition flex-shrink-0"
          aria-label="Yopish"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 sm:w-5 sm:h-5 mx-auto">
            <path d="M6 6 L18 18 M18 6 L6 18" />
          </svg>
        </button>
      </header>

      {/* Content varies by status */}
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-6">
        {status === STATUS.CHECKING && <CheckingView />}

        {status === STATUS.KARAOKE && (
          <KaraokeLines lyrics={lyrics} activeIndex={activeIndex} />
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

      {/* Player footer — only when audio is loaded */}
      {(status === STATUS.KARAOKE || status === STATUS.AUDIO_ONLY) && (
        <footer className="relative px-6 md:px-12 py-6 border-t border-gold/15 bg-bg-mid/40 backdrop-blur">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-gold/80 text-xs tabular-nums w-10">{fmt(time)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0.1}
                step="0.1"
                value={time}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="flex-1 accent-[#d4a574]"
              />
              <span className="text-gold/80 text-xs tabular-nums w-10 text-right">{fmt(duration)}</span>
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
          </div>
        </footer>
      )}
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

function KaraokeLines({ lyrics, activeIndex }) {
  // Scroll step grows with viewport size to match the larger line-height on bigger screens.
  const [step, setStep] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= 768 ? 80 : 56,
  );
  useEffect(() => {
    const onResize = () => setStep(window.innerWidth >= 768 ? 80 : 56);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-bg-deep to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-bg-deep to-transparent z-10 pointer-events-none" />

      <ul
        className="flex flex-col items-center gap-5 md:gap-7 transition-transform duration-700 ease-out"
        style={{ transform: `translateY(${-Math.max(0, activeIndex) * step}px)` }}
      >
        {lyrics.map((l, i) => {
          const distance = Math.abs(i - activeIndex);
          const opacity = i === activeIndex ? 1 : Math.max(0.15, 0.7 - distance * 0.18);
          const scale = i === activeIndex ? 1.05 : 1;
          return (
            <li
              key={i}
              className={`text-center transition-all duration-500 px-4 ${
                i === activeIndex
                  ? 'font-serif text-2xl sm:text-3xl md:text-5xl text-gold-gradient drop-shadow-[0_4px_24px_rgba(212,165,116,0.3)]'
                  : 'font-serif text-lg sm:text-xl md:text-3xl text-cream-soft'
              }`}
              style={{ opacity, transform: `scale(${scale})` }}
            >
              {l.line}
            </li>
          );
        })}
      </ul>
    </>
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
          src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1`}
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
          MP3 + LRC fayllarini <code className="text-gold">/public/audio/musiqa/{song.slug}.mp3</code> manziliga qo'ying — karaoke avtomatik ishlay boshlaydi.
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
