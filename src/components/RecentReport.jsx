"use client";
import { getRecentReports } from "@/actions/dbActions";
import { MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";

const RecentReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const fetchedReports = await getRecentReports();
        setReports(fetchedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-4 sm:p-8">
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full sm:w-3/4 mx-auto table-auto text-sm sm:text-base">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr
                key={report.id}
                className="hover:bg-blue-50 transition-colors duration-300"
              >
                <td className="px-4 py-3 text-gray-600">
                  <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
                  {report.location}
                </td>
                <td className="px-4 py-3 text-gray-600">{report.wasteType}</td>
                <td className="px-4 py-3 text-gray-600">{report.amount}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(report.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentReport;
