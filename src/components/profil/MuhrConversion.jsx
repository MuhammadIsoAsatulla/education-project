import { useState } from 'react';
import MuhrIcon from './MuhrIcon.jsx';
import useProgress from '../../hooks/useProgress.js';

export default function MuhrConversion({ onClose }) {
  const { state, convertMuhr } = useProgress();
  const { bronze, silver } = state.muhr;
  const [animating, setAnimating] = useState(null); // 'bronze' | 'silver' | null

  const doConvert = (fromType) => {
    setAnimating(fromType);
    setTimeout(() => {
      convertMuhr(fromType);
      setAnimating(null);
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-[150] bg-bg-deep/95 backdrop-blur-xl flex items-center justify-center px-3 sm:px-6 py-6 sm:py-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-w-lg w-full bg-bg-mid/80 border border-gold/30 rounded-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-6 py-4 border-b border-gold/20 flex items-center justify-between">
          <div>
            <div className="eyebrow text-xs mb-1">— AYIRBOSHLASH —</div>
            <h3 className="font-serif text-cream text-2xl">Muhrni Yangilash</h3>
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

        <div className="p-6 space-y-4">
          {/* Bronze → Silver */}
          <div className="p-4 rounded-sm border border-gold/20 bg-bg-deep/40">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-serif text-cream tabular-nums">10×</span>
                <MuhrIcon type="bronze" size={40} className={animating === 'bronze' ? 'muhr-stamp-in' : ''} />
                <span className="text-gold mx-2">→</span>
                <MuhrIcon type="silver" size={40} />
                <span className="font-serif text-cream tabular-nums">1×</span>
              </div>
              <button
                onClick={() => doConvert('bronze')}
                disabled={bronze < 10 || animating}
                className={`px-4 py-2 rounded-sm border text-xs tracking-[2px] uppercase transition ${
                  bronze >= 10 && !animating
                    ? 'border-gold text-gold hover:bg-gold hover:text-bg-deep'
                    : 'border-gold/20 text-gold/40 cursor-not-allowed'
                }`}
              >
                {bronze >= 10 ? 'Ayirboshlash' : `${10 - bronze} kerak`}
              </button>
            </div>
            <p className="text-cream-soft/60 text-xs mt-2 italic">
              Sizda: {bronze} bronza muhr
            </p>
          </div>

          {/* Silver → Gold */}
          <div className="p-4 rounded-sm border border-gold/20 bg-bg-deep/40">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-serif text-cream tabular-nums">10×</span>
                <MuhrIcon type="silver" size={40} className={animating === 'silver' ? 'muhr-stamp-in' : ''} />
                <span className="text-gold mx-2">→</span>
                <MuhrIcon type="gold" size={40} />
                <span className="font-serif text-cream tabular-nums">1×</span>
              </div>
              <button
                onClick={() => doConvert('silver')}
                disabled={silver < 10 || animating}
                className={`px-4 py-2 rounded-sm border text-xs tracking-[2px] uppercase transition ${
                  silver >= 10 && !animating
                    ? 'border-gold text-gold hover:bg-gold hover:text-bg-deep'
                    : 'border-gold/20 text-gold/40 cursor-not-allowed'
                }`}
              >
                {silver >= 10 ? 'Ayirboshlash' : `${10 - silver} kerak`}
              </button>
            </div>
            <p className="text-cream-soft/60 text-xs mt-2 italic">
              Sizda: {silver} kumush muhr
            </p>
          </div>

          <p className="text-cream-soft/50 text-xs text-center italic pt-2">
            Yuqori darajadagi muhrlar — eng noyob va qadrlidir.
          </p>
        </div>
      </div>
    </div>
  );
}
