import { LayoutDashboard, Users, FileText, BarChart3, TrendingUp, BookOpen, Sparkles, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Enfants', path: '/children' },
  { icon: FileText, label: 'Questionnaire', path: '/questionnaire' },
  { icon: BarChart3, label: 'Résultats', path: '/results' },
  { icon: TrendingUp, label: 'Suivi', path: '/tracking' },
  { icon: BookOpen, label: 'Ressources', path: '/resources' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="w-72 bg-white/80 backdrop-blur-xl border-r border-border/50 h-screen fixed left-0 top-0 flex flex-col shadow-xl">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-sky-600">AutiGuide</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl mb-1 transition-all group relative overflow-hidden ${isActive
                    ? 'bg-sky-600 text-white shadow-lg'
                    : 'text-foreground hover:bg-gradient-to-r hover:bg-sky-50'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-sky-600 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-br sky-50 p-4 rounded-xl border border-sky-100">
          <p className="text-sm text-foreground mb-1">Besoin d'aide ?</p>
          <p className="text-xs text-muted-foreground mb-3">Contactez notre support</p>
          <button className="text-xs bg-sky-600 text-white px-4 py-2 rounded-lg w-full hover:shadow-lg transition-all">
            Support 24/7
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sky-600 hover:bg-sky-50 border border-transparent hover:border-sky-100 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
