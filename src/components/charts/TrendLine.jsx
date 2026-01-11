import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const TrendLine = ({ data }) => {
  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="_id" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="total" />
    </LineChart>
  );
};

export default TrendLine;
