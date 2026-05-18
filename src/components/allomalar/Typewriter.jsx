import { useEffect, useState } from 'react';

/**
 * Reveals biography paragraphs one at a time with a typewriter effect.
 *
 * Each paragraph types character-by-character at `charSpeed` ms/char, then
 * pauses `paragraphPause` ms before the next paragraph starts typing.
 *
 * Props:
 *   - paragraphs:     string[]
 *   - charSpeed:      ms per character (default 5)
 *   - paragraphPause: ms between finishing one paragraph and starting next (default 150)
 *   - startDelay:     ms before the very first character appears (default 0)
 *   - onDone:         fired once the last character is typed
 */
export default function Typewriter({
  paragraphs,
  charSpeed = 1,
  paragraphPause = 0,
  startDelay = 0,
  onDone,
}) {
  // Index of paragraph currently being typed (or completed).
  const [pIndex, setPIndex] = useState(0);
  // Char position within the currently-typing paragraph.
  const [cIndex, setCIndex] = useState(0);
  // 'pre' (waiting for startDelay), 'typing', 'paused' (between paragraphs), 'done'
  const [phase, setPhase] = useState('pre');

  // Reset on paragraphs change (e.g., navigating between allomas)
  useEffect(() => {
    setPIndex(0);
    setCIndex(0);
    setPhase('pre');
  }, [paragraphs]);

  useEffect(() => {
    if (!paragraphs?.length) return undefined;

    if (phase === 'pre') {
      const t = setTimeout(() => setPhase('typing'), startDelay);
      return () => clearTimeout(t);
    }

    if (phase === 'done') {
      onDone?.();
      return undefined;
    }

    if (phase === 'paused') {
      const t = setTimeout(() => {
        const nextIdx = pIndex + 1;
        if (nextIdx >= paragraphs.length) {
          setPhase('done');
        } else {
          setPIndex(nextIdx);
          setCIndex(0);
          setPhase('typing');
        }
      }, paragraphPause);
      return () => clearTimeout(t);
    }

    // phase === 'typing'
    const current = paragraphs[pIndex] || '';
    if (cIndex >= current.length) {
      setPhase('paused');
      return undefined;
    }
    const t = setTimeout(() => setCIndex((c) => c + 1), charSpeed);
    return () => clearTimeout(t);
  }, [phase, pIndex, cIndex, paragraphs, charSpeed, paragraphPause, startDelay, onDone]);

  const current = paragraphs[pIndex] || '';
  const stillTyping = phase !== 'done';

  return (
    <div className="space-y-5 text-cream-soft text-lg leading-relaxed">
      {paragraphs.slice(0, pIndex).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {pIndex < paragraphs.length && (
        <p>
          {current.slice(0, cIndex)}
          {stillTyping && (
            <span className="inline-block w-[2px] h-5 ml-0.5 bg-gold align-middle animate-pulse" />
          )}
        </p>
      )}
    </div>
  );
}
