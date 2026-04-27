"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Plus,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [statsData, setStatsData] = useState<any>(null);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => setStatsData(data));

    fetch("/api/tasks?status=todo")
      .then(res => res.json())
      .then(data => setRecentTasks(data.slice(0, 3)));
  }, []);

  const stats = [
    { label: "Total Tugas", value: statsData?.totalTasks || 0, icon: TrendingUp, color: "text-primary-500", bg: "bg-primary-50 dark:bg-primary-900/20" },
    { label: "Tugas Selesai", value: statsData?.completedTasks || 0, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Pending", value: statsData?.pendingTasks || 0, icon: Clock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Terlambat (Overdue)", value: statsData?.overdueTasks || 0, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Selamat Datang, {session?.user?.name || "Mahasiswa"}! 👋</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Ini ringkasan tugas kuliahmu hari ini.</p>
        </div>
        <Link href="/tasks/create" className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all shadow-lg shadow-primary-200 dark:shadow-none font-bold">
          <Plus size={20} className="mr-2" />
          Tugas Baru
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 glass rounded-2xl card-hover"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Tugas Terdekat</h3>
            <Link href="/tasks" className="text-primary-500 hover:text-primary-600 text-sm font-semibold flex items-center">
              Lihat Semua <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentTasks.length === 0 ? (
              <p className="text-slate-500 py-10 text-center glass rounded-2xl">Tidak ada tugas mendesak. Kerja bagus!</p>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="p-4 glass rounded-2xl flex items-center justify-between card-hover border-l-4 border-primary-500">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">{task.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {task.course.name} • Deadline: {formatDate(task.deadline)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      "px-3 py-1 text-xs font-bold rounded-full capitalize",
                      task.priority === "high" ? "bg-red-100 text-red-700" : 
                      task.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
            <Sparkles className="mr-2 text-primary-500" size={24} />
            AI Insight
          </h3>
          <div className="p-6 bg-gradient-to-br from-primary-600 to-primary-400 text-white rounded-3xl shadow-xl shadow-primary-200 dark:shadow-none">
            <p className="font-medium text-primary-50">Rekomendasi hari ini:</p>
            <p className="mt-4 text-lg font-bold">
              "Fokus pada Laporan Praktikum Jaringan. Deadline tinggal 24 jam dan memiliki bobot nilai tinggi."
            </p>
            <button className="mt-6 w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-bold transition-all text-sm">
              Buat Jadwal Belajar
            </button>
          </div>
        </div>

        {/* Course Analytics */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Analitik Matkul</h3>
          <div className="glass p-6 rounded-3xl space-y-6">
            {statsData?.tasksPerCourse?.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">Belum ada data matkul.</p>
            ) : (
              statsData?.tasksPerCourse?.map((course: any) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{course.name}</span>
                    <span className="font-black text-primary-600">{course.count} Tugas</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((course.count / (statsData.pendingTasks || 1)) * 100, 100)}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: course.color || "#6366f1" }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
