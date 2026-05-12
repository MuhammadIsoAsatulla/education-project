import Hero from '../components/home/Hero.jsx';
import SectionsGrid from '../components/home/SectionsGrid.jsx';
import DailyFigure from '../components/home/DailyFigure.jsx';
import Stats from '../components/home/Stats.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function HomePage() {
  useScrollReveal();
  return (
    <>
      <Hero />
      <SectionsGrid />
      <DailyFigure />
      <Stats />
    </>
  );
}
