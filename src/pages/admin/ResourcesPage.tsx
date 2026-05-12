import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, BookOpen, Video, FileText, Edit2, Trash2, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../api/apiClient';

interface Resource {
  id: number;
  titre: string;
  contenu?: string;
  categorie: string;
  motsCles?: string;
  datePublication?: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    categorie: 'Guide',
    motsCles: '',
  });

  const fetchResources = async () => {
    try {
      const res = await apiClient.get('/ressources');
      setResources(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Erreur chargement ressources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await apiClient.put(`/ressources/${editingId}`, formData);
      } else {
        await apiClient.post('/ressources', formData);
      }
      await fetchResources();
      closeModal();
    } catch (err) {
      console.error('Erreur sauvegarde ressource:', err);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cette ressource ?')) return;
    try {
      await apiClient.delete(`/ressources/${id}`);
      setResources(resources.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const openAdd = () => {
    setFormData({ titre: '', contenu: '', categorie: 'Guide', motsCles: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (r: Resource) => {
    setFormData({
      titre: r.titre,
      contenu: r.contenu || '',
      categorie: r.categorie,
      motsCles: r.motsCles || '',
    });
    setEditingId(r.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ titre: '', contenu: '', categorie: 'Guide', motsCles: '' });
  };

  const getIcon = (cat: string) => {
    if (cat?.toLowerCase().includes('vid')) return Video;
    if (cat?.toLowerCase().includes('guide')) return BookOpen;
    return FileText;
  };

  const getGradient = (cat: string) => {
    if (cat?.toLowerCase().includes('vid')) return 'from-rose-500 to-pink-500';
    if (cat?.toLowerCase().includes('guide')) return 'from-emerald-500 to-teal-500';
    return 'from-indigo-500 to-purple-600';
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
            Gestion des Ressources
          </h1>
          <p className="text-muted-foreground">Publier et gérer les ressources éducatives</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAdd}
          className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Ajouter une ressource
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl p-16 rounded-3xl shadow-xl border border-border/50 text-center">
          <BookOpen className="w-16 h-16 text-rose-200 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Aucune ressource publiée pour le moment</p>
          <p className="text-sm text-muted-foreground mt-2">Cliquez sur "Ajouter une ressource" pour commencer</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => {
            const Icon = getIcon(resource.categorie);
            const gradient = getGradient(resource.categorie);
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-border/50 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all"
              >
                <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm shadow-lg bg-gradient-to-r ${gradient} text-white`}>
                      {resource.categorie}
                    </span>
                  </div>
                  <h3 className="text-foreground mb-2 line-clamp-2">{resource.titre}</h3>
                  {resource.contenu && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{resource.contenu}</p>
                  )}
                  {resource.motsCles && (
                    <p className="text-xs text-muted-foreground mb-3">🏷 {resource.motsCles}</p>
                  )}
                  {resource.datePublication && (
                    <p className="text-xs text-muted-foreground mb-4">{resource.datePublication}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(resource)}
                      className="flex-1 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="flex-1 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Modal Ajouter / Modifier ── */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-white rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-foreground text-sky-600 text-xl font-semibold">
                    {editingId ? 'Modifier la ressource' : 'Ajouter une ressource'}
                  </h2>
                  <button onClick={closeModal} className="p-2 hover:bg-accent rounded-xl">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm text-foreground">Titre *</label>
                    <input
                      type="text"
                      value={formData.titre}
                      onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                      placeholder="Ex: Guide complet sur l'autisme"
                      className="w-full px-4 py-3 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-foreground">Catégorie *</label>
                    <select
                      value={formData.categorie}
                      onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                    >
                      <option value="Guide">Guide</option>
                      <option value="Article">Article</option>
                      <option value="Vidéo">Vidéo</option>
                      <option value="Communication">Communication</option>
                      <option value="Comportement">Comportement</option>
                      <option value="Alimentation">Alimentation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-foreground">Contenu</label>
                    <textarea
                      value={formData.contenu}
                      onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                      placeholder="Description ou contenu de la ressource..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-foreground">Mots-clés</label>
                    <input
                      type="text"
                      value={formData.motsCles}
                      onChange={(e) => setFormData({ ...formData, motsCles: e.target.value })}
                      placeholder="Ex: autisme, langage, jeu"
                      className="w-full px-4 py-3 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>

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
                      className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-2xl hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...</> : (editingId ? 'Modifier' : 'Ajouter')}
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
