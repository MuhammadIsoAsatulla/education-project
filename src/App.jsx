import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import useProgress from './hooks/useProgress.js';

// HomePage stays eager — it's the landing page, any "loading…" flash here
// would feel like a broken first impression.
import HomePage from './pages/HomePage.jsx';

// Every other route is code-split: its JS only downloads when the user
// actually navigates to it. This drops the first-paint bundle by ~60%,
// which matters on phone networks and on the Russian VPS where round-trip
// time to the user adds up. The chunks are aggressively cached via the
// content-hashed filenames Vite already produces.
const AllomalarPage = lazy(() => import('./pages/AllomalarPage.jsx'));
const AllomaDetailPage = lazy(() => import('./pages/AllomaDetailPage.jsx'));
const JadidlarPage = lazy(() => import('./pages/JadidlarPage.jsx'));
const MuzeylarPage = lazy(() => import('./pages/MuzeylarPage.jsx'));
const MuzeyDetailPage = lazy(() => import('./pages/MuzeyDetailPage.jsx'));
const MusiqaPage = lazy(() => import('./pages/MusiqaPage.jsx'));
const MusiqaDetailPage = lazy(() => import('./pages/MusiqaDetailPage.jsx'));
const KinolarPage = lazy(() => import('./pages/KinolarPage.jsx'));
const KinoDetailPage = lazy(() => import('./pages/KinoDetailPage.jsx'));
const KitoblarPage = lazy(() => import('./pages/KitoblarPage.jsx'));
const KitobDetailPage = lazy(() => import('./pages/KitobDetailPage.jsx'));
const ProfilPage = lazy(() => import('./pages/ProfilPage.jsx'));
const CommentsPage = lazy(() => import('./pages/CommentsPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const UsersListPage = lazy(() => import('./pages/UsersListPage.jsx'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// jadidlar.json is ~30 KB — small enough to share the AllomaDetailPage chunk
// rather than spinning up its own loader. Lazy via a dedicated route module.
const JadidDetailRoute = lazy(() => import('./pages/JadidDetailRoute.jsx'));

// Minimal loading state shown while a route's chunk is being fetched. Kept
// intentionally light — a quick spinner with the site's gold palette so
// it never feels off-brand. Most chunk loads on a warm cache are <50ms,
// so users barely see this on second-and-later navigations.
function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="flex items-center gap-3 text-gold/70">
        <span className="w-5 h-5 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
        <span className="font-serif italic text-cream-soft/70 text-sm tracking-wide">
          Yuklanmoqda…
        </span>
      </div>
    </div>
  );
}

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
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/allomalar" element={<AllomalarPage />} />
            <Route path="/allomalar/:slug" element={<AllomaDetailPage />} />
            <Route path="/jadidlar" element={<JadidlarPage />} />
            <Route path="/jadidlar/:slug" element={<JadidDetailRoute />} />
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
            <Route path="/foydalanuvchilar" element={<UsersListPage />} />
            <Route path="/foydalanuvchilar/:uid" element={<UserProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      {!isAuthRoute && <Footer />}
    </>
  );
}
