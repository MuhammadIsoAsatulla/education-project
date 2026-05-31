export default function RegistanSilhouette({ className = '' }) {
  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-[1] pointer-events-none ${className}`}
    >
      {/* Warm amber sky glow — behind the mosque, simulates lit horizon */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '75%',
        background: 'radial-gradient(ellipse 80% 65% at 50% 95%, rgba(200,120,20,0.45) 0%, rgba(160,80,10,0.18) 45%, transparent 72%)',
        zIndex: 0,
      }} />
      {/* full-bleed mosque — spans the page edge-to-edge, base anchored to bottom.
          screen blend lets the warm artwork glow over the dark sky and fade to
          navy at the corners */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <img
          src="/mosque-crop.png?v=3"
          alt=""
          aria-hidden="true"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            transform: 'translateY(4vh)',
            opacity: 0.92,
            mixBlendMode: 'screen',
          }}
        />
      </div>
      {/* blend only the very bottom edge into the page so the lit base stays bright */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '90px',
          background: 'linear-gradient(to bottom, transparent, #0a1f2e)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
