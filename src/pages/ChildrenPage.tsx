import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Plus, Edit2, Trash2, X, User, Cake, Loader2, ChevronRight, Baby, BookOpen, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/apiClient';

// Interface correspondant à l'entité Enfant du backend
interface Child {
  id: number;
  prenom: string;
  dateNaissance: string;
  sexe: string;
}

/** Calcule l'âge exact en années à partir de la date de naissance */
const calculerAgeNumerique = (dateNaissance: string): number => {
  const naissance = new Date(dateNaissance);
  const aujourd = new Date();
  let age = aujourd.getFullYear() - naissance.getFullYear();
  const mois = aujourd.getMonth() - naissance.getMonth();
  if (mois < 0 || (mois === 0 && aujourd.getDate() < naissance.getDate())) age--;
  return Math.max(0, age);
};

/** Convertit un âge en date de naissance approximative (1er janvier) */
const ageToDOB = (age: number): string => {
  const annee = new Date().getFullYear() - age;
  return `${annee}-06-15`; // milieu de l'année pour être précis
};

/** Retourne la tranche d'âge et le badge associé */
const getTranche = (age: number) => {
  if (age < 3) return {
    label: 'Nourrisson 0-3 ans',
    code: '0-3',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    gradient: 'from-blue-500 to-cyan-500',
    icon: Baby,
    questionnaire: 'Questionnaire Nourrisson — 8 questions',
    description: 'Stimulation sensorielle, attachement, premiers mots',
  };
  if (age < 7) return {
    label: 'Préscolaire 3-7 ans',
    code: '3-7',
    color: 'bg-green-100 text-green-700 border-green-200',
    gradient: 'from-green-500 to-teal-500',
    icon: BookOpen,
    questionnaire: 'Questionnaire Préscolaire — 10 questions',
    description: 'Jeu symbolique, langage, émotions, socialisation',
  };
  return {
    label: 'Scolaire 7-12 ans',
    code: '7-12',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    gradient: 'from-orange-500 to-amber-500',
    icon: GraduationCap,
    questionnaire: 'Questionnaire Scolaire — 8 questions',
    description: 'Habiletés sociales, autonomie, règles implicites',
  };
};

export default function ChildrenPage() {
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    ageChoisi: 3,   // âge choisi directement par le parent (1-12 ans)
    sexe: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  // Enfant actuellement sélectionné (pour le questionnaire/suivi)
  const [selectedId, setSelectedId] = useState<number | null>(
    parseInt(localStorage.getItem('enfantId') || '0') || null
  );

  // Calcul de l'âge à partir de la date de naissance (affichage)
  const calculerAge = (dateNaissance: string): string => {
    const age = calculerAgeNumerique(dateNaissance);
    return `${age} ans`;
  };

  // Récupération des enfants depuis le backend au chargement
  useEffect(() => {
    const parentId = localStorage.getItem('userId');
    if (!parentId) return;

    apiClient
      .get(`/enfants/parent/${parentId}`)
      .then((res) => setChildren(res.data))
      .catch((err) => {
        console.error('Erreur chargement enfants:', err);
        setError('Impossible de charger les enfants');
      })
      .finally(() => setLoading(false));
  }, []);

  // Ajout ou modification d'un enfant
  const handleAddOrEditChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const parentId = parseInt(localStorage.getItem('userId') || '1');
      // Convertir l'âge choisi en date de naissance approximative
      const dateNaissance = ageToDOB(formData.ageChoisi);

      if (editingId) {
        const res = await apiClient.put(`/enfants/${editingId}`, {
          prenom: formData.prenom,
          dateNaissance,
          sexe: formData.sexe,
          parentId,
        });
        setChildren(children.map((c) => (c.id === editingId ? res.data : c)));
      } else {
        const res = await apiClient.post('/enfants', {
          prenom: formData.prenom,
          dateNaissance,
          sexe: formData.sexe,
          parentId,
        });
        setChildren([...children, res.data]);
      }
      closeModal();
    } catch (err) {
      console.error('Erreur sauvegarde enfant:', err);
    } finally {
      setSaving(false);
    }
  };

  // Ouverture du modal de modification
  const handleEdit = (child: Child, e: React.MouseEvent) => {
    e.stopPropagation();
    const age = calculerAgeNumerique(child.dateNaissance);
    setFormData({
      prenom: child.prenom,
      ageChoisi: age || 3,
      sexe: child.sexe,
    });
    setEditingId(child.id);
    setShowModal(true);
  };

  // Suppression d'un enfant via DELETE /api/enfants/{id}
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet enfant ?')) return;

    try {
      await apiClient.delete(`/enfants/${id}`);
      setChildren(children.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Erreur suppression enfant:', err);
    }
  };

  const openAddModal = () => {
    setFormData({ prenom: '', ageChoisi: 3, sexe: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ prenom: '', ageChoisi: 3, sexe: '' });
    setEditingId(null);
  };

  // Génération des initiales pour l'avatar
  const getInitials = (prenom: string) => prenom.charAt(0).toUpperCase();

  // Affichage pendant le chargement
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement des enfants...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-foreground mb-2 text-sky-600 inline-block">
            Gestion des enfants
          </h1>
          <p className="text-muted-foreground">Ajoutez et gérez les profils de vos enfants</p>
          {selectedId && (
            <div className="mt-2 inline-flex items-center gap-2 bg-sky-50 border border-sky-200 text-indigo-700 text-sm px-4 py-2 rounded-xl">
              <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
              Enfant sélectionné : <strong>{children.find(c => c.id === selectedId)?.prenom}</strong>
              — prêt pour le questionnaire et le suivi
            </div>
          )}
        </div>
      </motion.div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-border/50 overflow-hidden"
      >
        <div className="p-8">
          {children.length === 0 ? (
            // Message si aucun enfant
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">Aucun enfant enregistré</p>
              <p className="text-muted-foreground text-sm">
                Cliquez sur le bouton + pour ajouter un enfant
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child, index) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group bg-gradient-to-br from-white to-indigo-50/30 p-6 rounded-2xl border-2 transition-all cursor-pointer ${selectedId === child.id
                    ? 'border-indigo-500 shadow-2xl ring-2 ring-indigo-300'
                    : 'border-border hover:border-indigo-300 hover:shadow-2xl'
                    }`}
                  onClick={() => {
                    // Calculer l'âge exact et la tranche
                    const age = calculerAgeNumerique(child.dateNaissance);
                    const tranche = getTranche(age);

                    // Sauvegarder dans localStorage pour le questionnaire et le suivi
                    localStorage.setItem('enfantId', String(child.id));
                    localStorage.setItem('enfantPrenom', child.prenom);
                    localStorage.setItem('enfantAge', String(age));
                    localStorage.setItem('enfantTranche', tranche.code);

                    setSelectedId(child.id);

                    // Naviguer directement vers le questionnaire
                    navigate('/questionnaire');
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-white text-xl">{getInitials(child.prenom)}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {selectedId === child.id && (
                        <span className="text-xs bg-sky-500 text-white px-2 py-1 rounded-full">
                          ✓ Sélectionné
                        </span>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleEdit(child, e)}
                          className="p-2 text-sky-600 hover:bg-sky-100 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(child.id, e)}
                          className="p-2 text-sky-600 hover:bg-sky-100 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-foreground mb-3">{child.prenom}</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Cake className="w-4 h-4" />
                      <span>{child.dateNaissance}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>
                        {child.sexe} • {calculerAge(child.dateNaissance)}
                      </span>
                    </div>
                    {/* Badge tranche d'âge */}
                    {(() => {
                      const age = calculerAgeNumerique(child.dateNaissance);
                      const tranche = getTranche(age);
                      return (
                        <span className={`inline-block text-xs px-3 py-1 rounded-full border font-medium ${tranche.color}`}>
                          {tranche.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Bouton démarrer questionnaire */}
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-sky-500 group-hover:text-indigo-700 transition-colors">
                      <ChevronRight className="w-3 h-3" />
                      <span>Cliquer pour démarrer le questionnaire</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Bouton flottant pour ajouter un enfant */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={openAddModal}
        className="fixed bottom-8 right-8 w-16 h-16 bg-sky-600 rounded-full shadow-2xl flex items-center justify-center z-50"
      >
        <Plus className="w-8 h-8 text-white" />
      </motion.button>

      {/* Modal d'ajout / modification */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl pointer-events-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-foreground text-sky-600">
                    {editingId ? 'Modifier un enfant' : 'Ajouter un enfant'}
                  </h2>
                  <button onClick={closeModal} className="p-2 hover:bg-accent rounded-xl">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <form onSubmit={handleAddOrEditChild} className="space-y-5">
                  {/* Champ Prénom */}
                  <div>
                    <label className="block mb-2 text-foreground text-sm font-medium">Prénom de l'enfant</label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      placeholder="Ex: Mohamed"
                      className="w-full px-4 py-3 border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all"
                      required
                    />
                  </div>

                  {/* Sélecteur d'âge */}
                  <div>
                    <label className="block mb-2 text-foreground text-sm font-medium">
                      Âge de l'enfant
                    </label>
                    {/* Grille des âges 0-12 */}
                    <div className="grid grid-cols-7 gap-1.5 mb-3">
                      {Array.from({ length: 13 }, (_, i) => i).map((age) => {
                        const t = getTranche(age);
                        const isSelected = formData.ageChoisi === age;
                        return (
                          <button
                            key={age}
                            type="button"
                            onClick={() => setFormData({ ...formData, ageChoisi: age })}
                            className={`py-2 rounded-xl text-sm font-semibold transition-all border-2 ${isSelected
                                ? `bg-gradient-to-br ${t.gradient} text-white border-transparent shadow-lg scale-110`
                                : 'border-border text-muted-foreground hover:border-indigo-300 hover:bg-sky-50'
                              }`}
                          >
                            {age}
                          </button>
                        );
                      })}
                    </div>

                    {/* Aperçu de la tranche sélectionnée */}
                    {(() => {
                      const t = getTranche(formData.ageChoisi);
                      const TIcon = t.icon;
                      return (
                        <div className={`p-4 rounded-2xl border-2 ${t.color} flex items-start gap-3`}>
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                            <TIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{t.label}</p>
                            <p className="text-xs opacity-80 mt-0.5">{t.questionnaire}</p>
                            <p className="text-xs opacity-70 mt-0.5 italic">{t.description}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Champ Genre */}
                  <div>
                    <label className="block mb-3 text-foreground text-sm font-medium">Genre</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['M', 'F'].map((genre) => (
                        <label key={genre} className="cursor-pointer">
                          <input
                            type="radio"
                            name="sexe"
                            value={genre}
                            checked={formData.sexe === genre}
                            onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
                            className="peer sr-only"
                            required
                          />
                          <div className="p-4 border-2 border-border rounded-2xl text-center peer-checked:border-indigo-500 peer-checked:bg-sky-50 transition-all font-medium">
                            {genre === 'M' ? '👦 Garçon' : '👧 Fille'}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Boutons du formulaire */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-3 border-2 border-border rounded-2xl hover:bg-accent transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-2xl hover:shadow-xl transition-all disabled:opacity-70"
                    >
                      {saving ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
}