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
    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...body,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
      },
    });
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
