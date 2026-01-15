import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import ExpensePie from "../components/charts/ExpensePie";
import TrendLine from "../components/charts/TrendLine";
import EmptyState from "../components/common/EmptyState";

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [pieData, setPieData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true); // New Loading State

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
          $
          {(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Typography>
      )}
    </CardContent>
  );

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
      </Grid>
    </Box>
  );
};

export default Dashboard;
