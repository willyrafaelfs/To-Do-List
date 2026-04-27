"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  ArrowRight,
  LayoutDashboard,
  CheckCircle2,
  Calendar,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#030712] text-slate-900 dark:text-slate-100 flex flex-col justify-center relative overflow-hidden">
      {/* Dekorasi Background Minimalis */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <main className="max-w-4xl mx-auto px-6 w-full py-20">
        <div className="space-y-12">
          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 mb-8"
          >
            <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center">
              <Zap className="text-white dark:text-slate-900" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">Personal Task System</span>
          </motion.div>

          {/* Hero Content */}
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]"
            >
              Organize. <br />
              <span className="text-slate-400 dark:text-slate-600">Focus.</span> Achieve.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-xl font-medium leading-relaxed"
            >
              Sistem manajemen tugas pribadi yang dirancang untuk efisiensi maksimal tanpa gangguan.
            </motion.p>
          </div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            {session ? (
              <Link href="/dashboard" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-slate-200 dark:shadow-none flex items-center group">
                Buka Dashboard
                <LayoutDashboard className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-slate-200 dark:shadow-none flex items-center group">
                  Masuk Ke Sistem
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link href="/register" className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  Buat Akun
                </Link>
              </>
            )}
          </motion.div>

          {/* Quick Shortcuts Hint (Visual Only) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-6 pt-16 border-t border-slate-100 dark:border-slate-900"
          >
            {[
              { icon: CheckCircle2, label: "Task List" },
              { icon: Calendar, label: "Calendar" },
              { icon: BarChart3, label: "Analytics" }
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3 text-slate-400 dark:text-slate-600">
                <item.icon size={18} />
                <span className="text-sm font-bold tracking-wide uppercase">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Version Tag */}
      <div className="absolute bottom-10 left-10 text-[10px] font-black tracking-[0.2em] uppercase text-slate-300 dark:text-slate-800 vertical-text">
        Private Beta v2.4.0
      </div>
    </div>
  );
}
