import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { generateStudyPlan } from "@/lib/planner-engine";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { searchParams } = new URL(req.url);
    const daysParam = searchParams.get("days");
    const planningDays = daysParam ? parseInt(daysParam) : 7;

    // Fetch user preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { studyHoursPerDay: true, preferredStudyTime: true },
    });

    // Fetch all unfinished tasks
    const tasks = await prisma.task.findMany({
      where: { userId, status: { not: "done" } },
      include: { course: true },
      orderBy: { deadline: "asc" },
    });

    const studyHoursPerDay = user?.studyHoursPerDay ?? 4;

    // Run planner engine
    const plan = generateStudyPlan(
      tasks.map(t => ({
        id: t.id,
        title: t.title,
        deadline: t.deadline,
        aiScore: t.aiScore,
        estimatedHours: t.estimatedHours,
        priority: t.priority,
        status: t.status,
        course: {
          id: t.course.id,
          name: t.course.name,
          color: t.course.color,
        },
      })),
      studyHoursPerDay,
      planningDays
    );

    // Persist the plan for today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    await prisma.studyPlan.upsert({
      where: {
        // We'll use userId + date as a unique constraint via compound key workaround
        id: `${userId}-${todayStart.toISOString().split("T")[0]}`,
      },
      update: { planData: plan as any, updatedAt: new Date() },
      create: {
        id: `${userId}-${todayStart.toISOString().split("T")[0]}`,
        userId,
        date: todayStart,
        planData: plan as any,
      },
    });

    return NextResponse.json({
      plan,
      preferences: {
        studyHoursPerDay,
        preferredStudyTime: user?.preferredStudyTime ?? "morning",
      },
    });
  } catch (error: any) {
    console.error("[PLANNER_ERROR]", error);
    return NextResponse.json({ message: "Planner Error", error: error.message }, { status: 500 });
  }
}

// Update user study preferences
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { studyHoursPerDay, preferredStudyTime } = await req.json();

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(studyHoursPerDay !== undefined && { studyHoursPerDay }),
        ...(preferredStudyTime !== undefined && { preferredStudyTime }),
      },
      select: { studyHoursPerDay: true, preferredStudyTime: true },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ message: "Error updating preferences" }, { status: 500 });
  }
}
