// src/components/PropertyGrid.tsx
import React from "react";

type Property = {
  id: number;
  title: string;
  price: string;
  location: string;
  image: string;
};

const mockProperties: Property[] = [
  {
    id: 1,
    title: "Luxury Villa in LA",
    price: "$2,000,000",
    location: "Los Angeles, CA",
    image: "/images/property-1.jpg",
  },
  {
    id: 2,
    title: "Modern Apartment",
    price: "$850,000",
    location: "New York, NY",
    image: "/images/property-2.jpg",
  },
  {
    id: 3,
    title: "Cozy Family House",
    price: "$650,000",
    location: "Austin, TX",
    image: "/images/property-3.jpg",
  },
];

export default function PropertyGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockProperties.map((p) => (
            <div key={p.id} className="bg-white shadow rounded-xl overflow-hidden">
              <img src={p.image} alt={p.title} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className="text-indigo-600 font-bold mt-2">{p.price}</p>
                <p className="text-gray-500 text-sm mt-1">{p.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
