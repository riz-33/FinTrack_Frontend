import {
  AreaChart, // Changed to AreaChart for the gradient effect
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme, Box, Typography } from "@mui/material";

const TrendLine = ({ data, formatValue }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const currentMonth = new Date().toLocaleString("default", { month: "short" });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: isDarkMode ? "grey.900" : "white",
            p: 1.5,
            borderRadius: 3,
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight="700">
            {currentMonth} {label}
          </Typography>
          <Typography variant="body2" fontWeight="900" color="primary.main">
            ${payload[0].value.toLocaleString()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke={isDarkMode ? "#334155" : "#f1f5f9"}
        />
        <XAxis
          dataKey="day"
          stroke={isDarkMode ? "#94a3b8" : "#64748b"}
          fontSize={11}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke={isDarkMode ? "#94a3b8" : "#64748b"}
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#6366f1"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorAmount)" // Uses the gradient defined in <defs>
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TrendLine;
