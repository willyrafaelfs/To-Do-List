"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function LandingPage() {
  const { data: session, status } = useSession();

  // Jika sudah login, berikan pilihan untuk ke dashboard di Hero, 
  // tapi jangan redirect otomatis agar user bisa melihat landing page jika mau.

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Manajemen Tugas Kuliah
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-primary-600 transition-colors">Fitur</a>
            <a href="#about" className="hover:text-primary-600 transition-colors">Tentang</a>
            {session ? (
              <Link href="/dashboard" className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                Ke Dashboard
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="hover:text-primary-600 transition-colors font-bold">Masuk</Link>
                <Link href="/register" className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                  Daftar Gratis
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-primary-500/5 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-bold"
          >
            <Sparkles size={16} className="mr-2" />
            Asisten Kuliah Nomor 1 di Indonesia
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-800 dark:text-white leading-tight"
          >
            Kelola Tugas Kuliah <br />
            <span className="bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent">
              Lebih Cerdas & Cepat
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Jangan biarkan deadline menumpuk. Gunakan sistem manajemen tugas yang dirancang khusus untuk mahasiswa masa kini. Lengkap dengan AI Planner.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 flex items-center justify-center group">
              Mulai Sekarang
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700">
              Cek Demo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Fitur Unggulan</h2>
          <p className="text-slate-500 dark:text-slate-400">Segala yang Anda butuhkan untuk sukses di perkuliahan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Manajemen Tugas", 
              desc: "Pantau semua tugas dari berbagai mata kuliah dalam satu dashboard yang bersih.",
              icon: CheckCircle2,
              color: "text-emerald-500",
              bg: "bg-emerald-50 dark:bg-emerald-900/20"
            },
            { 
              title: "AI Study Planner", 
              desc: "Biarkan AI kami membuatkan jadwal belajar optimal berdasarkan deadline Anda.",
              icon: Sparkles,
              color: "text-primary-500",
              bg: "bg-primary-50 dark:bg-primary-900/20"
            },
            { 
              title: "Analitik Statistik", 
              desc: "Lihat progres belajar Anda dengan grafik dan data statistik yang mendalam.",
              icon: BarChart3,
              color: "text-purple-500",
              bg: "bg-purple-50 dark:bg-purple-900/20"
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 glass rounded-3xl space-y-4 border border-slate-200/50 dark:border-slate-800/50"
            >
              <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
        <p>© 2024 ManajenTugas. Dibuat dengan ❤️ untuk Mahasiswa Indonesia.</p>
      </footer>
    </div>
  );
}
