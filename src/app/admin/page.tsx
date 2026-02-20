"use client";

import { useState, useEffect } from "react";

interface Department {
  id: number;
  name: string;
  _count?: { surveys: number };
}

export default function AdminPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [totalResponses, setTotalResponses] = useState(0);

  async function loadData() {
    const [deptRes, surveyRes] = await Promise.all([
      fetch("/api/departments"),
      fetch("/api/admin/stats"),
    ]);
    setDepartments(await deptRes.json());
    const stats = await surveyRes.json();
    setTotalResponses(stats.totalResponses);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!newName.trim()) return;

    const res = await fetch("/api/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });

    if (res.ok) {
      setNewName("");
      loadData();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add department");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Admin</h1>
      <p className="text-gray-600 mb-8">
        Manage departments and view survey statistics.
      </p>

      {/* Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="font-semibold text-lg mb-2">Survey Stats</h2>
        <p className="text-3xl font-bold text-blue-600">{totalResponses}</p>
        <p className="text-sm text-gray-500">total responses</p>
      </div>

      {/* Add department */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4">Add Department</h2>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Department name"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </form>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {/* Department list */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-lg mb-4">Departments</h2>
        <ul className="divide-y divide-gray-100">
          {departments.map((d) => (
            <li key={d.id} className="py-3 flex justify-between items-center">
              <span className="font-medium">{d.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
