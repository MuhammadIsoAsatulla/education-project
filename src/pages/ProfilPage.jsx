import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import achievements from '../data/achievements.json';
import allomalar from '../data/allomalar.json';
import muzeylar from '../data/muzeylar.json';
import musiqa from '../data/musiqa.json';
import kinolar from '../data/kinolar.json';
import kitoblar from '../data/kitoblar.json';
import AchievementBadge from '../components/profil/AchievementBadge.jsx';
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

function isUnlocked(badge, state) {
  const req = badge.requires || {};
  if (req.type === 'any') {
    const total = Object.values(state.visited).reduce((s, arr) => s + (arr?.length || 0), 0);
    return total >= (req.count || 1);
  }
  if (req.type === 'all') {
    return SECTIONS.every((s) => (state.visited[s.key]?.length || 0) > 0);
  }
  return (state.visited[req.type]?.length || 0) >= (req.count || 1);
}

function nextLevelInfo(points) {
  // simple thresholds
  const levels = [
    { name: 'Yangi sayyoh', min: 0, max: 30 },
    { name: 'Ma\'rifatchi', min: 30, max: 80 },
    { name: 'Bilim do\'sti', min: 80, max: 150 },
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
  const { state, setName, reset } = useProgress();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(state.name);

  const totalVisits = useMemo(
    () => Object.values(state.visited).reduce((s, arr) => s + (arr?.length || 0), 0),
    [state.visited],
  );

  const { current: level, next, progress } = nextLevelInfo(state.points);

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
        <div className="reveal grid md:grid-cols-[1fr_auto] gap-6 md:gap-8 p-6 sm:p-8 md:p-12 rounded-sm border border-gold/30 bg-bg-mid/50 backdrop-blur"
             style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.08), rgba(15,76,92,0.4))' }}>
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
              <h1 className="font-serif text-cream mb-2 leading-tight"
                  style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>
                {state.name}
                <button
                  onClick={() => { setNameInput(state.name); setEditingName(true); }}
                  className="ml-3 text-gold/60 hover:text-gold text-sm align-middle"
                  aria-label="Nomni o'zgartirish"
                >
                  ✎
                </button>
              </h1>
            )}
            <p className="font-amiri text-gold tracking-[3px] text-sm mb-6">— {level.current.name.toUpperCase()} —</p>

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
          </div>

          <div className="flex md:flex-col gap-3">
            <Link to="/" className="px-5 py-2 border border-gold/40 text-cream-soft text-xs tracking-[2px] uppercase hover:text-gold hover:border-gold rounded-sm transition text-center">
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
              <div key={s.key} className="reveal p-5 rounded-sm border border-gold/20 bg-bg-mid/40 backdrop-blur"
                   style={{ background: `linear-gradient(160deg, ${s.accent}1a, transparent)` }}>
                <div className="font-serif text-cream text-lg mb-1">{s.label}</div>
                <div className="text-cream-soft/60 text-xs tracking-[2px] uppercase mb-3">{done} / {total}</div>
                <div className="h-1.5 bg-bg-deep rounded-full overflow-hidden">
                  <div className="h-full transition-all duration-700"
                       style={{ width: pct + '%', background: `linear-gradient(to right, ${s.accent}, var(--gold))` }} />
                </div>
              </div>
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
            {state.achievements.length} ta ochilgan, {achievements.length - state.achievements.length} ta kutmoqda
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 reveal">
          {achievements.map((a) => (
            <AchievementBadge
              key={a.id}
              badge={a}
              unlocked={state.achievements.includes(a.id) || isUnlocked(a, state)}
            />
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
