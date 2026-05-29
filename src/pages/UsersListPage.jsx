import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import OrnamentDivider from '../components/common/OrnamentDivider.jsx';
import Avatar from '../components/profil/Avatar.jsx';
import { apiFetch, probeApi } from '../lib/api.js';

const DEBOUNCE_MS = 300;

export default function UsersListPage() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading');
  const debounceRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const ok = await probeApi();
      if (cancelled) return;
      if (!ok) {
        setStatus('offline');
        setUsers([]);
        return;
      }
      try {
        const data = await apiFetch(
          `/api/users?q=${encodeURIComponent(query)}&limit=40`,
          { auth: 'optional' },
        );
        if (cancelled) return;
        setUsers(data?.users || []);
        setStatus('ready');
      } catch {
        if (cancelled) return;
        setStatus('error');
      }
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <section className="relative min-h-screen px-4 py-16 sm:py-24">
      <div className="absolute inset-0 bg-girih opacity-20 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <OrnamentDivider className="opacity-60 mb-5" />
          <div className="eyebrow mb-3">— MEROS HAMJAMIYATI —</div>
          <h1
            className="font-serif text-gold-gradient leading-tight mb-3"
            style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}
          >
            Foydalanuvchilar
          </h1>
          <p className="font-serif italic text-cream-soft text-base">
            Boshqa sayohatchilarni kashf eting va kuzating
          </p>
        </div>

        <div className="mb-6">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ism yoki email bo'yicha qidiring…"
            className="w-full bg-bg-deep/60 border border-gold/30 focus:border-gold/80 rounded-sm px-4 py-3 text-cream font-serif outline-none transition placeholder:text-cream-soft/30"
          />
        </div>

        <UserList users={users} status={status} />
      </div>
    </section>
  );
}

function UserList({ users, status }) {
  const empty = useMemo(() => users.length === 0, [users]);
  if (status === 'offline') {
    return (
      <div className="p-6 border border-gold/25 bg-bg-deep/40 rounded-sm text-center text-cream-soft/70">
        Server hozirda mavjud emas. Iltimos, keyinroq qaytib keling.
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="p-6 border border-crimson/30 bg-crimson/5 rounded-sm text-center text-crimson/80">
        Foydalanuvchilarni yuklashda xato yuz berdi.
      </div>
    );
  }
  if (status === 'loading') {
    return (
      <div className="flex justify-center py-8 text-gold/70">
        <span className="w-5 h-5 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }
  if (empty) {
    return (
      <div className="p-6 border border-gold/25 bg-bg-deep/40 rounded-sm text-center text-cream-soft/70">
        Hech kim topilmadi.
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {users.map((u) => (
        <Link
          key={u.uid}
          to={`/foydalanuvchilar/${u.uid}`}
          className="flex items-center gap-3 p-3 border border-gold/15 hover:border-gold/40 bg-bg-mid/30 hover:bg-bg-mid/50 rounded-sm transition"
        >
          {u.picture ? (
            <img
              src={u.picture}
              alt={u.name}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover border border-gold/40 flex-shrink-0"
            />
          ) : (
            <Avatar avatarId="girih-1" initial={u.name?.charAt(0) || 'M'} size={44} />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-serif text-cream truncate font-medium">{u.name}</div>
            <div className="text-cream-soft/50 text-[10px] tracking-[2px] uppercase mt-0.5">
              {u.points} ball
            </div>
          </div>
          <span className="text-gold/70 text-xs tracking-[2px]">→</span>
        </Link>
      ))}
    </div>
  );
}
