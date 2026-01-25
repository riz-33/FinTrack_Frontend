import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";

const CustomTooltip = ({ active, payload, label, formatValue }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="caption"
          fontWeight="bold"
          color="text.secondary"
          sx={{ display: "block", mb: 0.5 }}
        >
          {label}
        </Typography>
        <Typography variant="h6" fontWeight="900" color="primary.main">
          {formatValue(payload[0].value)}
        </Typography>
      </Box>
    );
  }
  return null;
};

const BalanceTrend = ({ data, formatValue }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={theme.palette.primary.main}
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor={theme.palette.primary.main}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke={theme.palette.divider}
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: theme.palette.text.secondary,
            fontSize: 12,
            fontWeight: 600,
          }}
          dy={10}
        />
        <YAxis
          hide // Net worth charts often look cleaner without the Y-axis labels
          domain={["auto", "auto"]}
        />
        <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
        <Area
          type="monotone"
          dataKey="balance"
          stroke={theme.palette.primary.main}
          strokeWidth={4}
          fillOpacity={1}
          fill="url(#colorBalance)"
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BalanceTrend;
