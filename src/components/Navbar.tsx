import { Search } from 'lucide-react';

export default function Navbar() {
  // Lire l'utilisateur connecté depuis le localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const prenom = user.prenom || '';
  const nom = user.nom || '';
  const email = user.email || '';
  const displayName = prenom && nom
    ? `${prenom} ${nom}`
    : prenom || nom || 'Utilisateur';
  const initiale = displayName.charAt(0).toUpperCase();

  return (
    <div className="h-20 bg-white/80 backdrop-blur-xl border-b border-border/50 fixed top-0 right-0 left-72 z-10 flex items-center justify-between px-8 shadow-sm">
      {/* Barre de recherche */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Profil utilisateur — vrai nom et email */}
      <div className="flex items-center gap-3 pl-4 border-l border-border">
        <div className="text-right">
          <div className="text-sm text-foreground font-medium">{displayName}</div>
          <div className="text-xs text-muted-foreground">{email}</div>
        </div>
        <div className="w-11 h-11 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
          <span className="text-white font-semibold text-sm">{initiale}</span>
        </div>
      </div>
    </div>
  );
}
