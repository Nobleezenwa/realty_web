// src/components/Testimonials.tsx
import React from "react";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  text: string;
  image: string;
};

const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    text: "Homeverse made finding our dream home so simple and stress-free! Highly recommended.",
    image: "/images/avatar-1.jpg",
  },
  {
    id: 2,
    name: "Michael Lee",
    role: "Investor",
    text: "I’ve bought multiple properties through Homeverse. The experience has been top-notch every time.",
    image: "/images/avatar-2.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white shadow rounded-xl p-6 flex gap-4 items-start"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="text-gray-600 italic mb-2">“{t.text}”</p>
                <h4 className="font-semibold">{t.name}</h4>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
