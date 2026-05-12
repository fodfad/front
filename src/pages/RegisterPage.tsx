import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Sparkles, TrendingUp, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../api/apiClient';

export default function RegisterPage() {
  const navigate = useNavigate();

  // État du formulaire
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // États pour gérer les erreurs et le chargement
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Vérification que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      // Séparation du nom complet en nom et prénom
      const parts = name.trim().split(' ');
      const prenom = parts[0] || '';
      const nom = parts.slice(1).join(' ') || prenom;

      // Appel API vers Spring Boot POST /api/auth/register
      const res = await apiClient.post('/auth/register', {
        nom,
        prenom,
        email,
        motDePasse: password,
        telephone: '',
      });

      const user = res.data;

      // Sauvegarde des informations utilisateur dans localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', String(user.id));
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('role', user.role.toLowerCase());

      // Redirection vers le tableau de bord parent
      navigate('/dashboard');

    } catch (err: any) {
      // Gestion des erreurs retournées par le backend
      const message = err.response?.data?.message || 'Erreur lors de l\'inscription';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-300 to-blue-100 opacity-90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(45,125,210,0.3),rgba(255,255,255,0))]"></div>

      {/* Côté gauche - Illustration */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center p-12 relative z-10 hidden lg:flex"
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
            className="text-5xl mb-4 text-white font-bold"
          >
            Rejoignez AutiGuide
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-white/90 leading-relaxed mb-12"
          >
            Créez votre compte pour commencer le suivi personnalisé de votre enfant
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { icon: Users, value: '1000+', label: 'Familles' },
              { icon: TrendingUp, value: '95%', label: 'Progression' },
              { icon: Shield, value: '100%', label: 'Sécurisé' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <item.icon className="w-8 h-8 text-white mb-2 mx-auto" />
                <div className="text-3xl mb-1 font-semibold">{item.value}</div>
                <div className="text-sm text-white/80">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Côté droit - Formulaire d'inscription */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center p-8 lg:p-12 relative z-10 w-full"
      >
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-2xl p-8 lg:p-10 rounded-3xl shadow-2xl border border-white/20">
            <div className="mb-8">
              <h2 className="text-foreground text-3xl font-bold mb-2">Créer un compte</h2>
              <p className="text-muted-foreground">Inscrivez-vous en tant que parent</p>
            </div>

            {/* Affichage des erreurs */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Champ Nom complet */}
              <div>
                <label htmlFor="name" className="block mb-2 text-foreground text-sm font-medium">
                  Nom complet
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* Champ Email */}
              <div>
                <label htmlFor="email" className="block mb-2 text-foreground text-sm font-medium">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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

              {/* Champ Mot de passe */}
              <div>
                <label htmlFor="password" className="block mb-2 text-foreground text-sm font-medium">
                  Mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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

              {/* Champ Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-foreground text-sm font-medium">
                  Confirmer le mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* Bouton d'inscription avec état de chargement */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-600 text-white py-4 rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all shadow-lg font-medium text-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Inscription en cours...
                    </span>
                  ) : (
                    "S'inscrire"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}