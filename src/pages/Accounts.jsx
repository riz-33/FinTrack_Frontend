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
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  PlusIcon,
  BanknotesIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  WalletIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import EmptyState from "../components/common/EmptyState";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenMenu = (event, account) => {
    setAnchorEl(event.currentTarget);
    setSelectedAccount(account);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    // setSelectedAccount(null);
  };

  const handleOpenDelete = () => {
    setOpenDeleteDialog(true);
    handleCloseMenu();
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/accounts/${selectedAccount._id}`);
      setAccounts(accounts.filter((a) => a._id !== selectedAccount._id));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete account", error);
    }
  };

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
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={4}
      >
        <Box>
          <Typography variant="h5" fontWeight="800" gutterBottom>
            My Accounts
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your banks, wallets, and savings.
          </Typography>
        </Box>
        <Button
          variant="contained"
          disableElevation
          onClick={() => navigate("/accounts/add")}
          startIcon={<PlusIcon className="h-5 w-5" />}
          sx={{ borderRadius: 2.5, px: 3, py: 1, textTransform: "none" }}
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
          actionPath="/accounts/add"
        />
      ) : (
        <Grid container spacing={3}>
          {accounts.map((acc) => (
            <Grid size={3} item xs={12} sm={6} md={4} key={acc._id}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 10px 20px rgba(0,0,0,0.05)",
                    // borderColor: "primary.light",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={3}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: "grey.50",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {getAccountIcon(acc.type)}
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={acc.type?.toUpperCase()}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.65rem",
                          bgcolor: "blue.50",
                          color: "blue.700",
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{ color: "text.secondary" }}
                        onClick={(e) => handleOpenMenu(e, acc)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="h6" fontWeight="700" noWrap>
                      {acc.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                      sx={{ fontFamily: "monospace", letterSpacing: 1 }}
                    >
                      **** {acc.lastFour || "8821"}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 1, borderStyle: "dashed" }} />
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="600"
                      sx={{ textTransform: "uppercase" }}
                    >
                      Current Balance
                    </Typography>
                    <Typography
                      variant="h5"
                      color="text.primary"
                      fontWeight="800"
                    >
                      <Box
                        component="span"
                        sx={{
                          fontSize: "1rem",
                          mr: 0.5,
                          color: "text.secondary",
                        }}
                      >
                        {acc.currency?.toUpperCase() || "USD"}
                      </Box>
                      {acc.balance?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* --- ACTION MENU --- */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        slotProps={{
          paper: { sx: { borderRadius: 2, minWidth: 150, boxShadow: 3 } },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => navigate(`/accounts/edit/${selectedAccount?._id}`)}
        >
          <ListItemIcon>
            <PencilIcon className="h-4 w-4" />
          </ListItemIcon>
          <ListItemText primary="Edit details" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleOpenDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <TrashIcon className="h-4 w-4 text-red-500" />
          </ListItemIcon>
          <ListItemText primary="Delete Account" />
        </MenuItem>
      </Menu>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Delete this account?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{selectedAccount?.name}</strong>? This action cannot be
            undone and will remove all associated transaction history.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disableElevation
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Accounts;
