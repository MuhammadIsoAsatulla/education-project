import kitoblar from '../data/kitoblar.json';
import BookSpine from '../components/kitoblar/BookSpine.jsx';
import PageHero from '../components/common/PageHero.jsx';
import OrnamentDivider from '../components/common/OrnamentDivider.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';
import { Link } from 'react-router-dom';

export default function KitoblarPage() {
  useScrollReveal();

  // Split into shelves — fewer books per row on mobile.
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const perShelf = isMobile ? 3 : 4;
  const shelves = [];
  for (let i = 0; i < kitoblar.length; i += perShelf) {
    shelves.push(kitoblar.slice(i, i + perShelf));
  }

  return (
    <>
      <PageHero
        eyebrow="DONOLIK BOG'I"
        title="Kitoblar"
        description="Navoiy g'azallaridan zamonaviy nasrgacha — har sahifa bir olam, har kitob bir umr."
        accent
      />

      {/* Library shelves */}
      <section className="px-4 sm:px-6 md:px-12 pb-16 sm:pb-20 max-w-[1300px] mx-auto -mt-8">
        {shelves.map((shelf, idx) => (
          <div key={idx} className="mb-10 sm:mb-16 reveal" data-reveal-delay={idx * 100}>
            <div className="relative pt-6 sm:pt-10">
              {/* Books standing on shelf */}
              <div className="flex items-end justify-center gap-2 sm:gap-3 flex-wrap">
                {shelf.map((b, i) => (
                  <BookSpine key={b.id} book={b} index={i} height={i % 2 === 0 ? 360 : 320} />
                ))}
              </div>
              {/* Shelf board */}
              <div className="relative mt-1">
                <div className="h-2 sm:h-3 rounded-sm bg-gradient-to-b from-gold-deep via-gold to-gold-deep shadow-[0_8px_20px_rgba(0,0,0,0.5)]" />
                <div className="h-1.5 sm:h-2 bg-bg-deep" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Featured book section: a "book of the month" preview */}
      <FeaturedBook />
    </>
  );
}

function FeaturedBook() {
  const featured = kitoblar[0];
  return (
    <section className="px-6 md:px-12 py-20 border-t border-gold/10 reveal"
             style={{ background: `linear-gradient(180deg, transparent, ${featured.accent}1a, transparent)` }}>
      <div className="max-w-[1200px] mx-auto text-center">
        <OrnamentDivider className="opacity-60 mb-6" />
        <div className="eyebrow mb-3">— OY KITOBI —</div>
        <h2 className="section-title mb-3">Bugun O'qing</h2>
        <p className="font-serif italic text-cream-soft/80 max-w-xl mx-auto mb-10">
          Har oy biz bir asarni alohida diqqat bilan tanlaymiz va sizga taklif etamiz.
        </p>
      </div>
      <div className="max-w-[1100px] mx-auto grid lg:grid-cols-[300px_1fr] gap-12 items-center">
        <div className="mx-auto">
          <BookSpine book={featured} index={0} height={420} />
        </div>
        <div>
          <h3 className="font-serif text-cream text-3xl md:text-4xl mb-2">{featured.title}</h3>
          <p className="text-cream-soft/70 mb-4">— {featured.author} ({featured.year}) —</p>
          <p className="text-cream-soft text-lg leading-relaxed mb-6">{featured.annotation}</p>
          <Link to={`/kitoblar/${featured.slug}`} className="gold-cta">
            <span>Mutolaani boshlash</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
