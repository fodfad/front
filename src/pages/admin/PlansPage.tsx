import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Target, TrendingUp, Calendar, User, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const initialPlans: Plan[] = [
  { id: 1, childName: 'Emma Dupont', title: 'Plan de développement social', objectives: 8, completedObjectives: 5, startDate: '2024-01-15', nextReview: '2024-06-15', progress: 62 },
  { id: 2, childName: 'Lucas Martin', title: 'Communication et langage', objectives: 12, completedObjectives: 7, startDate: '2024-02-01', nextReview: '2024-07-01', progress: 58 },
  { id: 3, childName: 'Thomas Dubois', title: 'Gestion des émotions', objectives: 10, completedObjectives: 3, startDate: '2024-03-10', nextReview: '2024-08-10', progress: 30 },
];

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    childName: '',
    title: '',
    objectives: 1,
    completedObjectives: 0,
    startDate: '',
    nextReview: ''
  });

  const handleAddOrEditPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const progress = Math.round((formData.completedObjectives / formData.objectives) * 100) || 0;

    if (editingId) {
      setPlans(plans.map(plan => 
        plan.id === editingId 
          ? { ...plan, ...formData, progress } 
          : plan
      ));
    } else {
      const newPlan: Plan = {
        id: plans.length > 0 ? Math.max(...plans.map(p => p.id)) + 1 : 1,
        ...formData,
        progress
      };
      setPlans([...plans, newPlan]);
    }
    closeModal();
  };

  const handleEdit = (plan: Plan) => {
    setFormData({ 
      childName: plan.childName, 
      title: plan.title, 
      objectives: plan.objectives,
      completedObjectives: plan.completedObjectives,
      startDate: plan.startDate,
      nextReview: plan.nextReview
    });
    setEditingId(plan.id);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
      setPlans(plans.filter(plan => plan.id !== id));
    }
  };

  const openAddModal = () => {
    setFormData({ childName: '', title: '', objectives: 1, completedObjectives: 0, startDate: '', nextReview: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ childName: '', title: '', objectives: 1, completedObjectives: 0, startDate: '', nextReview: '' });
    setEditingId(null);
  };

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
          onClick={openAddModal}
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
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50 relative"
          >
            <div className="absolute top-6 right-6 flex gap-2">
              <button 
                onClick={() => handleEdit(plan)}
                className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(plan.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start justify-between mb-6 pr-20">
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

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-white rounded-3xl p-8 w-full max-w-xl mx-4 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-foreground bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    {editingId ? 'Modifier le Plan' : 'Ajouter un Plan'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-accent rounded-xl transition-all"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <form onSubmit={handleAddOrEditPlan} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-foreground text-sm">Nom de l'enfant</label>
                      <input
                        type="text"
                        value={formData.childName}
                        onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                        className="w-full px-4 py-3 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-foreground text-sm">Titre du plan</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-foreground text-sm">Date de début</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-3 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-foreground text-sm">Date de révision</label>
                      <input
                        type="date"
                        value={formData.nextReview}
                        onChange={(e) => setFormData({ ...formData, nextReview: e.target.value })}
                        className="w-full px-4 py-3 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-foreground text-sm">Total des objectifs</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.objectives}
                        onChange={(e) => setFormData({ ...formData, objectives: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-3 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-foreground text-sm">Objectifs complétés</label>
                      <input
                        type="number"
                        min="0"
                        max={formData.objectives}
                        value={formData.completedObjectives}
                        onChange={(e) => setFormData({ ...formData, completedObjectives: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-3 border-2 border-border rounded-2xl hover:bg-accent transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl hover:shadow-2xl transition-all"
                    >
                      {editingId ? 'Modifier' : 'Ajouter'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
