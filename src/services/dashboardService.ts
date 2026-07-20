import API from "./api";

// Dashboard service to fetch data for the dashboard page\
//  Dashboard API endpoint
export const getDashboardData = async (
  month: number,
  year: number
) => {
  try {
    const res = await API.get("/dashboard", {
      params: { month, year },
    });

    return res.data;
  } catch (error) {
    console.error("Dashboard error:", error);
    throw error;
  }
};