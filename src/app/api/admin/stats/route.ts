import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const totalResponses = await prisma.survey.count();
  return NextResponse.json({ totalResponses });
}
