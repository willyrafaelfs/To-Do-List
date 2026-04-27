"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Target
} from "lucide-react";
import {
  WeeklyProductivityChart,
  DeadlinePressureChart,
  CourseDistributionChart
} from "@/components/AnalyticsCharts";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
            <BarChart2 className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Analytics</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Pantau produktivitas dan performa belajarmu</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="glass rounded-3xl p-20 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-slate-500 font-medium">Memuat data analitik...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Selesai", value: data?.summary?.completed || 0, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" },
              { label: "Tingkat Penyelesaian", value: `${data?.summary?.completionRate || 0}%`, icon: Target, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" },
              { label: "Rata-rata Waktu", value: `${data?.summary?.avgCompletionTime || 0} Hari`, icon: Clock, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
              { label: "Tugas Overdue", value: data?.summary?.overdue || 0, icon: AlertTriangle, color: "text-red-500 bg-red-50 dark:bg-red-900/20" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`glass p-5 rounded-3xl`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color.split(" ").slice(1).join(" ")}`}>
                  <s.icon className={`${s.color.split(" ")[0]}`} size={20} />
                </div>
                <p className="text-2xl font-black text-slate-800 dark:text-white">{s.value}</p>
                <p className="text-sm font-bold text-slate-500 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Productivity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-3xl">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center">
                <TrendingUp size={20} className="mr-2 text-indigo-500" /> Tren Produktivitas Mingguan
              </h3>
              {data?.weeklyProductivity && <WeeklyProductivityChart data={data.weeklyProductivity} />}
            </motion.div>

            {/* Deadline Pressure */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6 rounded-3xl">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center">
                <Clock size={20} className="mr-2 text-orange-500" /> Deadline Pressure (Pending Tasks)
              </h3>
              {data?.deadlinePressure && <DeadlinePressureChart data={data.deadlinePressure} />}
            </motion.div>

            {/* Course Distribution */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass p-6 rounded-3xl lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center justify-center">
                <BarChart2 size={20} className="mr-2 text-emerald-500" /> Distribusi Tugas per Mata Kuliah
              </h3>
              {data?.tasksPerCourse?.length > 0 ? (
                <CourseDistributionChart data={data.tasksPerCourse} />
              ) : (
                <p className="text-center text-slate-500 py-10">Belum ada data mata kuliah.</p>
              )}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
