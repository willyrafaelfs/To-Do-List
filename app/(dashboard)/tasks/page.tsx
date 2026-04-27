"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const priorityColors: any = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?status=${filter}&priority=${priorityFilter}&courseId=${courseFilter}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [filter, priorityFilter, courseFilter]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "done" ? "todo" : "done";
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm("Hapus tugas ini?")) return;
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.course.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Daftar Tugas</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola semua tugas kuliahmu di sini.</p>
        </div>
        <Link href="/tasks/create" className="flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl transition-all shadow-lg shadow-primary-200 dark:shadow-none font-bold">
          <Plus size={20} className="mr-2" />
          Tambah Tugas
        </Link>
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

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari tugas..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
            />
          </div>

          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium transition-all shadow-sm"
          >
            <option value="all">Semua Prioritas</option>
            <option value="high">Tinggi</option>
            <option value="medium">Sedang</option>
            <option value="low">Rendah</option>
          </select>

          <select 
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium transition-all shadow-sm"
          >
            <option value="all">Semua Matkul</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <p className="text-center py-10 text-slate-400">Memuat tugas...</p>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl">
            <p className="text-slate-500">Tidak ada tugas ditemukan.</p>
          </div>
        ) : (
          filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group glass p-5 rounded-2xl flex items-center justify-between card-hover border-l-4 border-transparent hover:border-primary-500"
            >
              <div className="flex items-start space-x-4 flex-1">
                <button 
                  onClick={() => toggleStatus(task.id, task.status)}
                  className="mt-1 text-slate-300 hover:text-emerald-500 transition-colors shrink-0"
                >
                  {task.status === "done" ? <CheckCircle2 className="text-emerald-500" size={24} /> : <Circle size={24} />}
                </button>
                <Link href={`/tasks/${task.id}`} className="flex-1 min-w-0 group/text">
                  <h4 className={cn(
                    "font-bold text-lg transition-all group-hover/text:text-primary-600 truncate",
                    task.status === "done" ? "text-slate-400 line-through" : "text-slate-800 dark:text-white"
                  )}>
                    {task.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
                      <span className="w-2 h-2 bg-primary-400 rounded-full mr-2"></span>
                      {task.course.name}
                    </span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
                      <CalendarIcon size={14} className="mr-1" />
                      {formatDate(task.deadline)}
                    </span>
                    <span className={cn("px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider", priorityColors[task.priority])}>
                      {task.priority}
                    </span>
                  </div>
                </Link>
              </div>
              
              <div className="flex items-center space-x-1 ml-4">
                <Link 
                  href={`/tasks/${task.id}/edit`}
                  className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary-500"
                >
                  <Edit2 size={18} />
                </Link>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
