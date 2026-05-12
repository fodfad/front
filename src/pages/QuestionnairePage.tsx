import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Check, X, Loader2, Baby, BookOpen, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/apiClient';

/** Retourne le badge de tranche d'âge */
const getBadgeTranche = (tranche: string) => {
  switch (tranche) {
    case '0-3': return { label: 'Questionnaire Nourrisson', icon: Baby, color: 'from-blue-500 to-cyan-500' };
    case '3-7': return { label: 'Questionnaire Préscolaire', icon: BookOpen, color: 'from-green-500 to-teal-500' };
    case '7-12': return { label: 'Questionnaire Scolaire', icon: GraduationCap, color: 'from-orange-500 to-amber-500' };
    default: return { label: 'Questionnaire M-CHAT', icon: BookOpen, color: 'from-indigo-500 to-purple-600' };
  }
};

export default function QuestionnairePage() {
  const navigate = useNavigate();

  // État des questions chargées depuis la DB
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  // Infos de l'enfant depuis localStorage
  const enfantAge = parseInt(localStorage.getItem('enfantAge') || '3');
  const enfantPrenom = localStorage.getItem('enfantPrenom') || 'votre enfant';
  const enfantTranche = localStorage.getItem('enfantTranche') || '3-7';
  const badge = getBadgeTranche(enfantTranche);
  const BadgeIcon = badge.icon;

  /**
   * ÉTAPE 1 — Charger le questionnaire adapté à l'âge depuis la DB.
   * Flux : GET /api/questionnaire/age/{age} → GET /api/question/questionnaire/{id}
   * Pas d'appel IA pour les questions — elles sont fixes en DB.
   */
  useEffect(() => {
    const chargerQuestions = async () => {
      try {
        // Récupérer le questionnaire adapté à l'âge
        const resQ = await apiClient.get(`/questionnaire/age/${enfantAge}`);
        const questionnaires = resQ.data;

        if (!Array.isArray(questionnaires) || questionnaires.length === 0) {
          setErreur(`Aucun questionnaire trouvé pour l'âge ${enfantAge} ans.`);
          setLoading(false);
          return;
        }

        // Prendre le premier questionnaire adapté
        const questionnaire = questionnaires[0];

        // Récupérer les questions fixes depuis la DB
        const resQQ = await apiClient.get(`/question/questionnaire/${questionnaire.id}`);
        const questionsDB = resQQ.data;

        if (!Array.isArray(questionsDB) || questionsDB.length === 0) {
          setErreur('Aucune question trouvée pour ce questionnaire.');
          setLoading(false);
          return;
        }

        // Trier par ordre et extraire le contenu
        const sorted = [...questionsDB].sort((a: any, b: any) => a.ordre - b.ordre);
        setQuestions(sorted.map((q: any) => q.contenu));

      } catch (err) {
        console.error('Erreur chargement questions:', err);
        setErreur('Impossible de charger les questions. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    chargerQuestions();
  }, []);

  const progress = questions.length > 0
    ? ((currentQuestion + 1) / questions.length) * 100
    : 0;

  /**
   * Gestion de la réponse à une question.
   * Au dernier "Non" → envoie POST /api/resultat/calculer avec l'âge.
   */
  const handleAnswer = async (answer: boolean) => {
    setSelectedAnswer(answer);

    setTimeout(async () => {
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        // Passer à la question suivante
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // Toutes les questions répondues → envoyer au backend
        setSubmitting(true);
        try {
          const enfantId = parseInt(localStorage.getItem('enfantId') || '1');

          // POST /api/resultat/calculer — score calculé en Java, plan généré par IA
          const res = await apiClient.post('/resultat/calculer', {
            enfantId,
            questions,
            reponses: newAnswers,
            age: enfantAge,  // ← âge envoyé pour adapter le plan IA
          });

          // Sauvegarder le résultat + infos pour ResultsPage
          localStorage.setItem('resultat', JSON.stringify({
            ...res.data,
            enfantId,
            tranche: enfantTranche,
          }));

          navigate('/results');
        } catch (err) {
          console.error('Erreur envoi résultats:', err);
          navigate('/results');
        } finally {
          setSubmitting(false);
        }
      }
    }, 600);
  };

  // ── Écran de chargement ──────────────────────────────────────────────────
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement du questionnaire...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Tranche d'âge : {enfantTranche} ans
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Écran d'erreur ───────────────────────────────────────────────────────
  if (erreur) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-foreground font-medium mb-2">Questionnaire introuvable</p>
            <p className="text-muted-foreground text-sm mb-4">{erreur}</p>
            <button
              onClick={() => navigate('/children')}
              className="px-6 py-3 bg-sky-600 text-white rounded-2xl text-sm"
            >
              Retour aux enfants
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Écran d'analyse en cours ─────────────────────────────────────────────
  if (submitting) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Calcul du score en cours...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Génération du plan personnalisé par l'IA...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Questionnaire ────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          {/* Badge tranche d'âge */}
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${badge.color} text-white px-6 py-2 rounded-full mb-3 shadow-lg`}>
            <BadgeIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{badge.label}</span>
          </div>

          <h1 className="text-foreground mb-2">Évaluation du développement</h1>
          <p className="text-muted-foreground">
            Questionnaire pour{' '}
            <span className="text-sky-600 font-medium">{enfantPrenom}</span>
            {' '}— {enfantAge} ans
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

          {/* Barre de progression */}
          <div className="mb-10 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} sur {questions.length}
              </span>
              <span className="text-sm text-sky-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-3 bg-sky-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${badge.color} rounded-full`}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Question actuelle */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="mb-10"
            >
              <h2 className="text-foreground text-2xl leading-relaxed">
                {questions[currentQuestion]}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Boutons Oui / Non */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Bouton OUI */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(true)}
              disabled={selectedAnswer !== null}
              className={`p-8 rounded-2xl border-2 transition-all text-left ${selectedAnswer === true
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-500 to-teal-500 shadow-2xl'
                  : 'border-border bg-white hover:border-emerald-400 hover:shadow-xl'
                }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${selectedAnswer === true ? 'bg-white' : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                }`}>
                <Check className={`w-8 h-8 ${selectedAnswer === true ? 'text-emerald-500' : 'text-white'}`} />
              </div>
              <div className={`text-2xl mb-2 ${selectedAnswer === true ? 'text-white' : 'text-foreground'}`}>
                Oui
              </div>
              <div className={`text-sm ${selectedAnswer === true ? 'text-white/90' : 'text-muted-foreground'}`}>
                Ce comportement est présent
              </div>
            </motion.button>

            {/* Bouton NON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(false)}
              disabled={selectedAnswer !== null}
              className={`p-8 rounded-2xl border-2 transition-all text-left ${selectedAnswer === false
                  ? 'border-rose-500 bg-gradient-to-br from-rose-500 to-pink-500 shadow-2xl'
                  : 'border-border bg-white hover:border-rose-400 hover:shadow-xl'
                }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${selectedAnswer === false ? 'bg-white' : 'bg-gradient-to-br from-rose-500 to-pink-500'
                }`}>
                <X className={`w-8 h-8 ${selectedAnswer === false ? 'text-sky-500' : 'text-white'}`} />
              </div>
              <div className={`text-2xl mb-2 ${selectedAnswer === false ? 'text-white' : 'text-foreground'}`}>
                Non
              </div>
              <div className={`text-sm ${selectedAnswer === false ? 'text-white/90' : 'text-muted-foreground'}`}>
                Ce comportement est absent ou rare
              </div>
            </motion.button>
          </div>

          {/* Indicateur de progression par étapes */}
          <div className="flex gap-2">
            {questions.map((_, index) => (
              <div key={index} className="flex-1">
                <div className={`h-2 rounded-full transition-all ${index < currentQuestion
                    ? `bg-gradient-to-r ${badge.color}`
                    : index === currentQuestion
                      ? 'bg-indigo-400'
                      : 'bg-sky-100'
                  }`} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
