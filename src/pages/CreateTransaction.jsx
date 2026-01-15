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
} from "@mui/material";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const categories = [
  "Food",
  "Rent",
  "Transport",
  "Salary",
  "Shopping",
  "Entertainment",
  "Bills",
  "Others",
];

const CreateTransaction = () => {
  const navigate = useNavigate();
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
    try {
      await api.post("/transactions", formData);
      navigate("/transactions");
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  return (
    <Box className="max-w-2xl mx-auto">
      <Button
        startIcon={<ArrowLeftIcon className="h-4 w-4" />}
        onClick={() => navigate("/transactions")}
        className="mb-4 text-gray-500"
      >
        Back
      </Button>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            New Transaction
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Income/Expense Toggle */}
              <Grid item xs={12} className="flex justify-center">
                <ToggleButtonGroup
                  value={formData.type}
                  exclusive
                  onChange={(e, val) =>
                    val && setFormData({ ...formData, type: val })
                  }
                  fullWidth
                  color={formData.type === "income" ? "success" : "error"}
                >
                  <ToggleButton value="expense" sx={{ flex: 1 }}>
                    Expense
                  </ToggleButton>
                  <ToggleButton value="income" sx={{ flex: 1 }}>
                    Income
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  required
                  placeholder="e.g. Weekly Groceries"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
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
                      {acc.name} (${acc.balance})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
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
                  type="date"
                  label="Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  color={formData.type === "income" ? "success" : "primary"}
                  sx={{ py: 1.5, mt: 2 }}
                >
                  Save {formData.type}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateTransaction;
