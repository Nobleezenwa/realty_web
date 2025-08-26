// src/components/SearchBar.tsx
import React from "react";

export default function SearchBar() {
  return (
    <section className="py-8 bg-white shadow-sm">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by location..."
          className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
          Search
        </button>
      </div>
    </section>
  );
}
