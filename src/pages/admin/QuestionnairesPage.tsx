import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Edit2, Trash2, Eye, FileQuestion, GripVertical, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Questionnaire {
  id: number;
  title: string;
  description: string;
  questionCount: number;
  completedCount: number;
  status: 'active' | 'draft';
  createdAt: string;
  questions?: string[];
}

const initialQuestionnaires: Questionnaire[] = [
  { id: 1, title: 'M-CHAT (18-24 mois)', description: 'Questionnaire de dépistage pour les enfants de 18 à 24 mois', questionCount: 20, completedCount: 456, status: 'active', createdAt: '2024-01-15' },
  { id: 2, title: 'M-CHAT-R/F', description: 'Version révisée avec questions de suivi', questionCount: 20, completedCount: 312, status: 'active', createdAt: '2024-02-10' },
  { id: 3, title: 'CARS (Childhood Autism Rating Scale)', description: 'Échelle d\'évaluation de l\'autisme infantile', questionCount: 15, completedCount: 89, status: 'draft', createdAt: '2024-03-05' },
];

export default function QuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>(initialQuestionnaires);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingQuestionnaire, setViewingQuestionnaire] = useState<Questionnaire | null>(null);
  const [builderData, setBuilderData] = useState({ title: '', description: '', questions: [''] });

  const handleSave = () => {
    if (editingId) {
      setQuestionnaires(questionnaires.map(q => 
        q.id === editingId ? { ...q, title: builderData.title, description: builderData.description, questionCount: builderData.questions.length, questions: builderData.questions } : q
      ));
    } else {
      const newQuestionnaire: Questionnaire = {
        id: questionnaires.length > 0 ? Math.max(...questionnaires.map(q => q.id)) + 1 : 1,
        title: builderData.title || 'Nouveau Questionnaire',
        description: builderData.description || 'Description du nouveau questionnaire',
        questionCount: builderData.questions.length > 0 ? builderData.questions.length : 1,
        completedCount: 0,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0],
        questions: builderData.questions
      };
      setQuestionnaires([...questionnaires, newQuestionnaire]);
    }
    setShowBuilder(false);
    setEditingId(null);
    setBuilderData({ title: '', description: '', questions: [''] });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce questionnaire ?')) {
      setQuestionnaires(questionnaires.filter(q => q.id !== id));
    }
  };

  const handleEdit = (q: Questionnaire) => {
    setBuilderData({ 
      title: q.title, 
      description: q.description, 
      questions: q.questions && q.questions.length > 0 ? q.questions : [''] 
    });
    setEditingId(q.id);
    setShowBuilder(true);
  };

  const handleNew = () => {
    setBuilderData({ title: '', description: '', questions: [''] });
    setEditingId(null);
    setShowBuilder(true);
  };

  const handleView = (q: Questionnaire) => {
    setViewingQuestionnaire(q);
    setShowViewModal(true);
  };

  const handleAddQuestion = () => {
    setBuilderData({ ...builderData, questions: [...builderData.questions, ''] });
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...builderData.questions];
    newQuestions[index] = value;
    setBuilderData({ ...builderData, questions: newQuestions });
  };

  const handleRemoveQuestion = (index: number) => {
    if (builderData.questions.length > 1) {
      const newQuestions = builderData.questions.filter((_, i) => i !== index);
      setBuilderData({ ...builderData, questions: newQuestions });
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
          <h1 className="text-foreground mb-2 bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent inline-block">
            Gestion des Questionnaires
          </h1>
          <p className="text-muted-foreground">Créer et gérer les questionnaires de dépistage</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNew}
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
                <button 
                  onClick={() => handleView(questionnaire)}
                  className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleEdit(questionnaire)}
                  className="p-3 text-rose-600 hover:bg-rose-100 rounded-xl transition-all"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(questionnaire.id)}
                  className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {/* Modale d'ajout / édition */}
        {showBuilder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBuilder(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl mx-4 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto border border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-foreground text-2xl font-semibold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    {editingId ? 'Modifier le questionnaire' : 'Constructeur de questionnaire'}
                  </h3>
                  <button
                    onClick={() => setShowBuilder(false)}
                    className="p-2 hover:bg-accent rounded-xl transition-all"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={builderData.title}
                    onChange={(e) => setBuilderData({ ...builderData, title: e.target.value })}
                    placeholder="Titre du questionnaire"
                    className="w-full px-5 py-4 bg-white border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                  />
                  <textarea
                    placeholder="Description"
                    value={builderData.description}
                    onChange={(e) => setBuilderData({ ...builderData, description: e.target.value })}
                    rows={3}
                    className="w-full px-5 py-4 bg-white border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all resize-none"
                  ></textarea>

                  <div className="space-y-3 mt-6">
                    <h4 className="text-foreground mb-2 font-medium">Questions</h4>
                    {builderData.questions.map((question, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-muted-foreground cursor-move flex-shrink-0" />
                        <input
                          type="text"
                          value={question}
                          onChange={(e) => handleQuestionChange(index, e.target.value)}
                          placeholder={`Question ${index + 1}`}
                          className="flex-1 px-5 py-4 bg-white border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                        />
                        {builderData.questions.length > 1 && (
                          <button 
                            onClick={() => handleRemoveQuestion(index)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all flex-shrink-0"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={handleAddQuestion}
                    className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors mt-2"
                  >
                    <Plus className="w-5 h-5" />
                    Ajouter une question
                  </button>

                  <div className="flex gap-3 pt-4 border-t border-border mt-6">
                    <button
                      onClick={() => setShowBuilder(false)}
                      className="px-6 py-3 border-2 border-border rounded-2xl hover:bg-accent transition-all font-medium"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl hover:shadow-2xl transition-all font-medium flex-1"
                    >
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Modale de vue (Show) */}
        {showViewModal && viewingQuestionnaire && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowViewModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl mx-4 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto border border-border/50">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileQuestion className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-foreground text-2xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                        {viewingQuestionnaire.title}
                      </h3>
                      <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs shadow-sm ${
                        viewingQuestionnaire.status === 'active'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                      }`}>
                        {viewingQuestionnaire.status === 'active' ? 'Actif' : 'Brouillon'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="p-2 hover:bg-accent rounded-xl transition-all"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-muted-foreground">{viewingQuestionnaire.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                    <div className="text-sm text-blue-600 mb-1">Questions</div>
                    <div className="text-2xl text-foreground">{viewingQuestionnaire.questionCount}</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                    <div className="text-sm text-emerald-600 mb-1">Complétés</div>
                    <div className="text-2xl text-foreground">{viewingQuestionnaire.completedCount}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-foreground font-medium mb-3 border-b border-border pb-2">Liste des questions</h4>
                  {viewingQuestionnaire.questions && viewingQuestionnaire.questions.length > 0 ? (
                    viewingQuestionnaire.questions.map((q, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-white border border-border/50 rounded-xl">
                        <span className="text-rose-500 font-bold">{i + 1}.</span>
                        <p className="text-foreground">{q}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Aucune question n'a été ajoutée pour ce questionnaire.</p>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-border flex justify-end">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl hover:shadow-2xl transition-all font-medium"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
