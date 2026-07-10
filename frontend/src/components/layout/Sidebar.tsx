import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  ListChecks,
  Code2,
  TrendingUp,
  RotateCcw,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/dsa-tracker", label: "DSA Tracker", icon: Code2 },
  { to: "/topics", label: "Topic Progress", icon: TrendingUp },
  { to: "/revisions", label: "Revisions", icon: RotateCcw },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-base-border bg-base-surface">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent font-mono text-xs font-bold text-white">
          P
        </div>
        <span className="font-semibold tracking-tight">Momentum</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent-muted text-accent font-medium"
                  : "text-ink-muted hover:bg-base-surface-raised hover:text-ink"
              )
            }
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-base-border px-3 py-3">
        <div className="flex items-center justify-between rounded-lg px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
            <p className="truncate text-xs text-ink-faint">{user?.email}</p>
          </div>
          <button
            onClick={() => logout()}
            aria-label="Log out"
            className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-base-surface-raised hover:text-danger"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
