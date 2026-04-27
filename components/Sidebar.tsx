"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Calendar, 
  Settings, 
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpenCheck
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tugas", href: "/tasks", icon: CheckSquare },
  { label: "Mata Kuliah", href: "/courses", icon: BookOpen },
  { label: "Kalender", href: "/calendar", icon: Calendar },
  { label: "Study Planner", href: "/planner", icon: BookOpenCheck },
  { label: "AI Planner", href: "/ai-planner", icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useStore();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full glass transition-all duration-300 z-50 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {isSidebarOpen && (
          <h1 className="font-bold text-xl bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            ManajenTugas
          </h1>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center p-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-200 dark:shadow-none" 
                  : "hover:bg-primary-50 dark:hover:bg-primary-900/30 text-slate-600 dark:text-slate-400"
              )}
            >
              <Icon className={cn("shrink-0", isSidebarOpen ? "mr-3" : "mx-auto")} size={22} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center w-full p-3 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className={cn("shrink-0", isSidebarOpen ? "mr-3" : "mx-auto")} size={22} />
          {isSidebarOpen && <span className="font-medium">Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
