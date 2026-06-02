import { useState } from 'react';
import MuhrIcon from './MuhrIcon.jsx';
import MuhrHistory from './MuhrHistory.jsx';
import MuhrConversion from './MuhrConversion.jsx';
import useProgress from '../../hooks/useProgress.js';

export default function MuhrBalance({ compact = false }) {
  const { state } = useProgress();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  const { bronze = 0, silver = 0, gold = 0 } = state.muhr || {};

  return (
    <>
      <div className={`flex flex-wrap items-center gap-3 sm:flex-nowrap ${compact ? '' : ''}`}>
        {/* Three muhr tiers side by side */}
        <button
          onClick={() => setHistoryOpen(true)}
          className="group flex items-center gap-2 px-3 py-2 rounded-sm border border-gold/25 bg-bg-deep/40 hover:bg-bg-deep/70 hover:border-gold/60 transition"
          title="Bronza Muhr balansi — tarixni ko'rish"
        >
          <MuhrIcon type="bronze" size={compact ? 22 : 28} />
          <span className="font-serif text-cream tabular-nums text-base sm:text-lg leading-none">
            {bronze}
          </span>
        </button>

        <button
          onClick={() => setHistoryOpen(true)}
          className="group flex items-center gap-2 px-3 py-2 rounded-sm border border-gold/25 bg-bg-deep/40 hover:bg-bg-deep/70 hover:border-gold/60 transition"
          title="Kumush Muhr balansi"
        >
          <MuhrIcon type="silver" size={compact ? 22 : 28} />
          <span className="font-serif text-cream tabular-nums text-base sm:text-lg leading-none">
            {silver}
          </span>
        </button>

        <button
          onClick={() => setHistoryOpen(true)}
          className="group flex items-center gap-2 px-3 py-2 rounded-sm border border-gold/25 bg-bg-deep/40 hover:bg-bg-deep/70 hover:border-gold/60 transition"
          title="Tilla Muhr balansi"
        >
          <MuhrIcon type="gold" size={compact ? 22 : 28} />
          <span className="font-serif text-cream tabular-nums text-base sm:text-lg leading-none">
            {gold}
          </span>
        </button>

        {/* Convert button */}
        {!compact && (bronze >= 10 || silver >= 10) && (
          <button
            onClick={() => setConvertOpen(true)}
            className="px-4 py-2 border border-gold/40 text-gold text-xs tracking-[2px] uppercase rounded-sm hover:bg-gold hover:text-bg-deep transition"
            title="Muhrlarni yuqori darajaga aylantirish"
          >
            ⇄ Ayirboshlash
          </button>
        )}
      </div>

      {historyOpen && <MuhrHistory onClose={() => setHistoryOpen(false)} />}
      {convertOpen && <MuhrConversion onClose={() => setConvertOpen(false)} />}
    </>
  );
}
