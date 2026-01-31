import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

export default function ItemCard({ item, onView, onEdit, onDelete }) {

  // 🛑 Haddii item uusan jirin, ha render-garayn
  if (!item) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-xl transition-transform transform hover:-translate-y-1 w-full max-w-sm mx-auto">
      
      {/* Image */}
      <img
        src={item.image || item.imageUrl || '/placeholder.png'}
        alt={item.title || 'Item'}
        className="w-full h-48 object-cover rounded mb-4"
      />

      {/* Title & Description */}
      <h2 className="font-bold text-lg truncate">{item.title}</h2>
      <p className="text-gray-500 text-sm mb-4 line-clamp-3">{item.description}</p>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => onView(item)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
          title="View"
        >
          <FaEye />
        </button>

        <button
          onClick={() => onEdit(item)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition"
          title="Edit"
        >
          <FaEdit />
        </button>

        <button
          onClick={() => onDelete(item)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
