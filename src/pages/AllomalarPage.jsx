import allomalar from '../data/allomalar.json';
import AllomaCard from '../components/allomalar/AllomaCard.jsx';
import PageHero from '../components/common/PageHero.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function AllomalarPage() {
  useScrollReveal();
  return (
    <>
      <PageHero
        eyebrow="BUYUK AQL SOHIBLARI"
        title="Allomalar"
        description="Asrlardan oshib kelgan beshta aql sohibi. Har birining hayoti — bir kitob, asarlari — bir olam."
        accent
      />
      <section className="px-6 md:px-12 pb-32 max-w-[1400px] mx-auto -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allomalar.map((a, i) => (
            <AllomaCard key={a.id} alloma={a} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
