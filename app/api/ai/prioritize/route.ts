import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { rankTasks } from "@/lib/ai-engine";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    // Fetch all unfinished tasks for this user with full relations
    const tasks = await prisma.task.findMany({
      where: { userId, status: { not: "done" } },
      include: {
        course: true,
        reminders: { where: { isSent: false } },
      },
      orderBy: { deadline: "asc" },
    });

    // Build course task count map (to assess course workload)
    const courseTaskCounts = await prisma.task.groupBy({
      by: ["courseId"],
      where: { userId, status: { not: "done" } },
      _count: { id: true },
    });

    const countMap: Record<string, number> = {};
    courseTaskCounts.forEach(c => {
      countMap[c.courseId] = c._count.id;
    });

    // Run AI ranking
    const ranked = rankTasks(tasks as any, countMap);

    // Update aiScore back to the DB (fire and forget)
    const updates = ranked.map(r =>
      prisma.task.update({
        where: { id: r.id },
        data: { aiScore: r.aiScore },
      })
    );
    await Promise.all(updates).catch(err => 
      console.warn("[AI] Could not persist aiScore:", err)
    );

    // Build response
    const today = ranked.filter(t => (t.daysLeft ?? 999) <= 1);
    const urgent = ranked.filter(t => t.urgencyLabel === "KRITIS" || t.urgencyLabel === "MENDESAK");
    const warnings = ranked.flatMap(t => t.warnings.map(w => ({ task: t.title, warning: w })));

    return NextResponse.json({
      ranked,          // All tasks sorted by AI score
      today,           // Tasks due within 24 hours
      urgent,          // Tasks labeled KRITIS or MENDESAK
      warnings,        // Flat list of all warnings
      summary: {
        total: ranked.length,
        critical: ranked.filter(t => t.urgencyLabel === "KRITIS").length,
        overdue: ranked.filter(t => t.hoursLeft !== null && t.hoursLeft < 0).length,
      }
    });

  } catch (error: any) {
    console.error("[AI_PRIORITIZE_ERROR]", error);
    return NextResponse.json({ message: "AI Engine Error", error: error.message }, { status: 500 });
  }
}
