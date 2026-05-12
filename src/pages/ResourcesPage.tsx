import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Search, BookOpen, Video, FileText, ExternalLink, Filter, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../api/apiClient';

interface Resource {
  id: number;
  titre?: string;
  title?: string;
  description: string;
  categorie?: string;
  category?: string;
  type?: string;
  lien?: string;
}

const fallbackResources: Resource[] = [
  { id: 1, titre: "Comprendre l'autisme : Guide pour les parents", description: "Un guide complet pour comprendre les signes précoces de l'autisme et comment accompagner votre enfant.", categorie: 'Guide', type: 'guide' },
  { id: 2, titre: "Les signes précoces de l'autisme chez les tout-petits", description: "Article détaillé sur les comportements à observer chez les enfants de 0-3 ans.", categorie: 'Article', type: 'article' },
  { id: 3, titre: "Stratégies de communication pour enfants autistes", description: "Vidéo éducative présentant des techniques de communication efficaces.", categorie: 'Vidéo', type: 'video' },
  { id: 4, titre: "Interventions précoces et leur importance", description: "Pourquoi le dépistage et l'intervention précoces sont cruciaux pour le développement.", categorie: 'Article', type: 'article' },
  { id: 5, titre: "Créer un environnement adapté à la maison", description: "Guide pratique pour aménager un espace rassurant et stimulant pour votre enfant.", categorie: 'Guide', type: 'guide' },
  { id: 6, titre: "Gérer les crises et les comportements difficiles", description: "Techniques éprouvées pour gérer les moments difficiles avec bienveillance.", categorie: 'Vidéo', type: 'video' },
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  useEffect(() => {
    apiClient
      .get('/ressources')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setResources(res.data);
        } else {
          setResources(fallbackResources);
        }
      })
      .catch(() => setResources(fallbackResources))
      .finally(() => setLoading(false));
  }, []);

  const getTitle = (r: Resource) => r.titre || r.title || '';
  const getCategory = (r: Resource) => r.categorie || r.category || 'Autre';
  const getType = (r: Resource) => r.type || 'article';

  const categories = ['Tous', ...Array.from(new Set(resources.map(getCategory)))];

  const filteredResources = resources.filter((resource) => {
    const title = getTitle(resource).toLowerCase();
    const desc = resource.description?.toLowerCase() || '';
    const matchesSearch = title.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || getCategory(resource) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'guide': return BookOpen;
      default: return FileText;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case 'video': return 'from-rose-500 to-pink-500';
      case 'guide': return 'from-emerald-500 to-teal-500';
      default: return 'from-indigo-500 to-purple-600';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-foreground mb-2 text-sky-600 inline-block">
          Ressources
        </h1>
        <p className="text-muted-foreground">Explorez nos guides, articles et vidéos sur l'autisme et le développement de l'enfant</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-border/50 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher des ressources..."
              className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-2xl transition-all ${
                    selectedCategory === category
                      ? 'bg-sky-600 text-white shadow-lg'
                      : 'bg-white/50 text-foreground hover:bg-white border-2 border-border'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource, index) => {
          const type = getType(resource);
          const Icon = getIcon(type);
          const gradient = getGradient(type);
          const title = getTitle(resource);
          const category = getCategory(resource);

          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-border/50 overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
            >
              <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm text-white bg-gradient-to-r ${gradient} shadow-lg`}>
                    {category}
                  </span>
                </div>

                <h3 className="text-foreground mb-3 group-hover:text-sky-600 transition-colors line-clamp-2">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3 leading-relaxed">
                  {resource.description}
                </p>

                <button
                  onClick={() => resource.lien && window.open(resource.lien, '_blank')}
                  className="flex items-center gap-2 text-sky-600 hover:gap-3 transition-all group-hover:text-sky-600"
                >
                  <span className="text-sm">En savoir plus</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className={`h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            </motion.div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl p-16 rounded-3xl shadow-xl border border-border/50 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-sky-600" />
          </div>
          <p className="text-muted-foreground text-lg">
            Aucune ressource trouvée pour votre recherche
          </p>
        </motion.div>
      )}
    </Layout>
  );
}
