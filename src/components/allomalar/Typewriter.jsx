import { useEffect, useRef, useState } from 'react';

export default function Typewriter({ paragraphs, speed = 18, startDelay = 0, onDone }) {
  const [revealed, setRevealed] = useState([]);
  const [paragraphIndex, setParagraphIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    setRevealed([]);
    setParagraphIndex(0);
    setCharIndex(0);
    startedRef.current = false;
  }, [paragraphs]);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      const t = setTimeout(() => setCharIndex(1), startDelay);
      return () => clearTimeout(t);
    }
    if (paragraphIndex >= paragraphs.length) {
      onDone?.();
      return;
    }
    const current = paragraphs[paragraphIndex] || '';
    if (charIndex > current.length) {
      const t = setTimeout(() => {
        setRevealed((r) => [...r, current]);
        setParagraphIndex((p) => p + 1);
        setCharIndex(0);
      }, 250);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCharIndex((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [charIndex, paragraphIndex, paragraphs, speed, startDelay, onDone]);

  const current = paragraphs[paragraphIndex] || '';

  return (
    <div className="space-y-5 text-cream-soft text-lg leading-relaxed">
      {revealed.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {paragraphIndex < paragraphs.length && (
        <p>
          {current.slice(0, Math.max(0, charIndex - 1))}
          <span className="inline-block w-[2px] h-5 ml-0.5 bg-gold align-middle animate-pulse" />
        </p>
      )}
    </div>
  );
}
