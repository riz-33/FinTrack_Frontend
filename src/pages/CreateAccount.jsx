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
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const accountTypes = [
  { value: "bank", label: "Bank Account" },
  { value: "savings", label: "Savings/Investment" },
  { value: "cash", label: "Cash/Wallet" },
  { value: "credit", label: "Credit Card" },
];

const currencyOptions = [
  { value: "USD", label: "US Dollar (USD)", symbol: "$" },
  { value: "EUR", label: "Euro (EUR)", symbol: "€" },
  { value: "GBP", label: "British Pound (GBP)", symbol: "£" },
  { value: "PKR", label: "Pakistani Rupee (PKR)", symbol: "Rs" },
];

const CreateAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    name: "",
    type: "bank",
    balance: "",
    currency: "USD",
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
      await api.post("/accounts", formData);
      showToast("Account created successfully!"); // Success Toast
      setTimeout(() => {
        navigate("/accounts");
      }, 1500);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Account creation failed",
        "error",
      ); // Error Toast
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

      {/* Back Button */}
      <Button
        startIcon={<ArrowLeftIcon className="h-4 w-4" />}
        onClick={() => navigate("/accounts")}
        sx={{
          textTransform: "none",
          color: "text.secondary",
          "&:hover": { color: "primary.main" },
        }}
      >
        Back to Accounts
      </Button>

      <Card
        variant="outlined"
        sx={{ borderRadius: 4, boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="800" gutterBottom>
            Add New Account
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={4}>
            Enter the details of your bank account, wallet, or savings.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12} item xs={12}>
                <TextField
                  size="small"
                  fullWidth
                  label="Account Name"
                  placeholder="e.g. HBL Main Account or Pocket Cash"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              <Grid size={6} item xs={12} md={6}>
                <TextField
                  select
                  size="small"
                  required
                  fullWidth
                  label="Account Type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                >
                  {accountTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={6} item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  required
                  label="Initial Balance"
                  type="number"
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
                  value={formData.balance}
                  onChange={(e) =>
                    setFormData({ ...formData, balance: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              {/* <Grid size={6} item xs={12} md={6}>
                <TextField
                  size="small"
                  select
                  required
                  fullWidth
                  label="Currency"
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                >
                  {currencyOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid> */}
            </Grid>

            <Grid className='mt-4' item xs={12}>
              <Box display="flex" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  disableElevation
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
                    "Create Account"
                  )}
                </Button>

                <Button
                  // fullWidth
                  variant="outlined"
                  // size="large"
                  onClick={() => navigate("/accounts")}
                  sx={{
                    borderRadius: 2.5,
                    px: 4,
                    textTransform: "none",
                    fontWeight: "bold",
                    // flex: 1,
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

export default CreateAccount;
