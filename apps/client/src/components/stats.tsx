// src/components/Stats.tsx
import React from "react";

export default function Stats() {
  const stats = [
    { number: "9K+", label: "Happy Customers" },
    { number: "2K+", label: "Properties For Clients" },
    { number: "28K+", label: "Properties Sold" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {stats.map((s, i) => (
          <div key={i} className="p-6">
            <h3 className="text-4xl font-bold text-indigo-600">{s.number}</h3>
            <p className="mt-2 text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
