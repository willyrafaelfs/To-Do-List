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
    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        ...body,
        semester: body.semester ? parseInt(body.semester) : undefined,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ message: "Error updating course" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await prisma.course.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Course deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting course" }, { status: 500 });
  }
}
