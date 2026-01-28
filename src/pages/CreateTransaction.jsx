import { useState, useEffect } from "react";
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
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  ArrowLeftIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";

const categoriesExpense = [
  "Food",
  "Rent",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills",
  "Others",
];

const categoriesIncome = ["Salary", "Business", "Investment", "Gift", "Others"];

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  PKR: "Rs",
};

const CreateTransaction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "",
    accountId: "",
    fromAccountId: "",
    toAccountId: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    api.get("/accounts").then((res) => setAccounts(res.data));
  }, []);

  // Helper to get active account for balance checks
  const activeAccount =
    formData.type === "transfer"
      ? accounts.find((a) => a._id === formData.fromAccountId)
      : accounts.find((a) => a._id === formData.accountId);

  const currentSymbol = currencySymbols[activeAccount?.currency] || "$";
  const isOverLimit =
    (formData.type === "expense" || formData.type === "transfer") &&
    Number(formData.amount) > (activeAccount?.balance || 0);

  // Dynamic Theme Colors
  const getThemeColor = () => {
    if (formData.type === "income") return "#16a34a";
    if (formData.type === "transfer") return "#0284c7";
    return "#dc2626";
  };

  const handleTypeChange = (e, val) => {
    if (val) {
      setFormData({
        ...formData,
        type: val,
        category: "",
        accountId: "",
        fromAccountId: "",
        toAccountId: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.type === "transfer" &&
      formData.fromAccountId === formData.toAccountId
    ) {
      return setSnackbar({
        open: true,
        message: "Source and Destination accounts must be different",
        severity: "error",
      });
    }

    setLoading(true);
    try {
      await api.post("/transactions", {
        ...formData,
        amount: Number(formData.amount),
      });
      setSnackbar({
        open: true,
        message: "Transaction created!",
        severity: "success",
      });
      setTimeout(() => navigate("/transactions"), 1200);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error",
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
        onClick={() => navigate("/transactions")}
        sx={{
          mb: 2,
          textTransform: "none",
          color: "text.secondary",
          fontWeight: 600,
        }}
      >
        Back to Transactions
      </Button>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 5,
          borderTop: `6px solid ${getThemeColor()}`,
          boxShadow: "0px 10px 30px rgba(0,0,0,0.04)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="800">
            Create{" "}
            {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Fill in the details below to record your transaction.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={{ xs: 2, md: 2 }} rowSpacing={3}>
              <Grid size={{ xs: 12 }}>
                <ToggleButtonGroup
                  value={formData.type}
                  exclusive
                  onChange={handleTypeChange}
                  fullWidth
                  sx={{
                    bgcolor: "grey.50",
                    // p: 0.5,
                    borderRadius: 4,
                    "& .MuiToggleButton-root": {
                      border: "none",
                      color: "lightgrey",
                      borderRadius: 3,
                      fontWeight: "bold",
                      textTransform: "none",
                      // py: 1.5,
                      "&.Mui-selected": {
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                        // bgcolor: "white",
                        color: getThemeColor(),
                      },
                    },
                  }}
                >
                  <ToggleButton value="expense">
                    <ArrowTrendingDownIcon className="h-4 w-4 mr-2" />
                    Expense
                  </ToggleButton>
                  <ToggleButton value="income">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                    Income
                  </ToggleButton>
                  <ToggleButton value="transfer">
                    <ArrowsRightLeftIcon className="h-4 w-4 mr-2" />
                    Transfer
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  size="small"
                  fullWidth
                  label="Description"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>

              {formData.type === "transfer" ? (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      size="small"
                      select
                      fullWidth
                      label="From Account"
                      required
                      value={formData.fromAccountId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fromAccountId: e.target.value,
                        })
                      }
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    >
                      {accounts.map((acc) => (
                        <MenuItem key={acc._id} value={acc._id}>
                          {acc.name} ({currencySymbols[acc.currency]}
                          {acc.balance})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      size="small"
                      select
                      fullWidth
                      label="To Account"
                      required
                      value={formData.toAccountId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          toAccountId: e.target.value,
                        })
                      }
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    >
                      {accounts
                        .filter((a) => a._id !== formData.fromAccountId)
                        .map((acc) => (
                          <MenuItem key={acc._id} value={acc._id}>
                            {acc.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      size="small"
                      select
                      fullWidth
                      label="Account"
                      required
                      value={formData.accountId}
                      onChange={(e) =>
                        setFormData({ ...formData, accountId: e.target.value })
                      }
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    >
                      {accounts.map((acc) => (
                        <MenuItem key={acc._id} value={acc._id}>
                          {acc.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
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
                    >
                      {(formData.type === "income"
                        ? categoriesIncome
                        : categoriesExpense
                      ).map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </>
              )}

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  label="Amount"
                  required
                  error={isOverLimit}
                  helperText={
                    isOverLimit
                      ? `Insufficient funds in ${activeAccount?.name}`
                      : activeAccount
                        ? `Current Balance: ${currentSymbol}${activeAccount.balance}`
                        : ""
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {currentSymbol}
                      </InputAdornment>
                    ),
                  }}
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  size="small"
                  fullWidth
                  type="date"
                  label="Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disableElevation
                disabled={loading || isOverLimit}
                sx={{
                  borderRadius: 3,
                  // py: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                  bgcolor: getThemeColor(),
                  "&:hover": {
                    bgcolor: getThemeColor(),
                    filter: "brightness(0.9)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Complete Transaction"
                )}
              </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default CreateTransaction;
