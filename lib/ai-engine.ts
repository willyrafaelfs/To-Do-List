/**
 * AI Priority Engine
 * Rule-based scoring engine untuk meranking task berdasarkan urgensi.
 * Tidak memerlukan API eksternal — berjalan sepenuhnya di server.
 */

export interface TaskInput {
  id: string;
  title: string;
  deadline: Date | null;
  priority: string;
  status: string;
  difficulty: string | null;
  estimatedHours: number | null;
  reminders: { remindAt: Date; isSent: boolean }[];
  course: {
    id: string;
    name: string;
    color: string | null;
    _count?: { tasks: number };
  };
}

export interface AITaskResult {
  id: string;
  title: string;
  course: { name: string; color: string | null };
  deadline: Date | null;
  priority: string;
  aiScore: number;
  urgencyLabel: "KRITIS" | "MENDESAK" | "NORMAL" | "SANTAI";
  urgencyColor: string;
  recommendation: string;
  warnings: string[];
  hoursLeft: number | null;
  daysLeft: number | null;
}

function getDifficultyWeight(difficulty: string | null): number {
  switch (difficulty) {
    case "hard": return 1.5;
    case "medium": return 1.0;
    case "easy": return 0.6;
    default: return 1.0;
  }
}

function getPriorityWeight(priority: string): number {
  switch (priority) {
    case "high": return 40;
    case "medium": return 20;
    case "low": return 5;
    default: return 5;
  }
}

export function calculateAIScore(task: TaskInput, courseTaskCount: number): AITaskResult {
  const now = new Date();
  const warnings: string[] = [];
  let score = 0;

  // --- Deadline scoring (0–60 points) ---
  let hoursLeft: number | null = null;
  let daysLeft: number | null = null;

  if (task.deadline) {
    hoursLeft = (task.deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    daysLeft = hoursLeft / 24;

    if (hoursLeft < 0) {
      // OVERDUE — nilai tertinggi
      score += 60;
      warnings.push("⚠️ Tugas ini sudah MELEWATI tenggat waktu!");
    } else if (hoursLeft <= 6) {
      score += 55;
      warnings.push(`🔥 Hanya tersisa ${Math.round(hoursLeft)} jam!`);
    } else if (hoursLeft <= 24) {
      score += 45;
      warnings.push(`⏰ Tenggat waktu kurang dari 24 jam.`);
    } else if (hoursLeft <= 48) {
      score += 30;
    } else if (hoursLeft <= 72) {
      score += 18;
    } else if (hoursLeft <= 168) { // 1 minggu
      score += 8;
    } else {
      score += 2;
    }
  } else {
    score += 3; // No deadline, low urgency
  }

  // --- Priority weight (0–40 points) ---
  score += getPriorityWeight(task.priority);

  // --- Difficulty modifier ---
  score *= getDifficultyWeight(task.difficulty);

  // --- Course workload bonus (max +10) ---
  if (courseTaskCount > 3) {
    const workloadBonus = Math.min((courseTaskCount - 3) * 2, 10);
    score += workloadBonus;
  }

  // --- Reminder indicator ---
  const hasActiveReminder = task.reminders.some(r => !r.isSent);
  if (hasActiveReminder) {
    score += 5;
    warnings.push("🔔 Memiliki pengingat aktif.");
  }

  // --- Estimated hours penalty (large tasks need to start early) ---
  if (task.estimatedHours && task.estimatedHours > 3 && daysLeft !== null && daysLeft < 2) {
    score += 8;
    warnings.push(`📚 Tugas ini membutuhkan ~${task.estimatedHours} jam pengerjaan — mulai segera!`);
  }

  // Cap score at 100
  score = Math.min(Math.round(score), 100);

  // --- Urgency label ---
  let urgencyLabel: AITaskResult["urgencyLabel"];
  let urgencyColor: string;

  if (score >= 75) {
    urgencyLabel = "KRITIS";
    urgencyColor = "#ef4444"; // red
  } else if (score >= 50) {
    urgencyLabel = "MENDESAK";
    urgencyColor = "#f97316"; // orange
  } else if (score >= 25) {
    urgencyLabel = "NORMAL";
    urgencyColor = "#eab308"; // yellow
  } else {
    urgencyLabel = "SANTAI";
    urgencyColor = "#22c55e"; // green
  }

  // --- Recommendation text ---
  let recommendation = "";
  if (hoursLeft !== null && hoursLeft < 0) {
    recommendation = `Tugas ini sudah terlambat ${Math.abs(Math.round(daysLeft!))} hari. Kerjakan SEGERA dan komunikasikan dengan dosen jika perlu.`;
  } else if (hoursLeft !== null && hoursLeft <= 24) {
    recommendation = `Prioritas hari ini! Kerjakan "${task.title}" sekarang agar selesai tepat waktu.`;
  } else if (hoursLeft !== null && daysLeft! <= 3) {
    recommendation = `Mulai cicil pengerjaan "${task.title}". Sisa ${Math.round(daysLeft!)} hari, jangan ditunda.`;
  } else if (task.priority === "high") {
    recommendation = `Tugas ini berprioritas tinggi. Jadwalkan sesi pengerjaan dalam beberapa hari ke depan.`;
  } else {
    recommendation = `Tenggat waktu masih longgar. Catat di kalender dan rencanakan pengerjaannya.`;
  }

  return {
    id: task.id,
    title: task.title,
    course: { name: task.course.name, color: task.course.color },
    deadline: task.deadline,
    priority: task.priority,
    aiScore: score,
    urgencyLabel,
    urgencyColor,
    recommendation,
    warnings,
    hoursLeft,
    daysLeft,
  };
}

export function rankTasks(tasks: TaskInput[], courseTaskCounts: Record<string, number>): AITaskResult[] {
  return tasks
    .filter(t => t.status !== "done") // only unfinished
    .map(t => calculateAIScore(t, courseTaskCounts[t.course.id] || 0))
    .sort((a, b) => b.aiScore - a.aiScore);
}
