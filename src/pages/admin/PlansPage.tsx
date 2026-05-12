import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Target, TrendingUp, Calendar, User, Loader2, Sparkles, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../api/apiClient';

interface PlanDB {
  id: number;
  titre: string;
  description: string;
  objectifs: string;
  dateGeneration: string;
}

interface EnfantAvecPlan {
  enfantId: number;
  enfantPrenom: string;
  parentNom: string;
  score: number;
  niveauRisque: string;
  dateEvaluation: string;
  plan: PlanDB | null;
}

/** Couleur selon le niveau de risque */
const niveauGradient = (niveau: string) => {
  if (niveau === 'FAIBLE') return 'from-emerald-500 to-teal-500';
  if (niveau === 'MOYEN') return 'from-orange-500 to-amber-500';
  return 'from-red-500 to-rose-500';
};

export default function PlansPage() {
  const [plans, setPlans] = useState<EnfantAvecPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingPlan, setViewingPlan] = useState<EnfantAvecPlan | null>(null);

  useEffect(() => {
    chargerPlans();
  }, []);

  const chargerPlans = async () => {
    setLoading(true);
    try {
      // 1. Charger tous les parents
      const parentsRes = await apiClient.get('/parents');
      const parents = parentsRes.data;

      // 2. Pour chaque parent, charger ses enfants
      const tousEnfants: any[] = [];
      for (const parent of parents) {
        try {
          const enfantsRes = await apiClient.get(`/enfants/parent/${parent.id}`);
          enfantsRes.data.forEach((e: any) => {
            tousEnfants.push({ ...e, parentNom: `${parent.prenom} ${parent.nom}` });
          });
        } catch { }
      }

      // 3. Pour chaque enfant, charger son dernier résultat + plan
      const resultats: EnfantAvecPlan[] = [];
      for (const enfant of tousEnfants) {
        try {
          const resRes = await apiClient.get(`/resultat/enfant/${enfant.id}`);
          if (Array.isArray(resRes.data) && resRes.data.length > 0) {
            const dernierResultat = resRes.data[0]; // déjà trié du plus récent
            // Charger le plan associé
            let plan: PlanDB | null = null;
            try {
              const planRes = await apiClient.get(`/resultat/${dernierResultat.id}/plan`);
              plan = planRes.data;
            } catch { }

            resultats.push({
              enfantId: enfant.id,
              enfantPrenom: enfant.prenom,
              parentNom: enfant.parentNom,
              score: dernierResultat.score,
              niveauRisque: dernierResultat.niveauRisque,
              dateEvaluation: dernierResultat.dateEvaluation,
              plan,
            });
          }
        } catch { }
      }

      setPlans(resultats);
    } catch (err) {
      console.error('Erreur chargement plans:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-foreground mb-2 text-sky-600 inline-block">
            Plans Personnalisés
          </h1>
          <p className="text-muted-foreground">
            Plans générés par l'IA pour chaque enfant évalué
          </p>
        </div>
        <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-sm px-4 py-2 rounded-xl">
          <Sparkles className="w-4 h-4" />
          {plans.length} plan{plans.length > 1 ? 's' : ''} générés
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl p-16 rounded-3xl shadow-xl border border-border/50 text-center">
          <Target className="w-16 h-16 text-rose-200 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Aucun plan disponible</p>
          <p className="text-sm text-muted-foreground mt-2">
            Les plans sont générés automatiquement après chaque questionnaire
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {plans.map((item, index) => (
            <motion.div
              key={item.enfantId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Avatar enfant */}
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">
                      {item.enfantPrenom.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-foreground text-xl font-semibold">{item.enfantPrenom}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>Parent : {item.parentNom}</span>
                    </div>
                  </div>
                </div>

                {/* Bouton voir le plan */}
                {item.plan && (
                  <button
                    onClick={() => setViewingPlan(item)}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-2.5 rounded-2xl shadow-lg hover:shadow-2xl transition-all text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Voir le plan
                  </button>
                )}
              </div>

              {/* Infos résultat */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                  <div className="text-sm text-blue-600 mb-1">Score TSA</div>
                  <div className="text-2xl font-bold text-foreground">{item.score}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
                  <div className="text-sm text-violet-600 mb-1">Niveau de risque</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm text-white bg-gradient-to-r ${niveauGradient(item.niveauRisque)} shadow-md`}>
                    {item.niveauRisque}
                  </span>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                  <div className="flex items-center gap-2 text-sm text-orange-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    Évaluation
                  </div>
                  <div className="text-sm font-medium text-foreground">{item.dateEvaluation}</div>
                </div>
              </div>

              {/* Aperçu du plan */}
              {item.plan ? (
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                    <span className="text-sm font-medium text-violet-700">{item.plan.titre}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.plan.description?.substring(0, 150)}...
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
                  <p className="text-sm text-muted-foreground">Aucun plan généré pour cet enfant</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal détail du plan */}
      <AnimatePresence>
        {viewingPlan && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setViewingPlan(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-white rounded-3xl p-8 w-full max-w-2xl mx-4 shadow-2xl pointer-events-auto max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold">{viewingPlan.plan?.titre}</h3>
                      <p className="text-sm text-muted-foreground">{viewingPlan.enfantPrenom} — {viewingPlan.niveauRisque}</p>
                    </div>
                  </div>
                  <button onClick={() => setViewingPlan(null)} className="p-2 hover:bg-accent rounded-xl">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {viewingPlan.plan?.description}
                </p>
                <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
                  Généré le : {viewingPlan.plan?.dateGeneration}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
