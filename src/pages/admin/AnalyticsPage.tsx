import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { TrendingUp, Users, Target, Award, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import apiClient from '../../api/apiClient';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnfants: 0,
    totalTests: 0,
    scoreMoyen: 0,
    faible: 0,
    moyen: 0,
    eleve: 0,
  });
  const [evolutionData, setEvolutionData] = useState<any[]>([]);

  useEffect(() => {
    chargerAnalytics();
  }, []);

  const chargerAnalytics = async () => {
    try {
      // 1. Charger tous les parents → enfants
      const parentsRes = await apiClient.get('/parents');
      const parents = parentsRes.data;

      let tousEnfants: any[] = [];
      for (const parent of parents) {
        try {
          const enfantsRes = await apiClient.get(`/enfants/parent/${parent.id}`);
          tousEnfants = [...tousEnfants, ...enfantsRes.data];
        } catch { }
      }

      // 2. Charger tous les résultats
      let tousResultats: any[] = [];
      for (const enfant of tousEnfants) {
        try {
          const resRes = await apiClient.get(`/resultat/enfant/${enfant.id}`);
          if (Array.isArray(resRes.data)) {
            tousResultats = [...tousResultats, ...resRes.data];
          }
        } catch { }
      }

      // 3. Calculer les statistiques
      const faible = tousResultats.filter(r => r.niveauRisque === 'FAIBLE').length;
      const moyen = tousResultats.filter(r => r.niveauRisque === 'MOYEN').length;
      const eleve = tousResultats.filter(r => r.niveauRisque === 'ELEVE').length;
      const scoreMoyen = tousResultats.length > 0
        ? Math.round(tousResultats.reduce((s, r) => s + r.score, 0) / tousResultats.length * 10) / 10
        : 0;

      setStats({
        totalEnfants: tousEnfants.length,
        totalTests: tousResultats.length,
        scoreMoyen,
        faible, moyen, eleve,
      });

      // 4. Données d'évolution par date (grouper par mois)
      const parMois: Record<string, { faible: number; moyen: number; eleve: number }> = {};
      tousResultats.forEach(r => {
        const mois = r.dateEvaluation?.substring(0, 7) || 'Inconnu';
        if (!parMois[mois]) parMois[mois] = { faible: 0, moyen: 0, eleve: 0 };
        if (r.niveauRisque === 'FAIBLE') parMois[mois].faible++;
        else if (r.niveauRisque === 'MOYEN') parMois[mois].moyen++;
        else parMois[mois].eleve++;
      });

      const evolution = Object.entries(parMois)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([mois, data]) => ({ mois, ...data }));

      setEvolutionData(evolution.length > 0 ? evolution : [
        { mois: 'Aucune donnée', faible: 0, moyen: 0, eleve: 0 }
      ]);

    } catch (err) {
      console.error('Erreur analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: 'Faible', value: stats.faible, color: '#10B981' },
    { name: 'Moyen', value: stats.moyen, color: '#F59E0B' },
    { name: 'Élevé', value: stats.eleve, color: '#EF4444' },
  ].filter(d => d.value > 0);

  const kpis = [
    { icon: TrendingUp, label: 'Score moyen', value: `${stats.scoreMoyen}`, gradient: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Enfants suivis', value: String(stats.totalEnfants), gradient: 'from-emerald-500 to-teal-500' },
    { icon: Target, label: 'Tests effectués', value: String(stats.totalTests), gradient: 'from-violet-500 to-purple-600' },
    { icon: Award, label: 'Risque faible', value: `${stats.faible}`, gradient: 'from-orange-500 to-pink-500' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-foreground mb-2 text-sky-600 inline-block">
          Résultats & Analytics
        </h1>
        <p className="text-muted-foreground">Analyses basées sur les données réelles de la base de données</p>
      </motion.div>

      {/* KPIs réels */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => {
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
              <p className="text-3xl text-foreground font-semibold">{kpi.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Distribution des risques — données réelles */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Distribution des niveaux de risque par mois</h3>
          {evolutionData.length === 0 || evolutionData[0].mois === 'Aucune donnée' ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              Aucune donnée disponible
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="mois" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="faible" fill="#10B981" radius={[6, 6, 0, 0]} name="Faible" />
                <Bar dataKey="moyen" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Moyen" />
                <Bar dataKey="eleve" fill="#EF4444" radius={[6, 6, 0, 0]} name="Élevé" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Pie chart répartition */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Répartition globale</h3>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              Aucun test effectué
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1rem' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Évolution des scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
      >
        <h3 className="text-foreground mb-6">Résumé des évaluations</h3>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="text-3xl font-bold text-emerald-600 mb-1">{stats.faible}</div>
            <div className="text-sm text-emerald-700">Risque Faible</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.totalTests > 0 ? Math.round(stats.faible / stats.totalTests * 100) : 0}%
            </div>
          </div>
          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="text-3xl font-bold text-amber-600 mb-1">{stats.moyen}</div>
            <div className="text-sm text-amber-700">Risque Moyen</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.totalTests > 0 ? Math.round(stats.moyen / stats.totalTests * 100) : 0}%
            </div>
          </div>
          <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
            <div className="text-3xl font-bold text-red-600 mb-1">{stats.eleve}</div>
            <div className="text-sm text-red-700">Risque Élevé</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.totalTests > 0 ? Math.round(stats.eleve / stats.totalTests * 100) : 0}%
            </div>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
