/**
 * Parse a standard LRC (lyrics) file body into an array of timed lines.
 * Returns [{ time: seconds, line: text }, ...]
 *
 * Supports:
 *   [mm:ss.xx] line
 *   [mm:ss] line
 *   Multiple timestamps per line: [00:01.00][00:30.00] line
 *   Metadata tags ([ti:], [ar:], etc.) are skipped.
 */
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
    const lineText = raw.slice(lastIndex).trim();
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
