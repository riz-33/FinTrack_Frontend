import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ExpensePie = ({ data }) => {
  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey="total"
        nameKey="_id"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default ExpensePie;
