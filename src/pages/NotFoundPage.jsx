import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="font-serif text-gold-gradient text-[160px] leading-none">404</div>
      <h1 className="font-serif text-cream text-3xl mb-4">Yo‘l topilmadi</h1>
      <p className="text-cream-soft/70 mb-8 max-w-md">
        Bu manzilda hech qanday meros saqlanmagan. Bosh sahifaga qaytib, sayohatni boshlash mumkin.
      </p>
      <Link to="/" className="gold-cta">
        <span>Bosh Sahifa</span>
      </Link>
    </section>
  );
}
