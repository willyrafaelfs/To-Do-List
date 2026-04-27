"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Plus,
  ArrowRight,
  CalendarDays
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import MiniCalendar from "@/components/MiniCalendar";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [statsData, setStatsData] = useState<any>(null);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [aiData, setAiData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => setStatsData(data));

    fetch("/api/tasks?status=todo")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecentTasks(data.slice(0, 3));
        } else {
          setRecentTasks([]);
        }
      })
      .catch(() => setRecentTasks([]));

    fetch("/api/ai/prioritize")
      .then(res => res.json())
      .then(data => setAiData(data))
      .catch(console.error);
  }, []);

  const stats = [
    { label: "Total Tugas", value: statsData?.totalTasks || 0, icon: TrendingUp, color: "text-primary-500", bg: "bg-primary-50 dark:bg-primary-900/20" },
    { label: "Tugas Selesai", value: statsData?.completedTasks || 0, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Tenggat Hari Ini", value: statsData?.dueTodayTasks || 0, icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Mendesak (High)", value: statsData?.urgentTasks || 0, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
          Halo, {session?.user?.name?.split(" ")[0] || "Student"}! 👋
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Ini ringkasan tugas-tugas kuliahmu hari ini.</p>
      </div>

      {(statsData?.overdueTasks || 0) > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-red-500/20"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle size={24} />
            <span className="font-bold">Perhatian! Ada {statsData?.overdueTasks} tugas yang sudah lewat tenggat waktu.</span>
          </div>
          <Link href="/tasks?status=todo" className="px-4 py-2 bg-white text-red-500 font-bold rounded-xl text-sm hover:bg-red-50 transition-colors">
            Cek Sekarang
          </Link>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6 rounded-3xl"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.label}</p>
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

        {/* AI Recommendations - Real Data */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
            <Sparkles className="mr-2 text-primary-500" size={24} />
            AI Priority
          </h3>
          <div className="p-6 bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-3xl shadow-xl shadow-primary-200 dark:shadow-none space-y-4">
            {!aiData ? (
              <p className="text-primary-100 text-sm animate-pulse">AI sedang menganalisis...</p>
            ) : aiData?.ranked?.length === 0 ? (
              <p className="font-bold text-lg">Semua tugas sudah selesai! 🎉</p>
            ) : (
              <>
                <div>
                  <p className="text-xs font-bold text-primary-200 uppercase tracking-widest">Prioritas Utama Hari Ini</p>
                  <p className="text-xl font-black mt-1">{aiData.ranked[0].title}</p>
                  <p className="text-sm text-primary-100 mt-1">{aiData.ranked[0].recommendation}</p>
                </div>
                <div className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-2">
                  <span className="text-sm font-bold">AI Score</span>
                  <span className="text-2xl font-black">{aiData.ranked[0].aiScore}/100</span>
                </div>
                {aiData.summary?.critical > 0 && (
                  <p className="text-xs text-red-200 font-bold">⚠️ {aiData.summary.critical} tugas dalam status KRITIS!</p>
                )}
              </>
            )}
            <Link href="/ai-planner" className="block w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-bold transition-all text-sm text-center">
              Lihat Analisis Lengkap →
            </Link>
          </div>
        </div>

        {/* Layout for Course Analytics and Mini Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Analytics */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
              <TrendingUp size={20} className="mr-2 text-primary-500" /> Analitik Matkul
            </h3>
            <div className="glass p-6 rounded-3xl space-y-6 min-h-[350px]">
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

          {/* Mini Calendar Widget */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
              <CalendarDays size={20} className="mr-2 text-primary-500" /> Kalender Mini
            </h3>
            <div className="glass p-6 rounded-3xl min-h-[350px]">
              <MiniCalendar />
            </div>
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
