import { Link } from 'react-router-dom';

const SECTION_PATHS = {
  allomalar: '/allomalar',
  muzeylar: '/muzeylar',
  musiqa: '/musiqa',
  kinolar: '/kinolar',
  kitoblar: '/kitoblar',
};

function relativeTime(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'hozirgina';
  if (diff < 3600) return `${Math.floor(diff / 60)} daq`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} kun`;
  return new Date(ts).toLocaleDateString('uz-UZ');
}

function ActivityRow({ activity }) {
  const { type, payload, at } = activity;
  let icon = '✦';
  let label = 'Faoliyat';
  let detail = '';
  let link = null;

  switch (type) {
    case 'visit':
      icon = '✦';
      label = 'Tashrif';
      detail = `${payload.section} bo'limidan kontent ko'rdingiz (+${payload.points} ball)`;
      link = SECTION_PATHS[payload.section];
      break;
    case 'quiz':
      icon = payload.perfect ? '🏆' : '✓';
      label = payload.perfect ? 'Mukammal viktorina!' : 'Viktorina';
      detail = `${payload.score}/${payload.total} natija`;
      break;
    case 'muhr-earned':
      icon = '●';
      label = 'Muhr olindi';
      detail = `${payload.amount} ${payload.kind} muhr`;
      break;
    case 'muhr-converted':
      icon = '⇆';
      label = 'Konversiya';
      detail = `${payload.to} muhrga aylantirildi`;
      break;
    case 'comment-added':
      icon = '✎';
      label = 'Sharh qoldirildi';
      detail = payload.contentKey;
      break;
    case 'daily-completed':
      icon = '☀';
      label = 'Kunlik vazifa bajarildi';
      detail = `Streak: ${payload.streak} kun`;
      break;
    case 'shop-purchase':
      icon = '✦';
      label = 'Sotib olindi';
      detail = `${payload.itemId} (${payload.amount} ${payload.type})`;
      break;
    default:
      detail = '';
  }

  const colorClass = type === 'quiz' && payload.perfect
    ? 'text-gold'
    : type === 'muhr-earned' || type === 'daily-completed'
    ? 'text-gold/90'
    : 'text-cream-soft';

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gold/10 last:border-b-0">
      <span className={`text-lg ${colorClass} flex-shrink-0 leading-none mt-0.5`}>{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="font-serif text-cream text-sm truncate">{label}</span>
          <span className="text-cream-soft/40 text-[10px] tracking-[1px] uppercase flex-shrink-0">
            {relativeTime(at)}
          </span>
        </div>
        {detail && (
          link ? (
            <Link to={link} className="text-cream-soft/60 text-xs hover:text-gold transition">
              {detail}
            </Link>
          ) : (
            <p className="text-cream-soft/60 text-xs truncate">{detail}</p>
          )
        )}
      </div>
    </div>
  );
}

export default function RecentActivity({ state }) {
  const activities = (state.recentActivity || []).slice(0, 10);

  if (activities.length === 0) {
    return (
      <p className="text-center font-serif italic text-cream-soft/60 py-6">
        Hali faoliyat yo'q. Bo'limlardan birini ochib boshlang!
      </p>
    );
  }

  return (
    <div className="rounded-sm border border-gold/20 bg-bg-mid/40 backdrop-blur p-4 sm:p-5">
      {activities.map((a) => (
        <ActivityRow key={a.id} activity={a} />
      ))}
    </div>
  );
}
