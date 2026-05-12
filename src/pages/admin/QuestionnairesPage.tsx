import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Edit2, Trash2, Eye, FileQuestion, GripVertical, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../api/apiClient';

interface Questionnaire {
  id: number;
  titre: string;
  ageMin: number;
  ageMax: number;
  dateCreation?: string;
  // champs locaux pour l'affichage
  questions?: string[];
}

export default function QuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingQ, setViewingQ] = useState<Questionnaire | null>(null);
  const [questionsModal, setQuestionsModal] = useState<string[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [builderData, setBuilderData] = useState({
    titre: '',
    ageMin: 0,
    ageMax: 6,
    questions: [''],
  });

  // ── Chargement depuis le backend
  const fetchQuestionnaires = async () => {
    try {
      const res = await apiClient.get('/questionnaire');
      setQuestionnaires(res.data);
    } catch (err) {
      console.error('Erreur chargement questionnaires:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  // ── Sauvegarder (créer ou modifier)
  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await apiClient.put(`/questionnaire/${editingId}`, {
          titre: builderData.titre,
          ageMin: builderData.ageMin,
          ageMax: builderData.ageMax,
        });
      } else {
        await apiClient.post('/questionnaire', {
          titre: builderData.titre,
          ageMin: builderData.ageMin,
          ageMax: builderData.ageMax,
        });
      }
      await fetchQuestionnaires();
      closeBuilder();
    } catch (err) {
      console.error('Erreur sauvegarde questionnaire:', err);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // ── Supprimer
  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce questionnaire ?')) return;
    try {
      await apiClient.delete(`/questionnaire/${id}`);
      setQuestionnaires(questionnaires.filter((q) => q.id !== id));
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleEdit = (q: Questionnaire) => {
    setBuilderData({
      titre: q.titre,
      ageMin: q.ageMin,
      ageMax: q.ageMax,
      questions: q.questions?.length ? q.questions : [''],
    });
    setEditingId(q.id);
    setShowBuilder(true);
  };

  const handleView = async (q: Questionnaire) => {
    setViewingQ(q);
    setQuestionsModal([]);
    setShowViewModal(true);
    setLoadingQuestions(true);
    try {
      const res = await apiClient.get(`/question/questionnaire/${q.id}`);
      const data = Array.isArray(res.data) ? res.data : [];
      // Le backend peut retourner des objets Question ou des strings
      const texts = data.map((item: any) =>
        typeof item === 'string' ? item : item.contenu || item.texte || item.question || JSON.stringify(item)
      );
      setQuestionsModal(texts);
    } catch (err) {
      console.error('Erreur chargement questions:', err);
      setQuestionsModal([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleNew = () => {
    setBuilderData({ titre: '', ageMin: 0, ageMax: 6, questions: [''] });
    setEditingId(null);
    setShowBuilder(true);
  };

  const closeBuilder = () => {
    setShowBuilder(false);
    setEditingId(null);
    setBuilderData({ titre: '', ageMin: 0, ageMax: 6, questions: [''] });
  };

  const handleAddQuestion = () =>
    setBuilderData({ ...builderData, questions: [...builderData.questions, ''] });

  const handleQuestionChange = (index: number, value: string) => {
    const q = [...builderData.questions];
    q[index] = value;
    setBuilderData({ ...builderData, questions: q });
  };

  const handleRemoveQuestion = (index: number) => {
    if (builderData.questions.length > 1)
      setBuilderData({
        ...builderData,
        questions: builderData.questions.filter((_, i) => i !== index),
      });
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
            Gestion des Questionnaires
          </h1>
          <p className="text-muted-foreground">Créer et gérer les questionnaires de dépistage</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNew}
          className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouveau questionnaire
        </motion.button>
      </motion.div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
        </div>
      ) : questionnaires.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl p-16 rounded-3xl shadow-xl border border-border/50 text-center">
          <FileQuestion className="w-16 h-16 text-rose-200 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Aucun questionnaire créé pour le moment</p>
          <p className="text-sm text-muted-foreground mt-2">Cliquez sur "Nouveau questionnaire" pour commencer</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {questionnaires.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50 hover:shadow-2xl transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileQuestion className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-foreground text-xl mb-1">{q.titre}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Tranche d'âge : {q.ageMin} – {q.ageMax} ans
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-w-xs">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                        <div className="text-sm text-blue-600 mb-1">Âge min</div>
                        <div className="text-2xl text-foreground">{q.ageMin}</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
                        <div className="text-sm text-violet-600 mb-1">Âge max</div>
                        <div className="text-2xl text-foreground">{q.ageMax}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(q)}
                    className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(q)}
                    className="p-3 text-sky-600 hover:bg-sky-100 rounded-xl transition-all"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {/* ── Modal Créer / Modifier ── */}
        {showBuilder && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeBuilder}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl mx-4 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto border border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-sky-600">
                    {editingId ? 'Modifier le questionnaire' : 'Nouveau questionnaire'}
                  </h3>
                  <button onClick={closeBuilder} className="p-2 hover:bg-accent rounded-xl">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Titre */}
                  <div>
                    <label className="block mb-2 text-sm text-foreground">Titre</label>
                    <input
                      type="text"
                      value={builderData.titre}
                      onChange={(e) => setBuilderData({ ...builderData, titre: e.target.value })}
                      placeholder="Ex: M-CHAT (18-24 mois)"
                      className="w-full px-5 py-4 bg-white border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>

                  {/* Âges */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm text-foreground">Âge minimum</label>
                      <input
                        type="number" min="0" max="18"
                        value={builderData.ageMin}
                        onChange={(e) => setBuilderData({ ...builderData, ageMin: parseInt(e.target.value) || 0 })}
                        className="w-full px-5 py-4 bg-white border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-foreground">Âge maximum</label>
                      <input
                        type="number" min="0" max="18"
                        value={builderData.ageMax}
                        onChange={(e) => setBuilderData({ ...builderData, ageMax: parseInt(e.target.value) || 0 })}
                        className="w-full px-5 py-4 bg-white border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Questions (locales, pour référence) */}
                  <div className="space-y-3 mt-2">
                    <h4 className="text-foreground font-medium">Questions (optionnel)</h4>
                    {builderData.questions.map((question, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-muted-foreground cursor-move flex-shrink-0" />
                        <input
                          type="text"
                          value={question}
                          onChange={(e) => handleQuestionChange(index, e.target.value)}
                          placeholder={`Question ${index + 1}`}
                          className="flex-1 px-5 py-3 bg-white border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                        />
                        {builderData.questions.length > 1 && (
                          <button
                            onClick={() => handleRemoveQuestion(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={handleAddQuestion}
                      className="flex items-center gap-2 text-sky-600 hover:text-rose-700 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter une question
                    </button>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-border">
                    <button
                      onClick={closeBuilder}
                      className="px-6 py-3 border-2 border-border rounded-2xl hover:bg-accent transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || !builderData.titre}
                      className="flex-1 px-6 py-3 bg-sky-600 text-white rounded-2xl hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...</> : 'Sauvegarder'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* ── Modal Voir ── */}
        {showViewModal && viewingQ && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowViewModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl pointer-events-auto border border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileQuestion className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      {viewingQ.titre}
                    </h3>
                  </div>
                  <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-accent rounded-xl">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                    <div className="text-sm text-blue-600 mb-1">Âge minimum</div>
                    <div className="text-2xl text-foreground">{viewingQ.ageMin} ans</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
                    <div className="text-sm text-violet-600 mb-1">Âge maximum</div>
                    <div className="text-2xl text-foreground">{viewingQ.ageMax} ans</div>
                  </div>
                </div>
                {viewingQ.dateCreation && (
                  <p className="text-sm text-muted-foreground mb-4">Créé le : {viewingQ.dateCreation}</p>
                )}
                {/* Questions chargées depuis l'API */}
                <div className="mb-4">
                  <h4 className="text-foreground font-medium mb-3">Questions</h4>
                  {loadingQuestions ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                    </div>
                  ) : questionsModal.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Aucune question enregistrée pour ce questionnaire.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {questionsModal.map((q, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100"
                        >
                          <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                            {i + 1}
                          </span>
                          <p className="text-sm text-foreground">{q}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end pt-4 border-t border-border">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl hover:shadow-2xl transition-all"
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
