/**
 * Footer. Two columns — brand mission + contact. No section-nav duplication
 * (the navbar already carries that).
 *
 * Contact channels are deliberately limited to what we'll actually run:
 *   - Telegram news channel (one-way updates from us)
 *   - Telegram support bot (two-way support, runs on the same VPS as the API)
 *   - Email (manual fallback for institutional / partnership inquiries)
 *
 * Each placeholder is `href="#"` until the channel exists. The bot URL will
 * be `https://t.me/<bot-username>` once we register it with @BotFather and
 * deploy the bot as a systemd service alongside meros-api.
 */

const CONTACTS = [
  {
    label: 'Yangiliklar kanali',
    hint: '@meros_website',
    href: 'https://t.me/meros_website',
    icon: <TelegramIcon />,
  },
  {
    label: 'Yordam boti',
    hint: '@meros_yordam_bot',
    href: 'https://t.me/meros_yordam_bot',
    icon: <BotIcon />,
  },
  {
    label: 'hello@meros.website',
    hint: 'Maktab va hamkorlik takliflari',
    href: 'mailto:hello@meros.website',
    icon: <MailIcon />,
  },
];

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M21.5 4.5 18.7 18.8c-.2 1-.8 1.2-1.6.7l-4.4-3.3-2.1 2c-.2.2-.4.4-.9.4l.3-4.6 8.3-7.5c.4-.3-.1-.5-.6-.2l-10.2 6.4-4.4-1.4c-1-.3-1-.9.2-1.4l17.2-6.6c.8-.3 1.5.2 1.2 1.2z" />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" aria-hidden="true">
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <circle cx="9" cy="14" r="1.2" fill="currentColor" />
      <circle cx="15" cy="14" r="1.2" fill="currentColor" />
      <path d="M12 4v4M10 4h4" />
      <path d="M2 14h2M20 14h2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 7 9-7" />
    </svg>
  );
}

function ColumnHeading({ children }) {
  return (
    <h4 className="text-gold/75 text-[10px] tracking-[4.5px] uppercase font-medium mb-4">
      {children}
    </h4>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] px-4 sm:px-6 md:px-12 pt-16 sm:pt-20 pb-8 text-center">
      {/* Quote */}
      <span aria-hidden="true" className="block mx-auto w-12 h-px bg-gold/40 mb-6" />
      <p
        className="font-serif text-cream/90 mb-3 max-w-3xl mx-auto"
        style={{ fontSize: 'clamp(18px, 2vw, 26px)', lineHeight: 1.35 }}
      >
        “O'tmishini bilmagan — kelajakka eshikni topa olmaydi.”
      </p>
      <p className="text-cream-soft/55 text-[10px] tracking-[4.5px] uppercase font-medium mb-14">
        Xalq Hikmati
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 md:gap-16 max-w-4xl mx-auto text-left mb-12 px-2">
        <div>
          <ColumnHeading>Meros</ColumnHeading>
          <p className="text-cream-soft/75 text-[14px] leading-relaxed max-w-md">
            O'zbek xalqining ma'naviy xazinasini zamonaviy tilda yangi avlodga yetkazish uchun
            yaratilgan raqamli ta'lim platformasi. Allomalardan jadidlarga, muzeylardan musiqaga —
            yetti hazina bir joyda.
          </p>
        </div>

        <div>
          <ColumnHeading>Aloqa</ColumnHeading>
          {/* Horizontal row of contact pills — icon + label, single line each.
              Wraps to a second line on narrow screens. Hints (e.g. @handle)
              show in the native tooltip so they're still discoverable. */}
          <ul className="flex flex-wrap gap-2.5">
            {CONTACTS.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  title={c.hint || c.label}
                  className="group inline-flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full border border-white/[0.08] hover:border-gold/40 transition-colors"
                >
                  <span className="w-7 h-7 inline-flex items-center justify-center rounded-full text-cream-soft/70 group-hover:text-gold-bright transition-colors flex-shrink-0">
                    {c.icon}
                  </span>
                  <span className="text-cream-soft/85 group-hover:text-gold-bright text-[13.5px] transition-colors">
                    {c.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-white/[0.05] text-cream-soft/40 text-[11px] tracking-[2px]">
        MEROS © {new Date().getFullYear()} · Raqamli Madaniy Meros Platformasi
      </div>
    </footer>
  );
}
