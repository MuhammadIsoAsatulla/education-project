import { useEffect, useRef, useState } from 'react';

// Lazy-load the YouTube IFrame Player API exactly once for the whole site.
// Returns a promise that resolves to the global `YT` object.
let ytReadyPromise = null;
function loadYouTubeAPI() {
  if (ytReadyPromise) return ytReadyPromise;
  ytReadyPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevCallback?.();
      resolve(window.YT);
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
    }
  });
  return ytReadyPromise;
}

/**
 * MoviePlayer
 * ----------
 * Wraps the YouTube IFrame Player API so the parent can know:
 *   - whether the user actually started playing the video
 *   - how far they've watched (max position reached)
 *   - when they've crossed the "counted as watched" threshold
 *
 * Props:
 *   - youtubeId    YouTube video id (required)
 *   - title        accessible label
 *   - startSeconds optional start offset
 *   - watchThreshold fraction of duration that counts as "watched" (0.70)
 *   - onWatched    called ONCE when the user crosses the threshold
 *
 * Behaviour:
 *   - The player is sandboxed in its own div; we sample currentTime each
 *     second while it's playing, track the max, and fire onWatched once
 *     `(maxTime / duration) >= watchThreshold`.
 *   - Falls back gracefully if the API never loads (e.g. corporate network
 *     blocks youtube.com): renders a plain iframe and just doesn't track.
 */
export default function MoviePlayer({
  youtubeId,
  title,
  startSeconds = 0,
  watchThreshold = 0.7,
  onWatched,
}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const watchedFiredRef = useRef(false);
  const maxTimeRef = useRef(0);
  const durationRef = useRef(0);
  const tickerRef = useRef(null);
  const onWatchedRef = useRef(onWatched);
  const [fallback, setFallback] = useState(false);
  const [watchedFraction, setWatchedFraction] = useState(0);
  const [isWatched, setIsWatched] = useState(false);

  // Keep the latest onWatched callback without re-initialising the player.
  useEffect(() => {
    onWatchedRef.current = onWatched;
  }, [onWatched]);

  useEffect(() => {
    let cancelled = false;
    let player = null;

    const fireWatchedIfReady = () => {
      if (watchedFiredRef.current) return;
      const d = durationRef.current;
      const m = maxTimeRef.current;
      if (d <= 0) return;
      const fraction = m / d;
      setWatchedFraction(Math.min(1, fraction));
      if (fraction >= watchThreshold) {
        watchedFiredRef.current = true;
        setIsWatched(true);
        onWatchedRef.current?.();
      }
    };

    const startTicker = () => {
      if (tickerRef.current) return;
      tickerRef.current = setInterval(() => {
        if (!playerRef.current) return;
        try {
          const t = playerRef.current.getCurrentTime?.();
          if (typeof t === 'number') {
            if (t > maxTimeRef.current) maxTimeRef.current = t;
            fireWatchedIfReady();
          }
        } catch {
          /* player might not be ready */
        }
      }, 1000);
    };
    const stopTicker = () => {
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
    };

    loadYouTubeAPI()
      .then((YT) => {
        if (cancelled || !containerRef.current) return;
        player = new YT.Player(containerRef.current, {
          videoId: youtubeId,
          playerVars: {
            rel: 0,
            modestbranding: 1,
            cc_load_policy: 1,
            start: Math.max(0, Math.floor(startSeconds || 0)),
            playsinline: 1,
          },
          events: {
            onReady: (e) => {
              try {
                durationRef.current = e.target.getDuration?.() || 0;
              } catch {
                /* not ready */
              }
            },
            onStateChange: (e) => {
              // YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
              if (durationRef.current === 0) {
                try {
                  durationRef.current = e.target.getDuration?.() || 0;
                } catch {
                  /* ignore */
                }
              }
              if (e.data === 1) startTicker();
              else stopTicker();
              if (e.data === 0) {
                // Treat reaching the end as fully watched, even if the
                // ticker missed the last few seconds.
                if (durationRef.current > 0) {
                  maxTimeRef.current = durationRef.current;
                  fireWatchedIfReady();
                }
              }
            },
          },
        });
        playerRef.current = player;
      })
      .catch(() => {
        // API failed to load (network blocked, etc.) — fall back to a plain
        // iframe so playback still works; watch tracking is just disabled.
        if (!cancelled) setFallback(true);
      });

    return () => {
      cancelled = true;
      stopTicker();
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [youtubeId, startSeconds, watchThreshold]);

  if (fallback) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&cc_load_policy=1${
          startSeconds ? `&start=${Math.floor(startSeconds)}` : ''
        }`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        className="w-full h-full"
      />
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* The YT API replaces this div in-place with the iframe */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Watch progress overlay — only when the user has begun playing
          (watchedFraction > 0). Disappears once threshold is hit so it
          doesn't compete with the video. */}
      {watchedFraction > 0 && (
        <div className="pointer-events-none absolute top-2 right-2 z-10 flex items-center gap-2 px-2.5 py-1 rounded-full bg-bg-deep/80 border border-gold/40 text-[10px] tracking-[2px] uppercase backdrop-blur">
          {isWatched ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-gold">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gold">Ko'rib bo'lindi</span>
            </>
          ) : (
            <>
              <span className="text-gold tabular-nums">{Math.round(watchedFraction * 100)}%</span>
              <span className="text-cream-soft/60">
                {Math.round(watchThreshold * 100)}% gacha
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
