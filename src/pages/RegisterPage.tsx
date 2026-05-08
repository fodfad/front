import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Sparkles, TrendingUp, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    // Simulation de création de compte
    // Dans un vrai projet, on enverrait les données au backend
    alert('Compte créé avec succès !');
    localStorage.setItem('role', 'parent');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      {/* Left side - Illustration */}
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
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <Users className="w-8 h-8 text-white mb-2 mx-auto" />
              <div className="text-3xl mb-1 font-semibold">1000+</div>
              <div className="text-sm text-white/80">Familles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <TrendingUp className="w-8 h-8 text-white mb-2 mx-auto" />
              <div className="text-3xl mb-1 font-semibold">95%</div>
              <div className="text-sm text-white/80">Progression</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <Shield className="w-8 h-8 text-white mb-2 mx-auto" />
              <div className="text-3xl mb-1 font-semibold">100%</div>
              <div className="text-sm text-white/80">Sécurisé</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Register form with glassmorphism */}
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

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-foreground text-sm font-medium">
                  Nom complet
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
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

              <div>
                <label htmlFor="email" className="block mb-2 text-foreground text-sm font-medium">
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
                <label htmlFor="password" className="block mb-2 text-foreground text-sm font-medium">
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

              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-foreground text-sm font-medium">
                  Confirmer le mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
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

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all shadow-lg font-medium text-lg"
                >
                  S'inscrire
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
