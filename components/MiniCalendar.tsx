"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "next/navigation";

export default function MiniCalendar() {
  const [tasks, setTasks] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/tasks`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data);
        }
      })
      .catch(console.error);
  }, []);

  const calendarEvents = tasks.map(task => {
    return {
      id: task.id,
      title: task.title,
      start: task.deadline,
      display: 'list-item', // Shows as a dot
      color: task.course?.color || "#6366f1",
    };
  });

  return (
    <div className="mini-calendar-wrapper">
      <style>{`
        .mini-calendar-wrapper .fc {
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: transparent;
          --fc-neutral-text-color: inherit;
          --fc-border-color: rgba(148, 163, 184, 0.1);
          --fc-button-bg-color: transparent;
          --fc-button-border-color: transparent;
          --fc-button-text-color: inherit;
          --fc-button-hover-bg-color: rgba(99, 102, 241, 0.1);
          --fc-button-hover-border-color: transparent;
          font-family: inherit;
          font-size: 0.8rem;
        }

        .dark .mini-calendar-wrapper .fc {
          --fc-border-color: rgba(255, 255, 255, 0.05);
        }

        .mini-calendar-wrapper .fc-toolbar-title {
          font-size: 1rem !important;
          font-weight: 700 !important;
        }

        .mini-calendar-wrapper .fc-button {
          padding: 0.2rem 0.5rem !important;
        }

        .mini-calendar-wrapper .fc-daygrid-day-number {
          padding: 4px !important;
        }
        
        .mini-calendar-wrapper .fc-day-today {
          background-color: rgba(99, 102, 241, 0.1) !important;
          font-weight: bold;
        }

        .mini-calendar-wrapper .fc-scroller::-webkit-scrollbar {
          width: 4px;
        }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next'
        }}
        initialView="dayGridMonth"
        editable={false}
        selectable={false}
        events={calendarEvents}
        height={350}
        contentHeight="auto"
        eventClick={(info) => router.push(`/tasks/${info.event.id}`)}
      />
    </div>
  );
}
