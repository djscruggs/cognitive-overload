import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(departments);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const department = await prisma.department.create({
    data: { name: name.trim() },
  });
  return NextResponse.json(department, { status: 201 });
}
