import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Upload, BookOpen, Video, FileText, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Resource {
  id: number;
  title: string;
  type: 'article' | 'video' | 'pdf';
  category: string;
  status: 'published' | 'draft';
  views: number;
  uploadDate: string;
}

const resources: Resource[] = [
  { id: 1, title: 'Guide complet sur l\'autisme', type: 'pdf', category: 'Guide', status: 'published', views: 1234, uploadDate: '2024-01-15' },
  { id: 2, title: 'Vidéo: Signes précoces', type: 'video', category: 'Vidéo', status: 'published', views: 856, uploadDate: '2024-02-20' },
  { id: 3, title: 'Stratégies de communication', type: 'article', category: 'Article', status: 'published', views: 645, uploadDate: '2024-03-10' },
  { id: 4, title: 'Interventions précoces', type: 'article', category: 'Article', status: 'draft', views: 0, uploadDate: '2024-04-05' },
];

export default function ResourcesPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'pdf': return FileText;
      default: return BookOpen;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case 'video': return 'from-rose-500 to-pink-500';
      case 'pdf': return 'from-emerald-500 to-teal-500';
      default: return 'from-indigo-500 to-purple-600';
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
            Gestion des Ressources
          </h1>
          <p className="text-muted-foreground">Publier et gérer les ressources éducatives</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
        >
          <Upload className="w-5 h-5" />
          Ajouter une ressource
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => {
          const Icon = getIcon(resource.type);
          const gradient = getGradient(resource.type);

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
                  <span className={`px-4 py-1.5 rounded-full text-sm shadow-lg ${
                    resource.status === 'published'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  }`}>
                    {resource.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </div>

                <h3 className="text-foreground mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{resource.category}</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{resource.views} vues</span>
                  <span>{resource.uploadDate}</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all">
                    <Edit2 className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
