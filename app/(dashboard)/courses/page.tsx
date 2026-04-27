"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Plus, 
  Users, 
  GraduationCap,
  ArrowUpRight,
  Trash2,
  Edit2
} from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCourses(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const deleteCourse = async (id: string) => {
    if (!confirm("Hapus mata kuliah ini? Semua tugas di dalamnya juga akan terhapus.")) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Mata Kuliah</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Daftar mata kuliah yang kamu ambil semester ini.</p>
        </div>
        <Link href="/courses/create" className="flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl transition-all shadow-lg shadow-primary-200 dark:shadow-none font-bold">
          <Plus size={20} className="mr-2" />
          Mata Kuliah Baru
        </Link>
      </div>

      {loading ? (
        <p className="text-center py-20 text-slate-400">Memuat mata kuliah...</p>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl">
          <p className="text-slate-500">Belum ada mata kuliah. Silakan tambahkan matkul baru!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group glass p-6 rounded-3xl card-hover flex flex-col justify-between border-t-8"
              style={{ borderTopColor: course.color || "#6366f1" }}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center" 
                    style={{ backgroundColor: `${course.color}20`, color: course.color }}
                  >
                    <BookOpen size={24} />
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      href={`/courses/${course.id}/edit`} 
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary-500"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button 
                      onClick={() => deleteCourse(course.id)} 
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
                    {course.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                    <Users size={14} className="mr-1" /> {course.lecturer || "Dosen Belum Diatur"}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <GraduationCap size={14} className="mr-1" /> Sem {course.semester}
                  </div>
                </div>
                <button className="flex items-center text-sm font-bold hover:underline" style={{ color: course.color }}>
                  Detail <ArrowUpRight size={16} className="ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
