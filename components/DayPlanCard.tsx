"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ChevronRight, Flame, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudySession {
  taskId: string;
  taskTitle: string;
  courseColor: string | null;
  courseName: string;
  hoursAllocated: number;
  reason: string;
  priority: string;
  isUrgent: boolean;
}

interface DayPlan {
  date: string;
  label: string;
  totalHours: number;
  sessions: StudySession[];
  load: "light" | "moderate" | "heavy";
}

const LOAD_CONFIG = {
  light:    { label: "Ringan",  color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", bar: "bg-emerald-400" },
  moderate: { label: "Sedang",  color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-900/20",     bar: "bg-amber-400" },
  heavy:    { label: "Padat",   color: "text-red-600",     bg: "bg-red-50 dark:bg-red-900/20",         bar: "bg-red-400" },
};

interface Props {
  dayPlan: DayPlan;
  maxHours: number;
  index: number;
  compact?: boolean;
}

export default function DayPlanCard({ dayPlan, maxHours, index, compact = false }: Props) {
  const loadCfg = LOAD_CONFIG[dayPlan.load];
  const fillPct = Math.min((dayPlan.totalHours / maxHours) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Day Header */}
      <div className={cn("px-5 py-3 flex items-center justify-between", loadCfg.bg)}>
        <div>
          <p className="font-black text-slate-800 dark:text-white text-base">{dayPlan.label}</p>
          <p className="text-xs text-slate-500">{dayPlan.date}</p>
        </div>
        <div className="text-right">
          <span className={cn("text-xs font-black px-2 py-0.5 rounded-full", loadCfg.bg, loadCfg.color)}>
            {loadCfg.label}
          </span>
          <p className="text-xs text-slate-400 mt-0.5">{dayPlan.totalHours.toFixed(1)} jam</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100 dark:bg-slate-800">
        <div className={cn("h-full transition-all", loadCfg.bar)} style={{ width: `${fillPct}%` }} />
      </div>

      {/* Sessions */}
      <div className={cn("divide-y divide-slate-100 dark:divide-slate-800", compact && "max-h-48 overflow-y-auto")}>
        {dayPlan.sessions.length === 0 ? (
          <p className="px-5 py-4 text-sm text-slate-400 text-center">Tidak ada sesi belajar terjadwal.</p>
        ) : (
          dayPlan.sessions.map((session, i) => (
            <div key={`${session.taskId}-${i}`} className="px-5 py-3 flex items-center gap-3 group">
              {/* Course color dot */}
              <div
                className="w-1.5 h-8 rounded-full shrink-0"
                style={{ backgroundColor: session.courseColor || "#6366f1" }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {session.isUrgent && <Flame size={12} className="text-red-500 shrink-0" />}
                  <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{session.taskTitle}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <BookOpen size={10} />
                    {session.courseName}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {session.hoursAllocated.toFixed(1)} jam
                  </span>
                </div>
                {!compact && (
                  <p className="text-xs text-slate-400 mt-0.5 italic">{session.reason}</p>
                )}
              </div>

              {/* Link */}
              <Link
                href={`/tasks/${session.taskId}`}
                className="shrink-0 p-1.5 rounded-lg text-slate-300 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={16} />
              </Link>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
