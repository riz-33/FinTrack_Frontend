import { useContext, useEffect, useState } from "react";
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
  TextField,
  MenuItem as SelectItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
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
import { CurrencyContext } from "../context/ThemeContext";

const Accounts = () => {
  const { formatValue } = useContext(CurrencyContext);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", balance: 0, type: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Open Edit Dialog and populate data
  const handleOpenEdit = () => {
    setFormData({
      name: selectedAccount.name,
      balance: selectedAccount.balance,
      type: selectedAccount.type,
    });
    setOpenEditDialog(true);
    handleCloseMenu();
  };

  const handleUpdateAccount = async () => {
    try {
      const res = await api.put(`/accounts/${selectedAccount._id}`, formData);
      setAccounts(
        accounts.map((a) => (a._id === selectedAccount._id ? res.data : a)),
      );
      setOpenEditDialog(false);
      showToast("Account updated successfully!"); // Success Toast
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to update account",
        "error",
      );
    }
  };

  const handleOpenMenu = (event, account) => {
    setAnchorEl(event.currentTarget);
    setSelectedAccount(account);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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
      showToast("Account deleted successfully!");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to delete account",
        "error",
      );
    } finally {
      setLoading(false);
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

  const totalBalance = accounts.reduce(
    (acc, curr) => acc + (Number(curr.balance) || 0),
    0,
  );

  const getAccountStyles = (type) => {
    switch (type?.toLowerCase()) {
      case "bank":
        return {
          color: "#2563eb",
          bg: "#eff6ff",
          icon: <BuildingLibraryIcon className="h-6 w-6" />,
        };
      case "savings":
        return {
          color: "#7c3aed",
          bg: "#f5f3ff",
          icon: <BanknotesIcon className="h-6 w-6" />,
        };
      case "cash":
        return {
          color: "#059669",
          bg: "#ecfdf5",
          icon: <WalletIcon className="h-6 w-6" />,
        };
      case "credit":
        return {
          color: "#dc2626",
          bg: "#fef2f2",
          icon: <CreditCardIcon className="h-6 w-6" />,
        };
      default:
        return {
          color: "#4b5563",
          bg: "#f3f4f6",
          icon: <CreditCardIcon className="h-6 w-6" />,
        };
    }
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{ letterSpacing: "-0.5px" }}
          >
            Accounts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your financial sources in one place.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Card
            variant="outlined"
            sx={{
              px: 4,
              borderRadius: 4,
              bgcolor: "background.paper",
              display: { xs: "none", sm: "block" },
            }}
          >
            <Typography
              variant="caption"
              fontWeight="700"
              color="text.secondary"
              sx={{ textTransform: "uppercase" }}
            >
              Total Net Worth
            </Typography>
            <Typography variant="h6" fontWeight="600" color="primary.main">
              {formatValue(totalBalance)}
            </Typography>
          </Card>

          <Button
            variant="contained"
            disableElevation
            onClick={() => navigate("/accounts/add")}
            startIcon={<PlusIcon className="h-5 w-5" />}
            sx={{
              borderRadius: 3,
              px: 4,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Add Account
          </Button>
        </Box>
      </Box>

      {accounts.length === 0 && !loading ? (
        <EmptyState
          title="No accounts linked"
          message="Link a bank account or wallet to start tracking your net worth."
          actionLabel="Add My First Account"
          actionPath="/accounts/add"
        />
      ) : (
        <Grid
          container
          spacing={{ xs: 2, md: 2 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          mb={3}
        >
          {accounts.map((acc) => {
            const styles = getAccountStyles(acc.type);
            return (
              <Grid size={{ xs: 2, sm: 4, md: 3 }} key={acc._id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 5,
                    position: "relative",
                    overflow: "visible",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0px 12px 30px rgba(0,0,0,0.08)",
                      borderColor: styles.color,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 3,
                          bgcolor: styles.bg,
                          color: styles.color,
                        }}
                      >
                        {styles.icon}
                      </Box>
                      <IconButton
                        onClick={(e) => handleOpenMenu(e, acc)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight="800"
                      noWrap
                      sx={{ mb: 0.5 }}
                    >
                      {acc.name}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Chip
                        label={acc.type}
                        size="small"
                        sx={{
                          bgcolor: styles.bg,
                          color: styles.color,
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontFamily: "monospace" }}
                      >
                        •••• {acc.lastFour || "8821"}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1, borderStyle: "dashed" }} />

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="700"
                      >
                        CURRENT BALANCE
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="700"
                        sx={{
                          display: "flex",
                          gap: 0.5,
                        }}
                      >
                        {formatValue(acc.balance)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
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
        <MenuItem onClick={handleOpenEdit}>
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

      {/* --- EDIT ACCOUNT DIALOG --- */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Edit Account</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <TextField
              label="Account Name"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Account Type</InputLabel>
              <Select
                label="Account Type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <SelectItem value="bank">Bank Account</SelectItem>
                <SelectItem value="credit">Credit Card</SelectItem>
                <SelectItem value="cash">Cash/Wallet</SelectItem>
                <SelectItem value="savings">Savings/Investment</SelectItem>
              </Select>
            </FormControl>
            <TextField
              label="Balance"
              type="number"
              fullWidth
              value={formData.balance}
              onChange={(e) =>
                setFormData({ ...formData, balance: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEditDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateAccount}
            variant="contained"
            disableElevation
            sx={{ borderRadius: 2 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default Accounts;
