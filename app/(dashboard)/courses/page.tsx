"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Plus, 
  Users, 
  GraduationCap,
  ArrowUpRight,
  MoreHorizontal
} from "lucide-react";

const mockCourses = [
  { id: "1", name: "Pemrograman Web", lecturer: "Budi Santoso, M.T.", semester: 4, taskCount: 5 },
  { id: "2", name: "Jaringan Komputer", lecturer: "Siti Aminah, Ph.D.", semester: 4, taskCount: 3 },
  { id: "3", name: "Etika Profesi", lecturer: "Dr. Ahmad Yani", semester: 4, taskCount: 2 },
  { id: "4", name: "Sistem Basis Data", lecturer: "Eko Prasetyo, M.Kom.", semester: 4, taskCount: 4 },
];

export default function CoursesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Mata Kuliah</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Daftar mata kuliah yang kamu ambil semester ini.</p>
        </div>
        <button className="flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl transition-all shadow-lg shadow-primary-200 dark:shadow-none font-bold">
          <Plus size={20} className="mr-2" />
          Mata Kuliah Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group glass p-6 rounded-3xl card-hover relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                <MoreHorizontal size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="w-14 h-14 bg-primary-500/10 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={28} />
            </div>

            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 leading-tight">
              {course.name}
            </h3>
            
            <div className="space-y-3 mt-4">
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <Users size={16} className="mr-2 shrink-0" />
                <span className="truncate">{course.lecturer}</span>
              </div>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <GraduationCap size={16} className="mr-2 shrink-0" />
                <span>Semester {course.semester}</span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                {course.taskCount} Tugas Aktif
              </div>
              <button className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors">
                <ArrowUpRight size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
