"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle
} from "lucide-react";
import { useState } from "react";
import { cn, formatDate } from "@/lib/utils";

const mockTasks = [
  { id: "1", title: "Laporan Praktikum Jaringan", course: "Jaringan Komputer", deadline: "2024-04-28", priority: "high", status: "todo" },
  { id: "2", title: "Project Akhir Next.js", course: "Pemrograman Web", deadline: "2024-05-01", priority: "medium", status: "progress" },
  { id: "3", title: "Essay Etika Profesi", course: "Etika Profesi", deadline: "2024-05-05", priority: "low", status: "done" },
];

const priorityColors: any = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function TasksPage() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Daftar Tugas</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola semua tugas kuliahmu di sini.</p>
        </div>
        <button className="flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl transition-all shadow-lg shadow-primary-200 dark:shadow-none font-bold">
          <Plus size={20} className="mr-2" />
          Tambah Tugas
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full md:w-auto">
          {["all", "todo", "progress", "done"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all",
                filter === f 
                  ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari tugas..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
          <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter size={20} className="text-slate-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group glass p-5 rounded-2xl flex items-center justify-between card-hover border-l-4 border-transparent hover:border-primary-500"
          >
            <div className="flex items-start space-x-4">
              <button className="mt-1 text-slate-300 hover:text-emerald-500 transition-colors">
                {task.status === "done" ? <CheckCircle2 className="text-emerald-500" size={24} /> : <Circle size={24} />}
              </button>
              <div>
                <h4 className={cn(
                  "font-bold text-lg transition-all",
                  task.status === "done" ? "text-slate-400 line-through" : "text-slate-800 dark:text-white"
                )}>
                  {task.title}
                </h4>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
                    <span className="w-2 h-2 bg-primary-400 rounded-full mr-2"></span>
                    {task.course}
                  </span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
                    <CalendarIcon size={14} className="mr-1" />
                    {formatDate(task.deadline)}
                  </span>
                  <span className={cn("px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider", priorityColors[task.priority])}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <MoreVertical size={20} className="text-slate-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
