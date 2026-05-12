import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Users, TrendingUp, FileText, Activity, ArrowUpRight, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../api/apiClient';

export default function DashboardPage() {
  const [enfants, setEnfants] = useState<any[]>([]);
  const [resultats, setResultats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupération des données du dashboard depuis le backend
  useEffect(() => {
    const parentId = localStorage.getItem('userId');
    if (!parentId) { setLoading(false); return; }

    // Chargement des enfants du parent connecté
    apiClient
      .get(`/enfants/parent/${parentId}`)
      .then(async (res) => {
        const enfantsList = res.data;
        setEnfants(enfantsList);

        // Pour chaque enfant, charger ses résultats
        const tousResultats: any[] = [];
        for (const enfant of enfantsList) {
          try {
            const r = await apiClient.get(`/resultat/enfant/${enfant.id}`);
            // Associer le prénom de l'enfant à chaque résultat
            r.data.forEach((res: any) => {
              tousResultats.push({ ...res, enfantPrenom: enfant.prenom });
            });
          } catch {}
        }
        // Trier du plus récent au plus ancien
        tousResultats.sort(
          (a, b) =>
            new Date(b.dateEvaluation).getTime() -
            new Date(a.dateEvaluation).getTime()
        );
        setResultats(tousResultats.slice(0, 3));
      })
      .catch((err) => console.error('Erreur dashboard:', err))
      .finally(() => setLoading(false));
  }, []);

  // Récupération du nom de l'utilisateur connecté
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Couleur du badge niveau de risque
  const niveauColor = (niveau: string) => {
    if (niveau === 'FAIBLE') return 'from-emerald-500 to-teal-500';
    if (niveau === 'MOYEN') return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  // Statistiques affichées dans les cartes du haut
  const stats = [
    {
      icon: Users,
      label: "Nombre d'enfants",
      value: String(enfants.length),
      trend: '+' + enfants.length,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FileText,
      label: 'Tests complétés',
      value: String(resultats.length),
      trend: '+' + resultats.length,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: TrendingUp,
      label: 'Dernier score',
      value: resultats[0] ? String(resultats[0].score) : '0',
      trend: '↑',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Activity,
      label: 'Jours de suivi',
      value: '0',
      trend: '+0',
      gradient: 'from-orange-500 to-pink-500',
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-sky-600 inline-block">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground">
          Bienvenue {user.prenom} ! Voici un aperçu de vos activités récentes.
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-border hover:shadow-2xl hover:scale-[1.02] transition-all">
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

      {/* Derniers résultats et activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Derniers résultats de tests */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Derniers résultats de tests</h3>
          {resultats.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Aucun test effectué pour le moment
            </p>
          ) : (
            <div className="space-y-4">
              {resultats.map((r, index) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-sky-50/50 rounded-2xl hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      {r.enfantPrenom?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="text-foreground">{r.enfantPrenom}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {r.dateEvaluation}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-foreground mb-1">Score: {r.score}</div>
                    <div className={`text-sm px-4 py-1.5 rounded-full inline-block bg-gradient-to-r ${niveauColor(r.niveauRisque)} text-white`}>
                      {r.niveauRisque}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Activité récente */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Activité récente</h3>
          {resultats.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Aucune activité récente
            </p>
          ) : (
            <div className="space-y-5">
              {resultats.map((r, index) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-foreground">
                      Test M-CHAT complété pour {r.enfantPrenom}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {r.dateEvaluation}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}