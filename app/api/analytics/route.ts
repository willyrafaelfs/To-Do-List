import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const now = new Date();

  try {
    // Fetch all tasks for user
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: { course: true },
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "done");
    const pendingTasks = tasks.filter(t => t.status !== "done");
    const overdueTasks = pendingTasks.filter(t => t.deadline && t.deadline < now);

    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

    // Average Completion Time (in days) - approximate using createdAt and updatedAt for done tasks
    let avgCompletionTime = 0;
    if (completedTasks.length > 0) {
      const totalTimeMs = completedTasks.reduce((acc, t) => {
        return acc + (t.updatedAt.getTime() - t.createdAt.getTime());
      }, 0);
      avgCompletionTime = totalTimeMs / completedTasks.length / (1000 * 60 * 60 * 24);
    }

    // Pie Chart: Tasks per Course
    const courseMap = new Map();
    tasks.forEach(t => {
      const c = t.course;
      if (!courseMap.has(c.id)) {
        courseMap.set(c.id, { name: c.name, count: 0, color: c.color || "#6366f1" });
      }
      courseMap.get(c.id).count += 1;
    });
    const tasksPerCourse = Array.from(courseMap.values()).sort((a, b) => b.count - a.count);

    // Line Chart: Weekly Productivity (Last 7 Days)
    const weeklyProductivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('id-ID', { weekday: 'short' });
      
      const createdCount = tasks.filter(t => {
        const tDate = new Date(t.createdAt);
        return tDate.getDate() === d.getDate() && tDate.getMonth() === d.getMonth();
      }).length;

      const completedCount = completedTasks.filter(t => {
        const tDate = new Date(t.updatedAt);
        return tDate.getDate() === d.getDate() && tDate.getMonth() === d.getMonth();
      }).length;

      weeklyProductivity.push({
        day: dateStr,
        created: createdCount,
        completed: completedCount,
      });
    }

    // Bar Chart: Deadline Pressure (Days until deadline for pending tasks)
    const deadlinePressure = [
      { name: "Overdue", count: overdueTasks.length, fill: "#ef4444" },
      { name: "Hari Ini", count: 0, fill: "#f97316" },
      { name: "1-3 Hari", count: 0, fill: "#eab308" },
      { name: "4-7 Hari", count: 0, fill: "#3b82f6" },
      { name: "> 7 Hari", count: 0, fill: "#10b981" },
    ];

    pendingTasks.forEach(t => {
      if (t.deadline && t.deadline >= now) {
        const diffDays = (t.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays <= 1) deadlinePressure[1].count++;
        else if (diffDays <= 3) deadlinePressure[2].count++;
        else if (diffDays <= 7) deadlinePressure[3].count++;
        else deadlinePressure[4].count++;
      } else if (!t.deadline) {
        deadlinePressure[4].count++; // Treat no deadline as > 7 days
      }
    });

    return NextResponse.json({
      summary: {
        total: totalTasks,
        completed: completedTasks.length,
        pending: pendingTasks.length,
        overdue: overdueTasks.length,
        completionRate: completionRate.toFixed(1),
        avgCompletionTime: avgCompletionTime.toFixed(1),
      },
      tasksPerCourse,
      weeklyProductivity,
      deadlinePressure,
    });
  } catch (error: any) {
    console.error("[ANALYTICS_ERROR]", error);
    return NextResponse.json({ message: "Analytics Error", error: error.message }, { status: 500 });
  }
}
