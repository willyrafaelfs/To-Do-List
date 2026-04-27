"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  Flame, 
  Leaf, 
  ChevronRight, 
  RefreshCcw,
  Shield
} from "lucide-react";

const URGENCY_CONFIG = {
  KRITIS: { icon: Flame, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", badge: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300", label: "🔴 KRITIS" },
  MENDESAK: { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300", label: "🟠 MENDESAK" },
  NORMAL: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20", badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300", label: "🟡 NORMAL" },
  SANTAI: { icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300", label: "🟢 SANTAI" },
};

function formatTimeLeft(hoursLeft: number | null): string {
  if (hoursLeft === null) return "Tanpa tenggat waktu";
  if (hoursLeft < 0) return `Terlambat ${Math.abs(Math.round(hoursLeft))} jam`;
  if (hoursLeft < 1) return "Kurang dari 1 jam!";
  if (hoursLeft < 24) return `${Math.round(hoursLeft)} jam lagi`;
  return `${Math.round(hoursLeft / 24)} hari lagi`;
}

export default function AIPlannerPage() {
  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAI = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/prioritize");
      const data = await res.json();
      setAiData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAI();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white">AI Planner</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Rekomendasi prioritas tugas berbasis AI</p>
            </div>
          </div>
        </div>
        <button
          onClick={fetchAI}
          className="flex items-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary-200 dark:shadow-none"
        >
          <RefreshCcw size={16} className="mr-2" /> Analisis Ulang
        </button>
      </div>

      {loading ? (
        <div className="glass rounded-3xl p-16 text-center">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-slate-500 font-medium">AI sedang menganalisis tugasmu...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          {aiData?.summary && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Tugas Aktif", value: aiData.summary.total, color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-900/20" },
                { label: "Status Kritis", value: aiData.summary.critical, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
                { label: "Sudah Overdue", value: aiData.summary.overdue, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`glass p-5 rounded-2xl ${s.bg}`}>
                  <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-sm font-bold text-slate-500 mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Today's Priority */}
          {aiData?.today?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                <Flame className="mr-2 text-red-500" size={22} /> Kerjakan Hari Ini
              </h3>
              <div className="space-y-3">
                {aiData.today.slice(0, 3).map((task: any, i: number) => {
                  const cfg = URGENCY_CONFIG[task.urgencyLabel as keyof typeof URGENCY_CONFIG];
                  return (
                    <motion.div key={task.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className={`glass p-5 rounded-2xl border-l-4 flex items-center justify-between`}
                      style={{ borderLeftColor: task.urgencyColor }}
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                          <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full" style={{ color: task.course.color }}>{task.course.name}</span>
                        </div>
                        <p className="font-bold text-slate-800 dark:text-white truncate">{task.title}</p>
                        <p className="text-xs text-slate-500">{formatTimeLeft(task.hoursLeft)} · Skor AI: <span className="font-black text-primary-600">{task.aiScore}</span></p>
                      </div>
                      <Link href={`/tasks/${task.id}`} className="ml-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-primary-500 transition-colors">
                        <ChevronRight size={20} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Ranked List */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
              <Shield className="mr-2 text-primary-500" size={22} /> Ranking Semua Tugas
            </h3>

            {aiData?.ranked?.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center">
                <Leaf className="mx-auto text-emerald-400 mb-4" size={48} />
                <p className="font-bold text-slate-600 dark:text-slate-300">Tidak ada tugas aktif yang perlu diprioritaskan.</p>
                <p className="text-sm text-slate-400 mt-1">Kerja bagus! Semua tugasmu sudah selesai.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aiData.ranked.map((task: any, i: number) => {
                  const cfg = URGENCY_CONFIG[task.urgencyLabel as keyof typeof URGENCY_CONFIG];
                  const UrgencyIcon = cfg.icon;
                  return (
                    <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="glass p-5 rounded-2xl"
                    >
                      <div className="flex items-start gap-4">
                        {/* Rank */}
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-500 text-sm shrink-0">
                          {i + 1}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                            <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full" style={{ color: task.course.color }}>
                              {task.course.name}
                            </span>
                          </div>
                          <p className="font-bold text-slate-800 dark:text-white">{task.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{task.recommendation}</p>

                          {/* Warnings */}
                          {task.warnings.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {task.warnings.map((w: string, wi: number) => (
                                <span key={wi} className="text-xs px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg">{w}</span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Score + Time */}
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-black text-primary-600">{task.aiScore}</div>
                          <div className="text-xs text-slate-400">{formatTimeLeft(task.hoursLeft)}</div>
                          <Link href={`/tasks/${task.id}`} className="mt-1 inline-block text-xs font-bold text-primary-500 hover:underline">
                            Detail →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
