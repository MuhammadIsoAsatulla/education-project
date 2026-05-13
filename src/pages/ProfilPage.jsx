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
  { key: 'allomalar', label: 'Allomalar', accent: '#d4a574' },
  { key: 'muzeylar', label: 'Muzeylar', accent: '#1a6b7e' },
  { key: 'musiqa', label: 'Musiqa', accent: '#e8c898' },
  { key: 'kinolar', label: 'Kinolar', accent: '#b8893f' },
  { key: 'kitoblar', label: 'Kitoblar', accent: '#8b2635' },
];

function countPerfectQuizzes(quizScores) {
  return viktorinalar.reduce((sum, q) => {
    const score = quizScores[q.ownerId] || 0;
    return score === q.questions.length ? sum + 1 : sum;
  }, 0);
}

function isUnlocked(badge, state) {
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
    return countPerfectQuizzes(state.quizScores || {}) >= (req.count || 1);
  }
  return (state.visited[req.type]?.length || 0) >= (req.count || 1);
}

function nextLevelInfo(points) {
  const levels = [
    { name: 'Yangi sayyoh', min: 0, max: 30 },
    { name: "Ma'rifatchi", min: 30, max: 80 },
    { name: "Bilim do'sti", min: 80, max: 150 },
    { name: 'Olim shogirdi', min: 150, max: 250 },
    { name: 'Meros vorisi', min: 250, max: 999 },
  ];
  const current = levels.findLast((l) => points >= l.min) || levels[0];
  const next = levels[levels.indexOf(current) + 1] || current;
  const progress = Math.min(1, (points - current.min) / (next.max - current.min));
  return { current, next, progress };
}

export default function ProfilPage() {
  useScrollReveal();
  const { state, setName, setAvatar, reset } = useProgress();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(state.name);
  const [pickerOpen, setPickerOpen] = useState(false);

  const totalVisits = useMemo(
    () => Object.values(state.visited).reduce((s, arr) => s + (arr?.length || 0), 0),
    [state.visited],
  );

  const { current: level, next, progress } = nextLevelInfo(state.points);
  const initial = (state.name || 'M').trim().charAt(0).toUpperCase();
  const quizCount = viktorinalar.length;
  const quizDoneCount = Object.values(state.quizScores || {}).filter((s) => s > 0).length;

  return (
    <>
      <PageHero
        eyebrow="MENING ZIYOM"
        title="Profil"
        description="Sayohatingiz xronikasi. Yig'gan ballaringiz, ochgan nishonlaringiz va bilim daraxtingiz."
        accent
      />

      {/* Profile card */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto -mt-4 mb-12 sm:mb-16">
        <div
          className="reveal grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 p-6 sm:p-8 md:p-12 rounded-sm border border-gold/30 bg-bg-mid/50 backdrop-blur items-start"
          style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.08), rgba(15,76,92,0.4))' }}
        >
          {/* Avatar */}
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
              <div className="text-2xl text-gold">🔥 {state.streak.current}</div>
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
                <span>{state.points} ball</span>
                <span>{next.min} ball</span>
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
                onSelect={(id) => {
                  setAvatar(id);
                }}
                onClose={() => setPickerOpen(false)}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex md:flex-col gap-3 md:min-w-[140px]">
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
      </section>

      {/* Section progress */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto mb-16 sm:mb-20">
        <div className="text-center mb-8 sm:mb-10">
          <OrnamentDivider className="opacity-60 mb-6" />
          <div className="eyebrow mb-3">— SAYOHAT XRONIKASI —</div>
          <h2 className="section-title">Tugatilgan Bo'limlar</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-5">
          {SECTIONS.map((s) => {
            const done = state.visited[s.key]?.length || 0;
            const total = SECTION_TOTALS[s.key]() || 1;
            const pct = Math.min(100, (done / total) * 100);
            return (
              <div
                key={s.key}
                className="reveal p-5 rounded-sm border border-gold/20 bg-bg-mid/40 backdrop-blur"
                style={{ background: `linear-gradient(160deg, ${s.accent}1a, transparent)` }}
              >
                <div className="font-serif text-cream text-lg mb-1">{s.label}</div>
                <div className="text-cream-soft/60 text-xs tracking-[2px] uppercase mb-3">
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
              </div>
            );
          })}
        </div>
      </section>

      {/* Favorites */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto mb-16 sm:mb-20 reveal">
        <div className="text-center mb-8 sm:mb-10">
          <OrnamentDivider className="opacity-60 mb-6" />
          <div className="eyebrow mb-3">— MENING TO'PLAMIM —</div>
          <h2 className="section-title">Sevimlilar</h2>
        </div>
        <FavoritesGallery favorites={state.favorites} />
      </section>

      {/* Quizzes */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto mb-16 sm:mb-20 reveal">
        <div className="text-center mb-8 sm:mb-10">
          <OrnamentDivider className="opacity-60 mb-6" />
          <div className="eyebrow mb-3">— BILIM SINOVLARI —</div>
          <h2 className="section-title">Viktorinalar</h2>
          <p className="font-serif italic text-cream-soft/80 mt-3">
            {quizDoneCount} / {quizCount} viktorina topshirildi
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {viktorinalar.map((q) => {
            const owner = allomalar.find((a) => a.id === q.ownerId);
            if (!owner) return null;
            const score = state.quizScores[q.ownerId] || 0;
            const done = score > 0;
            const perfect = score === q.questions.length;
            return (
              <Link
                key={q.ownerId}
                to={`/allomalar/${owner.slug}`}
                className="group p-5 border border-gold/20 hover:border-gold/70 rounded-sm bg-bg-mid/40 backdrop-blur transition flex items-center gap-4"
              >
                <div className="w-14 h-14 flex-shrink-0 rounded-sm overflow-hidden border border-gold/30">
                  <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${owner.accent}88, var(--teal))` }}>
                    <div className="w-full h-full flex items-center justify-center font-serif text-gold text-2xl">
                      {owner.initial}
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-cream text-lg leading-tight truncate">
                    {owner.name}
                  </h3>
                  <p className="text-cream-soft/60 text-xs tracking-[2px] uppercase mt-1">
                    {done ? (
                      <>
                        Natija: <span className={perfect ? 'text-gold' : 'text-cream-soft'}>
                          {score}/{q.questions.length}
                        </span>
                        {perfect && ' ✦'}
                      </>
                    ) : (
                      'Hali topshirilmagan'
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

      {/* Achievements */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1300px] mx-auto pb-20 sm:pb-32">
        <div className="text-center mb-8 sm:mb-10">
          <OrnamentDivider className="opacity-60 mb-6" />
          <div className="eyebrow mb-3">— BILIM NISHONLARI —</div>
          <h2 className="section-title">Yutuqlaringiz</h2>
          <p className="font-serif italic text-cream-soft/80 mt-3">
            {achievements.filter((a) => isUnlocked(a, state)).length} ta ochilgan,{' '}
            {achievements.filter((a) => !isUnlocked(a, state)).length} ta kutmoqda
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 reveal">
          {achievements.map((a) => (
            <AchievementBadge key={a.id} badge={a} unlocked={isUnlocked(a, state)} />
          ))}
        </div>

        {totalVisits === 0 && (
          <div className="mt-12 text-center p-10 border border-gold/20 rounded-sm bg-bg-mid/40">
            <p className="font-serif italic text-cream-soft text-xl mb-4">
              Hali sayohat boshlanmagan. Birinchi qadam — bu eng muhim qadam.
            </p>
            <Link to="/allomalar" className="gold-cta">
              <span>Sayohatni Boshlash</span>
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
