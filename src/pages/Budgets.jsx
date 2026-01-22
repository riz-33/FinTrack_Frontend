import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import {
  PlusIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import EmptyState from "../components/common/EmptyState";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        // We assume the API returns: { category, limit, spent }
        const res = await api.get("/budgets", {
          params: { month: "2026-01" }, // Using params is cleaner
        });
        setBudgets(res.data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBudgets();
  }, []);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Monthly Budgets
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Set limits to control your spending across categories.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate("/budgets/add")}
          startIcon={<PlusIcon className="h-5 w-5" />}
          sx={{ borderRadius: 2 }}
        >
          Set New Budget
        </Button>
      </Box>

      {budgets.length === 0 && !loading ? (
        <EmptyState
          title="No budgets set"
          message="Keep your finances in check by setting monthly limits for food, rent, and more."
          actionLabel="Set a Budget"
          actionPath="/budgets/add"
        />
      ) : (
        <Grid container spacing={3}>
          {budgets.map((budget) => {
            const percentage = Math.min(
              (budget.spent / budget.limit) * 100,
              100,
            );
            const isOverBudget = budget.spent > budget.limit;

            return (
              <Grid item xs={12} md={6} key={budget.category}>
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography fontWeight="bold">
                        {budget.category}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={isOverBudget ? "error.main" : "textSecondary"}
                      >
                        ${budget.spent} / ${budget.limit}
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#f0f0f0",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: isOverBudget ? "#ef4444" : "#3b82f6",
                        },
                      }}
                    />

                    <Box display="flex" justifyContent="space-between" mt={1}>
                      <Typography variant="caption" color="textSecondary">
                        {percentage.toFixed(0)}% used
                      </Typography>
                      {isOverBudget && (
                        <Typography
                          variant="caption"
                          color="error"
                          fontWeight="bold"
                        >
                          Over budget by $
                          {(budget.spent - budget.limit).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default Budgets;
