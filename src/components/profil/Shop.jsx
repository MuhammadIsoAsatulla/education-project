import { useState } from 'react';
import shopData from '../../data/shopItems.json';
import useProgress from '../../hooks/useProgress.js';
import MuhrIcon from './MuhrIcon.jsx';

function ShopItem({ item, ownedAlready, hasEnough, onBuy }) {
  return (
    <div className="relative p-4 rounded-sm border border-gold/25 bg-bg-mid/40 hover:border-gold/60 transition flex flex-col">
      <div className="flex-1 mb-3">
        <h4 className="font-serif text-cream text-base mb-1 leading-tight">{item.name}</h4>
        <p className="text-cream-soft/60 text-xs leading-relaxed">{item.description}</p>
      </div>
      <div className="flex items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-1.5">
          <MuhrIcon type={item.price.type} size={20} />
          <span className="font-serif text-gold tabular-nums">{item.price.amount}</span>
        </div>
        {ownedAlready && !item.consumable ? (
          <span className="text-[10px] tracking-[2px] uppercase text-gold/60 px-2 py-1 border border-gold/30 rounded-full">
            Sotib olingan
          </span>
        ) : (
          <button
            onClick={onBuy}
            disabled={!hasEnough}
            className={`px-3 py-1.5 rounded-full text-[10px] tracking-[2px] uppercase transition ${
              hasEnough
                ? 'bg-gold text-bg-deep border border-gold hover:scale-105'
                : 'border border-cream-soft/20 text-cream-soft/30 cursor-not-allowed'
            }`}
          >
            {hasEnough ? 'Olish' : 'Yetarli emas'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Shop({ onClose }) {
  const { state, spendMuhr } = useProgress();
  const [activeCategory, setActiveCategory] = useState(shopData.categories[0].id);
  const [toast, setToast] = useState(null);

  const category = shopData.categories.find((c) => c.id === activeCategory);
  const purchased = (state.shopPurchases || []).map((p) => p.itemId);

  const handleBuy = (item) => {
    const have = state.muhr[item.price.type] || 0;
    if (have < item.price.amount) return;
    const success = spendMuhr(item.price.type, item.price.amount, item.id);
    if (success) {
      setToast({ msg: `«${item.name}» sotib olindi!`, kind: 'success' });
      setTimeout(() => setToast(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-bg-deep/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-bg-deep border border-gold/40 rounded-t-lg sm:rounded-sm shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gold/20">
          <div>
            <div className="eyebrow text-[10px] mb-1">— MEROS DO'KONI —</div>
            <h3 className="font-serif text-gold-gradient text-2xl">Muhr Almashtirish</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-cream-soft hover:text-gold border border-gold/30 hover:border-gold rounded-full transition"
            aria-label="Yopish"
          >
            ✕
          </button>
        </div>

        {/* Balance bar */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 p-3 border-b border-gold/15 bg-bg-mid/30">
          {['bronze', 'silver', 'gold'].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <MuhrIcon type={t} size={22} />
              <span className="font-serif text-cream tabular-nums">{state.muhr[t] || 0}</span>
            </div>
          ))}
        </div>

        {/* Category tabs */}
        <div className="flex overflow-x-auto border-b border-gold/15 px-3 py-2 gap-2 flex-shrink-0">
          {shopData.categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] tracking-[2px] uppercase transition whitespace-nowrap ${
                activeCategory === c.id
                  ? 'bg-gold text-bg-deep border border-gold'
                  : 'border border-gold/30 text-cream-soft/70 hover:text-gold hover:border-gold/60'
              }`}
            >
              <span className="text-sm">{c.icon}</span>
              {c.name}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scroll">
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {category.items.map((item) => {
              const have = state.muhr[item.price.type] || 0;
              return (
                <ShopItem
                  key={item.id}
                  item={item}
                  ownedAlready={purchased.includes(item.id)}
                  hasEnough={have >= item.price.amount}
                  onBuy={() => handleBuy(item)}
                />
              );
            })}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-gold text-bg-deep rounded-full font-serif text-sm shadow-lg animate-pulse">
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  );
}
