import { AdminLayout } from '../../components/AdminLayout';
import { User, Bell, Shield, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-foreground mb-2 bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent inline-block">
          Paramètres
        </h1>
        <p className="text-muted-foreground">Gérer votre profil et préférences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-foreground text-xl">Profil</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground mb-2">Nom complet</label>
                <input
                  type="text"
                  defaultValue="Admin User"
                  className="w-full px-5 py-4 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="admin@autiguide.com"
                  className="w-full px-5 py-4 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                />
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-foreground text-xl">Notifications</h3>
            </div>

            <div className="space-y-4">
              {['Nouveaux parents', 'Résultats à risque élevé', 'Tests complétés'].map((item, index) => (
                <label key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-border cursor-pointer hover:bg-white transition-all">
                  <span className="text-foreground">{item}</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-rose-500" />
                </label>
              ))}
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-foreground text-xl">Sécurité</h3>
            </div>

            <button className="w-full px-6 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              Changer le mot de passe
            </button>
          </motion.div>
        </div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50 h-fit"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-foreground text-xl">Apparence</h3>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Clair', gradient: 'from-gray-100 to-gray-200' },
              { name: 'Sombre', gradient: 'from-gray-800 to-gray-900' },
            ].map((theme, index) => (
              <label key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-border cursor-pointer hover:bg-white transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.gradient}`}></div>
                  <span className="text-foreground">{theme.name}</span>
                </div>
                <input type="radio" name="theme" defaultChecked={index === 0} className="w-5 h-5 accent-rose-500" />
              </label>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
