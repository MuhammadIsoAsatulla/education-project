/**
 * Parse a standard LRC (lyrics) file body into an array of timed lines.
 * Returns [{ time: seconds, line: text }, ...]
 *
 * Supports:
 *   [mm:ss.xx] line                    — standard LRC
 *   [mm:ss] line                       — same, no fractional
 *   [00:01.00][00:30.00] line          — multiple line-start timestamps
 *   [mm:ss.xx]<mm:ss.xx>word ...        — Enhanced LRC (A2 format) with
 *                                        word-level <mm:ss.xx> markers inside
 *                                        the text; the inner markers are
 *                                        stripped so the displayed line is
 *                                        clean text. We still key the line
 *                                        off the LEADING [mm:ss.xx] only.
 *   Metadata tags ([ti:], [ar:], etc.) are skipped.
 */
const INNER_WORD_TAG = /<\d+:\d+(?:\.\d+)?>/g; // <mm:ss.xx> Enhanced-LRC markers

export function parseLRC(text) {
  if (!text || typeof text !== 'string') return [];
  const lines = text.split(/\r?\n/);
  const out = [];
  const tagRe = /\[(\d+):(\d+)(?:\.(\d+))?\]/g;

  for (const raw of lines) {
    const stamps = [];
    let m;
    let lastIndex = 0;
    tagRe.lastIndex = 0;
    while ((m = tagRe.exec(raw)) !== null) {
      const min = parseInt(m[1], 10);
      const sec = parseInt(m[2], 10);
      const frac = m[3] ? parseFloat('0.' + m[3]) : 0;
      stamps.push(min * 60 + sec + frac);
      lastIndex = m.index + m[0].length;
    }
    if (!stamps.length) continue; // metadata or comment line
    // Strip inner <mm:ss.xx> word-level timestamps before storing the line,
    // collapse the resulting double spaces, trim.
    const lineText = raw
      .slice(lastIndex)
      .replace(INNER_WORD_TAG, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!lineText) continue;
    for (const t of stamps) out.push({ time: t, line: lineText });
  }

  return out.sort((a, b) => a.time - b.time);
}

export async function loadLRC(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    return parseLRC(text);
  } catch {
    return [];
  }
}

export async function checkResource(url) {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}
