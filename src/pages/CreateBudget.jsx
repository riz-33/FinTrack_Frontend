import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  InputAdornment,
} from "@mui/material";
import { ArrowLeftIcon, WalletIcon } from "@heroicons/react/24/outline";

const categories = [
  "Food",
  "Rent",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills",
  "Health",
  "Others",
];

const CreateBudget = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    month: new Date().toISOString().slice(0, 7), // Format: "2026-01"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/budgets", formData);
      navigate("/budgets");
    } catch (error) {
      console.error("Error setting budget:", error);
      alert(
        "Failed to set budget. You might already have a budget for this category."
      );
    }
  };

  return (
    <Box className="max-w-2xl mx-auto">
      <Button
        startIcon={<ArrowLeftIcon className="h-4 w-4" />}
        onClick={() => navigate("/budgets")}
        className="mb-6 text-gray-500 hover:text-blue-600"
      >
        Back to Budgets
      </Button>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <div className="p-3 bg-blue-50 rounded-full">
              <WalletIcon className="h-6 w-6 text-blue-600" />
            </div>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Set Category Budget
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Define how much you want to spend this month.
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Select Category"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monthly Limit"
                  type="number"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  value={formData.limit}
                  onChange={(e) =>
                    setFormData({ ...formData, limit: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Budget Month"
                  type="month"
                  required
                  value={formData.month}
                  onChange={(e) =>
                    setFormData({ ...formData, month: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} className="mt-4">
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ py: 1.5, borderRadius: 2, fontWeight: "bold" }}
                >
                  Set Budget
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateBudget;
