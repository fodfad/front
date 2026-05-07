import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Search, Filter, Eye, Baby, User, Cake, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Child {
  id: number;
  name: string;
  age: number;
  birthdate: string;
  gender: string;
  parent: string;
  communicationLevel: number;
  socialScore: number;
  riskLevel: 'Faible' | 'Moyen' | 'Élevé';
  testsCompleted: number;
}

const children: Child[] = [
  { id: 1, name: 'Emma Dupont', age: 3, birthdate: '2023-03-15', gender: 'Fille', parent: 'Marie Dupont', communicationLevel: 8, socialScore: 7, riskLevel: 'Faible', testsCompleted: 5 },
  { id: 2, name: 'Lucas Martin', age: 5, birthdate: '2021-07-22', gender: 'Garçon', parent: 'Jean Martin', communicationLevel: 6, socialScore: 5, riskLevel: 'Moyen', testsCompleted: 8 },
  { id: 3, name: 'Sophie Bernard', age: 2, birthdate: '2024-01-10', gender: 'Fille', parent: 'Sophie Bernard', communicationLevel: 9, socialScore: 8, riskLevel: 'Faible', testsCompleted: 3 },
  { id: 4, name: 'Thomas Dubois', age: 4, birthdate: '2022-05-08', gender: 'Garçon', parent: 'Pierre Dubois', communicationLevel: 4, socialScore: 4, riskLevel: 'Élevé', testsCompleted: 12 },
];

export default function ChildrenManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('Tous');

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.parent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'Tous' || child.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const getRiskGradient = (risk: string) => {
    switch (risk) {
      case 'Faible': return 'from-emerald-500 to-teal-500';
      case 'Moyen': return 'from-orange-500 to-amber-500';
      case 'Élevé': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-foreground mb-2 bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent inline-block">
          Gestion des Enfants
        </h1>
        <p className="text-muted-foreground">Suivre le développement et les résultats des enfants</p>
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
              placeholder="Rechercher un enfant..."
              className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-6 py-4 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
            >
              <option>Tous</option>
              <option>Faible</option>
              <option>Moyen</option>
              <option>Élevé</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChildren.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="group bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-border/50 hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-white text-xl">
                    {child.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-foreground">{child.name}</h3>
                  <p className="text-sm text-muted-foreground">{child.age} ans</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm text-white bg-gradient-to-r ${getRiskGradient(child.riskLevel)} shadow-lg`}>
                {child.riskLevel}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Parent: {child.parent}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Cake className="w-4 h-4" />
                <span>{child.birthdate} • {child.gender}</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Communication</span>
                  <span className="text-foreground">{child.communicationLevel}/10</span>
                </div>
                <div className="h-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                    style={{ width: `${child.communicationLevel * 10}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Social</span>
                  <span className="text-foreground">{child.socialScore}/10</span>
                </div>
                <div className="h-2 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all"
                    style={{ width: `${child.socialScore * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>{child.testsCompleted} tests</span>
              </div>
              <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
}
