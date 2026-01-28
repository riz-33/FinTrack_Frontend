import { useState, useContext } from "react"; // Added useContext
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { CurrencyContext } from "../context/ThemeContext"; // Import your context
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
  Snackbar,
  Alert,
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

const CreateBudget = () => {
  const navigate = useNavigate();
  const { currency } = useContext(CurrencyContext);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    month: new Date().toISOString().slice(0, 7),
  });

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Logic: Backend expects 'amount' for the limit
      await api.post("/budgets", {
        ...formData,
        amount: Number(formData.limit),
      });
      showToast("Budget set successfully! Redirecting...");
      setTimeout(() => navigate("/budgets"), 1500);
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          "A budget for this category already exists for this month.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", py: 4 }}>
      <Button
        startIcon={<ArrowLeftIcon className="h-4 w-4" />}
        onClick={() => navigate("/budgets")}
        sx={{
          mb: 2,
          textTransform: "none",
          color: "text.secondary",
          fontWeight: 600,
        }}
      >
        Back to Budgets
      </Button>

      <Card
        variant="outlined"
        sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "primary.light",
                borderRadius: "12px",
                color: "primary.main",
                display: "flex",
              }}
            >
              <WalletIcon className="h-6 w-6" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="800">
                New Spending Limit
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Control your outflows by setting a monthly ceiling.
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={{ xs: 2, md: 2 }} rowSpacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  size="small"
                  select
                  fullWidth
                  label="Category"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  helperText="One budget per category per month"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  size="small"
                  fullWidth
                  label="Monthly Limit"
                  type="number"
                  required
                  inputProps={{ min: "1" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ fontWeight: "bold" }}>
                          {currency?.symbol || "$"}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  value={formData.limit}
                  onChange={(e) =>
                    setFormData({ ...formData, limit: e.target.value })
                  }
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  size="small"
                  fullWidth
                  label="Budget Period"
                  type="month"
                  required
                  value={formData.month}
                  onChange={(e) =>
                    setFormData({ ...formData, month: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  flex: 2,
                  // py: 1.5,
                  borderRadius: 2.5,
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Set Budget"}
              </Button>
              {/* <Button
                    variant="outlined"
                    onClick={() => navigate("/budgets")}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      borderRadius: 2.5,
                      fontWeight: "bold",
                      textTransform: "none",
                    }}
                  >
                    Cancel
                  </Button> */}
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateBudget;
