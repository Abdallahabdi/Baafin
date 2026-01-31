import { useParams } from "react-router-dom";
import API from "../api/api";
import { useEffect, useState } from "react";

export default function MatchDetails() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);

  useEffect(() => {
    API.get(`/matches/${id}`).then(res => setMatch(res.data));
  }, []);

  if (!match) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Match Details</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <img src={match.lost.imageUrl} />
        <img src={match.found.imageUrl} />
      </div>

      <p><strong>Title:</strong> {match.lost.title}</p>
      <p><strong>Category:</strong> {match.lost.category}</p>
      <p><strong>Location:</strong> {match.found.location}</p>
      <p className="text-green-600 font-bold">
        Match Score: {match.score}%
      </p>
    </div>
  );
}
