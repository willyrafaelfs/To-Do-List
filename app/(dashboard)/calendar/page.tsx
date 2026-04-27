"use client";

import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CalendarPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [courseFilter, setCourseFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCourses(data);
      });
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?courseId=${courseFilter}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [courseFilter]);

  const calendarEvents = tasks.map(task => {
    const isOverdue = task.status !== "done" && new Date(task.deadline) < new Date();
    return {
      id: task.id,
      title: task.title,
      start: task.deadline,
      backgroundColor: isOverdue ? "#ef4444" : (task.course?.color || "#6366f1"),
      borderColor: isOverdue ? "#dc2626" : "transparent",
      extendedProps: {
        status: task.status,
        isOverdue
      }
    };
  });

  const handleEventClick = (clickInfo: any) => {
    router.push(`/tasks/${clickInfo.event.id}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Kalender Tugas</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola dan pantau tenggat waktu tugasmu.</p>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium transition-all shadow-sm"
          >
            <option value="all">Semua Mata Kuliah</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-3xl"
      >
        <style>{`
          .fc {
            --fc-page-bg-color: transparent;
            --fc-neutral-bg-color: transparent;
            --fc-neutral-text-color: inherit;
            --fc-border-color: rgba(148, 163, 184, 0.2);
            --fc-button-bg-color: #6366f1;
            --fc-button-border-color: transparent;
            --fc-button-hover-bg-color: #4f46e5;
            --fc-button-hover-border-color: transparent;
            --fc-button-active-bg-color: #4338ca;
            --fc-button-active-border-color: transparent;
            --fc-event-bg-color: #6366f1;
            --fc-event-border-color: transparent;
            --fc-event-text-color: #fff;
            --fc-event-selected-overlay-color: rgba(0, 0, 0, 0.25);
            font-family: inherit;
          }
          
          .dark .fc {
            --fc-border-color: rgba(255, 255, 255, 0.1);
          }

          .fc-toolbar-title {
            font-size: 1.5rem !important;
            font-weight: 800 !important;
          }

          .fc-button {
            text-transform: capitalize !important;
            font-weight: 600 !important;
            border-radius: 0.75rem !important;
            padding: 0.5rem 1rem !important;
          }

          .fc-event {
            border-radius: 4px;
            padding: 2px 4px;
            font-size: 0.75rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: opacity 0.2s;
          }
          
          .fc-event:hover {
            opacity: 0.9;
          }
          
          .fc-day-today {
            background-color: rgba(99, 102, 241, 0.05) !important;
          }
        `}</style>
        
        {loading ? (
          <div className="h-[600px] flex items-center justify-center text-slate-400 font-medium">
            Memuat kalender...
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            initialView="dayGridMonth"
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={calendarEvents}
            eventClick={handleEventClick}
            height="auto"
            contentHeight={600}
            locale="id"
          />
        )}
      </motion.div>
    </div>
  );
}
