import { useEffect } from 'react';

/**
 * Watches `.reveal` elements and adds `.active` once they scroll into view.
 *
 * Crucially, this also picks up `.reveal` nodes that appear AFTER mount —
 * e.g. when a filter is changed and the list re-renders, or when a tab
 * unfolds new content. Without the MutationObserver leg, newly inserted
 * elements stayed at `opacity: 0` until a full page refresh.
 */
export default function useScrollReveal(selector = '.reveal', options = {}) {
  useEffect(() => {
    const observed = new WeakSet();

    const intersection = new IntersectionObserver(
      (entries) => {
        // Cap the visible-batch stagger so a long grid doesn't leave the last
        // card empty for nearly a second. 35ms × max 6 steps ≈ 210ms tail.
        entries
          .filter((e) => e.isIntersecting)
          .forEach((entry, i) => {
            const explicit = entry.target.dataset.revealDelay;
            const delay = explicit != null ? explicit | 0 : Math.min(i, 6) * 35;
            if (delay) {
              setTimeout(() => entry.target.classList.add('active'), delay);
            } else {
              entry.target.classList.add('active');
            }
            intersection.unobserve(entry.target);
          });
      },
      { threshold: 0.08, rootMargin: '0px 0px 80px 0px', ...options },
    );

    const observeAll = () => {
      document.querySelectorAll(selector).forEach((el) => {
        if (observed.has(el) || el.classList.contains('active')) return;
        observed.add(el);
        intersection.observe(el);
      });
    };

    // Pick up everything currently in the DOM.
    observeAll();

    // Re-scan whenever new nodes are added (filter change, tab switch, etc.).
    const mutation = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes.length) {
          observeAll();
          return;
        }
      }
    });
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersection.disconnect();
      mutation.disconnect();
    };
  }, [selector]);
}
