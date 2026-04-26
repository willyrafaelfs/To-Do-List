"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const mockDeadlines: any = {
  "2024-04-28": [{ title: "Laporan Praktikum", type: "high" }],
  "2024-05-01": [{ title: "Project Next.js", type: "medium" }],
  "2024-05-05": [{ title: "Essay Etika", type: "low" }],
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthName = currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Kalender Deadline</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Pantau semua tenggat waktu tugasmu.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="px-4 font-bold text-slate-700 dark:text-slate-200">{monthName}</span>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
          {days.map(day => (
            <div key={day} className="py-4 text-center text-sm font-bold text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-32 p-2 border-r border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10"></div>
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `2024-04-${dayNum.toString().padStart(2, '0')}`; // Simplified for demo
            const hasDeadlines = mockDeadlines[dateStr];
            const isToday = dayNum === 26; // Assume today is 26th for demo

            return (
              <div key={dayNum} className={cn(
                "h-32 p-2 border-r border-b border-slate-100 dark:border-slate-800 transition-colors hover:bg-primary-50/30 dark:hover:bg-primary-900/10",
                isToday && "bg-primary-50/50 dark:bg-primary-900/20"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold",
                    isToday ? "bg-primary-600 text-white shadow-lg" : "text-slate-600 dark:text-slate-400"
                  )}>
                    {dayNum}
                  </span>
                  {hasDeadlines && <Bell size={12} className="text-amber-500 animate-bounce" />}
                </div>
                
                <div className="space-y-1">
                  {hasDeadlines?.map((dl: any, idx: number) => (
                    <div 
                      key={idx}
                      className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold truncate",
                        dl.type === "high" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" :
                        dl.type === "medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" :
                        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                      )}
                    >
                      {dl.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
