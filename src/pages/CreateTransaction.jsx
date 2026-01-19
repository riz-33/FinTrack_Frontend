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
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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

const CreateTransaction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState({ type: "success", msg: "" });
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "",
    accountId: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Fetch accounts so the user can choose WHERE the money is coming from
  useEffect(() => {
    api.get("/accounts").then((res) => setAccounts(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "success", msg: "Transaction created successfully!" });
    setLoading(true);
    console.log("Submitting form data:", formData);
    try {
      await api.post("/transactions", formData);
      setOpen(true);
      // setTimeout(() => {
      // navigate("/transactions");
      // }, 1500);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Transaction creation failed";
      setStatus({ type: "error", msg: errorMsg });
      setOpen(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: 700 }} className=" mx-auto">
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={status.type}
          variant="filled"
          style={{ marginTop: "50px" }}
        >
          {status.msg}
        </Alert>
      </Snackbar>
      <Button
        startIcon={<ArrowLeftIcon className="h-4 w-4" />}
        onClick={() => navigate("/transactions")}
        className="mb-4 text-gray-500"
      >
        Back to Transactions
      </Button>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            New Transaction
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Income/Expense Toggle */}
              <Grid size={12} item xs={12} className="flex justify-center">
                <ToggleButtonGroup
                  value={formData.type}
                  exclusive
                  onChange={(e, val) =>
                    val && setFormData({ ...formData, type: val })
                  }
                  fullWidth
                  color={formData.type === "income" ? "success" : "error"}
                >
                  <ToggleButton size="small" value="expense" sx={{ flex: 1 }}>
                    Expense
                  </ToggleButton>
                  <ToggleButton size="small" value="income" sx={{ flex: 1 }}>
                    Income
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
                />
              </Grid>

              <Grid size={6} item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Amount"
                  type="number"
                  required
                  // InputProps={{
                  //   startAdornment: (
                  //     <InputAdornment position="start">$</InputAdornment>
                  //   ),
                  // }}
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </Grid>

              <Grid size={6} item xs={12} md={6}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  label="Account"
                  required
                  value={formData.accountId}
                  onChange={(e) =>
                    setFormData({ ...formData, accountId: e.target.value })
                  }
                >
                  {accounts.map((acc) => (
                    <MenuItem key={acc._id} value={acc._id}>
                      {acc.name} ({acc.balance})
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
                >
                  {formData.type === "income"
                    ? categoriesIncome.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))
                    : categoriesExpense.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                </TextField>
              </Grid>

              <Grid size={6} item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </Grid>
            </Grid>

            <div className="flex justify-center mt-6">
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                // size="large"
                color={formData.type === "income" ? "success" : "primary"}
                // sx={{ py: 1.5, mt: 2 }}
              >
                Save {formData.type}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateTransaction;
