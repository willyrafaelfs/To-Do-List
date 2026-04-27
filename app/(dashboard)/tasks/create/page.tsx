"use client";

import { motion } from "framer-motion";
import { Plus, ArrowLeft, Calendar as CalendarIcon, Flag, Tag, FileText } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const taskSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
  deadline: z.string().min(1, "Tenggat waktu wajib diisi"),
  priority: z.enum(["low", "medium", "high"]),
  courseId: z.string().min(1, "Pilih mata kuliah"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function CreateTaskPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "low",
    },
  });

  useEffect(() => {
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  const onSubmit = async (data: TaskFormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/tasks");
        router.refresh();
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
        onSubmit={handleSubmit(onSubmit)}
        className="glass p-8 rounded-3xl space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Judul Tugas</label>
          <div className="relative">
            <Tag className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              {...register("title")}
              type="text" 
              placeholder="Contoh: Laporan Praktikum Jaringan"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all border-none"
            />
          </div>
          {errors.title && <p className="text-red-500 text-xs mt-1 ml-1">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Mata Kuliah</label>
          <select 
            {...register("courseId")}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all border-none appearance-none"
          >
            <option value="">Pilih Mata Kuliah</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
          {errors.courseId && <p className="text-red-500 text-xs mt-1 ml-1">{errors.courseId.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Deadline</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                {...register("deadline")}
                type="datetime-local" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all border-none"
              />
            </div>
            {errors.deadline && <p className="text-red-500 text-xs mt-1 ml-1">{errors.deadline.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Prioritas</label>
            <div className="relative">
              <Flag className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <select 
                {...register("priority")}
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
              {...register("description")}
              rows={4}
              placeholder="Tambahkan detail atau instruksi tugas..."
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
