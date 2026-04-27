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
    const [totalTasks, completedTasks, pendingTasks, overdueTasks, upcomingDeadline] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: "done" } }),
      prisma.task.count({ where: { userId, status: { not: "done" } } }),
      prisma.task.count({ where: { userId, status: { not: "done" }, deadline: { lt: now } } }),
      prisma.task.findFirst({
        where: { userId, status: { not: "done" }, deadline: { gte: now } },
        orderBy: { deadline: "asc" },
        include: { course: true }
      }),
    ]);

    return NextResponse.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      upcomingDeadline
    });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching stats" }, { status: 500 });
  }
}
