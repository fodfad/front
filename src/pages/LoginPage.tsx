import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Sparkles, TrendingUp, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../api/apiClient';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ── Connexion avec Spring Boot
      const res = await apiClient.post('/auth/login', {
        email,
        motDePasse: password,
      });

      const user = res.data;

      // ── Sauvegarde des données dans le localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', String(user.id));
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('role', user.role.toLowerCase());

      // ── Redirection selon le rôle
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (err: any) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-300 to-blue-100 opacity-90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(45,125,210,0.3),rgba(255,255,255,0))]"></div>

      {/* Left side */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center p-12 relative z-10"
      >
        <div className="max-w-lg text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-40 h-40 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/20"
          >
            <Sparkles className="w-20 h-20 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl mb-4 text-white"
          >
            AutiGuide
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-white/90 leading-relaxed mb-12"
          >
            Détection précoce et suivi personnalisé du développement de votre enfant
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <Users className="w-8 h-8 text-white mb-2 mx-auto" />
              <div className="text-3xl mb-1">1000+</div>
              <div className="text-sm text-white/80">Familles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <TrendingUp className="w-8 h-8 text-white mb-2 mx-auto" />
              <div className="text-3xl mb-1">95%</div>
              <div className="text-sm text-white/80">Satisfaction</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <Shield className="w-8 h-8 text-white mb-2 mx-auto" />
              <div className="text-3xl mb-1">24/7</div>
              <div className="text-sm text-white/80">Support</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Login form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center p-12 relative z-10"
      >
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/20">
            <div className="mb-8">
              <h2 className="text-foreground mb-2">Bienvenue 👋</h2>
              <p className="text-muted-foreground">Connectez-vous pour continuer</p>
            </div>

            {/* ── Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block mb-2 text-foreground text-sm">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-foreground text-sm">
                  Mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-border accent-primary" />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    Se souvenir
                  </span>
                </label>
                <a href="#" className="text-primary hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>

              {/* ── Submit button avec loading */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-600 text-white py-4 rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Connexion...
                  </span>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}