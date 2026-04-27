import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  try {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));
    const realNow = new Date();

    const [totalTasks, completedTasks, pendingTasks, overdueTasks, dueTodayTasks, urgentTasks, upcomingDeadline, courses] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: "done" } }),
      prisma.task.count({ where: { userId, status: { not: "done" } } }),
      prisma.task.count({ where: { userId, status: { not: "done" }, deadline: { lt: startOfToday } } }),
      prisma.task.count({ where: { userId, status: { not: "done" }, deadline: { gte: startOfToday, lte: endOfToday } } }),
      prisma.task.count({ where: { userId, status: { not: "done" }, priority: "high" } }),
      prisma.task.findFirst({
        where: { userId, status: { not: "done" }, deadline: { gte: realNow } },
        orderBy: { deadline: "asc" },
        include: { course: true }
      }),
      prisma.course.findMany({
        where: { userId },
        include: {
          _count: {
            select: { tasks: { where: { status: { not: "done" } } } }
          }
        }
      })
    ]);

    return NextResponse.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      dueTodayTasks,
      urgentTasks,
      upcomingDeadline,
      tasksPerCourse: courses.map(c => ({
        id: c.id,
        name: c.name,
        color: c.color,
        count: c._count.tasks
      }))
    });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching stats" }, { status: 500 });
  }
}
