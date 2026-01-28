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
  TextField,
  Avatar,
  LinearProgress,
  Button,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
} from "@mui/icons-material";
import ExpensePie from "../components/charts/ExpensePie";
import TrendLine from "../components/charts/TrendLine";
import EmptyState from "../components/common/EmptyState";
import RecentTransactions from "../components/charts/RecentTransactions";
import { CurrencyContext } from "../context/ThemeContext";
import BalanceTrend from "../components/charts/BalanceTrend";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [summary, setSummary] = useState({});
  const [pieData, setPieData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const { formatValue } = useContext(CurrencyContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summaryRes, pieRes, trendRes] = await Promise.all([
          api.get("/reports/dashboard", { params: { month: selectedMonth } }),
          api.get("/reports/expense-category", {
            params: { month: selectedMonth },
          }),
          api.get("/reports/daily-trend", { params: { month: selectedMonth } }),
        ]);
        // console.log(pieRes.data);
        // Just set the data! The backend already formatted it.
        setSummary(summaryRes.data);
        setPieData(pieRes.data); // Expects [{ name: "Food", value: 100 }]
        setTrendData(trendRes.data); // Expects [{ day: 1, amount: 50 }]
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [selectedMonth]);

  const [netWorthHistory, setNetWorthHistory] = useState([]);

  useEffect(() => {
    const fetchNetWorth = async () => {
      // Assuming you have an endpoint for historical balance
      const res = await api.get("/reports/net-worth-history");
      setNetWorthHistory(res.data);
      // Data looks like: [{ month: 'Oct', balance: 12000 }, { month: 'Nov', balance: 12500 }, ...]
    };
    fetchNetWorth();
  }, []);

  const savingsRate =
    summary.income > 0
      ? (((summary.income - summary.expense) / summary.income) * 100).toFixed(0)
      : 0;

  const topCat =
    pieData.length > 0
      ? [...pieData].sort((a, b) => b.value - a.value)[0]
      : null;

  // Calculate savings rate with safety checks
  const savingsAmount = (summary.income || 0) - (summary.expense || 0);

  // Insight Logic: Determine the "Mood" of the month
  const getInsightIcon = () => {
    if (savingsRate > 20) return "🚀";
    if (savingsRate > 0) return "💰";
    return "⚠️";
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: 5,
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-4px)" },
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="800"
              sx={{ textTransform: "uppercase", mb: 1, display: "block" }}
            >
              {title}
            </Typography>
            {loading ? (
              <Skeleton width={120} height={40} />
            ) : (
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{ letterSpacing: "-1px" }}
              >
                {formatValue(value || 0)}
              </Typography>
            )}
          </Box>
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: `${color}15`,
              color: color,
              width: 48,
              height: 48,
              borderRadius: 3,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 1400, margin: "auto" }}>
      {/* 1. Header with Month Selector */}
      <Box
      sx={{
        display: "flex",
        // display: { xs: "grid", sm: "flex" },
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        gap: 2,
      }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{ letterSpacing: "-2px", lineHeight: 1 }}
          >
            Overview
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Summary for{" "}
            {new Date(selectedMonth + "-01").toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Typography>
        </Box>
        <TextField
          type="month"
          size="small"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          InputProps={{ sx: { borderRadius: 3, fontWeight: "bold" } }}
        />
      </Box>

      {/* 2. Primary Metrics */}
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 2, sm: 8, md: 12 }}
        mb={3}
      >
        <Grid size={{ xs: 2, sm: 4, md: 4 }}>
          <StatCard
            title="Total Balance"
            value={summary.totalBalance}
            color="#6366f1"
            icon={<AccountBalanceWallet />}
          />
        </Grid>
        <Grid size={{ xs: 2, sm: 4, md: 4 }}>
          <StatCard
            title="Monthly Income"
            value={summary.income}
            color="#10b981"
            icon={<TrendingUp />}
          />
        </Grid>
        <Grid size={{ xs: 2, sm: 4, md: 4 }}>
          <StatCard
            title="Monthly Expenses"
            value={summary.expense}
            color="#f43f5e"
            icon={<TrendingDown />}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 2, sm: 8, md: 12 }}
        // mb={3}
      >
        {/* 3. Main Spending Chart */}
        <Grid size={{ xs: 2, sm: 4, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: 5, p: 2 }}>
            <Typography variant="h6" fontWeight="600" mb={2} px={2}>
              Daily Spending Trend
            </Typography>
            <Box height={350}>
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  height="100%"
                  sx={{ borderRadius: 4 }}
                />
              ) : trendData.length > 0 ? (
                <TrendLine data={trendData} formatValue={formatValue} />
              ) : (
                <EmptyState
                  title="No Expenses Yet"
                  message="We couldn't find any expenses for this month. Start tracking to see the breakdown!"
                />
              )}
            </Box>
          </Card>
        </Grid>

        {/* 4. Category Pie Chart */}
        <Grid size={{ xs: 2, sm: 4, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: 5, p: 2 }}>
            <Typography variant="h6" fontWeight="600" mb={2} px={2}>
              By Category
            </Typography>
            <Box
              height={350}
              // display="flex"
              // alignItems="center"
              // justifyContent="center"
            >
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  height="100%"
                  sx={{ borderRadius: 4 }}
                />
              ) : pieData.length > 0 ? (
                <ExpensePie data={pieData} formatValue={formatValue} />
              ) : (
                <EmptyState
                  title="No Expenses Yet"
                  message="We couldn't find any expenses for this month. Start tracking to see the breakdown!"
                />
              )}
            </Box>
          </Card>
        </Grid>

        {/* 5. Savings & Smart Insights */}
        <Grid size={{ xs: 2, sm: 4, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: 5, p: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle1" fontWeight="600">
                Monthly Savings Rate
              </Typography>
              <Typography
                variant="h6"
                fontWeight="600"
                color={savingsRate >= 0 ? "success.main" : "error.main"}
              >
                {savingsRate}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.max(0, Math.min(savingsRate, 100))}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: "grey.100",
                "& .MuiLinearProgress-bar": { borderRadius: 6 },
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 2, display: "block", fontWeight: 600 }}
            >
              {savingsRate >= 0
                ? `Great! You've retained ${formatValue(savingsAmount)} of your income.`
                : `Caution: You spent ${formatValue(Math.abs(savingsAmount))} more than you earned.`}
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 2, sm: 4, md: 6 }}>
          <Card
            sx={{
              borderRadius: 5,
              p: 3,
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "white",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h4">{getInsightIcon()}</Typography>
              <Box>
                <Typography variant="h6" fontWeight="600">
                  Smart Insight
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {topCat
                    ? `Your spending in "${topCat.name}" is the highest. Lowering this by 10% could save you ${formatValue(topCat.value * 0.1)} next month.`
                    : "Track more transactions to receive personalized AI insights."}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* 6. Recent Activity */}
        <Grid size={{ xs: 2, sm: 12 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            // mt={2}
            mb={2}
          >
            <Typography variant="h6" fontWeight="600">
              Recent Transactions
            </Typography>
            <Button
              onClick={() => navigate("/transactions")}
              size="small"
              sx={{ fontWeight: 600 }}
            >
              View Statement
            </Button>
          </Box>
          {loading ? (
            <Skeleton
              variant="rectangular"
              height={200}
              sx={{ borderRadius: 5 }}
            />
          ) : (
            <RecentTransactions
              transactions={summary.recentTransactions || []}
              formatValue={formatValue}
            />
          )}
        </Grid>

        <Grid size={{ xs: 2, sm: 12 }}>
          <Card variant="outlined" sx={{ borderRadius: 5, p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Box>
                <Typography variant="h5" fontWeight="600">
                  Net Worth Growth
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total balance across all accounts over the last 6 months
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="h5" fontWeight="600" color="primary.main">
                  +12.5%
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="success.main"
                >
                  UP FROM LAST QUARTER
                </Typography>
              </Box>
            </Box>

            <Box height={200}>
              <BalanceTrend data={netWorthHistory} formatValue={formatValue} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
