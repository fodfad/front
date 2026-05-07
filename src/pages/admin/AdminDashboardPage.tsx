import { AdminLayout } from '../../components/AdminLayout';
import { Users, Baby, FileCheck, TrendingUp, AlertCircle, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const stats = [
  { icon: Users, label: 'Total Parents', value: '248', trend: '+12', gradient: 'from-blue-500 to-cyan-500' },
  { icon: Baby, label: 'Total Enfants', value: '412', trend: '+28', gradient: 'from-emerald-500 to-teal-500' },
  { icon: FileCheck, label: 'Tests Complétés', value: '1,234', trend: '+156', gradient: 'from-violet-500 to-purple-500' },
  { icon: TrendingUp, label: 'Taux de Complétion', value: '87%', trend: '+5%', gradient: 'from-orange-500 to-pink-500' },
];

const riskData = [
  { name: 'Faible', value: 245, color: '#10B981' },
  { name: 'Moyen', value: 98, color: '#F59E0B' },
  { name: 'Élevé', value: 69, color: '#EF4444' },
];

const monthlyData = [
  { month: 'Jan', tests: 85, parents: 20 },
  { month: 'Fév', tests: 92, parents: 25 },
  { month: 'Mar', tests: 108, parents: 32 },
  { month: 'Avr', tests: 125, parents: 28 },
  { month: 'Mai', tests: 156, parents: 35 },
];

const recentActivities = [
  { type: 'success', icon: CheckCircle, message: 'Nouveau parent inscrit: Marie Dupont', time: 'Il y a 5 minutes', color: 'from-emerald-500 to-teal-500' },
  { type: 'warning', icon: AlertCircle, message: 'Enfant avec risque élevé détecté', time: 'Il y a 12 minutes', color: 'from-orange-500 to-amber-500' },
  { type: 'info', icon: FileCheck, message: '15 questionnaires complétés aujourd\'hui', time: 'Il y a 1 heure', color: 'from-blue-500 to-cyan-500' },
  { type: 'pending', icon: Clock, message: '3 plans personnalisés en attente', time: 'Il y a 2 heures', color: 'from-violet-500 to-purple-500' },
];

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-foreground mb-2 bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent inline-block">
          Tableau de bord Admin
        </h1>
        <p className="text-muted-foreground">Vue d'ensemble des activités et statistiques</p>
      </motion.div>

      {/* Statistics Cards */}
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
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-border/50 hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Tendances mensuelles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <defs>
                <linearGradient id="testsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="parentsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FB923C" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FB923C" stopOpacity={0} />
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
              <Line
                type="monotone"
                dataKey="tests"
                stroke="#F43F5E"
                strokeWidth={3}
                dot={{ fill: '#F43F5E', r: 5 }}
                name="Tests"
                fill="url(#testsGradient)"
              />
              <Line
                type="monotone"
                dataKey="parents"
                stroke="#FB923C"
                strokeWidth={3}
                dot={{ fill: '#FB923C', r: 5 }}
                name="Nouveaux parents"
                fill="url(#parentsGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Distribution des risques</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '1rem',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 mt-6">
            {riskData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
      >
        <h3 className="text-foreground mb-6">Activités récentes</h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-rose-50/50 hover:to-orange-50/50 transition-all group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground group-hover:text-rose-600 transition-colors">{activity.message}</p>
                  <p className="text-sm text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AdminLayout>
  );
}
