import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FIELDS = [
  "mentalDemand",
  "temporalDemand",
  "performance",
  "effort",
  "frustration",
  "interruptionFrequency",
] as const;

export async function POST(request: Request) {
  const body = await request.json();

  const departmentId = Number(body.departmentId);
  if (!departmentId || isNaN(departmentId)) {
    return NextResponse.json(
      { error: "Valid departmentId is required" },
      { status: 400 }
    );
  }

  for (const field of FIELDS) {
    const value = Number(body[field]);
    if (isNaN(value) || value < 0 || value > 100) {
      return NextResponse.json(
        { error: `${field} must be a number between 0 and 100` },
        { status: 400 }
      );
    }
  }

  const survey = await prisma.survey.create({
    data: {
      departmentId,
      mentalDemand: Number(body.mentalDemand),
      temporalDemand: Number(body.temporalDemand),
      performance: Number(body.performance),
      effort: Number(body.effort),
      frustration: Number(body.frustration),
      interruptionFrequency: Number(body.interruptionFrequency),
    },
  });

  return NextResponse.json(survey, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const departmentId = searchParams.get("departmentId");
  const year = searchParams.get("year");

  const where: Record<string, unknown> = {};

  if (departmentId) {
    where.departmentId = Number(departmentId);
  }

  if (year) {
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);
    where.createdAt = { gte: startOfYear, lt: endOfYear };
  }

  const surveys = await prisma.survey.findMany({
    where,
    include: { department: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(surveys);
}
