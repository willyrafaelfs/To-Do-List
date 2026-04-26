"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Brain, 
  Calendar as CalendarIcon, 
  Clock, 
  Zap,
  ArrowRight,
  ListTodo
} from "lucide-react";
import { useState } from "react";

export default function AIPlannerPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-bold animate-pulse">
          <Sparkles size={16} className="mr-2" />
          AI Powered Productivity
        </div>
        <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white">AI Study Planner</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Biarkan AI kami menganalisis beban tugasmu dan membuat jadwal belajar yang dipersonalisasi untuk hasil maksimal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-8 glass rounded-3xl space-y-6 border-2 border-primary-500/20 shadow-2xl shadow-primary-200/20 dark:shadow-none"
        >
          <div className="w-16 h-16 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 dark:shadow-none">
            <Brain size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Analisis Tugas</h3>
          <p className="text-slate-500 dark:text-slate-400">
            Kami akan memprioritaskan tugas berdasarkan deadline, kompleksitas, dan tingkat urgensi.
          </p>
          <ul className="space-y-3">
            {[
              "Optimasi urutan belajar",
              "Estimasi waktu pengerjaan",
              "Saran teknik belajar (Pomodoro, dll)",
              "Prioritas berbasis deadline"
            ].map((feature, i) => (
              <li key={i} className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
                <Zap size={14} className="mr-2 text-amber-500" />
                {feature}
              </li>
            ))}
          </ul>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center group"
          >
            {isGenerating ? "Menganalisis..." : "Buat Jadwal Sekarang"}
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </motion.div>

        <div className="space-y-6">
          <h4 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
            <ListTodo className="mr-2 text-primary-500" size={24} />
            Output Rencana
          </h4>
          
          <div className="space-y-4">
            {isGenerating ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
              ))
            ) : (
              <>
                <div className="p-4 glass border-l-4 border-amber-500 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Sesi Pagi • 08:00</span>
                    <Clock size={16} className="text-slate-400" />
                  </div>
                  <h5 className="font-bold text-slate-800 dark:text-white">Laporan Praktikum Jaringan</h5>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fokus pada bagian topologi (60 menit)</p>
                </div>

                <div className="p-4 glass border-l-4 border-blue-500 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Sesi Siang • 13:00</span>
                    <Clock size={16} className="text-slate-400" />
                  </div>
                  <h5 className="font-bold text-slate-800 dark:text-white">Project Next.js</h5>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Implementasi CRUD User (90 menit)</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
