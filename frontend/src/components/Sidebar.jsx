import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Server,
  LineChart,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../AuthProvider";

const navItems = [
  { label: "Operations Center", icon: LayoutGrid, path: "/operations" },
  { label: "Servers", icon: Server, path: "/servers" },
  { label: "Metrics History", icon: LineChart, path: "/history" },
  { label: "Alerts", icon: Bell, path: "/alerts", badge: 3 },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initial = user?.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-neko-panel-2 border-r border-neko-border h-screen sticky top-0">
      <NavLink
        to="/"
        className="flex items-center gap-3 px-6 py-6 hover:bg-white/5 transition-colors"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-neko-purple-light to-neko-purple rounded-lg flex items-center justify-center shadow-lg shadow-neko-purple/40">
          <span className="text-white font-bold text-sm">N</span>
        </div>

        <span className="text-white font-semibold text-lg hidden sm:inline">
          Neko <span className="text-neko-purple-light">Monitor</span>
        </span>
      </NavLink>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navItems.map(({ label, icon: Icon, path, badge }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-xl font-medium transition-colors ${
                isActive
                  ? "bg-neko-purple text-white shadow-lg shadow-neko-purple/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`
            }
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-neko-border p-3 space-y-1">
        <button
          onClick={() => navigate("/accounts")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-left"
        >
          <div className="w-9 h-9 rounded-full bg-neko-purple flex items-center justify-center text-white font-semibold text-sm">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-slate-200 truncate">
              {user?.username || "User"}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {user?.email || "-"}
            </div>
          </div>
          <ChevronDown size={16} className="text-slate-500" />
        </button>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
