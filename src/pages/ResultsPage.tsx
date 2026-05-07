import { Layout } from '../components/Layout';
import { AlertCircle, TrendingDown, Download, Sparkles, Brain, Heart, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar, Legend } from 'recharts';
import { motion } from 'framer-motion';

const scoreData = [
  { category: 'Communication', score: 6, fill: 'url(#gradient1)' },
  { category: 'Social', score: 4, fill: 'url(#gradient2)' },
  { category: 'Comportement', score: 2, fill: 'url(#gradient3)' },
  { category: 'Jeu', score: 3, fill: 'url(#gradient4)' },
];

const historyData = [
  { date: 'Jan', score: 18 },
  { date: 'Fév', score: 16 },
  { date: 'Mar', score: 14 },
  { date: 'Avr', score: 12 },
  { date: 'Mai', score: 12 },
];

export default function ResultsPage() {
  const totalScore = 12;
  const riskLevel = totalScore < 8 ? 'Faible' : totalScore < 15 ? 'Moyen' : 'Élevé';

  const insights = [
    {
      icon: Brain,
      title: 'Développement cognitif',
      description: 'Votre enfant montre des signes positifs de développement cognitif',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Interactions sociales',
      description: 'Continuez à encourager les interactions sociales quotidiennes',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Sparkles,
      title: 'Communication',
      description: 'Excellents progrès dans la communication verbale et non-verbale',
      gradient: 'from-violet-500 to-purple-500'
    },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-foreground mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block">
            Résultats du test
          </h1>
          <p className="text-muted-foreground">Analyse détaillée du questionnaire M-CHAT</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
        >
          <Download className="w-5 h-5" />
          Télécharger PDF
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="text-muted-foreground text-sm mb-3">Score total</div>
          <div className="text-5xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">{totalScore}/30</div>
          <div className="text-sm text-muted-foreground">sur 30 points possibles</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"></div>
          <div className="text-muted-foreground text-sm mb-3">Niveau de risque</div>
          <div className="inline-block px-6 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg mb-2 shadow-lg">
            {riskLevel}
          </div>
          <div className="text-sm text-muted-foreground">Évaluation basée sur M-CHAT</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"></div>
          <div className="text-muted-foreground text-sm mb-3">Tendance</div>
          <div className="flex items-center gap-2 text-3xl text-emerald-500 mb-2">
            <TrendingDown className="w-8 h-8" />
            -6 points
          </div>
          <div className="text-sm text-muted-foreground">Depuis le dernier test</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Score par catégorie</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreData}>
              <defs>
                <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
                <linearGradient id="gradient3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
                <linearGradient id="gradient4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="category" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '1rem',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="score" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Évolution du score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historyData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '1rem',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 6, strokeWidth: 2, stroke: '#fff' }}
                fill="url(#lineGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* AI-Style Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          <h3 className="text-foreground">Recommandations IA</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-border/50 hover:shadow-2xl hover:scale-[1.02] transition-all group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${insight.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-foreground mb-2">{insight.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-8 flex gap-6"
      >
        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <AlertCircle className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-foreground mb-3">Avertissement important</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Ce questionnaire est un outil de dépistage préliminaire et ne constitue pas un diagnostic médical.
            Les résultats doivent être interprétés par un professionnel de santé qualifié. Si vous avez des
            préoccupations concernant le développement de votre enfant, nous vous recommandons vivement de
            consulter un pédiatre ou un spécialiste en développement de l'enfant.
          </p>
        </div>
      </motion.div>
    </Layout>
  );
}
