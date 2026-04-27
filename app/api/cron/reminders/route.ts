import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  // Dalam aplikasi nyata, Anda HARUS mengamankan endpoint ini 
  // menggunakan cron secret key (misalnya dari Vercel Cron).
  // Contoh:
  // const authHeader = req.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }

  try {
    const now = new Date();

    // Cari semua reminder yang belum dikirim dan waktunya sudah tiba
    const pendingReminders = await prisma.reminder.findMany({
      where: {
        isSent: false,
        remindAt: {
          lte: now,
        },
      },
      include: {
        task: {
          include: {
            user: true,
            course: true,
          }
        }
      }
    });

    if (pendingReminders.length === 0) {
      return NextResponse.json({ message: "No pending reminders." });
    }

    // Di sini Anda akan mengintegrasikan layanan pengiriman email
    // seperti Resend, SendGrid, atau NodeMailer.
    // Karena ini simulasi, kita akan melakukan console.log
    const processedIds: string[] = [];

    for (const reminder of pendingReminders) {
      const email = reminder.task.user.email;
      const title = reminder.task.title;
      const course = reminder.task.course.name;
      
      console.log(`[CRON] Mengirim email ke ${email}: "PENGINGAT: Tugas ${title} (${course}) hampir mencapai tenggat waktu!"`);
      
      processedIds.push(reminder.id);
    }

    // Tandai sebagai sudah dikirim
    await prisma.reminder.updateMany({
      where: {
        id: { in: processedIds }
      },
      data: {
        isSent: true
      }
    });

    return NextResponse.json({ 
      message: `Successfully processed ${processedIds.length} reminders.`,
      processedIds 
    });

  } catch (error) {
    console.error("[CRON ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
