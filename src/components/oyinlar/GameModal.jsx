import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GameModal({ game, GameComponent, onComplete, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(8, 12, 20, 0.92)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-sm border border-gold/20 overflow-hidden"
        style={{ background: 'var(--bg-mid, #0f1621)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-gold/10 flex-shrink-0"
          style={{ background: 'linear-gradient(90deg, var(--bg-mid) 0%, rgba(212,165,116,0.06) 100%)' }}
        >
          <div>
            <div className="text-[10px] text-gold/50 tracking-[4px] uppercase mb-0.5">Kunlik Vazifa</div>
            <h2 className="font-serif text-lg sm:text-xl text-cream tracking-wide">{game.title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Yopish"
            className="w-8 h-8 flex items-center justify-center text-cream/40 hover:text-gold border border-white/10 hover:border-gold/30 rounded-sm transition-colors duration-200 text-sm"
          >
            ✕
          </button>
        </div>

        {/* scrollable game area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          <GameComponent onComplete={onComplete} />
        </div>

        {/* decorative bottom line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent flex-shrink-0" />
      </motion.div>
    </motion.div>
  );
}
