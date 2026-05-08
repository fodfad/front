import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Plus, Edit2, Trash2, X, User, Cake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Child {
  id: number;
  name: string;
  birthdate: string;
  gender: string;
  age: string;
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([
    { id: 1, name: 'Emma Dupont', birthdate: '2023-03-15', gender: 'Fille', age: '3 ans' },
    { id: 2, name: 'Lucas Martin', birthdate: '2021-07-22', gender: 'Garçon', age: '5 ans' },
    { id: 3, name: 'Sophie Bernard', birthdate: '2024-01-10', gender: 'Fille', age: '2 ans' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', birthdate: '', gender: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddOrEditChild = (e: React.FormEvent) => {
    e.preventDefault();
    const birthYear = new Date(formData.birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    if (editingId) {
      setChildren(children.map(child => 
        child.id === editingId 
          ? { ...child, name: formData.name, birthdate: formData.birthdate, gender: formData.gender, age: `${age} ans` } 
          : child
      ));
    } else {
      const newChild: Child = {
        id: children.length > 0 ? Math.max(...children.map(c => c.id)) + 1 : 1,
        name: formData.name,
        birthdate: formData.birthdate,
        gender: formData.gender,
        age: `${age} ans`,
      };
      setChildren([...children, newChild]);
    }

    closeModal();
  };

  const handleEdit = (child: Child, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({ name: child.name, birthdate: child.birthdate, gender: child.gender });
    setEditingId(child.id);
    setShowModal(true);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enfant ?')) {
      setChildren(children.filter(child => child.id !== id));
    }
  };

  const openAddModal = () => {
    setFormData({ name: '', birthdate: '', gender: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', birthdate: '', gender: '' });
    setEditingId(null);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-foreground mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block">
            Gestion des enfants
          </h1>
          <p className="text-muted-foreground">Ajoutez et gérez les profils de vos enfants</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-border/50 overflow-hidden"
      >
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gradient-to-br from-white to-indigo-50/30 p-6 rounded-2xl border-2 border-border hover:border-indigo-300 hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-white text-xl">{getInitials(child.name)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleEdit(child, e)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(child.id, e)}
                      className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-foreground mb-3">{child.name}</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Cake className="w-4 h-4" />
                    <span>{child.birthdate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{child.gender} • {child.age}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tests complétés</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg">
                      {Math.floor(Math.random() * 10) + 1}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={openAddModal}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-indigo-500/50 transition-all z-50"
      >
        <Plus className="w-8 h-8 text-white" />
      </motion.button>

      {/* Modal */}
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
              <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl pointer-events-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-foreground bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {editingId ? 'Modifier un enfant' : 'Ajouter un enfant'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-accent rounded-xl transition-all"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <form onSubmit={handleAddOrEditChild} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-foreground text-sm">
                      Nom complet
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Emma Dupont"
                      className="w-full px-4 py-3 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="birthdate" className="block mb-2 text-foreground text-sm">
                      Date de naissance
                    </label>
                    <input
                      id="birthdate"
                      type="date"
                      value={formData.birthdate}
                      onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-foreground text-sm">Genre</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Garçon"
                          checked={formData.gender === 'Garçon'}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="peer hidden"
                          required
                        />
                        <div className="p-4 border-2 border-border rounded-2xl text-center peer-checked:border-indigo-500 peer-checked:bg-gradient-to-r peer-checked:from-indigo-50 peer-checked:to-purple-50 hover:border-indigo-300 transition-all">
                          <span className="text-foreground">Garçon</span>
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Fille"
                          checked={formData.gender === 'Fille'}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="peer hidden"
                        />
                        <div className="p-4 border-2 border-border rounded-2xl text-center peer-checked:border-pink-500 peer-checked:bg-gradient-to-r peer-checked:from-pink-50 peer-checked:to-rose-50 hover:border-pink-300 transition-all">
                          <span className="text-foreground">Fille</span>
                        </div>
                      </label>
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
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:shadow-2xl transition-all"
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
    </Layout>
  );
}
