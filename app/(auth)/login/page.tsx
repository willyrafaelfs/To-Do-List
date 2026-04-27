"use client";

import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau password salah");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/login-bg.png')" }}
      />
      {/* Dark overlay for better contrast if needed */}
      <div className="absolute inset-0 z-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-8 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner border border-white/30 backdrop-blur-md">
              <LogIn className="text-white" size={32} />
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-center text-white mb-2 tracking-tight drop-shadow-sm">Masuk</h2>
          <p className="text-center text-white/70 mb-8 font-medium">Lanjutkan ke workspace pribadi Anda</p>

          {registered && (
            <div className="bg-emerald-500/20 backdrop-blur-md text-emerald-100 p-3 rounded-xl text-sm mb-6 font-medium border border-emerald-500/30 text-center">
              Registrasi berhasil! Silakan masuk.
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 backdrop-blur-md text-red-100 p-3 rounded-xl text-sm mb-6 font-medium border border-red-500/30 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/90 ml-1 drop-shadow-sm">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 dark:bg-black/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all border border-white/10 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/90 ml-1 drop-shadow-sm">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 dark:bg-black/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all border border-white/10 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full py-4 mt-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl transition-all border border-white/30 backdrop-blur-md shadow-[0_4px_12px_rgba(255,255,255,0.1)] flex items-center justify-center group disabled:opacity-50"
            >
              {loading ? "Masuk..." : "Masuk Sekarang"}
              {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/70 text-sm font-medium">
              Belum punya akun?{" "}
              <Link href="/register" className="text-white font-bold hover:text-white/80 transition-colors drop-shadow-sm">
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
