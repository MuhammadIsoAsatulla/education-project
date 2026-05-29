import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    // Bumped from the default 500 → 700 KB; the BookReader chunk legitimately
    // needs to be larger because of react-pageflip. Anything above this
    // threshold is genuinely worth investigating.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Vendor libraries change rarely; isolating them means the browser
        // can reuse them across deploys (CDN cache + browser cache hit),
        // and a code change in the app doesn't force a re-download of
        // React + react-router + everything else.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          // Heavy libs that should stay separate so they don't bloat any
          // single chunk and can be cached individually.
          if (id.includes('howler')) return 'howler';
          if (id.includes('pdfjs-dist')) return 'pdfjs';
          if (id.includes('react-pageflip')) return 'pageflip';
          // Core React + router get their own shared chunk so navigating
          // between any two pages only refetches the route's code, not
          // the React runtime itself.
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router')
          ) {
            return 'react-vendor';
          }
          // Everything else from node_modules → generic vendor chunk
          return 'vendor';
        },
      },
    },
  },
});
