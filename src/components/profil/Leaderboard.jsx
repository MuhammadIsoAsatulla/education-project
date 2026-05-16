import { useMemo, useState } from 'react';
import mockLeaderboard from '../../data/mockLeaderboard.json';
import Avatar from './Avatar.jsx';

const TIER_COLORS = {
  common: { ring: 'border-cream-soft/30', label: 'Oddiy' },
  rare: { ring: 'border-blue-300/60', label: 'Nodir' },
  epic: { ring: 'border-purple-400/70', label: 'Buyuk' },
  legendary: { ring: 'border-gold/80', label: 'Afsonaviy' },
  mythic: { ring: 'border-pink-400/70', label: 'Asotirim' },
  sohibqiron: { ring: 'border-orange-500/80', label: 'Sohibqiron' },
};

function getUserTier(points) {
  if (points >= 1200) return 'sohibqiron';
  if (points >= 900) return 'mythic';
  if (points >= 700) return 'legendary';
  if (points >= 500) return 'epic';
  if (points >= 300) return 'rare';
  return 'common';
}

function getUserLevel(points) {
  if (points >= 1200) return 'Meros Vorisi';
  if (points >= 700) return 'Olim Shogirdi';
  if (points >= 400) return 'Bilim Do\'sti';
  if (points >= 150) return 'Ma\'rifatchi';
  return 'Yangi Sayyoh';
}

function MedalIcon({ rank }) {
  if (rank > 3) {
    return (
      <span className="font-serif text-cream-soft/60 text-lg tabular-nums w-7 text-center">
        {rank}
      </span>
    );
  }
  const colors = {
    1: { bg: '#d4a574', text: '#0a1f2e' },
    2: { bg: '#cbd5e1', text: '#0a1f2e' },
    3: { bg: '#b8893f', text: '#fff' },
  };
  const c = colors[rank];
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-full font-serif text-sm font-bold flex-shrink-0"
      style={{ background: c.bg, color: c.text }}
    >
      {rank}
    </span>
  );
}

function LeaderboardRow({ entry, isYou }) {
  const tierInfo = TIER_COLORS[entry.tier] || TIER_COLORS.common;
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-sm transition ${
        isYou
          ? 'bg-gold/10 border border-gold/50'
          : 'border border-transparent hover:bg-bg-mid/30'
      }`}
    >
      <MedalIcon rank={entry.rank} />
      <div className={`rounded-full p-0.5 border-2 ${tierInfo.ring} flex-shrink-0`}>
        <Avatar avatarId={entry.avatar} initial={entry.name?.charAt(0) || 'M'} size={36} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-serif text-cream text-sm truncate font-medium">
            {entry.name}
            {isYou && <span className="ml-2 text-[10px] text-gold uppercase tracking-[2px]">— siz</span>}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] tracking-[1px] uppercase">
          <span className="text-gold/70">{entry.level}</span>
          <span className="text-cream-soft/30">•</span>
          <span className="text-cream-soft/50">{tierInfo.label}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-serif text-gold-gradient text-base tabular-nums leading-none">
          {entry.points}
        </div>
        <div className="text-cream-soft/40 text-[9px] tracking-[2px] uppercase mt-1">
          {entry.streak}d streak
        </div>
      </div>
    </div>
  );
}

export default function Leaderboard({ state }) {
  const [tab, setTab] = useState('all');

  const youEntry = useMemo(() => {
    const points = state.points || 0;
    return {
      rank: 0,
      name: state.name || 'Mehmon',
      avatar: state.avatar || 'girih-1',
      level: getUserLevel(points),
      points,
      streak: state.streak?.current || 0,
      tier: getUserTier(points),
      isYou: true,
    };
  }, [state]);

  const ranked = useMemo(() => {
    const combined = [...mockLeaderboard, youEntry]
      .sort((a, b) => b.points - a.points)
      .map((e, i) => ({ ...e, rank: i + 1 }));
    return combined;
  }, [youEntry]);

  const filtered = useMemo(() => {
    if (tab === 'top10') return ranked.slice(0, 10);
    if (tab === 'around') {
      const youIdx = ranked.findIndex((r) => r.isYou);
      const start = Math.max(0, youIdx - 3);
      const end = Math.min(ranked.length, youIdx + 4);
      return ranked.slice(start, end);
    }
    return ranked;
  }, [ranked, tab]);

  const yourRank = ranked.find((r) => r.isYou)?.rank;

  return (
    <div>
      {/* Your rank banner */}
      {yourRank && (
        <div className="mb-5 p-3 border border-gold/30 rounded-sm bg-gradient-to-r from-gold/10 to-transparent">
          <div className="flex items-center justify-between text-sm">
            <span className="text-cream-soft/70">Sizning o'rningiz:</span>
            <span className="font-serif text-gold-gradient text-xl tabular-nums">
              #{yourRank} <span className="text-cream-soft/50 text-xs">/ {ranked.length}</span>
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-center gap-1 mb-5">
        {[
          { id: 'top10', label: 'TOP 10' },
          { id: 'around', label: 'Atrofingiz' },
          { id: 'all', label: 'Hammasi' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-full text-[10px] tracking-[2px] uppercase transition ${
              tab === t.id
                ? 'bg-gold text-bg-deep border border-gold'
                : 'border border-gold/30 text-cream-soft/70 hover:text-gold hover:border-gold/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-1 max-h-[500px] overflow-y-auto custom-scroll pr-1">
        {filtered.map((entry) => (
          <LeaderboardRow key={entry.rank + '-' + entry.name} entry={entry} isYou={!!entry.isYou} />
        ))}
      </div>
    </div>
  );
}
