import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Search, Filter, Eye, Edit2, Trash2, UserPlus, Baby, Mail, Phone, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Parent {
  id: number;
  name: string;
  email: string;
  phone: string;
  childrenCount: number;
  status: 'active' | 'inactive';
  joinDate: string;
  lastActive: string;
}

const initialParents: Parent[] = [
  { id: 1, name: 'Marie Dupont', email: 'marie.dupont@email.com', phone: '+33 6 12 34 56 78', childrenCount: 2, status: 'active', joinDate: '2024-01-15', lastActive: 'Il y a 2h' },
  { id: 2, name: 'Jean Martin', email: 'jean.martin@email.com', phone: '+33 6 98 76 54 32', childrenCount: 1, status: 'active', joinDate: '2024-02-20', lastActive: 'Il y a 1 jour' },
  { id: 3, name: 'Sophie Bernard', email: 'sophie.b@email.com', phone: '+33 6 55 44 33 22', childrenCount: 3, status: 'active', joinDate: '2024-03-10', lastActive: 'Il y a 5h' },
  { id: 4, name: 'Pierre Dubois', email: 'p.dubois@email.com', phone: '+33 6 11 22 33 44', childrenCount: 1, status: 'inactive', joinDate: '2024-01-05', lastActive: 'Il y a 2 semaines' },
];

export default function ParentsManagementPage() {
  const [parents, setParents] = useState<Parent[]>(initialParents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', status: 'active' as 'active' | 'inactive' });

  const handleAddOrEditParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setParents(parents.map(parent => 
        parent.id === editingId 
          ? { ...parent, ...formData } 
          : parent
      ));
    } else {
      const newParent: Parent = {
        id: parents.length > 0 ? Math.max(...parents.map(p => p.id)) + 1 : 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        childrenCount: 0,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: 'À l\'instant'
      };
      setParents([...parents, newParent]);
    }
    closeModal();
  };

  const handleEdit = (parent: Parent) => {
    setFormData({ name: parent.name, email: parent.email, phone: parent.phone, status: parent.status });
    setEditingId(parent.id);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce parent ?')) {
      setParents(parents.filter(parent => parent.id !== id));
    }
  };

  const openAddModal = () => {
    setFormData({ name: '', email: '', phone: '', status: 'active' });
    setEditingId(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', phone: '', status: 'active' });
    setEditingId(null);
  };

  const filteredParents = parents.filter(parent =>
    parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-foreground mb-2 bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent inline-block">
            Gestion des Parents
          </h1>
          <p className="text-muted-foreground">Gérer les comptes parents et leurs enfants</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Ajouter un parent
        </motion.button>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-border/50 mb-8"
      >
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-white/50 border-2 border-border rounded-2xl hover:border-rose-500 hover:bg-white transition-all">
            <Filter className="w-5 h-5" />
            Filtrer
          </button>
        </div>
      </motion.div>

      {/* Parents Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-border/50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-rose-50 to-orange-50">
              <tr>
                <th className="text-left px-8 py-5 text-foreground">Parent</th>
                <th className="text-left px-8 py-5 text-foreground">Contact</th>
                <th className="text-left px-8 py-5 text-foreground">Enfants</th>
                <th className="text-left px-8 py-5 text-foreground">Statut</th>
                <th className="text-left px-8 py-5 text-foreground">Dernière activité</th>
                <th className="text-left px-8 py-5 text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParents.map((parent, index) => (
                <motion.tr
                  key={parent.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="border-b border-border hover:bg-gradient-to-r hover:from-rose-50/50 hover:to-orange-50/50 transition-all"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white">
                          {parent.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-foreground">{parent.name}</div>
                        <div className="text-sm text-muted-foreground">{parent.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm text-muted-foreground">{parent.phone}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm shadow-lg inline-flex items-center gap-2">
                      <Baby className="w-4 h-4" />
                      {parent.childrenCount}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-2 rounded-full text-sm shadow-lg ${
                      parent.status === 'active'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                    }`}>
                      {parent.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-muted-foreground">{parent.lastActive}</td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedParent(parent)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(parent)}
                        className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(parent.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Parent Details Modal */}
      <AnimatePresence>
        {selectedParent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedParent(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-white rounded-3xl p-8 w-full max-w-2xl mx-4 shadow-2xl pointer-events-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-foreground bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    Détails du Parent
                  </h2>
                  <button
                    onClick={() => setSelectedParent(null)}
                    className="p-2 hover:bg-accent rounded-xl transition-all"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">
                        {selectedParent.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-foreground text-xl">{selectedParent.name}</h3>
                      <p className="text-muted-foreground">Membre depuis {selectedParent.joinDate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <Mail className="w-5 h-5" />
                        <span className="text-sm">Email</span>
                      </div>
                      <p className="text-foreground">{selectedParent.email}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-2 text-emerald-600 mb-2">
                        <Phone className="w-5 h-5" />
                        <span className="text-sm">Téléphone</span>
                      </div>
                      <p className="text-foreground">{selectedParent.phone}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
                      <div className="flex items-center gap-2 text-violet-600 mb-2">
                        <Baby className="w-5 h-5" />
                        <span className="text-sm">Enfants</span>
                      </div>
                      <p className="text-foreground text-2xl">{selectedParent.childrenCount}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                      <div className="flex items-center gap-2 text-orange-600 mb-2">
                        <Calendar className="w-5 h-5" />
                        <span className="text-sm">Dernière activité</span>
                      </div>
                      <p className="text-foreground">{selectedParent.lastActive}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add/Edit Parent Modal */}
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
                  <h2 className="text-foreground bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    {editingId ? 'Modifier le Parent' : 'Ajouter un Parent'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-accent rounded-xl transition-all"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <form onSubmit={handleAddOrEditParent} className="space-y-5">
                  <div>
                    <label className="block mb-2 text-foreground text-sm">Nom complet</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Jean Dupont"
                      className="w-full px-4 py-3 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-foreground text-sm">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Ex: jean.dupont@email.com"
                      className="w-full px-4 py-3 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-foreground text-sm">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ex: +33 6 12 34 56 78"
                      className="w-full px-4 py-3 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-foreground text-sm">Statut</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                      className="w-full px-4 py-3 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 transition-all"
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
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
