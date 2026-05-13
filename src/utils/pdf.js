import * as pdfjsLib from 'pdfjs-dist';
// Vite-friendly worker import: the bundler resolves the URL of the worker file.
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// Document cache so we don't re-fetch the same PDF if user re-opens it.
const documentCache = new Map();

export async function loadPdf(url) {
  if (documentCache.has(url)) return documentCache.get(url);
  const loadingTask = pdfjsLib.getDocument({ url, withCredentials: false });
  const doc = await loadingTask.promise;
  documentCache.set(url, doc);
  return doc;
}

/**
 * Render a single PDF page to canvas. The canvas is sized at a high resolution
 * (default 1400px wide for crisp display on retina), and uses CSS object-fit
 * so it fits whatever slot the parent provides.
 */
export async function renderPage(pdfDoc, pageNum, { width = 1400 } = {}) {
  const page = await pdfDoc.getPage(pageNum);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = width / baseViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // CSS sizing — let the canvas scale to fit its parent while keeping aspect ratio.
  canvas.style.display = 'block';
  canvas.style.maxWidth = '100%';
  canvas.style.maxHeight = '100%';
  canvas.style.width = 'auto';
  canvas.style.height = 'auto';
  canvas.style.objectFit = 'contain';

  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
  return canvas;
}
