import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';

import HomePage from './pages/HomePage.jsx';
import AllomalarPage from './pages/AllomalarPage.jsx';
import AllomaDetailPage from './pages/AllomaDetailPage.jsx';
import MuzeylarPage from './pages/MuzeylarPage.jsx';
import MuzeyDetailPage from './pages/MuzeyDetailPage.jsx';
import MusiqaPage from './pages/MusiqaPage.jsx';
import KinolarPage from './pages/KinolarPage.jsx';
import KinoDetailPage from './pages/KinoDetailPage.jsx';
import KitoblarPage from './pages/KitoblarPage.jsx';
import KitobDetailPage from './pages/KitobDetailPage.jsx';
import ProfilPage from './pages/ProfilPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/allomalar" element={<AllomalarPage />} />
          <Route path="/allomalar/:slug" element={<AllomaDetailPage />} />
          <Route path="/muzeylar" element={<MuzeylarPage />} />
          <Route path="/muzeylar/:slug" element={<MuzeyDetailPage />} />
          <Route path="/musiqa" element={<MusiqaPage />} />
          <Route path="/kinolar" element={<KinolarPage />} />
          <Route path="/kinolar/:slug" element={<KinoDetailPage />} />
          <Route path="/kitoblar" element={<KitoblarPage />} />
          <Route path="/kitoblar/:slug" element={<KitobDetailPage />} />
          <Route path="/profil" element={<ProfilPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
