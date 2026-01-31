import React, { useEffect, useState } from "react";
import API from "../api/api";
import { FaCheckCircle, FaSearch, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
export default function AutoMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await API.get("/matches");
        if (res.data.length > matches.length) {
         toast.success("🔔 New match found!");
       }
        setMatches(res.data || []);
      } catch (err) {
        toast.error("Failed to load matches");
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  const getMatchColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-800">
            Auto Matches
          </h1>
          <p className="text-gray-600">
            Automatic comparison between lost & found items
          </p>
        </div>
        <FaSearch className="text-3xl text-blue-500" />
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 mt-10">
          Loading matches...
        </p>
      )}

      {/* No Matches */}
      {!loading && matches.length === 0 && (
        <p className="text-center mt-10 text-gray-400">
          No matches found
        </p>
      )}

      {/* Matches */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match, index) => {
          const strongMatch = match.score >= 80;

          return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden border-2 ${
                strongMatch ? "border-green-400" : "border-transparent"
              }`}
            >
              {/* Strong match badge */}
              {strongMatch && (
                <div className="bg-green-500 text-white text-xs px-3 py-1 flex items-center gap-1">
                  <FaStar /> Strong Match
                </div>
              )}

              {/* Images */}
              <div className="grid grid-cols-2 gap-1">
                <img
                  src={match.lost.imageUrl || "/no-image.png"}
                  alt="Lost"
                  className="h-40 w-full object-cover"
                />
                <img
                  src={match.found.imageUrl || "/no-image.png"}
                  alt="Found"
                  className="h-40 w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg text-gray-800">
                  {match.lost.title}
                </h3>

                <p className="text-sm text-gray-600">
                  <strong>Category:</strong> {match.lost.category}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {match.found.location}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Color:</strong> {match.lost.color}
                </p>

                {/* Match Score */}
                <div
                  className={`flex items-center gap-2 font-semibold ${getMatchColor(
                    match.score
                  )}`}
                >
                  <FaCheckCircle />
                  {match.score}% Match
                </div>

                <NavLink to={`/matches/${match._id}`} 
                className="block text-center bg-blue-600 text-white py-2 rounded">
                        View Details
               </NavLink>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
