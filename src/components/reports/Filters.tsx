import { ChangeEvent } from "react";

interface FiltersProps {
  month: number;
  year: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
}


// Filters component to filter reports by month and year
export default function Filters({ month, year, setMonth, setYear }: FiltersProps) {
  const today = new Date();
  const currentValue = `${year}-${String(month).padStart(2, "0")}`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // "YYYY-MM"
    if (!value) return;
    const [y, m] = value.split("-").map(Number);
    setYear(y);
    setMonth(m);
  };

  const handleClear = () => {
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
  };

  // Filters Interface
  return (
    <div className="flex flex-wrap items-end gap-4 bg-white p-5 rounded-2xl shadow-md">
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">Filter by Date</label>
        <input
          type="month"
          value={currentValue}
          onChange={handleChange}
          className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      <button
        onClick={handleClear}
        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-sm transition-colors"
      >
        Clear
      </button>
    </div>
  );
}