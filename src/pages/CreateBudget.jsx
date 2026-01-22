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
  Alert,
  Snackbar,
  CircularProgress,
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

const currencyOptions = [
  { value: "USD", label: "US Dollar (USD)", symbol: "$" },
  { value: "EUR", label: "Euro (EUR)", symbol: "€" },
  { value: "GBP", label: "British Pound (GBP)", symbol: "£" },
  { value: "PKR", label: "Pakistani Rupee (PKR)", symbol: "Rs" },
];

const CreateBudget = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    month: new Date().toISOString().slice(0, 7), // Format: "2026-01"
  });

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/budgets", {
        ...formData,
        amount: formData.limit, 
      });
      showToast("Budget added successfully!"); // Success Toast
      setTimeout(() => {
        navigate("/budgets");
      }, 1500);
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          "Failed to set budget. You might already have a budget for this category.",
        "error",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Button
        startIcon={<ArrowLeftIcon className="h-4 w-4" />}
        onClick={() => navigate("/budgets")}
        sx={{
          textTransform: "none",
          color: "text.secondary",
          "&:hover": { color: "primary.main" },
        }}
      >
        Back to Budgets
      </Button>

      <Card
        variant="outlined"
        sx={{ borderRadius: 4, boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <div className="p-3 bg-blue-50 rounded-full">
              <WalletIcon className="h-6 w-6 text-blue-600" />
            </div>
            <Box>
              <Typography variant="h5" fontWeight="800">
                Set Category Budget
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Define how much you want to spend this month.
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={4} item xs={12}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  label="Select Category"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={4} item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Monthly Limit"
                  type="number"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ fontWeight: "bold", color: "text.primary" }}
                        >
                          {currencyOptions.find(
                            (c) => c.value === formData.currency,
                          )?.symbol || "$"}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  value={formData.limit}
                  onChange={(e) =>
                    setFormData({ ...formData, limit: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              <Grid size={4} item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Budget Month"
                  type="month"
                  required
                  value={formData.month}
                  onChange={(e) =>
                    setFormData({ ...formData, month: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>

            <Grid className="mt-4" item xs={12}>
              <Box display="flex" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  // fullWidth
                  disableElevation
                  disabled={loading}
                  // size="large"
                  sx={{
                    borderRadius: 2.5,
                    px: 4,
                    textTransform: "none",
                    fontWeight: "bold",
                    flex: 1,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Set Budget"
                  )}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate("/budgets")}
                  sx={{
                    borderRadius: 2.5,
                    px: 4,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateBudget;
