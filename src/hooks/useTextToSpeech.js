import { useCallback, useEffect, useRef, useState } from 'react';

// Order of preference: native Uzbek voice first, then phonetically closer
// languages (Turkish/Tajik), and finally Russian. English is intentionally
// excluded — Uzbek text read by an English voice is unintelligible.
const PREFERRED_LANGS = ['uz', 'tk', 'tg', 'kk', 'ky', 'ru'];

function pickVoice(voices) {
  if (!voices?.length) return null;
  for (const code of PREFERRED_LANGS) {
    const v = voices.find((v) => v.lang?.toLowerCase().startsWith(code));
    if (v) return v;
  }
  return null;
}

export default function useTextToSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [voice, setVoice] = useState(null);
  const [voicesReady, setVoicesReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      if (all.length) {
        setVoice(pickVoice(all));
        setVoicesReady(true);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const speak = useCallback(
    (text, { rate = 0.95, pitch = 1 } = {}) => {
      if (!supported || !text || !voice) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.voice = voice;
      u.lang = voice.lang;
      u.rate = rate;
      u.pitch = pitch;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
    },
    [supported, voice],
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  // Available only when we found a phonetically reasonable voice.
  const available = supported && voicesReady && !!voice;
  const voiceLabel = voice?.lang?.toLowerCase().startsWith('uz')
    ? 'O\'zbek ovozi'
    : voice
      ? `${voice.lang} (taxminiy)`
      : null;

  return { speak, stop, speaking, available, voiceLabel };
}
