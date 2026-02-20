import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const FIELDS = [
  "mentalDemand",
  "temporalDemand",
  "performance",
  "effort",
  "frustration",
  "interruptionFrequency",
] as const;

interface SurveyRow {
  mentalDemand: number;
  temporalDemand: number;
  performance: number;
  effort: number;
  frustration: number;
  interruptionFrequency: number;
}

function averageScores(surveys: SurveyRow[]) {
  if (surveys.length === 0) return null;
  const totals: Record<string, number> = {};
  for (const field of FIELDS) {
    totals[field] = 0;
  }
  for (const s of surveys) {
    for (const field of FIELDS) {
      totals[field] += s[field];
    }
  }
  const averages: Record<string, number> = {};
  for (const field of FIELDS) {
    averages[field] = Math.round(totals[field] / surveys.length);
  }
  return averages;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  const where: Record<string, unknown> = {};
  if (year) {
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);
    where.createdAt = { gte: startOfYear, lt: endOfYear };
  }

  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
    include: {
      surveys: { where },
    },
  });

  const allSurveys = departments.flatMap((d) => d.surveys);

  const companyOverall = {
    averages: averageScores(allSurveys),
    count: allSurveys.length,
  };

  const byDepartment = departments.map((d) => ({
    id: d.id,
    name: d.name,
    averages: averageScores(d.surveys),
    count: d.surveys.length,
  }));

  // Get available years
  const firstSurvey = await prisma.survey.findFirst({
    orderBy: { createdAt: "asc" },
  });
  const lastSurvey = await prisma.survey.findFirst({
    orderBy: { createdAt: "desc" },
  });

  let years: number[] = [];
  if (firstSurvey && lastSurvey) {
    const startYear = firstSurvey.createdAt.getFullYear();
    const endYear = lastSurvey.createdAt.getFullYear();
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }
  }

  return NextResponse.json({ companyOverall, byDepartment, years });
}
