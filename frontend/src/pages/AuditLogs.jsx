import React, { useEffect, useState } from "react";
import API from "../api/api";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    const res = await API.get("/audit-logs");
    setLogs(res.data || []);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <ProtectedRoute adminOnly>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Audit Logs
        </h1>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">User</th>
                <th className="p-3 border-b">Action</th>
                <th className="p-3 border-b">Item</th>
                <th className="p-3 border-b">Description</th>
                <th className="p-3 border-b">Date</th>
              </tr>
            </thead>

            <tbody>
              {logs.length ? (
                logs.map((log) => (
                  <tr key={log._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">
                      {log.user?.username || "Unknown"}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-white text-sm
                          ${log.action === "CREATE" && "bg-green-600"}
                          ${log.action === "UPDATE" && "bg-blue-600"}
                          ${log.action === "DELETE" && "bg-red-600"}
                        `}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="p-3">{log.itemType}</td>
                    <td className="p-3">{log.description}</td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-400">
                    No audit logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
