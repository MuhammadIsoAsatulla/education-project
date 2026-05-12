import OrnamentDivider from './OrnamentDivider.jsx';

export default function Footer() {
  return (
    <footer className="bg-bg-deep border-t border-gold/20 px-6 md:px-12 pt-16 pb-10 text-center">
      <OrnamentDivider className="opacity-50 mb-8" />
      <p className="font-serif italic text-gold text-2xl tracking-wide mb-3">
        “O‘tmishini bilmagan — kelajakka eshikni topa olmaydi.”
      </p>
      <p className="text-cream-soft text-[13px] tracking-[3px] opacity-70 mb-10">— XALQ HIKMATI —</p>

      <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto text-left mb-12 px-2">
        <div>
          <h4 className="eyebrow mb-3">— MEROS —</h4>
          <p className="text-cream-soft/80 text-sm leading-relaxed">
            O‘zbek xalqining ma’naviy xazinasini zamonaviy tilda yangi avlodga yetkazish uchun yaratilgan
            raqamli ta’lim platformasi.
          </p>
        </div>
        <div>
          <h4 className="eyebrow mb-3">— BO‘LIMLAR —</h4>
          <ul className="text-cream-soft/80 text-sm space-y-2">
            <li>Allomalar</li>
            <li>Muzeylar</li>
            <li>Musiqa va Kinolar</li>
            <li>Kitoblar va Mening Ziyom</li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow mb-3">— ALOQA —</h4>
          <ul className="text-cream-soft/80 text-sm space-y-2">
            <li>Ta’lim muassasalari uchun</li>
            <li>Hamkorlik takliflari</li>
            <li>info@meros.uz</li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-gold/10 text-cream-soft/50 text-xs tracking-[2px]">
        MEROS © {new Date().getFullYear()} — Raqamli Madaniy Meros Platformasi
      </div>
    </footer>
  );
}
