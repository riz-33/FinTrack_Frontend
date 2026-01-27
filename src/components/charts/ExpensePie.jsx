import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Box, Typography } from "@mui/material";

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

const ExpensePie = ({ data, formatValue }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box sx={{ width: "100%", height: 350, position: "relative" }}>
      {/* Centered Total Label */}
      <Box
        sx={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Typography variant="caption" fontWeight="bold" color="text.secondary">
          TOTAL
        </Typography>
        <Typography variant="h6" fontWeight="900">
          {formatValue(total)}
        </Typography>
      </Box>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={80} // Creates the Donut effect
            outerRadius={110}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ExpensePie;
