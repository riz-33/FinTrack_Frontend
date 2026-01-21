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

  // Fetch accounts so the user can choose WHERE the money is coming from
  useEffect(() => {
    api.get("/accounts").then((res) => setAccounts(res.data));
  }, []);

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTypeChange = (e, val) => {
    if (val) {
      setFormData({
        ...formData,
        type: val,
        category: "",
        fromAccountId: "",
        toAccountId: "",
      }); // Reset category on type change
    }
  };

  const selectedAccount = accounts.find(
    (acc) => acc._id === formData.accountId,
  );
  const currentSymbol = currencySymbols[selectedAccount?.currency] || "$";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);
    const submissionData = {
      ...formData,
      amount: Number(formData.amount), // Ensure this is a number
    };
    try {
      await api.post("/transactions", submissionData);
      showToast("Transaction created successfully!"); // Success Toast
      setTimeout(() => {
        navigate("/transactions");
      }, 1500);
    } catch (error) {
      showToast(error.response?.data?.message || "Creation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Find the account the user currently has selected
  const activeAccount =
    formData.type === "transfer"
      ? accounts.find((a) => a._id === formData.fromAccountId)
      : accounts.find((a) => a._id === formData.accountId);

  // Determine if we are over the limit
  const isOverLimit =
    (formData.type === "expense" || formData.type === "transfer") &&
    Number(formData.amount) > (activeAccount?.balance || 0);

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
        onClick={() => navigate("/transactions")}
        sx={{
          textTransform: "none",
          color: "text.secondary",
          "&:hover": { color: "primary.main" },
        }}
      >
        Back to Transactions
      </Button>

      <Card
        variant="outlined"
        sx={{ borderRadius: 4, boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="800" gutterBottom mb={3}>
            New Transaction
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              {/* Income/Expense Toggle */}
              <Grid size={12} item xs={12}>
                {/* <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="600"
                  sx={{ mb: 1, display: "block", textTransform: "uppercase" }}
                >
                  Transaction Type
                </Typography> */}
                <ToggleButtonGroup
                  value={formData.type}
                  exclusive
                  onChange={handleTypeChange}
                  fullWidth
                  sx={{
                    height: 48,
                    // bgcolor: "grey.50",
                    p: 0.5,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    "& .MuiToggleButtonGroup-grouped": {
                      border: "none",
                      borderRadius: "10px !important",
                    },
                  }}
                >
                  <ToggleButton
                    value="expense"
                    sx={{
                      gap: 1,
                      // color: "black",
                      textTransform: "none",
                      fontWeight: "bold",
                      transition: "all 0.2s",
                      "&.Mui-selected": {
                        bgcolor: "#fee2e2", // Soft red
                        color: "#dc2626",
                        "&:hover": { bgcolor: "#fecaca" },
                      },
                    }}
                  >
                    <ArrowTrendingDownIcon className="h-5 w-5" />
                    Expense
                  </ToggleButton>

                  <ToggleButton
                    value="income"
                    sx={{
                      gap: 1,
                      textTransform: "none",
                      fontWeight: "bold",
                      transition: "all 0.2s",
                      "&.Mui-selected": {
                        bgcolor: "#dcfce7", // Soft green
                        color: "#16a34a",
                        "&:hover": { bgcolor: "#bbf7d0" },
                      },
                    }}
                  >
                    <ArrowTrendingUpIcon className="h-5 w-5" />
                    Income
                  </ToggleButton>

                  <ToggleButton
                    value="transfer"
                    sx={{
                      gap: 1,
                      fontWeight: "bold",
                      textTransform: "none",
                      transition: "all 0.2s",
                      "&.Mui-selected": {
                        bgcolor: "#dceefc", // Soft green
                        color: "#1668a3",
                        "&:hover": { bgcolor: "#bbf7d0" },
                      },
                    }}
                  >
                    <ArrowsRightLeftIcon className="h-4 w-4" /> Transfer
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              <Grid size={12} item xs={12}>
                <TextField
                  size="small"
                  fullWidth
                  label="Description"
                  required
                  // placeholder="e.g. Weekly Groceries"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              {/* CONDITIONAL FIELDS */}
              {formData.type === "transfer" ? (
                <>
                  {/* TRANSFER VIEW: Show From and To Accounts */}
                  <Grid size={6} item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="From Account"
                      required
                      value={formData.fromAccountId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fromAccountId: e.target.value,
                        })
                      }
                    >
                      {accounts.map((acc) => (
                        <MenuItem key={acc._id} value={acc._id}>
                          {acc.name} ({currencySymbols[acc.currency] || ""}
                          {acc.balance.toLocaleString()})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={6} item xs={12} md={6}>
                    <TextField
                      select
                      size="small"
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
                    >
                      {/* Tip: Filter out the 'From' account so they don't transfer to the same account */}
                      {accounts
                        .filter((acc) => acc._id !== formData.fromAccountId)
                        .map((acc) => (
                          <MenuItem key={acc._id} value={acc._id}>
                            {acc.name} ({currencySymbols[acc.currency] || ""}
                            {acc.balance.toLocaleString()})
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                </>
              ) : (
                <>
                  {/* NORMAL VIEW: Show Single Account and Category */}
                  <Grid size={6} item xs={12} md={6}>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      label="Select Account"
                      required
                      value={formData.accountId}
                      onChange={(e) =>
                        setFormData({ ...formData, accountId: e.target.value })
                      }
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    >
                      {accounts.map((acc) => (
                        <MenuItem key={acc._id} value={acc._id}>
                          {acc.name} ({currencySymbols[acc.currency] || ""}
                          {acc.balance.toLocaleString()})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={6} item xs={12} md={6}>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      label="Category"
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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

              {/* Amount and Date (Visible for all) */}
              <Grid size={6} item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Amount"
                  type="number"
                  required
                  error={isOverLimit}
                  helperText={
                    isOverLimit
                      ? `Warning: Exceeds ${activeAccount?.name} balance!`
                      : ""
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ fontWeight: "bold", color: "text.primary" }}
                        >
                          {currentSymbol}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              <Grid size={6} item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Transaction Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>

            <Grid sx={{ mt: 2 }} item xs={12}>
              <Box display="flex" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  disabled={loading}
                  color={formData.type === "income" ? "success" : "primary"}
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
                    <>
                      Save{" "}
                      {formData.type.charAt(0).toUpperCase() +
                        formData.type.slice(1)}
                    </>
                  )}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate("/transactions")}
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

export default CreateTransaction;
