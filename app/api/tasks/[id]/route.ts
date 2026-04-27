import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { reminderMode, ...taskData } = body;
    const taskDeadline = taskData.deadline ? new Date(taskData.deadline) : null;

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...taskData,
        deadline: taskDeadline,
      },
    });

    if (reminderMode !== undefined) {
      // Clean up existing reminders
      await prisma.reminder.deleteMany({
        where: { taskId: params.id }
      });

      // Create new if requested
      if (taskDeadline && reminderMode !== "none") {
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
    }

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ message: "Error updating task" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await prisma.task.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting task" }, { status: 500 });
  }
}
