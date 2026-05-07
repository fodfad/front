import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Target, TrendingUp, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface Plan {
  id: number;
  childName: string;
  title: string;
  objectives: number;
  completedObjectives: number;
  startDate: string;
  nextReview: string;
  progress: number;
}

const plans: Plan[] = [
  { id: 1, childName: 'Emma Dupont', title: 'Plan de développement social', objectives: 8, completedObjectives: 5, startDate: '2024-01-15', nextReview: '2024-06-15', progress: 62 },
  { id: 2, childName: 'Lucas Martin', title: 'Communication et langage', objectives: 12, completedObjectives: 7, startDate: '2024-02-01', nextReview: '2024-07-01', progress: 58 },
  { id: 3, childName: 'Thomas Dubois', title: 'Gestion des émotions', objectives: 10, completedObjectives: 3, startDate: '2024-03-10', nextReview: '2024-08-10', progress: 30 },
];

export default function PlansPage() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-foreground mb-2 bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent inline-block">
            Plans Personnalisés
          </h1>
          <p className="text-muted-foreground">Créer et suivre les plans d'intervention individualisés</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouveau plan
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-xl">{plan.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{plan.childName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  plan.progress >= 70
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                    : plan.progress >= 40
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500'
                    : 'bg-gradient-to-br from-red-500 to-rose-500'
                } shadow-lg`}>
                  <span className="text-white text-xl">{plan.progress}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                <div className="text-sm text-blue-600 mb-1">Objectifs</div>
                <div className="text-2xl text-foreground">{plan.objectives}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                <div className="text-sm text-emerald-600 mb-1">Complétés</div>
                <div className="text-2xl text-foreground">{plan.completedObjectives}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
                <div className="flex items-center gap-2 text-sm text-violet-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Début</span>
                </div>
                <div className="text-sm text-foreground">{plan.startDate}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-2 text-sm text-orange-600 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Révision</span>
                </div>
                <div className="text-sm text-foreground">{plan.nextReview}</div>
              </div>
            </div>

            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="text-foreground">{plan.completedObjectives}/{plan.objectives} objectifs</span>
            </div>
            <div className="h-3 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all"
                style={{ width: `${plan.progress}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
}
