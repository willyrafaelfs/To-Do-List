import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  try {
    const [totalTasks, completedTasks, pendingTasks, upcomingDeadline] = await Promise.all([
      prisma.task.count({ where: { course: { userId } } }),
      prisma.task.count({ where: { course: { userId }, status: "done" } }),
      prisma.task.count({ where: { course: { userId }, status: { not: "done" } } }),
      prisma.task.findFirst({
        where: { course: { userId }, status: { not: "done" }, deadline: { gte: new Date() } },
        orderBy: { deadline: "asc" },
        include: { course: true }
      }),
    ]);

    return NextResponse.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      upcomingDeadline
    });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching stats" }, { status: 500 });
  }
}
