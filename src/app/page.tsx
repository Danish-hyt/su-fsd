"use client";

import { useState } from "react";

interface CsvRow {
  filename: string;
  created_at: string;
}

interface ApiResponse {
  data: CsvRow[];
}

export default function CsvUploader() {
  const [data, setData] = useState<CsvRow[] | null>(null);

  const fetchCsvData = async (): Promise<void> => {
    try {
      const response = await fetch("/api/get-csv-data");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result: ApiResponse = await response.json();
      setData(result.data);
    } catch (error) {
      console.error("Error fetching CSV data:", error);
    }
  };

  const naturalSort = (a: string, b: string): number => {
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const sortData = (type: string) => {
    if (!data) return;
    const sortedData = [...data];

    switch (type) {
      case "created_at_asc":
        sortedData.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "filename_asc":
        sortedData.sort((a, b) => naturalSort(a.filename, b.filename));
        break;
      case "filename_desc":
        sortedData.sort((a, b) => naturalSort(b.filename, a.filename));
        break;
      default:
        break;
    }

    setData(sortedData);
  };

  return (
    <div className="p-4">
      <button
        onClick={fetchCsvData}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Fetch CSV Data
      </button>
      <div className="mb-4">
        <button
          onClick={() => sortData("created_at_asc")}
          className="p-2 bg-gray-500 text-white rounded mr-2"
        >
          Sort by Created At
        </button>
        <button
          onClick={() => sortData("filename_asc")}
          className="p-2 bg-gray-500 text-white rounded mr-2"
        >
          Sort by Filename (Asc)
        </button>
        <button
          onClick={() => sortData("filename_desc")}
          className="p-2 bg-gray-500 text-white rounded"
        >
          Sort by Filename (Desc)
        </button>
      </div>
      {data && (
        <table className="border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Filename</th>
              <th className="border border-gray-300 p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{row.filename}</td>
                <td className="border border-gray-300 p-2">{row.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
