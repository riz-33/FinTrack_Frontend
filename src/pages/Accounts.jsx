import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import {
  PlusIcon,
  BanknotesIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  WalletIcon
} from "@heroicons/react/24/outline";
import EmptyState from "../components/common/EmptyState";
import { useNavigate } from "react-router-dom";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/accounts");
      setAccounts(res.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Helper to pick an icon based on account type
  const getAccountIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "bank":
        return <BuildingLibraryIcon className="h-6 w-6 text-blue-600" />;
      case "savings":
        return <WalletIcon className="h-6 w-6 text-orange-600" />;
      case "cash":
        return <BanknotesIcon className="h-6 w-6 text-green-600" />;
      default:
        return <CreditCardIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <Box>
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            My Accounts
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage your banks, wallets, and savings.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate("/accounts/add")}
          startIcon={<PlusIcon className="h-5 w-5" />}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Add Account
        </Button>
      </Box>

      {/* Accounts Grid */}
      {accounts.length === 0 && !loading ? (
        <EmptyState
          title="No accounts linked"
          message="Add your first bank account or wallet to start tracking."
          actionLabel="Create Account"
          actionPath="/accounts"
        />
      ) : (
        <Grid container spacing={3}>
          {accounts.map((acc) => (
            <Grid size={4} item xs={12} sm={6} md={4} key={acc._id}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 3 },
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <div className="p-2 bg-gray-50 rounded-lg">
                      {getAccountIcon(acc.type)}
                    </div>
                    <Typography
                      variant="caption"
                      className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold"
                    >
                      {acc.type?.toUpperCase()}
                    </Typography>
                  </Box>

                  <Typography variant="h6" fontWeight="bold">
                    {acc.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    **** {acc.lastFour || "8821"}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2" color="textSecondary">
                      Current Balance
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {acc.currency?.toUpperCase()}{" "}
                      {acc.balance?.toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Accounts;
