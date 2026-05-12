import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import {
  AlertCircle, TrendingDown, Download, Sparkles,
  CheckCircle2, Loader2, ArrowRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import { motion } from 'framer-motion';
import apiClient from '../api/apiClient';

export default function ResultsPage() {
  const navigate = useNavigate();

  const [resultat, setResultat] = useState<any>(null);
  const [historique, setHistorique] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('resultat');
    if (saved) setResultat(JSON.parse(saved));

    let enfantId = localStorage.getItem('enfantId');
    if (!enfantId && saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.enfantId) enfantId = String(parsed.enfantId);
      } catch { }
    }

    if (enfantId) {
      apiClient
        .get(`/resultat/enfant/${enfantId}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            const data = res.data.map((r: any, index: number) => ({
              date: r.dateEvaluation || `Test ${index + 1}`,
              score: r.score,
              niveau: r.niveauRisque || '',
            }));
            data.sort((a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            setHistorique(data);
          }
        })
        .catch((err) => console.error('Erreur historique:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ── Données du résultat ──────────────────────────────────────────────────
  const score = resultat ? parseInt(resultat.score) : 0;
  const niveau = resultat?.niveau || 'FAIBLE';
  const planIA = resultat?.contenuIA || '';
  const tranche = localStorage.getItem('enfantTranche') || resultat?.tranche || '3-7';
  const enfantPrenom = localStorage.getItem('enfantPrenom') || '';

  // Nombre total de questions selon la tranche d'âge
  const totalQuestions = tranche === '3-7' ? 10 : 8;

  // Libellé de la tranche
  const trancheLabel =
    tranche === '0-3' ? 'Nourrisson 0-3 ans' :
      tranche === '3-7' ? 'Préscolaire 3-7 ans' :
        'Scolaire 7-12 ans';

  // Couleur du badge niveau de risque
  const niveauColor = {
    FAIBLE: 'from-emerald-500 to-teal-500',
    MOYEN: 'from-orange-500 to-amber-500',
    ELEVE: 'from-red-500 to-rose-500',
  }[niveau] || 'from-emerald-500 to-teal-500';

  // Données graphique par catégorie (proportionnel au score réel)
  const scoreData = [
    { category: 'Communication', score: Math.round(score * 0.3) },
    { category: 'Social', score: Math.round(score * 0.25) },
    { category: 'Comportement', score: Math.round(score * 0.25) },
    { category: 'Jeu', score: Math.round(score * 0.2) },
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
      {/* ── En-tête ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-foreground mb-2 text-sky-600 inline-block">
            Résultats du test
          </h1>
          <p className="text-muted-foreground">
            {enfantPrenom && <span className="font-medium text-sky-600">{enfantPrenom} — </span>}
            Tranche : <span className="font-medium">{trancheLabel}</span>
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-2xl shadow-lg"
        >
          <Download className="w-5 h-5" />
          Télécharger PDF
        </motion.button>
      </motion.div>

      {/* ── Cartes de résumé ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Score total — corrigé avec le bon total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <div className="text-muted-foreground text-sm mb-3">Score total</div>
          <div className="text-5xl text-sky-600 mb-2">
            {score}/{totalQuestions}
          </div>
          <div className="text-sm text-muted-foreground">
            sur {totalQuestions} questions — {score} réponse{score > 1 ? 's' : ''} à risque
          </div>
        </motion.div>

        {/* Niveau de risque */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <div className="text-muted-foreground text-sm mb-3">Niveau de risque</div>
          <div className={`inline-block px-6 py-2 rounded-2xl bg-gradient-to-r ${niveauColor} text-white text-lg mb-2 shadow-lg`}>
            {niveau}
          </div>
          <div className="text-sm text-muted-foreground">Évaluation basée sur M-CHAT</div>
        </motion.div>

        {/* Nombre de tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <div className="text-muted-foreground text-sm mb-3">Nombre de tests</div>
          <div className="flex items-center gap-2 text-3xl text-sky-500 mb-2">
            <CheckCircle2 className="w-8 h-8" />
            {historique.length} test{historique.length > 1 ? 's' : ''}
          </div>
          <div className="text-sm text-muted-foreground">
            {historique.length === 0 ? 'Aucun test enregistré' :
              historique.length === 1 ? 'Premier test effectué' : 'Historique complet'}
          </div>
        </motion.div>
      </div>

      {/* ── Graphiques ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        {/* Score par catégorie */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Score par catégorie</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="category" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="score" fill="#6366F1" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Évolution du score */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Évolution du score</h3>
          {historique.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center">
                <TrendingDown className="w-8 h-8 text-indigo-300" />
              </div>
              <p className="text-sm">Aucun historique disponible</p>
              <p className="text-xs text-center max-w-xs">
                Passez plusieurs questionnaires pour voir l'évolution
              </p>
            </div>
          ) : historique.length === 1 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-20 h-20 bg-sky-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">{historique[0].score}</span>
              </div>
              <p className="text-foreground font-medium">Score : {historique[0].score}/{totalQuestions}</p>
              <p className="text-sm text-muted-foreground">Passez un 2ème test pour voir l'évolution</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historique}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748B" domain={[0, totalQuestions]} />
                <Tooltip
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`${value}/${totalQuestions}`, 'Score']}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* ── Bouton vers le Plan personnalisé ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <div className={`bg-gradient-to-br sky-50 border border-sky-200 rounded-3xl p-8 flex items-center justify-between gap-6`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-sky-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-foreground mb-1">Plan personnalisé IA</h3>
              <p className="text-muted-foreground text-sm">
                Consultez votre plan d'accompagnement adapté à la tranche{' '}
                <span className="font-medium text-sky-600">{trancheLabel}</span>
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/plan')}
            className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-2xl transition-all whitespace-nowrap"
          >
            Voir le plan
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* ── Avertissement médical ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-amber-50 border border-amber-200 rounded-3xl p-8 flex gap-6"
      >
        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-foreground mb-3">Avertissement important</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Ce questionnaire est un outil de dépistage préliminaire et ne constitue pas un diagnostic médical.
            Si vous avez des préoccupations, consultez un professionnel de santé.
          </p>
        </div>
      </motion.div>
    </Layout>
  );
}
