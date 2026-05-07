import { Layout } from '../components/Layout';
import { Users, TrendingUp, FileText, Activity, ArrowUpRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const stats = [
    { icon: Users, label: 'Nombre d\'enfants', value: '3', trend: '+2', gradient: 'from-blue-500 to-cyan-500' },
    { icon: FileText, label: 'Tests complétés', value: '12', trend: '+4', gradient: 'from-emerald-500 to-teal-500' },
    { icon: TrendingUp, label: 'Amélioration', value: '+15%', trend: '+5%', gradient: 'from-violet-500 to-purple-500' },
    { icon: Activity, label: 'Jours de suivi', value: '45', trend: '+12', gradient: 'from-orange-500 to-pink-500' },
  ];

  const recentTests = [
    { child: 'Emma', age: '3 ans', date: '2026-05-01', score: 12, risk: 'Faible', avatar: 'E' },
    { child: 'Lucas', age: '5 ans', date: '2026-04-28', score: 28, risk: 'Moyen', avatar: 'L' },
    { child: 'Sophie', age: '2 ans', date: '2026-04-25', score: 8, risk: 'Faible', avatar: 'S' },
  ];

  const recentActivity = [
    { action: 'Test M-CHAT complété pour Emma', time: 'Il y a 3 jours', color: 'from-emerald-500 to-teal-500' },
    { action: 'Suivi quotidien ajouté pour Lucas', time: 'Il y a 5 jours', color: 'from-blue-500 to-cyan-500' },
    { action: 'Nouvelle ressource consultée', time: 'Il y a 1 semaine', color: 'from-violet-500 to-purple-500' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-foreground mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground">Bienvenue ! Voici un aperçu de vos activités récentes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-border hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>{stat.trend}</span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <p className="text-3xl text-foreground">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

          <h3 className="text-foreground mb-6">Derniers résultats de tests</h3>
          <div className="space-y-4">
            {recentTests.map((test, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-2xl hover:shadow-lg transition-all group cursor-pointer border border-transparent hover:border-indigo-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    {test.avatar}
                  </div>
                  <div>
                    <div className="text-foreground">{test.child} ({test.age})</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {test.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-foreground mb-1">Score: {test.score}</div>
                  <div
                    className={`text-sm px-4 py-1.5 rounded-full inline-block shadow-sm ${
                      test.risk === 'Faible'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        : test.risk === 'Moyen'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                        : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                    }`}
                  >
                    {test.risk}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"></div>

          <h3 className="text-foreground mb-6">Activité récente</h3>
          <div className="space-y-5">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-foreground group-hover:text-indigo-600 transition-colors">{activity.action}</div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
