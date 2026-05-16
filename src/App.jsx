import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import useProgress from './hooks/useProgress.js';

import HomePage from './pages/HomePage.jsx';
import AllomalarPage from './pages/AllomalarPage.jsx';
import AllomaDetailPage from './pages/AllomaDetailPage.jsx';
import MuzeylarPage from './pages/MuzeylarPage.jsx';
import MuzeyDetailPage from './pages/MuzeyDetailPage.jsx';
import MusiqaPage from './pages/MusiqaPage.jsx';
import MusiqaDetailPage from './pages/MusiqaDetailPage.jsx';
import KinolarPage from './pages/KinolarPage.jsx';
import KinoDetailPage from './pages/KinoDetailPage.jsx';
import KitoblarPage from './pages/KitoblarPage.jsx';
import KitobDetailPage from './pages/KitobDetailPage.jsx';
import ProfilPage from './pages/ProfilPage.jsx';
import CommentsPage from './pages/CommentsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  const { tickStreak } = useProgress();
  const { pathname } = useLocation();
  // Login is a full-screen experience — hide global nav/footer chrome there.
  const isAuthRoute = pathname === '/login';

  useEffect(() => {
    tickStreak();
  }, [tickStreak]);

  return (
    <>
      <ScrollToTop />
      {!isAuthRoute && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/allomalar" element={<AllomalarPage />} />
          <Route path="/allomalar/:slug" element={<AllomaDetailPage />} />
          <Route path="/muzeylar" element={<MuzeylarPage />} />
          <Route path="/muzeylar/:slug" element={<MuzeyDetailPage />} />
          <Route path="/musiqa" element={<MusiqaPage />} />
          <Route path="/musiqa/:slug" element={<MusiqaDetailPage />} />
          <Route path="/kinolar" element={<KinolarPage />} />
          <Route path="/kinolar/:slug" element={<KinoDetailPage />} />
          <Route path="/kitoblar" element={<KitoblarPage />} />
          <Route path="/kitoblar/:slug" element={<KitobDetailPage />} />
          <Route path="/profil" element={<ProfilPage />} />
          <Route path="/sharhlar/:type/:id" element={<CommentsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAuthRoute && <Footer />}
    </>
  );
}
