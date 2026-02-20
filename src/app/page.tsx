"use client";

import { useState, useEffect } from "react";
import { questions } from "@/lib/questions";

interface Department {
  id: number;
  name: string;
}

export default function SurveyPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(questions.map((q) => [q.id, 50]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/departments")
      .then((r) => r.json())
      .then(setDepartments)
      .catch(() => setError("Failed to load departments"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!departmentId) {
      setError("Please select your department");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/surveys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ departmentId: Number(departmentId), ...scores }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🙏</div>
        <h1 className="text-3xl font-bold mb-4 text-teal-700">Thank you!</h1>
        <p className="text-warm-600 text-lg">
          Your response has been recorded anonymously.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-teal-700">
        Cognitive Overload Survey
      </h1>
      <p className="text-warm-600 mb-8">
        Rate each dimension from 0 to 100. Your response is anonymous — only
        your department is recorded.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Department picker */}
        <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm">
          <label className="block text-sm font-semibold mb-2 text-warm-800">
            Your Department
          </label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="w-full border border-warm-200 rounded-xl px-4 py-2.5 bg-warm-50 text-warm-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Select department...</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Questions */}
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-1">
              <h2 className="font-semibold text-lg text-warm-800">{q.label}</h2>
              <span className="text-2xl font-bold text-teal-600 ml-4">
                {scores[q.id]}
              </span>
            </div>
            <p className="text-warm-600 text-sm mb-5">{q.description}</p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-warm-600 w-10">
                {q.lowLabel}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={scores[q.id]}
                onChange={(e) =>
                  setScores((prev) => ({
                    ...prev,
                    [q.id]: Number(e.target.value),
                  }))
                }
                className="flex-1 h-2"
              />
              <span className="text-xs font-medium text-warm-600 w-10 text-right">
                {q.highLabel}
              </span>
            </div>
          </div>
        ))}

        {error && (
          <p className="text-red-600 text-sm font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white font-semibold py-3.5 rounded-2xl hover:bg-teal-700 disabled:opacity-50 transition shadow-sm"
        >
          {loading ? "Submitting..." : "Submit Survey"}
        </button>
      </form>
    </div>
  );
}
