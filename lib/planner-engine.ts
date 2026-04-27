/**
 * Study Planner Engine
 * Membagi tugas ke sesi belajar harian berdasarkan deadline, AI score, dan preferensi user.
 */

export interface PlannerTask {
  id: string;
  title: string;
  deadline: Date | null;
  aiScore: number | null;
  estimatedHours: number | null;
  priority: string;
  status: string;
  course: { id: string; name: string; color: string | null };
}

export interface StudySession {
  taskId: string;
  taskTitle: string;
  courseColor: string | null;
  courseName: string;
  date: string; // ISO date string "YYYY-MM-DD"
  hoursAllocated: number;
  reason: string;
  priority: string;
  deadline: Date | null;
  isUrgent: boolean;
}

export interface DayPlan {
  date: string;
  label: string; // "Hari ini", "Besok", etc.
  totalHours: number;
  sessions: StudySession[];
  load: "light" | "moderate" | "heavy";
}

export interface PlannerOutput {
  days: DayPlan[];
  warnings: string[];
  summary: {
    totalTasks: number;
    totalStudyHours: number;
    scheduledDays: number;
    unscheduled: string[]; // task titles that couldn't be scheduled
  };
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getDayLabel(dateKey: string, today: string): string {
  const diff = (new Date(dateKey).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24);
  if (diff === 0) return "Hari Ini";
  if (diff === 1) return "Besok";
  if (diff === 2) return "Lusa";
  const d = new Date(dateKey);
  return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short" });
}

function getLoadLabel(hours: number, maxHours: number): DayPlan["load"] {
  const ratio = hours / maxHours;
  if (ratio < 0.5) return "light";
  if (ratio < 0.85) return "moderate";
  return "heavy";
}

export function generateStudyPlan(
  tasks: PlannerTask[],
  studyHoursPerDay: number = 4,
  planningDays: number = 7
): PlannerOutput {
  const now = new Date();
  const todayKey = formatDateKey(now);
  const warnings: string[] = [];
  const unscheduled: string[] = [];

  // Filter unfinished tasks only, sort by urgency (AI score desc, then deadline asc)
  const activeTasks = tasks
    .filter(t => t.status !== "done")
    .map(t => ({
      ...t,
      estimatedHours: t.estimatedHours ?? 2, // default 2 hours if not set
      aiScore: t.aiScore ?? 0,
    }))
    .sort((a, b) => {
      // Overdue first
      const aOverdue = a.deadline && a.deadline < now ? 1 : 0;
      const bOverdue = b.deadline && b.deadline < now ? 1 : 0;
      if (bOverdue !== aOverdue) return bOverdue - aOverdue;
      // Then by AI score
      return (b.aiScore ?? 0) - (a.aiScore ?? 0);
    });

  // Initialize day buckets
  const dayBuckets: Record<string, { hoursUsed: number; sessions: StudySession[] }> = {};
  for (let i = 0; i < planningDays; i++) {
    const key = formatDateKey(addDays(now, i));
    dayBuckets[key] = { hoursUsed: 0, sessions: [] };
  }

  // Schedule each task
  for (const task of activeTasks) {
    const hoursNeeded = task.estimatedHours;
    let remainingHours = hoursNeeded;

    // Determine latest date we can schedule (deadline - 1 day, or today if overdue)
    let latestDate = task.deadline
      ? formatDateKey(addDays(task.deadline, -1))
      : formatDateKey(addDays(now, planningDays - 1));

    if (task.deadline && task.deadline < now) {
      // Overdue — schedule today only
      latestDate = todayKey;
      warnings.push(`⚠️ "${task.title}" sudah melewati tenggat waktu! Kerjakan hari ini.`);
    } else if (task.deadline) {
      // Check if deadline is within planning window
      const daysUntilDeadline = (task.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (daysUntilDeadline <= 1 && hoursNeeded > studyHoursPerDay) {
        warnings.push(`⚡ "${task.title}" membutuhkan ${hoursNeeded} jam tapi deadline kurang dari 2 hari!`);
      }
    }

    // Try to fill days from today up to latestDate
    const dayKeys = Object.keys(dayBuckets).sort();
    for (const dayKey of dayKeys) {
      if (remainingHours <= 0) break;
      if (dayKey > latestDate) break;

      const bucket = dayBuckets[dayKey];
      const availableHours = studyHoursPerDay - bucket.hoursUsed;
      if (availableHours <= 0) continue;

      const allocated = Math.min(remainingHours, availableHours);
      remainingHours -= allocated;
      bucket.hoursUsed += allocated;

      const isUrgent =
        task.aiScore >= 70 ||
        (task.deadline !== null && (task.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 2);

      let reason = "";
      if (task.deadline && task.deadline < now) {
        reason = "Tugas ini sudah terlambat — kerjakan segera!";
      } else if (isUrgent) {
        reason = `Prioritas tinggi — deadline mendekat.`;
      } else {
        const daysLeft = task.deadline
          ? Math.round((task.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          : null;
        reason = daysLeft !== null
          ? `Kerjakan sekarang agar tidak menumpuk. ${daysLeft} hari tersisa.`
          : "Tugas tanpa tenggat — kerjakan di sela waktu luang.";
      }

      bucket.sessions.push({
        taskId: task.id,
        taskTitle: task.title,
        courseColor: task.course.color,
        courseName: task.course.name,
        date: dayKey,
        hoursAllocated: allocated,
        reason,
        priority: task.priority,
        deadline: task.deadline,
        isUrgent,
      });
    }

    if (remainingHours > 0.1) {
      unscheduled.push(task.title);
      if (task.estimatedHours > studyHoursPerDay * planningDays) {
        warnings.push(`📌 "${task.title}" membutuhkan ${task.estimatedHours} jam — melebihi kapasitas ${planningDays} hari. Pertimbangkan mengurangi estimasi atau menambah jam belajar.`);
      }
    }
  }

  // Build DayPlan array (only include days with sessions or today)
  const days: DayPlan[] = Object.entries(dayBuckets)
    .filter(([key, bucket]) => bucket.sessions.length > 0 || key === todayKey)
    .map(([key, bucket]) => ({
      date: key,
      label: getDayLabel(key, todayKey),
      totalHours: bucket.hoursUsed,
      sessions: bucket.sessions,
      load: getLoadLabel(bucket.hoursUsed, studyHoursPerDay),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalStudyHours = activeTasks.reduce((s, t) => s + t.estimatedHours, 0);

  return {
    days,
    warnings,
    summary: {
      totalTasks: activeTasks.length,
      totalStudyHours,
      scheduledDays: days.filter(d => d.sessions.length > 0).length,
      unscheduled,
    },
  };
}
