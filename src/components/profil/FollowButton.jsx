import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/api.js';
import useAuth from '../../hooks/useAuth.js';

// Optimistic follow / unfollow toggle.
//
//   - Renders nothing for guests (no API call would succeed anyway).
//   - Renders a disabled "Bu siz" placeholder when viewing your own profile.
//   - Otherwise toggles between "Follow" and "Following" with an optimistic
//     flip — the network call backs out the change if it fails.
//   - `onChange(nextFollowing)` lets the parent (UserProfilePage) update the
//     follower count without refetching.
export default function FollowButton({
  targetUid,
  initialFollowing,
  isSelf,
  size = 'md',
  onChange,
}) {
  const navigate = useNavigate();
  const { user, isGoogleUser } = useAuth();
  const [following, setFollowing] = useState(!!initialFollowing);
  const [busy, setBusy] = useState(false);

  if (isSelf) return null;

  const sizes = {
    sm: 'px-3 py-1 text-[10px] tracking-[2px]',
    md: 'px-4 py-1.5 text-[11px] tracking-[2px]',
    lg: 'px-5 py-2 text-xs tracking-[2px]',
  };
  const pad = sizes[size] || sizes.md;

  // Guest? Send them to the login page with a redirect back to this profile.
  if (!isGoogleUser || !user?.uid) {
    return (
      <button
        onClick={() => navigate(`/login?next=/foydalanuvchilar/${targetUid}`)}
        className={`${pad} border border-gold/40 text-cream hover:bg-gold hover:text-bg-deep rounded-full uppercase transition`}
      >
        Kuzatish uchun kiring
      </button>
    );
  }

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    const prev = following;
    setFollowing(!prev);
    onChange?.(!prev);
    try {
      await apiFetch(`/api/follow/${targetUid}`, {
        method: prev ? 'DELETE' : 'POST',
        auth: 'required',
      });
    } catch {
      // Rollback on failure so the UI stays accurate.
      setFollowing(prev);
      onChange?.(prev);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`${pad} rounded-full uppercase transition disabled:opacity-50 ${
        following
          ? 'border border-gold/40 text-cream-soft hover:border-crimson/60 hover:text-crimson'
          : 'bg-gold text-bg-deep hover:bg-gold/90 border border-gold'
      }`}
    >
      {following ? '✓ Kuzatilmoqda' : '+ Kuzatish'}
    </button>
  );
}
