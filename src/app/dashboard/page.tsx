"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { questions } from "@/lib/questions";

interface DepartmentSummary {
  id: number;
  name: string;
  averages: Record<string, number> | null;
  count: number;
}

interface Summary {
  companyOverall: { averages: Record<string, number> | null; count: number };
  byDepartment: DepartmentSummary[];
  years: number[];
}

function scoreColor(value: number): string {
  if (value <= 33) return "#22c55e"; // green
  if (value <= 66) return "#eab308"; // yellow
  return "#ef4444"; // red
}

function scoreBg(value: number): string {
  if (value <= 33) return "bg-green-100 text-green-800";
  if (value <= 66) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

const labelMap: Record<string, string> = {};
for (const q of questions) {
  labelMap[q.id] = q.label;
}

export default function DashboardPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [year, setYear] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("all");

  useEffect(() => {
    const params = new URLSearchParams();
    if (year) params.set("year", year);
    fetch(`/api/surveys/summary?${params}`)
      .then((r) => r.json())
      .then(setData);
  }, [year]);

  if (!data) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  const { companyOverall, byDepartment, years } = data;

  const displayData =
    selectedDept === "all"
      ? companyOverall
      : byDepartment.find((d) => String(d.id) === selectedDept) || companyOverall;

  const chartData = displayData.averages
    ? Object.entries(displayData.averages).map(([key, value]) => ({
        name: labelMap[key] || key,
        score: value,
      }))
    : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Overview of cognitive overload scores across your organization.
      </p>

      {/* Filters */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
          >
            <option value="">All time</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Department
          </label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
          >
            <option value="all">All Departments</option>
            {byDepartment.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.count} responses)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Response count */}
      <p className="text-sm text-gray-500 mb-4">
        {displayData.count} total response{displayData.count !== 1 ? "s" : ""}
      </p>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4">
            Average Scores {selectedDept === "all" ? "(Company-wide)" : ""}
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 130 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 13 }} />
              <Tooltip />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={scoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-500 inline-block" /> 0–33
              Good
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-yellow-500 inline-block" />{" "}
              34–66 Moderate
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500 inline-block" /> 67–100
              High
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400 mb-8">
          No survey responses yet.
        </div>
      )}

      {/* Department breakdown table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-lg mb-4">Department Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-semibold">Department</th>
                <th className="text-center py-2 px-2 font-semibold">Responses</th>
                {questions.map((q) => (
                  <th key={q.id} className="text-center py-2 px-2 font-semibold">
                    {q.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {byDepartment.map((d) => (
                <tr key={d.id} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium">{d.name}</td>
                  <td className="text-center py-2 px-2">{d.count}</td>
                  {questions.map((q) => (
                    <td key={q.id} className="text-center py-2 px-2">
                      {d.averages ? (
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${scoreBg(d.averages[q.id])}`}
                        >
                          {d.averages[q.id]}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
