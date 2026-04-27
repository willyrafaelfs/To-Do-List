import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const courseId = searchParams.get("courseId");

    const tasks = await prisma.task.findMany({
      where: {
        userId: (session.user as any).id,
        ...(status && status !== "all" ? { status } : {}),
        ...(priority && priority !== "all" ? { priority } : {}),
        ...(courseId && courseId !== "all" ? { courseId } : {}),
      },
      include: {
        course: true,
      },
      orderBy: {
        deadline: "asc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, deadline, priority, courseId, reminderMode } = await req.json();

    const taskDeadline = deadline ? new Date(deadline) : null;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        deadline: taskDeadline,
        priority,
        courseId,
        userId: (session.user as any).id,
      },
    });

    if (taskDeadline && reminderMode && reminderMode !== "none") {
      let remindAt = new Date(taskDeadline);
      if (reminderMode === "1h") {
        remindAt.setHours(remindAt.getHours() - 1);
      } else if (reminderMode === "1d") {
        remindAt.setDate(remindAt.getDate() - 1);
      }

      await prisma.reminder.create({
        data: {
          taskId: task.id,
          remindAt,
        }
      });
    }

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
