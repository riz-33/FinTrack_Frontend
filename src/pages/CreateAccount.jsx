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
  Avatar,
} from "@mui/material";
import {
  ArrowLeftIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

// Added colors and icons for better UX
const accountTypes = [
  {
    value: "bank",
    label: "Bank Account",
    icon: <BuildingLibraryIcon className="h-5 w-5" />,
    color: "#2563eb",
  },
  {
    value: "savings",
    label: "Savings/Investment",
    icon: <BanknotesIcon className="h-5 w-5" />,
    color: "#7c3aed",
  },
  {
    value: "cash",
    label: "Cash/Wallet",
    icon: <WalletIcon className="h-5 w-5" />,
    color: "#059669",
  },
  {
    value: "credit",
    label: "Credit Card",
    icon: <CreditCardIcon className="h-5 w-5" />,
    color: "#dc2626",
  },
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

  const selectedType = accountTypes.find((t) => t.value === formData.type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/accounts", {
        ...formData,
        balance: Number(formData.balance),
      });
      setSnackbar({
        open: true,
        message: "Account created successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/accounts"), 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 550, mx: "auto", py: 4 }}>
      <Button
        startIcon={<ArrowLeftIcon className="h-4 w-4" />}
        onClick={() => navigate("/accounts")}
        sx={{
          mb: 2,
          textTransform: "none",
          color: "text.secondary",
          fontWeight: 600,
        }}
      >
        Back to Accounts
      </Button>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 5,
          boxShadow: "0px 10px 30px rgba(0,0,0,0.04)",
          borderTop: `6px solid ${selectedType?.color || "#ddd"}`,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar
              sx={{
                bgcolor: `${selectedType?.color}15`,
                color: selectedType?.color,
                width: 56,
                height: 56,
              }}
            >
              {selectedType?.icon}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="800">
                New Account
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Setup your starting balance
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={{ xs: 2, md: 2 }} rowSpacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  size="small"
                  fullWidth
                  label="Account Name"
                  placeholder="e.g. Chase Checkings"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  size="small"
                  select
                  fullWidth
                  label="Account Type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                >
                  {accountTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box sx={{ color: option.color, display: "flex" }}>
                          {option.icon}
                        </Box>
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  size="small"
                  select
                  fullWidth
                  label="Currency"
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                >
                  {currencyOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  size="small"
                  fullWidth
                  label="Initial Balance"
                  type="number"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography fontWeight="bold">
                          {
                            currencyOptions.find(
                              (c) => c.value === formData.currency,
                            )?.symbol
                          }
                        </Typography>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 3,
                      // fontSize: "1.2rem",
                      // fontWeight: "bold",
                    },
                  }}
                  value={formData.balance}
                  onChange={(e) =>
                    setFormData({ ...formData, balance: e.target.value })
                  }
                />
              </Grid>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disableElevation
                disabled={loading}
                sx={{
                  borderRadius: 3,
                  fontWeight: "bold",
                  textTransform: "none",
                  bgcolor: `${selectedType?.color}`,
                  "&:hover": {
                    bgcolor: `${selectedType?.color}`,
                    filter: "brightness(0.9)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Account"
                )}
              </Button>
              {/* <Button
                variant="outlined"
                onClick={() => navigate("/accounts")}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: "bold",
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
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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

export default CreateAccount;
