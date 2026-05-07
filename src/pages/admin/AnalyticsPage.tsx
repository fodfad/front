import { AdminLayout } from '../../components/AdminLayout';
import { TrendingUp, Users, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const performanceData = [
  { month: 'Jan', faible: 45, moyen: 18, eleve: 12 },
  { month: 'Fév', faible: 52, moyen: 20, eleve: 14 },
  { month: 'Mar', faible: 61, moyen: 22, eleve: 15 },
  { month: 'Avr', faible: 73, moyen: 25, eleve: 16 },
  { month: 'Mai', faible: 85, moyen: 28, eleve: 18 },
];

const progressData = [
  { week: 'S1', avg: 6.2 },
  { week: 'S2', avg: 6.5 },
  { week: 'S3', avg: 6.8 },
  { week: 'S4', avg: 7.1 },
  { week: 'S5', avg: 7.4 },
];

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-foreground mb-2 bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent inline-block">
          Résultats & Analytics
        </h1>
        <p className="text-muted-foreground">Analyses approfondies des résultats et tendances</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: TrendingUp, label: 'Score moyen', value: '7.2/10', gradient: 'from-blue-500 to-cyan-500' },
          { icon: Users, label: 'Enfants suivis', value: '412', gradient: 'from-emerald-500 to-teal-500' },
          { icon: Target, label: 'Amélioration', value: '+12%', gradient: 'from-violet-500 to-purple-600' },
          { icon: Award, label: 'Taux de réussite', value: '89%', gradient: 'from-orange-500 to-pink-500' },
        ].map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-border/50"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-lg mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-muted-foreground text-sm mb-1">{kpi.label}</p>
              <p className="text-3xl text-foreground">{kpi.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Distribution des niveaux de risque</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <defs>
                <linearGradient id="faible" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
                <linearGradient id="moyen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
                <linearGradient id="eleve" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#F43F5E" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '1rem',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Bar dataKey="faible" fill="url(#faible)" radius={[8, 8, 0, 0]} name="Faible" />
              <Bar dataKey="moyen" fill="url(#moyen)" radius={[8, 8, 0, 0]} name="Moyen" />
              <Bar dataKey="eleve" fill="url(#eleve)" radius={[8, 8, 0, 0]} name="Élevé" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Évolution des scores moyens</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="week" stroke="#64748B" />
              <YAxis stroke="#64748B" domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '1rem',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="avg"
                stroke="#8B5CF6"
                strokeWidth={3}
                fill="url(#progressGradient)"
                name="Score moyen"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
