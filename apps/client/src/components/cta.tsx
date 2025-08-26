// src/components/CTA.tsx
import React from "react";

export default function CTA() {
  return (
    <section className="py-20 bg-indigo-600 text-white text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Looking for your dream home?
        </h2>
        <p className="mb-8 text-lg">
          Let us help you find the perfect place to live, today.
        </p>
        <button className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition">
          Get Started
        </button>
      </div>
    </section>
  );
}
