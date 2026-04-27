"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, User, GraduationCap, Palette } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const courseSchema = z.object({
  name: z.string().min(3, "Nama matkul minimal 3 karakter"),
  lecturer: z.string().optional(),
  semester: z.string().min(1, "Semester wajib diisi"),
  color: z.string().min(4, "Pilih warna"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const colors = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#f43f5e", "#14b8a6"
];

export default function CreateCoursePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      color: "#6366f1",
      semester: "1",
    },
  });

  const selectedColor = watch("color");

  const onSubmit = async (data: CourseFormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/courses");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link href="/courses" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Tambah Mata Kuliah</h2>
          <p className="text-slate-500 dark:text-slate-400">Daftarkan mata kuliah baru Anda semester ini.</p>
        </div>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="glass p-8 rounded-3xl space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Nama Mata Kuliah</label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              {...register("name")}
              type="text" 
              placeholder="Contoh: Algoritma dan Pemrograman"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all border-none"
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Nama Dosen (Opsional)</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                {...register("lecturer")}
                type="text" 
                placeholder="Nama Dosen"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all border-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Semester</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <select 
                {...register("semester")}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all border-none appearance-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s.toString()}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center">
            <Palette size={16} className="mr-2" /> Label Warna
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setValue("color", c)}
                className={`w-10 h-10 rounded-full transition-all border-4 ${selectedColor === c ? "border-slate-300 scale-110 shadow-lg" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Mata Kuliah"}
        </button>
      </motion.form>
    </div>
  );
}
