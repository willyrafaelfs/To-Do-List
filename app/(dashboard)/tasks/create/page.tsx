"use client";

import { motion } from "framer-motion";
import { Plus, ArrowLeft, Calendar as CalendarIcon, Flag, Tag, FileText } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateTaskPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "low",
    courseId: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/tasks");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link href="/tasks" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Tambah Tugas Baru</h2>
          <p className="text-slate-500 dark:text-slate-400">Masukkan detail tugas kuliahmu.</p>
        </div>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass p-8 rounded-3xl space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Judul Tugas</label>
          <div className="relative">
            <Tag className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Contoh: Laporan Praktikum Jaringan"
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all border-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Mata Kuliah</label>
          <select 
            required
            value={formData.courseId}
            onChange={e => setFormData({...formData, courseId: e.target.value})}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all border-none appearance-none"
          >
            <option value="">Pilih Mata Kuliah</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Deadline</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="datetime-local" 
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all border-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Prioritas</label>
            <div className="relative">
              <Flag className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <select 
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all border-none appearance-none"
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Deskripsi (Opsional)</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <textarea 
              rows={4}
              placeholder="Tambahkan detail atau instruksi tugas..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all border-none resize-none"
            ></textarea>
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Tugas"}
        </button>
      </motion.form>
    </div>
  );
}
