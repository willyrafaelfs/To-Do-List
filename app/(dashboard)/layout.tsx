"use client";

import { Sidebar } from "@/components/Sidebar";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
import { Search, Bell, User as UserIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen } = useStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a]">
      <Sidebar />
      <main 
        className={cn(
          "transition-all duration-300 min-h-screen pt-20 px-6 pb-10",
          isSidebarOpen ? "pl-70" : "pl-26"
        )}
      >
        {/* Top Navbar */}
        <header className="fixed top-0 right-0 h-16 glass z-40 flex items-center justify-between px-8 transition-all duration-300" 
          style={{ left: isSidebarOpen ? '16rem' : '5rem' }}>
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari tugas, mata kuliah..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {mounted && theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-80 transition-opacity">
              <UserIcon size={18} />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
