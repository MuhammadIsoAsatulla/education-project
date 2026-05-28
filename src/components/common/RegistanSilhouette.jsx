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
      {/* height cap keeps mosque in lower half — image anchors to bottom so base always shows */}
      <div style={{ position: 'relative', zIndex: 1, height: '52vh', overflow: 'hidden' }}>
        <img
          src="/mosque-golden.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 'auto',
            opacity: 0.8,
            mixBlendMode: 'screen',
          }}
        />
      </div>
      {/* blend bottom edge into page */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(to bottom, transparent, #0c0804)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
