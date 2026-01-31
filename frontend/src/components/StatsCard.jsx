import React from 'react';

/**
 * Small card for dashboard stats
 */
export default function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
        <div className="text-3xl text-primary">{icon}</div>
      </div>
    </div>
  );
}
