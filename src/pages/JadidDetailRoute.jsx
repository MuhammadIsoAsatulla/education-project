import AllomaDetailPage from './AllomaDetailPage.jsx';
import jadidlarData from '../data/jadidlar.json';

// Thin wrapper so the lazy-import boundary covers both the page module and
// the jadidlar data file in a single chunk. Keeps App.jsx clean.
export default function JadidDetailRoute() {
  return (
    <AllomaDetailPage
      source={jadidlarData}
      section="jadidlar"
      basePath="/jadidlar"
      notFoundTitle="Jadid topilmadi"
      listLabel="Jadidlar ro'yxati"
      siblingsLabel="— BOSHQA JADIDLAR —"
      achievement="jadid-do-st"
    />
  );
}
