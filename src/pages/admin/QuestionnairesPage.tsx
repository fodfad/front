import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Edit2, Trash2, Eye, FileQuestion, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface Questionnaire {
  id: number;
  title: string;
  description: string;
  questionCount: number;
  completedCount: number;
  status: 'active' | 'draft';
  createdAt: string;
}

const questionnaires: Questionnaire[] = [
  { id: 1, title: 'M-CHAT (18-24 mois)', description: 'Questionnaire de dépistage pour les enfants de 18 à 24 mois', questionCount: 20, completedCount: 456, status: 'active', createdAt: '2024-01-15' },
  { id: 2, title: 'M-CHAT-R/F', description: 'Version révisée avec questions de suivi', questionCount: 20, completedCount: 312, status: 'active', createdAt: '2024-02-10' },
  { id: 3, title: 'CARS (Childhood Autism Rating Scale)', description: 'Échelle d\'évaluation de l\'autisme infantile', questionCount: 15, completedCount: 89, status: 'draft', createdAt: '2024-03-05' },
];

export default function QuestionnairesPage() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-foreground mb-2 bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent inline-block">
            Gestion des Questionnaires
          </h1>
          <p className="text-muted-foreground">Créer et gérer les questionnaires de dépistage</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowBuilder(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouveau questionnaire
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {questionnaires.map((questionnaire, index) => (
          <motion.div
            key={questionnaire.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50 hover:shadow-2xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileQuestion className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-foreground text-xl">{questionnaire.title}</h3>
                    <span className={`px-4 py-1 rounded-full text-sm shadow-lg ${
                      questionnaire.status === 'active'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    }`}>
                      {questionnaire.status === 'active' ? 'Actif' : 'Brouillon'}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{questionnaire.description}</p>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                      <div className="text-sm text-blue-600 mb-1">Questions</div>
                      <div className="text-2xl text-foreground">{questionnaire.questionCount}</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                      <div className="text-sm text-emerald-600 mb-1">Complétés</div>
                      <div className="text-2xl text-foreground">{questionnaire.completedCount}</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
                      <div className="text-sm text-violet-600 mb-1">Créé le</div>
                      <div className="text-sm text-foreground">{questionnaire.createdAt}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-3 text-rose-600 hover:bg-rose-100 rounded-xl transition-all">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showBuilder && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50"
        >
          <h3 className="text-foreground mb-6">Constructeur de questionnaire</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Titre du questionnaire"
              className="w-full px-5 py-4 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
            />
            <textarea
              placeholder="Description"
              rows={3}
              className="w-full px-5 py-4 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all resize-none"
            ></textarea>

            <div className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Question 1"
                className="flex-1 px-5 py-4 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
              />
            </div>

            <button className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors">
              <Plus className="w-5 h-5" />
              Ajouter une question
            </button>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowBuilder(false)}
                className="px-6 py-3 border-2 border-border rounded-2xl hover:bg-accent transition-all"
              >
                Annuler
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl hover:shadow-2xl transition-all">
                Sauvegarder
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AdminLayout>
  );
}
