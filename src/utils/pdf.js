import * as pdfjsLib from 'pdfjs-dist';
// Vite-friendly worker import: the bundler resolves the URL of the worker file.
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// ─────────────────────────────────────────────────────────────────────────────
//  Document cache — same as before. Keeps the parsed PDF in memory so re-opens
//  don't re-fetch / re-parse.
// ─────────────────────────────────────────────────────────────────────────────
const documentCache = new Map();
let nextDocId = 1;
const docIds = new WeakMap();

function getDocId(doc) {
  // PDF.js exposes `fingerprints` (array). Prefer it; fall back to a per-doc
  // ID we attach ourselves so the cache key stays stable across renders.
  if (doc?.fingerprints?.[0]) return doc.fingerprints[0];
  let id = docIds.get(doc);
  if (!id) {
    id = 'doc-' + nextDocId++;
    docIds.set(doc, id);
  }
  return id;
}

export async function loadPdf(url) {
  if (documentCache.has(url)) return documentCache.get(url);
  const loadingTask = pdfjsLib.getDocument({ url, withCredentials: false });
  const doc = await loadingTask.promise;
  documentCache.set(url, doc);
  return doc;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Per-page bitmap cache.
//
//  The expensive thing PDF.js does is rasterizing a page to pixels. Once we
//  have those pixels, returning them to a new canvas is essentially free
//  (~1ms via drawImage of an ImageBitmap). We cache the ImageBitmap, NOT the
//  canvas itself — a DOM canvas can only have one parent, an ImageBitmap is
//  detached and can be drawn into any number of fresh canvases.
//
//  LRU via insertion order: JS Maps iterate in insertion order, so the first
//  key from `cache.keys()` is the oldest. Evict the oldest when we exceed
//  PAGE_CACHE_LIMIT.
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_CACHE_LIMIT = 32;
const pageCache = new Map(); // key -> ImageBitmap
const inflight = new Map();  // key -> Promise<ImageBitmap>

function cacheKey(docId, pageNum, width) {
  return `${docId}:${pageNum}:${width}`;
}

function touchLru(key) {
  // Re-insert so this key becomes the most-recently-used (last).
  const bmp = pageCache.get(key);
  if (bmp === undefined) return;
  pageCache.delete(key);
  pageCache.set(key, bmp);
}

function evictIfNeeded() {
  while (pageCache.size > PAGE_CACHE_LIMIT) {
    const oldestKey = pageCache.keys().next().value;
    const bmp = pageCache.get(oldestKey);
    pageCache.delete(oldestKey);
    // Release GPU memory promptly.
    try {
      bmp?.close?.();
    } catch {
      /* ignore — older Safari doesn't have ImageBitmap.close */
    }
  }
}

function paintBitmapToCanvas(bitmap) {
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.style.display = 'block';
  canvas.style.maxWidth = '100%';
  canvas.style.maxHeight = '100%';
  canvas.style.width = 'auto';
  canvas.style.height = 'auto';
  canvas.style.objectFit = 'contain';
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0);
  return canvas;
}

/**
 * Render a PDF page. Returns a *handle* `{ promise, cancel }` rather than a
 * bare promise so callers can abort in-flight work (e.g. PdfPage on unmount
 * or when scrolling away). Cached pages resolve synchronously-fast.
 *
 *   const handle = renderPage(doc, 5);
 *   handle.promise.then((canvas) => host.appendChild(canvas));
 *   // later:
 *   handle.cancel();   // safe even after resolution
 */
export function renderPage(pdfDoc, pageNum, { width = 1200 } = {}) {
  let cancelled = false;

  const docId = getDocId(pdfDoc);
  const key = cacheKey(docId, pageNum, width);

  // 1) Cache hit — synchronous-fast.
  const cached = pageCache.get(key);
  if (cached) {
    touchLru(key);
    return {
      promise: Promise.resolve(paintBitmapToCanvas(cached)),
      cancel() {
        /* nothing in flight */
      },
    };
  }

  // 2) In-flight dedup — if another caller is already rendering this page,
  //    piggy-back on their promise. Multiple consumers share one render.
  let bitmapPromise = inflight.get(key);
  if (!bitmapPromise) {
    bitmapPromise = (async () => {
      const page = await pdfDoc.getPage(pageNum);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = width / baseViewport.width;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const task = page.render({ canvasContext: canvas.getContext('2d'), viewport });
      await task.promise;

      const bitmap = await createImageBitmap(canvas);
      pageCache.set(key, bitmap);
      evictIfNeeded();
      return bitmap;
    })();
    inflight.set(key, bitmapPromise);
    bitmapPromise.finally(() => {
      if (inflight.get(key) === bitmapPromise) inflight.delete(key);
    });
  }

  // Per-caller "soft cancel": even if the underlying render finishes (and the
  // cache warms up — great for the next view), the cancelled caller never
  // gets a canvas back, so it can't paint onto a stale DOM node.
  const promise = bitmapPromise.then((bitmap) => {
    if (cancelled) {
      const err = new Error('Render cancelled');
      err.name = 'AbortError';
      throw err;
    }
    return paintBitmapToCanvas(bitmap);
  });

  return {
    promise,
    cancel() {
      cancelled = true;
    },
  };
}
