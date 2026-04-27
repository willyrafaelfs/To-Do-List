"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Flag, 
  BookOpen, 
  CheckCircle2, 
  Circle,
  Clock,
  Edit2,
  Trash2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/tasks`)
      .then(res => res.json())
      .then(data => {
        const foundTask = data.find((t: any) => t.id === id);
        setTask(foundTask);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini?")) return;
    
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/tasks");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async () => {
    const newStatus = task.status === "done" ? "todo" : "done";
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const updated = await res.json();
        setTask({...task, status: updated.status});
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center py-20 text-slate-400">Memuat detail tugas...</div>;
  if (!task) return <div className="text-center py-20 text-slate-500">Tugas tidak ditemukan.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/tasks" className="flex items-center text-slate-500 hover:text-primary-600 transition-colors font-medium">
          <ArrowLeft size={20} className="mr-2" /> Kembali ke Daftar
        </Link>
        <div className="flex items-center space-x-2">
          <Link 
            href={`/tasks/${id}/edit`}
            className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:text-primary-500 transition-all shadow-sm"
          >
            <Edit2 size={18} />
          </Link>
          <button 
            onClick={handleDelete}
            className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:text-red-500 transition-all shadow-sm"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className={cn(
                "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest",
                task.priority === "high" ? "bg-red-100 text-red-700" : 
                task.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
              )}>
                {task.priority} Priority
              </span>
              <span className="px-4 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-xs font-black uppercase tracking-widest">
                {task.course.name}
              </span>
            </div>
            <h1 className={cn(
              "text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white leading-tight",
              task.status === "done" && "line-through opacity-50"
            )}>
              {task.title}
            </h1>
          </div>
          
          <button 
            onClick={toggleStatus}
            className={cn(
              "shrink-0 px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-3 shadow-lg",
              task.status === "done" 
                ? "bg-emerald-500 text-white shadow-emerald-200" 
                : "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            )}
          >
            {task.status === "done" ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            <span>{task.status === "done" ? "Selesai" : "Tandai Selesai"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mr-4">
              <CalendarIcon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Deadline</p>
              <p className="font-bold text-slate-700 dark:text-white">{formatDate(task.deadline)}</p>
            </div>
          </div>

          <div className="flex items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mr-4">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
              <p className="font-bold text-slate-700 dark:text-white capitalize">{task.status}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
            <AlertCircle size={20} className="mr-2 text-primary-500" />
            Deskripsi Tugas
          </h3>
          <div className="p-8 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl text-slate-600 dark:text-slate-400 leading-relaxed min-h-[150px]">
            {task.description || "Tidak ada deskripsi tambahan untuk tugas ini."}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
