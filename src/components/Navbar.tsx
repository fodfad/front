import { Bell, User, Search } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="h-20 bg-white/80 backdrop-blur-xl border-b border-border/50 fixed top-0 right-0 left-72 z-10 flex items-center justify-between px-8 shadow-sm">
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

      <div className="flex items-center gap-4">
        <button className="relative p-3 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all group">
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <div className="text-sm text-foreground">Parent User</div>
            <div className="text-xs text-muted-foreground">parent@autiguide.com</div>
          </div>
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
