import muzeylar from '../data/muzeylar.json';
import MuseumCard from '../components/muzeylar/MuseumCard.jsx';
import PageHero from '../components/common/PageHero.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function MuzeylarPage() {
  useScrollReveal();
  return (
    <>
      <PageHero
        eyebrow="VIRTUAL SAYOHAT"
        title="Muzeylar"
        description="Registon maydonidan Ichan Qal'agacha — tarixiy yodgorliklarni 360° rejimda kashf eting."
        accent
      />
      <section className="px-6 md:px-12 pb-32 max-w-[1400px] mx-auto -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {muzeylar.map((m, i) => (
            <MuseumCard key={m.id} muzey={m} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
