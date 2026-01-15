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
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const accountTypes = [
  { value: "bank", label: "Bank Account" },
  { value: "savings", label: "Savings/Investment" },
  { value: "cash", label: "Cash/Wallet" },
  { value: "credit", label: "Credit Card" },
];

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "bank",
    balance: "",
    currency: "USD",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/accounts", formData);
      navigate("/accounts"); // Go back to list after success
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  return (
    <Box className="max-w-2xl mx-auto">
      {/* Back Button */}
      <Button
        startIcon={<ArrowLeftIcon className="h-4 w-4" />}
        onClick={() => navigate("/accounts")}
        className="mb-6 text-gray-500 hover:text-blue-600"
      >
        Back to Accounts
      </Button>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Add New Account
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={4}>
            Enter the details of your bank account, wallet, or savings.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Account Name"
                  placeholder="e.g. HBL Main Account or Pocket Cash"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Account Type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  {accountTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Initial Balance"
                  type="number"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  value={formData.balance}
                  onChange={(e) =>
                    setFormData({ ...formData, balance: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} className="mt-4">
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Create Account
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateAccount;
