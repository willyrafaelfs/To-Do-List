import prisma from "@/lib/prisma";
import { TaskStatus, TaskPriority } from "@/types";

export class TaskService {
  static async getTasks(userId: string) {
    return await prisma.task.findMany({
      where: {
        course: {
          userId: userId,
        },
      },
      include: {
        course: true,
      },
      orderBy: {
        deadline: 'asc',
      },
    });
  }

  static async createTask(data: {
    courseId: string;
    title: string;
    description?: string;
    deadline?: Date;
    priority?: TaskPriority;
    status?: TaskStatus;
  }) {
    return await prisma.task.create({
      data,
    });
  }

  static async updateTask(id: string, data: any) {
    return await prisma.task.update({
      where: { id },
      data,
    });
  }

  static async deleteTask(id: string) {
    return await prisma.task.delete({
      where: { id },
    });
  }
}
