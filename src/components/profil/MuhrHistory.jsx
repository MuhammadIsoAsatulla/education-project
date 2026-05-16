import MuhrIcon from './MuhrIcon.jsx';
import useProgress from '../../hooks/useProgress.js';

function relativeTime(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff} sek oldin`;
  if (diff < 3600) return `${Math.floor(diff / 60)} daq oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  return `${Math.floor(diff / 86400)} kun oldin`;
}

export default function MuhrHistory({ onClose }) {
  const { state } = useProgress();
  const history = state.muhrHistory || [];

  return (
    <div
      className="fixed inset-0 z-[150] bg-bg-deep/95 backdrop-blur-xl flex items-center justify-center px-4 py-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-w-2xl w-full max-h-[80vh] bg-bg-mid/80 border border-gold/30 rounded-sm overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-6 py-4 border-b border-gold/20 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="eyebrow text-xs mb-1">— TARIX —</div>
            <h3 className="font-serif text-cream text-2xl">Muhr Tarixi</h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-bg-deep transition flex items-center justify-center"
            aria-label="Yopish"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path d="M6 6 L18 18 M18 6 L6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <p className="font-serif italic text-cream-soft/60 text-center py-8">
              Hali muhr yo'q. Bilim olib boring — birinchi muhringizni yig'asiz.
            </p>
          ) : (
            <ul className="space-y-2">
              {history.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center gap-3 p-3 rounded-sm border border-gold/15 bg-bg-deep/40"
                >
                  <MuhrIcon type={h.muhrType} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="text-cream text-sm leading-tight">{h.reason}</p>
                    <p className="text-cream-soft/50 text-[10px] tracking-[1px] uppercase mt-1">
                      {relativeTime(h.at)}
                    </p>
                  </div>
                  <span
                    className={`font-serif text-lg tabular-nums ${
                      h.type === 'earned'
                        ? 'text-emerald-300'
                        : h.type === 'spent'
                          ? 'text-crimson'
                          : 'text-gold'
                    }`}
                  >
                    {h.type === 'spent' ? '-' : h.type === 'earned' ? '+' : '⇄'}
                    {h.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
