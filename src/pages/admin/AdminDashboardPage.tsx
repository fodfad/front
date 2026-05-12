import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Users, Baby, FileCheck, TrendingUp, AlertCircle, CheckCircle, Clock, ArrowUpRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import apiClient from '../../api/apiClient';

export default function AdminDashboardPage() {
  const [totalParents, setTotalParents] = useState(0);
  const [totalEnfants, setTotalEnfants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [riskData, setRiskData] = useState([
    { name: 'Faible', value: 0, color: '#10B981' },
    { name: 'Moyen', value: 0, color: '#F59E0B' },
    { name: 'Élevé', value: 0, color: '#EF4444' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Charger les parents
        const parentsRes = await apiClient.get('/parents');
        const parents = parentsRes.data;
        setTotalParents(parents.length);

        // Charger les enfants
        const enfantsRes = await apiClient.get('/enfants/all').catch(() => ({ data: [] }));
        let allEnfants: any[] = enfantsRes.data;

        // Si /enfants/all n'existe pas, charger par parent
        if (!allEnfants.length && parents.length > 0) {
          const enfantsPromises = parents.map((p: any) =>
            apiClient.get(`/enfants/parent/${p.id}`).then(r => r.data).catch(() => [])
          );
          const results = await Promise.all(enfantsPromises);
          allEnfants = results.flat();
        }
        setTotalEnfants(allEnfants.length);

        // Charger les résultats pour la distribution des risques
        const risques = { FAIBLE: 0, MOYEN: 0, ELEVE: 0 };
        for (const enfant of allEnfants.slice(0, 20)) {
          try {
            const r = await apiClient.get(`/resultat/enfant/${enfant.id}`);
            if (Array.isArray(r.data)) {
              r.data.forEach((res: any) => {
                const niveau = res.niveauRisque?.toUpperCase();
                if (niveau === 'FAIBLE') risques.FAIBLE++;
                else if (niveau === 'MOYEN') risques.MOYEN++;
                else if (niveau === 'ELEVE' || niveau === 'ÉLEVÉ') risques.ELEVE++;
              });
            }
          } catch {}
        }
        setRiskData([
          { name: 'Faible', value: risques.FAIBLE, color: '#10B981' },
          { name: 'Moyen', value: risques.MOYEN, color: '#F59E0B' },
          { name: 'Élevé', value: risques.ELEVE, color: '#EF4444' },
        ]);
      } catch (err) {
        console.error('Erreur chargement stats admin:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { icon: Users, label: 'Total Parents', value: loading ? '...' : String(totalParents), trend: `+${totalParents}`, gradient: 'from-blue-500 to-cyan-500' },
    { icon: Baby, label: 'Total Enfants', value: loading ? '...' : String(totalEnfants), trend: `+${totalEnfants}`, gradient: 'from-emerald-500 to-teal-500' },
    { icon: FileCheck, label: 'Tests Complétés', value: loading ? '...' : String(riskData.reduce((s, r) => s + r.value, 0)), trend: '', gradient: 'from-violet-500 to-purple-500' },
    { icon: TrendingUp, label: 'Taux de Complétion', value: '—', trend: '', gradient: 'from-orange-500 to-pink-500' },
  ];

  const recentActivities = [
    { type: 'success', icon: CheckCircle, message: `${totalParents} parents inscrits au total`, time: 'Données en temps réel', color: 'from-emerald-500 to-teal-500' },
    { type: 'info', icon: Baby, message: `${totalEnfants} enfants enregistrés`, time: 'Données en temps réel', color: 'from-blue-500 to-cyan-500' },
    { type: 'warning', icon: AlertCircle, message: `${riskData[2].value} enfants avec risque élevé détectés`, time: 'Données en temps réel', color: 'from-orange-500 to-amber-500' },
    { type: 'pending', icon: Clock, message: `${riskData[1].value} enfants avec risque moyen`, time: 'Données en temps réel', color: 'from-violet-500 to-purple-500' },
  ];

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-foreground mb-2 text-sky-600 inline-block">
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
                  {stat.trend && (
                    <div className="flex items-center gap-1 text-emerald-500 text-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>{stat.trend}</span>
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                {loading ? (
                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                ) : (
                  <p className="text-3xl text-foreground">{stat.value}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Placeholder chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Résumé des inscriptions</h3>
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <div className="text-center">
              <Users className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
              <p className="text-lg">{totalParents} parents · {totalEnfants} enfants</p>
              <p className="text-sm mt-2">Données chargées depuis le backend</p>
            </div>
          </div>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Distribution des risques</h3>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
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
              <div className="space-y-3 mt-4">
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
            </>
          )}
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
                  <p className="text-foreground group-hover:text-sky-600 transition-colors">{activity.message}</p>
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
