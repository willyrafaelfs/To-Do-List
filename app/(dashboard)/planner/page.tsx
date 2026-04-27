"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BookOpenCheck, 
  RefreshCcw, 
  Settings2, 
  Clock, 
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Zap
} from "lucide-react";
import DayPlanCard from "@/components/DayPlanCard";

export default function PlannerPage() {
  const [planData, setPlanData] = useState<any>(null);
  const [prefs, setPrefs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    studyHoursPerDay: 4,
    preferredStudyTime: "morning",
  });
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [planningDays, setPlanningDays] = useState(7);

  const fetchPlan = async (days = planningDays) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/planner/generate?days=${days}`);
      const data = await res.json();
      if (data.plan) {
        setPlanData(data.plan);
        setPrefs(data.preferences);
        setSettingsForm({
          studyHoursPerDay: data.preferences.studyHoursPerDay,
          preferredStudyTime: data.preferences.preferredStudyTime,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlan(); }, []);

  const savePreferences = async () => {
    setSavingPrefs(true);
    try {
      await fetch("/api/planner/generate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      await fetchPlan(planningDays);
      setShowSettings(false);
    } finally {
      setSavingPrefs(false);
    }
  };

  const LOAD_LABELS: Record<string, string> = {
    light: "bg-emerald-100 text-emerald-700",
    moderate: "bg-amber-100 text-amber-700",
    heavy: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <BookOpenCheck className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Study Planner</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Jadwal belajar otomatis berbasis AI</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={planningDays}
            onChange={e => { setPlanningDays(Number(e.target.value)); fetchPlan(Number(e.target.value)); }}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value={3}>3 Hari</option>
            <option value={7}>7 Hari</option>
            <option value={14}>14 Hari</option>
          </select>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2.5 glass rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <Settings2 size={20} />
          </button>
          <button
            onClick={() => fetchPlan(planningDays)}
            className="flex items-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-200 dark:shadow-none"
          >
            <RefreshCcw size={16} className="mr-2" /> Buat Ulang
          </button>
        </div>
      </div>

      {/* Preferences Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-3xl space-y-4"
        >
          <h3 className="font-bold text-slate-800 dark:text-white">Preferensi Belajar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-300">Jam Belajar per Hari</label>
              <div className="flex items-center gap-4">
                <input
                  type="range" min={1} max={12} step={0.5}
                  value={settingsForm.studyHoursPerDay}
                  onChange={e => setSettingsForm({ ...settingsForm, studyHoursPerDay: Number(e.target.value) })}
                  className="flex-1 accent-emerald-500"
                />
                <span className="font-black text-2xl text-emerald-600 w-12 text-center">{settingsForm.studyHoursPerDay}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-300">Waktu Belajar Favorit</label>
              <select
                value={settingsForm.preferredStudyTime}
                onChange={e => setSettingsForm({ ...settingsForm, preferredStudyTime: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 border-none"
              >
                <option value="morning">Pagi (06:00 – 12:00)</option>
                <option value="afternoon">Siang (12:00 – 17:00)</option>
                <option value="evening">Sore (17:00 – 21:00)</option>
                <option value="night">Malam (21:00 – 00:00)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowSettings(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
              Batal
            </button>
            <button
              onClick={savePreferences}
              disabled={savingPrefs}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50"
            >
              {savingPrefs ? "Menyimpan..." : "Simpan & Buat Ulang"}
            </button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="glass rounded-3xl p-20 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-slate-500 font-medium">Planner sedang menyusun jadwal belajarmu...</p>
        </div>
      ) : (
        <>
          {/* Summary Row */}
          {planData?.summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Tugas Aktif", value: planData.summary.totalTasks, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
                { label: "Total Jam Belajar", value: `${planData.summary.totalStudyHours?.toFixed(1)} jam`, icon: Clock, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
                { label: "Hari Terjadwal", value: planData.summary.scheduledDays, icon: CalendarDays, color: "text-primary-600 bg-primary-50 dark:bg-primary-900/20" },
                { label: "Tidak Terjadwal", value: planData.summary.unscheduled?.length || 0, icon: AlertTriangle, color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className={`glass p-5 rounded-2xl ${s.color.split(" ").slice(1).join(" ")}`}
                >
                  <s.icon className={`mb-2 ${s.color.split(" ")[0]}`} size={22} />
                  <p className={`text-3xl font-black ${s.color.split(" ")[0]}`}>{s.value}</p>
                  <p className="text-xs font-bold text-slate-500 mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Warnings */}
          {planData?.warnings?.length > 0 && (
            <div className="space-y-2">
              {planData.warnings.map((w: string, i: number) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl text-amber-700 dark:text-amber-300 text-sm"
                >
                  <Zap size={16} className="shrink-0 mt-0.5" />
                  <span>{w}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Day Plans Grid */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <CalendarDays size={22} className="text-emerald-500" /> Jadwal Belajar Mingguan
            </h3>
            {planData?.days?.length === 0 ? (
              <div className="glass rounded-3xl p-16 text-center">
                <CheckCircle2 className="mx-auto text-emerald-400 mb-4" size={48} />
                <p className="font-bold text-slate-600 dark:text-slate-300">Tidak ada tugas aktif untuk dijadwalkan.</p>
                <p className="text-sm text-slate-400 mt-1">Kerja bagus! Semua tugasmu sudah selesai.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {planData?.days?.map((day: any, i: number) => (
                  <DayPlanCard
                    key={day.date}
                    dayPlan={day}
                    maxHours={prefs?.studyHoursPerDay ?? 4}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Unscheduled tasks */}
          {planData?.summary?.unscheduled?.length > 0 && (
            <div className="glass p-6 rounded-3xl border-l-4 border-red-400">
              <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-red-500" /> Tugas Tidak Dapat Dijadwalkan
              </h4>
              <p className="text-sm text-slate-500 mb-3">Tugas berikut tidak cukup waktu untuk dijadwalkan dalam {planningDays} hari ke depan. Pertimbangkan mengurangi estimasi jam atau menambah jam belajar per hari.</p>
              <ul className="space-y-1">
                {planData.summary.unscheduled.map((t: string) => (
                  <li key={t} className="text-sm font-bold text-red-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
