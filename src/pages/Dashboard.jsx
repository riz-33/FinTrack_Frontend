import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Skeleton,
  useTheme,
} from "@mui/material";
import ExpensePie from "../components/charts/ExpensePie";
import TrendLine from "../components/charts/TrendLine";
import EmptyState from "../components/common/EmptyState";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CurrencyContext } from "../context/ThemeContext";

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [pieData, setPieData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true); // New Loading State
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const { formatValue } = useContext(CurrencyContext);

  const chartColors = {
    text: isDarkMode ? "#94a3b8" : "#64748b", // slate-400 vs slate-500
    grid: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    tooltipBg: isDarkMode ? "#1e293b" : "#ffffff",
    tooltipBorder: isDarkMode ? "#334155" : "#e2e8f0",
  };

  useEffect(() => {
    const currentMonth = "2026-01";

    const fetchDashboardData = async () => {
      try {
        setLoading(true); // Start loading
        const [summaryRes, pieRes, trendRes] = await Promise.all([
          api.get(`/reports/dashboard?month=${currentMonth}`),
          api.get(`/reports/expense-category?month=${currentMonth}`),
          api.get(`/reports/daily-trend?month=${currentMonth}`),
        ]);

        setSummary(summaryRes.data);
        setPieData(pieRes.data);
        setTrendData(trendRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading regardless of success/fail
      }
    };

    fetchDashboardData();
  }, []);

  // Helper to show Skeleton or Content
  const renderCardContent = (label, value) => (
    <CardContent style={{ textAlign: "center" }}>
      <Typography color="textSecondary" variant="overline">
        {label}
      </Typography>
      {loading ? (
        <Skeleton variant="text" width="60%" height={40} sx={{ mx: "auto" }} />
      ) : (
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {formatValue(value || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </Typography>
      )}
    </CardContent>
  );

  const getInsights = () => {
    if (pieData.length === 0) return null;
    // Sort to find the highest expense category
    const topCategory = [...pieData].sort((a, b) => b.value - a.value)[0];
    return topCategory;
  };

  const topCat = getInsights();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top Stats Row */}
      <Grid container spacing={4} mb={3}>
        <Grid size={4} item xs={12} md={4}>
          <Card variant="outlined">
            {renderCardContent("TOTAL BALANCE", summary.totalBalance)}
          </Card>
        </Grid>
        <Grid size={4} item xs={12} md={4}>
          <Card variant="outlined">
            {renderCardContent("INCOME", summary.income)}
          </Card>
        </Grid>
        <Grid size={4} item xs={12} md={4}>
          <Card variant="outlined">
            {renderCardContent("EXPENSE", summary.expense)}
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} mt={1}>
        <Grid size={6} item xs={12} md={6}>
          <Card variant="outlined" sx={{ minHeight: 350 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Expense by Category
              </Typography>

              {loading ? (
                <Box display="flex" justifyContent="center" py={10}>
                  <CircularProgress />
                </Box>
              ) : pieData.length > 0 ? (
                <ExpensePie data={pieData} />
              ) : (
                <EmptyState
                  title="No Expenses Yet"
                  message="We couldn't find any expenses for this month. Start tracking to see the breakdown!"
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={6} item xs={12} md={6}>
          <Card variant="outlined" sx={{ minHeight: 350 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Daily Expense Trend
              </Typography>

              {loading ? (
                <Box display="flex" justifyContent="center" py={10}>
                  <TrendLine />
                </Box>
              ) : trendData.length > 0 ? (
                <TrendLine data={trendData} />
              ) : (
                <EmptyState
                  title="No Expenses Yet"
                  message="We couldn't find any expenses for this month. Start tracking to see the breakdown!"
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid container spacing={3} mt={1}>
          <Grid item xs={12}>
            <Card
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
                height: "100%",
                background: isDarkMode
                  ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Monthly Spending Overview
                </Typography>

                <Grid container spacing={4}>
                  {/* Left Side: Insight Text */}
                  <Grid item xs={12} md={4}>
                    <Box py={2}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        MOST EXPENSIVE CATEGORY
                      </Typography>
                      {loading ? (
                        <Skeleton width="50%" />
                      ) : (
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          color="primary"
                        >
                          {topCat ? topCat.name : "N/A"}
                        </Typography>
                      )}

                      <Box mt={3}>
                        <Typography variant="body2" color="textSecondary">
                          You've spent{" "}
                          <strong>${summary.expense?.toLocaleString()}</strong>{" "}
                          this month.
                          {topCat &&
                            ` Your ${topCat.name} expenses account for ${((topCat.value / summary.expense) * 100).toFixed(1)}% of total spending.`}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Right Side: The Bar Chart */}
                  <Grid item xs={12} md={8}>
                    <div style={{ width: "100%", height: 250 }}>
                      <ResponsiveContainer>
                        <BarChart data={pieData}>
                          {" "}
                          {/* Mapping category data to bars */}
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={chartColors.grid}
                            vertical={false}
                          />
                          <XAxis
                            dataKey="name"
                            stroke={chartColors.text}
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke={chartColors.text}
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: chartColors.tooltipBg,
                              borderColor: chartColors.tooltipBorder,
                              borderRadius: "8px",
                              color: isDarkMode ? "#fff" : "#000",
                            }}
                          />
                          <Bar
                            dataKey="value"
                            fill={isDarkMode ? "#818cf8" : "#4f46e5"}
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* New Budget Section */}
          <Grid item xs={12} mt={2}>
            <Card
              variant="outlined"
              className="dark:bg-gray-800 dark:border-gray-700"
            >
              <CardContent>
                <Typography
                  variant="h6"
                  mb={3}
                  className="dark:text-white font-bold"
                >
                  Budget Trackers
                </Typography>
                <Grid container spacing={4}>
                  {pieData.slice(0, 3).map((category) => (
                    <Grid item xs={12} md={4} key={category.name}>
                      <div className="flex justify-between mb-1">
                        <Typography
                          variant="body2"
                          className="text-gray-600 dark:text-gray-400 font-medium"
                        >
                          {category.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-gray-900 dark:text-gray-200 font-bold"
                        >
                          {((category.value / 1000) * 100).toFixed(0)}%{" "}
                          {/* Assuming 1000 is the limit for now */}
                        </Typography>
                      </div>
                      {/* The Actual Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            category.value / 1000 > 0.8
                              ? "bg-red-500"
                              : "bg-blue-600"
                          }`}
                          style={{
                            width: `${Math.min((category.value / 1000) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <Typography
                        variant="caption"
                        className="text-gray-500 mt-1 block"
                      >
                        ${category.value} spent of $1,000 limit
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
