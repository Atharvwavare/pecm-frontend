import { useEffect, useState, useRef } from "react";
import Filters from "./reports/Filters";
import SummaryCards from "./reports/SummaryCards";
import CategoryPieChart from "./reports/CategoryPieChart";
import MonthlyTrendChart from "./reports/MonthlyTrendChart";
import DailyBreakdownTable from "./reports/DailyBreakDownTable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  getReportSummary,
  getCategoryReport,
  getMonthlyTrend,
  getDailyBreakDown,
} from "../services/reportService";

// Report component
// Report page that displays financial data, charts, and tables for a selected month and year.
export default function Report() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [summary, setSummary] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const reportRef = useRef(null);

  useEffect(() => {
    fetchReports();
  }, [month, year]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = { month, year };

      const [summaryRes, categoryRes, monthlyRes, dailyRes] = await Promise.all(
        [
          getReportSummary(params),
          getCategoryReport(params),
          getMonthlyTrend(),
          getDailyBreakDown({ month, year }),
        ],
      );

      setSummary(summaryRes?.data || {});
      setCategoryData(categoryRes?.data || []);
      setTrendData(monthlyRes?.data || []);
      setDailyData(dailyRes?.data || []);
    } catch (error) {
      console.error("Report Error:", error);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };
  /*PROFESSIONAL PDF EXPORT */
const downloadPDF = async () => {
  const input = reportRef.current;
  if (!input || downloading) return;

  setDownloading(true);

  try {
    // Reset scroll position — prevents ghosted/offset captures
    window.scrollTo(0, 0);

    // Wait for fonts to fully load before capturing
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Small delay to let any pending layout/paint settle
    await new Promise((resolve) => setTimeout(resolve, 300));

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;

    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const usablePageHeight = pageHeight - margin * 2;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= usablePageHeight;

    while (heightLeft > 0) {
      position = margin - (imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= usablePageHeight;
    }

    pdf.save(`Expense_Report_${month}_${year}.pdf`);
  } finally {
    setDownloading(false);
  }
};
  // Report Interface
  return (
    <div className="pt-20 lg:ml-64 min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 pb-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Financial Report
          </h2>
          <p className="text-black mt-1 text-sm sm:text-base">
            Overview for {format(new Date(year, month - 1), "MMMM yyyy")}
          </p>
        </div>

        <button
          onClick={downloadPDF}
          disabled={downloading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 
  bg-black text-white px-5 py-2.5 rounded-xl 
  active:scale-95 transition hover:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          {downloading ? "Generating..." : "Download PDF"}
        </button>
      </div>

      {/* FILTERS */}
      <div className="mb-6">
        <Filters
          month={month}
          year={year}
          setMonth={setMonth}
          setYear={setYear}
        />
      </div>

      {/* REPORT CONTENT — plain layout container, NOT another card.
          Each section below (SummaryCards, charts, DailyBreakdownTable)
          owns its own card styling, so we don't get a card wrapping cards. */}
      <div
        ref={reportRef}
        className={`space-y-6 transition-opacity duration-200 ${
          loading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <SummaryCards summary={summary} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryPieChart data={categoryData} />
          <MonthlyTrendChart data={trendData} />
        </div>

        <DailyBreakdownTable data={dailyData} />
      </div>
    </div>
  );
}
