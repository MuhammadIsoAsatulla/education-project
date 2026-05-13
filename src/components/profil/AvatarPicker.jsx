import avatars from '../../data/avatars.json';
import Avatar from './Avatar.jsx';

export default function AvatarPicker({ currentId, initial, onSelect, onClose }) {
  return (
    <div className="mt-6 p-5 sm:p-6 rounded-sm border border-gold/30 bg-bg-deep/70 backdrop-blur">
      <div className="flex items-center justify-between mb-5">
        <div className="eyebrow text-xs">— AVATAR TANLASH —</div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gold/60 hover:text-gold text-xs tracking-[2px] uppercase"
          >
            Yopish
          </button>
        )}
      </div>
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {avatars.map((a) => {
          const selected = a.id === currentId;
          return (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              className="group flex flex-col items-center gap-2 outline-none"
              aria-label={a.label}
            >
              <div className={`transition-transform duration-300 ${selected ? 'scale-110' : 'group-hover:scale-105'}`}>
                <Avatar avatarId={a.id} initial={initial} size={56} className={selected ? 'ring-2 ring-gold ring-offset-2 ring-offset-bg-deep' : ''} />
              </div>
              <span
                className={`text-[10px] tracking-[2px] uppercase transition-colors ${
                  selected ? 'text-gold' : 'text-cream-soft/70 group-hover:text-cream'
                }`}
              >
                {a.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
