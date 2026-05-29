import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import OrnamentDivider from '../components/common/OrnamentDivider.jsx';
import Avatar from '../components/profil/Avatar.jsx';
import LevelBadge from '../components/profil/LevelBadge.jsx';
import FollowButton from '../components/profil/FollowButton.jsx';
import { apiFetch, probeApi } from '../lib/api.js';

// Same thresholds Leaderboard uses to label points → level. Duplicated
// (small + stable) rather than threading the function through props.
function getUserLevel(points) {
  if (points >= 1200) return 'Meros vorisi';
  if (points >= 700) return 'Olim shogirdi';
  if (points >= 400) return "Bilim do'sti";
  if (points >= 150) return "Ma'rifatchi";
  return 'Yangi sayyoh';
}

const SECTION_LABELS = {
  allomalar: 'Allomalar',
  muzeylar: 'Muzeylar',
  musiqa: 'Musiqa',
  kinolar: 'Kinolar',
  kitoblar: 'Kitoblar',
};

export default function UserProfilePage() {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await probeApi();
      if (cancelled) return;
      if (!ok) {
        setStatus('offline');
        return;
      }
      try {
        const data = await apiFetch(`/api/users/${uid}`, { auth: 'optional' });
        if (cancelled) return;
        setUser(data);
        setFollowers(data.followers || 0);
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        setStatus(err?.status === 404 ? 'missing' : 'error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (status === 'loading') {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </section>
    );
  }
  if (status === 'offline') {
    return <CenteredMessage title="Server mavjud emas" body="Iltimos, keyinroq qaytib keling." />;
  }
  if (status === 'missing') {
    return <CenteredMessage title="Foydalanuvchi topilmadi" body="Bunday foydalanuvchi mavjud emas." backTo="/foydalanuvchilar" backLabel="Ro'yxatga qaytish" />;
  }
  if (status === 'error' || !user) {
    return <CenteredMessage title="Xato" body="Profilni yuklab bo'lmadi." backTo="/foydalanuvchilar" backLabel="Ro'yxatga qaytish" />;
  }

  const level = getUserLevel(user.points || 0);

  return (
    <section className="relative min-h-screen px-4 py-16 sm:py-24">
      <div className="absolute inset-0 bg-girih opacity-20 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto">
        <Link
          to="/foydalanuvchilar"
          className="inline-flex items-center gap-2 text-cream-soft/60 hover:text-gold text-[11px] tracking-[2px] uppercase mb-6 transition"
        >
          ← Foydalanuvchilar
        </Link>

        <div className="text-center mb-8">
          <OrnamentDivider className="opacity-60 mb-5" />
          <div className="flex justify-center mb-4">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full object-cover border-2 border-gold shadow-[0_0_40px_rgba(212,165,116,0.25)]"
              />
            ) : (
              <Avatar avatarId="girih-1" initial={user.name?.charAt(0) || 'M'} size={96} />
            )}
          </div>
          <h1
            className="font-serif text-gold-gradient leading-tight mb-3"
            style={{ fontSize: 'clamp(28px, 4.5vw, 40px)' }}
          >
            {user.name}
          </h1>
          <div className="flex justify-center mb-5">
            <LevelBadge levelName={level} size="md" />
          </div>

          <div className="flex justify-center">
            <FollowButton
              targetUid={user.uid}
              initialFollowing={user.iFollow}
              isSelf={user.isMe}
              size="lg"
              onChange={(nowFollowing) =>
                setFollowers((n) => Math.max(0, n + (nowFollowing ? 1 : -1)))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard label="Ball" value={user.points || 0} />
          <StatCard label="Kuzatuvchi" value={followers} />
          <StatCard label="Kuzatadi" value={user.following || 0} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {Object.entries(SECTION_LABELS).map(([key, label]) => (
            <div
              key={key}
              className="p-3 border border-gold/20 bg-bg-mid/30 rounded-sm text-center"
            >
              <div className="font-serif text-gold-gradient text-xl tabular-nums">
                {user.visited?.[key] || 0}
              </div>
              <div className="text-cream-soft/60 text-[10px] tracking-[2px] uppercase mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>

        <MuhrPanel muhr={user.muhr} />
        <ActivityList activity={user.recentActivity} />
      </div>
    </section>
  );
}

function CenteredMessage({ title, body, backTo, backLabel }) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-gold-gradient text-2xl mb-3">{title}</h1>
        <p className="text-cream-soft/70 mb-6">{body}</p>
        {backTo && (
          <Link
            to={backTo}
            className="inline-block px-5 py-2 border border-gold/40 text-cream hover:bg-gold hover:text-bg-deep rounded-full text-xs tracking-[2px] uppercase transition"
          >
            {backLabel}
          </Link>
        )}
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-4 border border-gold/25 bg-bg-mid/40 rounded-sm text-center">
      <div className="font-serif text-gold-gradient text-2xl tabular-nums">{value}</div>
      <div className="text-cream-soft/60 text-[10px] tracking-[2px] uppercase mt-1">{label}</div>
    </div>
  );
}

function MuhrPanel({ muhr }) {
  if (!muhr) return null;
  const items = [
    { type: 'bronze', label: 'Bronza', color: '#b8893f' },
    { type: 'silver', label: 'Kumush', color: '#cbd5e1' },
    { type: 'gold', label: 'Tilla', color: '#ffd28e' },
  ];
  return (
    <div className="mb-8">
      <div className="eyebrow mb-3">— MUHR'LAR —</div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((it) => (
          <div
            key={it.type}
            className="p-4 border border-gold/20 bg-bg-mid/30 rounded-sm text-center"
          >
            <div className="font-serif text-2xl tabular-nums" style={{ color: it.color }}>
              {muhr[it.type] || 0}
            </div>
            <div className="text-cream-soft/60 text-[10px] tracking-[2px] uppercase mt-1">
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityList({ activity }) {
  if (!activity || activity.length === 0) return null;
  return (
    <div>
      <div className="eyebrow mb-3">— SO'NGGI HARAKATLAR —</div>
      <div className="space-y-2">
        {activity.slice(0, 8).map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between p-3 border border-gold/15 bg-bg-mid/20 rounded-sm text-sm"
          >
            <span className="text-cream-soft/80">{labelForActivity(a)}</span>
            <span className="text-cream-soft/40 text-[10px] tracking-[2px] uppercase">
              {timeAgo(a.at)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function labelForActivity(a) {
  switch (a.type) {
    case 'visit':
      return `Ko'rdi: ${SECTION_LABELS[a.payload?.section] || a.payload?.section || '?'}`;
    case 'quiz':
      return `Viktorina: ${a.payload?.score}/${a.payload?.total}${a.payload?.perfect ? ' • mukammal' : ''}`;
    case 'reading':
      return `Kitob o'qidi (${a.payload?.newPages || 0} sahifa)`;
    case 'muhr-earned':
      return `${a.payload?.kind || 'muhr'} muhr oldi`;
    case 'daily-completed':
      return `Kunlik vazifa bajardi (streak ${a.payload?.streak || 1})`;
    case 'comment-added':
      return 'Sharh qoldirdi';
    case 'shop-purchase':
      return 'Sotib oldi';
    default:
      return a.type;
  }
}

function timeAgo(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'hozir';
  if (m < 60) return `${m} daqiqa`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} soat`;
  const d = Math.floor(h / 24);
  return `${d} kun`;
}
