import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import achievements from '../data/achievements.json';
import allomalar from '../data/allomalar.json';
import muzeylar from '../data/muzeylar.json';
import musiqa from '../data/musiqa.json';
import kinolar from '../data/kinolar.json';
import kitoblar from '../data/kitoblar.json';
import viktorinalar from '../data/viktorinalar.json';
import AchievementBadge from '../components/profil/AchievementBadge.jsx';
import Avatar from '../components/profil/Avatar.jsx';
import AvatarPicker from '../components/profil/AvatarPicker.jsx';
import FavoritesGallery from '../components/profil/FavoritesGallery.jsx';
import MuhrBalance from '../components/profil/MuhrBalance.jsx';
import StatOverview from '../components/profil/StatOverview.jsx';
import RecentActivity from '../components/profil/RecentActivity.jsx';
import Leaderboard from '../components/profil/Leaderboard.jsx';
import DailyChallenge from '../components/profil/DailyChallenge.jsx';
import DailyQuote from '../components/profil/DailyQuote.jsx';
import DailyWord from '../components/profil/DailyWord.jsx';
import Shop from '../components/profil/Shop.jsx';
import MixedQuiz from '../components/profil/MixedQuiz.jsx';
import OrnamentDivider from '../components/common/OrnamentDivider.jsx';
import PageHero from '../components/common/PageHero.jsx';
import useProgress from '../hooks/useProgress.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

const SECTION_TOTALS = {
  allomalar: () => allomalar.length,
  muzeylar: () => muzeylar.filter((m) => m.status === 'available').length || muzeylar.length,
  musiqa: () => musiqa.length,
  kinolar: () => kinolar.length,
  kitoblar: () => kitoblar.length,
};

const SECTIONS = [
  { key: 'allomalar', label: 'Allomalar', accent: '#d4a574', path: '/allomalar' },
  { key: 'muzeylar', label: 'Muzeylar', accent: '#1a6b7e', path: '/muzeylar' },
  { key: 'musiqa', label: 'Musiqa', accent: '#e8c898', path: '/musiqa' },
  { key: 'kinolar', label: 'Kinolar', accent: '#b8893f', path: '/kinolar' },
  { key: 'kitoblar', label: 'Kitoblar', accent: '#8b2635', path: '/kitoblar' },
];

const OWNER_LOOKUP = {
  allomalar: (id) => allomalar.find((a) => a.id === id),
  muzeylar: (id) => muzeylar.find((m) => m.id === id),
  musiqa: (id) => musiqa.find((m) => m.id === id),
  kinolar: (id) => kinolar.find((k) => k.id === id),
  kitoblar: (id) => kitoblar.find((k) => k.id === id),
};

const OWNER_NAME = {
  allomalar: (o) => o.name,
  muzeylar: (o) => o.name,
  musiqa: (o) => o.title,
  kinolar: (o) => o.title,
  kitoblar: (o) => o.title,
};

function getQuizScore(state, ownerId) {
  const entry = state.quizScores?.[ownerId];
  if (!entry) return { score: 0, total: 0 };
  if (typeof entry === 'number') return { score: entry, total: 0 };
  return { score: entry.score || 0, total: entry.total || 0 };
}

function countPerfectQuizzes(state) {
  return viktorinalar.reduce((sum, q) => {
    const { score } = getQuizScore(state, q.ownerId);
    return score === q.questions.length ? sum + 1 : sum;
  }, 0);
}

function getCommentsCount(state) {
  return Object.values(state.comments || {}).reduce(
    (sum, list) => sum + (list?.filter((c) => c.author?.name === state.name).length || 0),
    0,
  );
}

function getFavoritesCount(state) {
  return Object.values(state.favorites || {}).reduce((s, arr) => s + (arr?.length || 0), 0);
}

function isUnlocked(badge, state, allBadges) {
  const req = badge.requires || {};
  if (req.type === 'any') {
    const total = Object.values(state.visited).reduce((s, arr) => s + (arr?.length || 0), 0);
    return total >= (req.count || 1);
  }
  if (req.type === 'all') {
    return SECTIONS.every((s) => (state.visited[s.key]?.length || 0) > 0);
  }
  if (req.type === 'streak') {
    return (state.streak?.longest || 0) >= (req.count || 1);
  }
  if (req.type === 'quiz-perfect') {
    return countPerfectQuizzes(state) >= (req.count || 1);
  }
  if (req.type === 'pages-read') {
    const maxPagesRead = Object.values(state.readingProgress || {}).reduce(
      (max, p) => Math.max(max, p?.lastPage || 0),
      0,
    );
    return maxPagesRead >= (req.count || 1);
  }
  if (req.type === 'pages-percent') {
    const maxPercent = Object.values(state.readingProgress || {}).reduce(
      (max, p) => Math.max(max, p?.percent || 0),
      0,
    );
    return maxPercent >= (req.percent || 100);
  }
  if (req.type === 'muhr-bronze') {
    return (state.muhr?.bronze || 0) >= (req.count || 1);
  }
  if (req.type === 'muhr-silver') {
    return (state.muhr?.silver || 0) >= (req.count || 1);
  }
  if (req.type === 'muhr-gold') {
    return (state.muhr?.gold || 0) >= (req.count || 1);
  }
  if (req.type === 'comments') {
    return getCommentsCount(state) >= (req.count || 1);
  }
  if (req.type === 'favorites') {
    return getFavoritesCount(state) >= (req.count || 1);
  }
  if (req.type === 'daily-completed') {
    return (state.daily?.completedDays?.length || 0) >= (req.count || 1);
  }
  if (req.type === 'words-known') {
    return (state.dailyContent?.wordsKnown?.length || 0) >= (req.count || 1);
  }
  if (req.type === 'shop-purchase') {
    return (state.shopPurchases?.length || 0) >= (req.count || 1);
  }
  if (req.type === 'tier-legendary') {
    if (!allBadges) return false;
    const unlocked = allBadges.filter(
      (b) => b.id !== badge.id && b.tier === 'legendary' && isUnlocked(b, state),
    ).length;
    return unlocked >= (req.count || 1);
  }
  if (req.type === 'tier-mythic') {
    if (!allBadges) return false;
    const unlocked = allBadges.filter(
      (b) => b.id !== badge.id && b.tier === 'mythic' && isUnlocked(b, state),
    ).length;
    return unlocked >= (req.count || 1);
  }
  return (state.visited[req.type]?.length || 0) >= (req.count || 1);
}

function nextLevelInfo(points) {
  const levels = [
    { name: 'Yangi sayyoh', min: 0, max: 150 },
    { name: "Ma'rifatchi", min: 150, max: 300 },
    { name: "Bilim do'sti", min: 300, max: 500 },
    { name: 'Olim shogirdi', min: 500, max: 800 },
    { name: 'Meros vorisi', min: 800, max: 9999 },
  ];
  const current = levels.findLast((l) => points >= l.min) || levels[0];
  const next = levels[levels.indexOf(current) + 1] || current;
  const progress = Math.min(1, (points - current.min) / (next.max - current.min));
  return { current, next, progress };
}

const TIER_FILTERS = [
  { key: 'all', label: 'Hammasi' },
  { key: 'common', label: 'Oddiy' },
  { key: 'rare', label: 'Nodir' },
  { key: 'epic', label: 'Buyuk' },
  { key: 'legendary', label: 'Afsonaviy' },
  { key: 'mythic', label: 'Asotirim' },
  { key: 'sohibqiron', label: 'Sohibqiron' },
];

export default function ProfilPage() {
  useScrollReveal();
  const { state, setName, setAvatar, reset } = useProgress();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(state.name);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mixedQuizOpen, setMixedQuizOpen] = useState(false);
  const [tierFilter, setTierFilter] = useState('all');

  const { current: level, next, progress } = nextLevelInfo(state.points);
  const initial = (state.name || 'M').trim().charAt(0).toUpperCase();
  const quizCount = viktorinalar.length;
  const quizDoneCount = Object.values(state.quizScores || {}).filter((s) => {
    if (typeof s === 'number') return s > 0;
    return (s?.score || 0) > 0;
  }).length;

  const filteredAchievements = useMemo(() => {
    if (tierFilter === 'all') return achievements;
    return achievements.filter((a) => a.tier === tierFilter);
  }, [tierFilter]);

  const unlockedCount = useMemo(
    () => achievements.filter((a) => isUnlocked(a, state, achievements)).length,
    [state],
  );

  return (
    <>
      <PageHero
        eyebrow="MENING ZIYOM"
        title="Profil"
        description="Sayohatingiz xronikasi. Yig'gan ballaringiz, ochgan nishonlaringiz va bilim daraxtingiz."
        accent
      />

      {/* ============================================================ */}
      {/* HERO CARD + MUHR BALANCE */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto -mt-4 mb-10 sm:mb-12">
        <div
          className="reveal p-6 sm:p-8 md:p-10 rounded-sm border border-gold/30 bg-bg-mid/50 backdrop-blur"
          style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.08), rgba(15,76,92,0.4))' }}
        >
          <div className="grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-start">
            {/* Avatar + Streak */}
            <div className="flex flex-col items-center md:items-start">
              <button
                onClick={() => setPickerOpen((o) => !o)}
                className="relative group"
                aria-label="Avatar tanlash"
              >
                <Avatar avatarId={state.avatar} initial={initial} size={140} className="md:!w-[160px] md:!h-[160px]" />
                <span className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-gold text-bg-deep flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition">
                  ✎
                </span>
              </button>
              <div className="mt-4 text-center md:text-left">
                <div className="text-2xl text-gold tabular-nums">✧ {state.streak.current}</div>
                <div className="text-cream-soft/70 text-[10px] tracking-[2px] uppercase mt-1">
                  kun ketma-ket
                </div>
                {state.streak.longest > state.streak.current && (
                  <div className="text-cream-soft/50 text-[10px] mt-1 italic">
                    Eng uzun: {state.streak.longest} kun
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="eyebrow text-xs mb-3">— SALOM —</div>
              {editingName ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setName(nameInput.trim() || 'Mehmon');
                    setEditingName(false);
                  }}
                  className="flex flex-wrap items-center gap-3 mb-4"
                >
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="bg-transparent border-b-2 border-gold text-cream font-serif text-3xl md:text-5xl outline-none px-2 py-1"
                    maxLength={32}
                  />
                  <button type="submit" className="gold-cta"><span>Saqlash</span></button>
                </form>
              ) : (
                <h1
                  className="font-serif text-cream mb-2 leading-tight"
                  style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
                >
                  {state.name}
                  <button
                    onClick={() => {
                      setNameInput(state.name);
                      setEditingName(true);
                    }}
                    className="ml-3 text-gold/60 hover:text-gold text-sm align-middle"
                    aria-label="Nomni o'zgartirish"
                  >
                    ✎
                  </button>
                </h1>
              )}
              <p className="font-amiri text-gold tracking-[3px] text-sm mb-6">
                — {level.name.toUpperCase()} —
              </p>

              <div className="max-w-md">
                <div className="flex items-center justify-between text-xs text-cream-soft/70 mb-2">
                  <span className="tabular-nums">{state.points} ball</span>
                  <span className="tabular-nums">{next.min} ball</span>
                </div>
                <div className="h-2 bg-bg-deep rounded-full overflow-hidden border border-gold/20">
                  <div
                    className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright transition-all duration-700"
                    style={{ width: `${Math.max(5, progress * 100)}%` }}
                  />
                </div>
                <p className="text-cream-soft/60 text-xs mt-2 italic">
                  Keyingi daraja: <span className="text-gold">{next.name}</span>
                </p>
              </div>

              {pickerOpen && (
                <AvatarPicker
                  currentId={state.avatar}
                  initial={initial}
                  onSelect={(id) => setAvatar(id)}
                  onClose={() => setPickerOpen(false)}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex md:flex-col gap-3 md:min-w-[160px]">
              <button
                onClick={() => setShopOpen(true)}
                className="gold-cta w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-base">✦</span>
                  Do'kon
                </span>
              </button>
              <Link
                to="/"
                className="px-5 py-2 border border-gold/40 text-cream-soft text-xs tracking-[2px] uppercase hover:text-gold hover:border-gold rounded-sm transition text-center"
              >
                Bosh sahifa
              </Link>
              <button
                onClick={() => {
                  if (confirm("Barcha yutuqlaringiz o'chiriladi. Davom etamizmi?")) reset();
                }}
                className="px-5 py-2 border border-crimson/40 text-crimson/80 text-xs tracking-[2px] uppercase hover:text-crimson hover:border-crimson rounded-sm transition"
              >
                Tozalash
              </button>
            </div>
          </div>

          {/* Muhr balance bar */}
          <div className="mt-6 pt-6 border-t border-gold/15">
            <MuhrBalance />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* DAILY CHALLENGE + QUOTE + WORD */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto mb-10 sm:mb-14 reveal">
        <div className="text-center mb-6 sm:mb-8">
          <OrnamentDivider className="opacity-60 mb-4" />
          <div className="eyebrow mb-2">— KUNLIK XAZINALAR —</div>
          <h2 className="section-title">Har Kun Yangi Bilim</h2>
        </div>

        <div className="space-y-4">
          <DailyChallenge />
          <div className="grid md:grid-cols-2 gap-4">
            <DailyQuote />
            <DailyWord />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* STAT OVERVIEW */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto mb-10 sm:mb-14 reveal">
        <StatOverview state={state} />
      </section>

      {/* ============================================================ */}
      {/* SECTION PROGRESS */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto mb-14 sm:mb-20 reveal">
        <div className="text-center mb-8">
          <OrnamentDivider className="opacity-60 mb-4" />
          <div className="eyebrow mb-2">— SAYOHAT XRONIKASI —</div>
          <h2 className="section-title">Bo'limlar bo'yicha tugatish</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-5">
          {SECTIONS.map((s) => {
            const done = state.visited[s.key]?.length || 0;
            const total = SECTION_TOTALS[s.key]() || 1;
            const pct = Math.min(100, (done / total) * 100);
            return (
              <Link
                key={s.key}
                to={s.path}
                className="p-5 rounded-sm border border-gold/20 hover:border-gold/60 bg-bg-mid/40 backdrop-blur transition group"
                style={{ background: `linear-gradient(160deg, ${s.accent}1a, transparent)` }}
              >
                <div className="font-serif text-cream text-lg mb-1 group-hover:text-gold transition">
                  {s.label}
                </div>
                <div className="text-cream-soft/60 text-xs tracking-[2px] uppercase mb-3 tabular-nums">
                  {done} / {total}
                </div>
                <div className="h-1.5 bg-bg-deep rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: pct + '%',
                      background: `linear-gradient(to right, ${s.accent}, var(--gold))`,
                    }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* QUICK ACTIONS — Mixed Quiz banner */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto mb-14 sm:mb-20 reveal">
        {mixedQuizOpen ? (
          <MixedQuiz onClose={() => setMixedQuizOpen(false)} />
        ) : (
          <div
            className="relative p-6 sm:p-8 rounded-sm border border-gold/30 overflow-hidden text-center"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(212,165,116,0.2), rgba(10,31,46,0.6) 70%)',
            }}
          >
            <div className="absolute inset-0 bg-girih opacity-25 pointer-events-none" />
            <div className="relative">
              <div className="eyebrow mb-3">— ARALASH VIKTORINA —</div>
              <h3 className="font-serif text-gold-gradient text-2xl sm:text-3xl mb-3">
                5 bo'limdan 10 ta tasodifiy savol
              </h3>
              <p className="font-serif italic text-cream-soft/80 mb-6 max-w-2xl mx-auto">
                Allomalar, muzeylar, musiqa, kinolar, kitoblar — barchasidan tasodifiy savollar.
                Mukammal natija uchun 2 bronza muhr bonus.
              </p>
              <button onClick={() => setMixedQuizOpen(true)} className="gold-cta">
                <span>Boshlash</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* ACHIEVEMENTS WITH TIER TABS */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1300px] mx-auto mb-14 sm:mb-20">
        <div className="text-center mb-8">
          <OrnamentDivider className="opacity-60 mb-4" />
          <div className="eyebrow mb-2">— BILIM NISHONLARI —</div>
          <h2 className="section-title">Yutuqlaringiz</h2>
          <p className="font-serif italic text-cream-soft/80 mt-3">
            <span className="text-gold tabular-nums">{unlockedCount}</span> ta ochilgan,{' '}
            <span className="text-cream-soft/60 tabular-nums">{achievements.length - unlockedCount}</span>{' '}
            ta kutmoqda
          </p>
        </div>

        {/* Tier filter tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {TIER_FILTERS.map((f) => {
            const count = f.key === 'all'
              ? achievements.length
              : achievements.filter((a) => a.tier === f.key).length;
            if (f.key !== 'all' && count === 0) return null;
            return (
              <button
                key={f.key}
                onClick={() => setTierFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-[10px] tracking-[2px] uppercase transition ${
                  tierFilter === f.key
                    ? 'bg-gold text-bg-deep border border-gold'
                    : 'border border-gold/30 text-cream-soft/70 hover:text-gold hover:border-gold/60'
                }`}
              >
                {f.label} <span className="tabular-nums opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 reveal">
          {filteredAchievements.map((a) => (
            <AchievementBadge key={a.id} badge={a} unlocked={isUnlocked(a, state, achievements)} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* FAVORITES */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto mb-14 sm:mb-20 reveal">
        <div className="text-center mb-8">
          <OrnamentDivider className="opacity-60 mb-4" />
          <div className="eyebrow mb-2">— MENING TO'PLAMIM —</div>
          <h2 className="section-title">Sevimlilar</h2>
        </div>
        <FavoritesGallery favorites={state.favorites} />
      </section>

      {/* ============================================================ */}
      {/* QUIZ ROSTER — all sections, not just allomalar */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto mb-14 sm:mb-20 reveal">
        <div className="text-center mb-8">
          <OrnamentDivider className="opacity-60 mb-4" />
          <div className="eyebrow mb-2">— BILIM SINOVLARI —</div>
          <h2 className="section-title">Viktorinalar</h2>
          <p className="font-serif italic text-cream-soft/80 mt-3">
            <span className="text-gold tabular-nums">{quizDoneCount}</span> / {quizCount} viktorina topshirildi
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {viktorinalar.map((q) => {
            const owner = OWNER_LOOKUP[q.ownerType]?.(q.ownerId);
            if (!owner) return null;
            const { score } = getQuizScore(state, q.ownerId);
            const done = score > 0;
            const perfect = score === q.questions.length;
            const path = `/${q.ownerType}/${owner.slug}`;
            const name = OWNER_NAME[q.ownerType](owner);
            return (
              <Link
                key={`${q.ownerType}-${q.ownerId}`}
                to={path}
                className="group p-4 border border-gold/15 hover:border-gold/70 rounded-sm bg-bg-mid/40 backdrop-blur transition flex items-center gap-3"
              >
                <div
                  className="w-11 h-11 flex-shrink-0 rounded-sm flex items-center justify-center font-serif text-gold text-lg"
                  style={{ background: `linear-gradient(135deg, ${owner.accent || '#d4a574'}88, var(--teal))` }}
                >
                  {owner.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-cream text-sm leading-tight truncate">
                    {name}
                  </h3>
                  <p className="text-cream-soft/60 text-[10px] tracking-[2px] uppercase mt-1">
                    <span className="text-gold/80">{q.ownerType}</span>
                    {done && (
                      <>
                        {' • '}
                        <span className={perfect ? 'text-gold' : 'text-cream-soft'}>
                          {score}/{q.questions.length}
                        </span>
                        {perfect && ' ✦'}
                      </>
                    )}
                  </p>
                </div>
                <span className="text-gold opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition">
                  ›
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* LEADERBOARD */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[900px] mx-auto mb-14 sm:mb-20 reveal">
        <div className="text-center mb-8">
          <OrnamentDivider className="opacity-60 mb-4" />
          <div className="eyebrow mb-2">— ENG YAXSHILAR —</div>
          <h2 className="section-title">Reyting</h2>
        </div>
        <Leaderboard state={state} />
      </section>

      {/* ============================================================ */}
      {/* RECENT ACTIVITY */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[900px] mx-auto pb-20 sm:pb-32 reveal">
        <div className="text-center mb-8">
          <OrnamentDivider className="opacity-60 mb-4" />
          <div className="eyebrow mb-2">— SO'NGGI FAOLIYAT —</div>
          <h2 className="section-title">Xronikangiz</h2>
        </div>
        <RecentActivity state={state} />
      </section>

      {/* Shop modal */}
      {shopOpen && <Shop onClose={() => setShopOpen(false)} />}
    </>
  );
}
