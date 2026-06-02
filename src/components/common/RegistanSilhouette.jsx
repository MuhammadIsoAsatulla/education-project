/**
 * The Registan / Bibi-Khanim mosque silhouette anchored to the bottom of
 * the hero.
 *
 * Two viewport modes:
 *
 *   • Desktop (≥768 px): the panoramic image fits the viewport width 1:1
 *     so all the side minarets and the central dome read together, just
 *     as the PC composition was designed.
 *
 *   • Mobile (<768 px): scaling the same panorama down to 412 px makes
 *     the architecture a tiny strip and leaves the title floating in
 *     dead space. Instead we ZOOM into the central dome region — render
 *     the image at ~190 % of viewport width and slide it left by half
 *     the overflow so the central dome stays centered. The side minarets
 *     crop out, which is fine: the dome alone behind the MEROS title is
 *     the wow shot, matching the PC vibe rather than fighting it.
 */
export default function RegistanSilhouette({ className = '' }) {
  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-[1] pointer-events-none overflow-hidden ${className}`}
    >
      {/* Warm amber sky glow — behind the mosque, simulates lit horizon.
          On mobile the halo is taller and reaches higher so the warm glow
          fills the space between the MEROS title and the dome peak, killing
          the dead-space-in-the-middle feeling. Desktop unchanged. */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[110%] sm:h-[85%] md:h-[75%]"
        style={{
          background:
            'radial-gradient(ellipse 95% 55% at 50% 90%, rgba(200,120,20,0.60) 0%, rgba(160,80,10,0.22) 50%, transparent 78%)',
          zIndex: 0,
        }}
      />

      {/* The mosque image. Mobile zooms in (190% width, centered) so the
          central dome reads as prominent architecture rather than a
          decorative strip. Desktop keeps the original 100 % full-bleed. */}
      <div className="relative" style={{ zIndex: 1 }}>
        <img
          src="/mosque-crop.png?v=3"
          alt=""
          aria-hidden="true"
          className="block mosque-img"
        />
      </div>

      {/* Bottom-edge bridge — multi-stop gradient that walks from the warm
          amber of the lit mosque base through deepening browns and dusk
          blue into the page's deep navy. */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] sm:h-[260px]"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(120,70,20,0.18) 22%, rgba(60,40,25,0.45) 48%, rgba(20,30,45,0.78) 72%, #0a1f2e 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      <style>{`
        /* Mobile-first (<640 px): deep zoom into the central dome.
           320 % width, bottom-anchored so the reflection line sits flush
           with the viewport. Side minarets crop out — the dome alone is
           the wow shot. */
        .mosque-img {
          width: 320%;
          height: auto;
          max-width: none;
          margin-left: -110%;
          transform: translateY(0);
          opacity: 0.95;
          mix-blend-mode: screen;
        }
        /* Tablet portrait (iPad: 640–1023 px). Aggressive zoom (~360 %)
           so the central dome + flanking minarets dominate the lower
           half of the tall viewport. Side architecture crops out — fine,
           the user explicitly approved cropping from left/right to gain
           more visual weight. */
        @media (min-width: 640px) {
          .mosque-img {
            width: 360%;
            margin-left: -130%;
            transform: translateY(0);
            opacity: 0.95;
          }
        }
        /* Desktop (≥1024 px): original full-bleed composition exactly as
           before. PC monitors are landscape so the panoramic image fits
           naturally without zooming. */
        @media (min-width: 1024px) {
          .mosque-img {
            width: 100%;
            margin-left: 0;
            transform: translateY(4vh);
            opacity: 0.92;
          }
        }
      `}</style>
    </div>
  );
}
