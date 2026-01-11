import { useEffect, useState } from "react";
import api from "../services/api";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import ExpensePie from "../components/charts/ExpensePie";
import TrendLine from "../components/charts/TrendLine";

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [pieData, setPieData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    api
      .get("/reports/dashboard?month=2026-01")
      .then((res) => setData(res.data));
  }, []);

  useEffect(() => {
    api
      .get("/reports/dashboard?month=2026-01")
      .then((res) => setSummary(res.data));

    api
      .get("/reports/expense-category?month=2026-01")
      .then((res) => setPieData(res.data));

    api
      .get("/reports/daily-trend?month=2026-01")
      .then((res) => setTrendData(res.data));
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        {["totalBalance", "income", "expense"].map((key) => (
          <Grid item xs={12} md={4} key={key}>
            <Card>
              <CardContent>
                <Typography>{key.toUpperCase()}</Typography>
                <Typography variant="h5">${summary[key]}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography>Expense by Category</Typography>
              <ExpensePie data={pieData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography>Daily Expense Trend</Typography>
              <TrendLine data={trendData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
