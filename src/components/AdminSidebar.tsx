import { LayoutDashboard, Users, Baby, FileQuestion, BarChart3, BookOpen, ClipboardList, Shield, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Parents', path: '/admin/parents' },
  { icon: Baby, label: 'Enfants', path: '/admin/children' },
  { icon: FileQuestion, label: 'Questionnaires', path: '/admin/questionnaires' },
  { icon: BarChart3, label: 'Résultats & Analytics', path: '/admin/analytics' },
  { icon: BookOpen, label: 'Ressources', path: '/admin/resources' },
  { icon: ClipboardList, label: 'Plans Personnalisés', path: '/admin/plans' },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Dans un cas réel, vous videriez le localStorage ou l'état global ici
    navigate('/login');
  };

  return (
    <div className="w-72 bg-white/80 backdrop-blur-xl border-r border-border/50 h-screen fixed left-0 top-0 flex flex-col shadow-xl">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-sky-600">AutiGuide</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
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
                    layoutId="admin-active-pill"
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

      <div className="p-4 border-t border-border/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sky-600 hover:bg-sky-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
