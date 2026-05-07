import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Plus, Edit2, Trash2, Users, FileQuestion, BookOpen } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'questions' | 'resources' | 'users'>('questions');

  const tabs = [
    { id: 'questions' as const, label: 'Questions', icon: FileQuestion },
    { id: 'resources' as const, label: 'Ressources', icon: BookOpen },
    { id: 'users' as const, label: 'Utilisateurs', icon: Users },
  ];

  const questions = [
    { id: 1, text: 'Votre enfant répond-il lorsque vous l\'appelez par son nom ?', category: 'Communication' },
    { id: 2, text: 'Votre enfant établit-il un contact visuel avec vous ?', category: 'Social' },
    { id: 3, text: 'Votre enfant pointe-t-il du doigt pour montrer quelque chose ?', category: 'Comportement' },
  ];

  const resourcesList = [
    { id: 1, title: 'Guide pour les parents', category: 'Guide', status: 'Publié' },
    { id: 2, title: 'Les signes précoces', category: 'Article', status: 'Publié' },
    { id: 3, title: 'Stratégies de communication', category: 'Vidéo', status: 'Brouillon' },
  ];

  const usersList = [
    { id: 1, name: 'Marie Dupont', email: 'marie@example.com', role: 'Parent', children: 2 },
    { id: 2, name: 'Jean Martin', email: 'jean@example.com', role: 'Parent', children: 1 },
    { id: 3, name: 'Dr. Sophie Bernard', email: 'sophie@example.com', role: 'Admin', children: 0 },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-foreground mb-2">Panneau d'administration</h1>
        <p className="text-muted-foreground">Gérez les questions, ressources et utilisateurs de la plateforme.</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'questions' && (
        <div className="bg-white rounded-xl shadow-sm border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-foreground">Gestion des questions</h3>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              <Plus className="w-5 h-5" />
              Ajouter une question
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-accent/50">
              <tr>
                <th className="text-left px-6 py-4 text-foreground">Question</th>
                <th className="text-left px-6 py-4 text-foreground">Catégorie</th>
                <th className="text-left px-6 py-4 text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id} className="border-b border-border hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 text-foreground max-w-md">{question.text}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {question.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="bg-white rounded-xl shadow-sm border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-foreground">Gestion des ressources</h3>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              <Plus className="w-5 h-5" />
              Ajouter une ressource
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-accent/50">
              <tr>
                <th className="text-left px-6 py-4 text-foreground">Titre</th>
                <th className="text-left px-6 py-4 text-foreground">Catégorie</th>
                <th className="text-left px-6 py-4 text-foreground">Statut</th>
                <th className="text-left px-6 py-4 text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resourcesList.map((resource) => (
                <tr key={resource.id} className="border-b border-border hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 text-foreground">{resource.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                      {resource.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        resource.status === 'Publié'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-chart-3/10 text-chart-3'
                      }`}
                    >
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-foreground">Gestion des utilisateurs</h3>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              <Plus className="w-5 h-5" />
              Ajouter un utilisateur
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-accent/50">
              <tr>
                <th className="text-left px-6 py-4 text-foreground">Nom</th>
                <th className="text-left px-6 py-4 text-foreground">Email</th>
                <th className="text-left px-6 py-4 text-foreground">Rôle</th>
                <th className="text-left px-6 py-4 text-foreground">Enfants</th>
                <th className="text-left px-6 py-4 text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 text-foreground">{user.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.role === 'Admin'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.children}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
