import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const totalResponses = await prisma.survey.count();
  return NextResponse.json({ totalResponses });
}
