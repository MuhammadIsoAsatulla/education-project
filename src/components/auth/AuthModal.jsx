import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function AuthModal() {
  const { showAuth, closeAuth, signIn, signUp, signInWithGoogle } = useAuth();
  const [tab, setTab]       = useState('signin');
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);

  function reset() {
    setError(''); setDone(false); setName(''); setEmail(''); setPassword('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (tab === 'signin') {
        await signIn(email, password);
        closeAuth();
      } else {
        await signUp(email, password, name);
        setDone(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(''); setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function switchTab(t) { setTab(t); reset(); }

  return (
    <AnimatePresence>
      {showAuth && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: 'rgba(6,12,20,0.92)' }}
          onClick={closeAuth}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-sm border border-gold/20 overflow-hidden"
            style={{ background: 'var(--bg-mid, #0f1621)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-8 pt-8 pb-6 border-b border-gold/10"
              style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.06) 0%, transparent 100%)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="text-[10px] text-gold/50 tracking-[5px] uppercase">— MEROS —</div>
                <button
                  onClick={closeAuth}
                  className="w-7 h-7 flex items-center justify-center text-cream/30 hover:text-gold border border-white/10 hover:border-gold/30 rounded-sm transition-colors text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-6">
                {[['signin', 'Kirish'], ['signup', "Ro'yxatdan o'tish"]].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => switchTab(key)}
                    className={`font-serif text-xl pb-1 border-b-2 transition-all duration-200 ${
                      tab === key
                        ? 'text-gold border-gold'
                        : 'text-cream/40 border-transparent hover:text-cream/70'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-8 py-7">
              {done ? (
                <div className="text-center py-4">
                  <div className="text-emerald-400 text-2xl mb-3">✓</div>
                  <p className="font-serif text-cream text-lg mb-2">Tasdiqlash xati yuborildi</p>
                  <p className="text-cream/50 text-sm">Emailingizni tekshiring va havolani bosing.</p>
                  <button
                    onClick={() => { reset(); setTab('signin'); }}
                    className="mt-6 text-gold/60 hover:text-gold text-xs tracking-[2px] uppercase transition-colors"
                  >
                    Kirishga o'tish
                  </button>
                </div>
              ) : (
                <>
                  {/* Google */}
                  <button
                    onClick={handleGoogle}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 border border-white/10 hover:border-gold/30 text-cream/80 hover:text-cream text-sm tracking-wide transition-all duration-200 rounded-sm mb-6 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google bilan {tab === 'signin' ? 'kirish' : "ro'yxatdan o'tish"}
                  </button>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-cream/30 text-xs tracking-[2px]">YOKI</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {tab === 'signup' && (
                      <div>
                        <label className="block text-[10px] text-gold/60 tracking-[3px] uppercase mb-2">Ismingiz</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ismingizni kiriting"
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-gold/40 rounded-sm px-4 py-3 text-cream text-sm outline-none transition-colors placeholder:text-cream/20"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] text-gold/60 tracking-[3px] uppercase mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@manzil.com"
                        className="w-full bg-white/[0.03] border border-white/10 focus:border-gold/40 rounded-sm px-4 py-3 text-cream text-sm outline-none transition-colors placeholder:text-cream/20"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gold/60 tracking-[3px] uppercase mb-2">Parol</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/[0.03] border border-white/10 focus:border-gold/40 rounded-sm px-4 py-3 text-cream text-sm outline-none transition-colors placeholder:text-cream/20"
                      />
                    </div>

                    {error && (
                      <p className="text-red-400/80 text-xs border border-red-400/20 bg-red-400/5 rounded-sm px-3 py-2">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-1 w-full py-3 bg-gold/10 hover:bg-gold/20 border border-gold/30 hover:border-gold text-gold text-xs tracking-[3px] uppercase font-semibold transition-all duration-200 rounded-sm disabled:opacity-50"
                    >
                      {loading ? '...' : tab === 'signin' ? 'Kirish' : "Ro'yxatdan o'tish"}
                    </button>
                  </form>
                </>
              )}
            </div>

            <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
