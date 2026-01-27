import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Box,
  Typography,
  Button,
  Card,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import EmptyState from "../components/common/EmptyState";

const categoriesExpense = [
  "Food",
  "Rent",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills",
  "Health",
  "Others",
];

const categoriesIncome = ["Salary", "Business", "Investment", "Gift", "Others"];

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  PKR: "Rs",
};

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  // const [editFormData, setEditFormData] = useState(null);
  const currentSymbol = currencySymbols[selectedAccount?.currency] || "$";
  const [isUpdating, setIsUpdating] = useState(false); // Naya state
  const [editFormData, setEditFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "",
    accountId: "",
    fromAccountId: "",
    toAccountId: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Edit button click par data load karne ka function
  const handleEditClick = (transaction) => {
    setEditFormData({
      ...transaction,
      // Agar account populated hai to ID nikalni hogi
      accountId: transaction.accountId?._id || transaction.accountId,
      fromAccountId:
        transaction.fromAccountId?._id || transaction.fromAccountId,
      toAccountId: transaction.toAccountId?._id || transaction.toAccountId,
      date: new Date(transaction.date).toISOString().split("T")[0],
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true); // Start loading
    try {
      const finalData = {
        ...editFormData,
        amount: Number(editFormData.amount),
      };
      await api.put(`/transactions/${editFormData._id}`, finalData);
      setEditModalOpen(false);
      showToast("Transaction updated!");
      fetchTransactions();
    } catch (error) {
      showToast(error.response?.data?.message || "Update failed", "error");
    } finally {
      setIsUpdating(false); // Stop loading
    }
  };
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

  const handleOpenMenu = (event, account) => {
    setAnchorEl(event.currentTarget);
    setSelectedAccount(account);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    // setSelectedAccount(null);
  };

  // Delete handle karne ka function
  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/transactions/${selectedId}`);
      setOpenConfirm(false);
      showToast("Transaction deleted successfully!");
      fetchTransactions(); // List refresh karein
    } catch (error) {
      showToast(
        error.response?.data?.message || "Delete failed",
        "error",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/transactions");
      console.log(res.data);
      const data = res.data;
      const sortedData = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
      setTransactions(sortedData);
      // setTransactions(data);
      setFilteredData(sortedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get("/accounts");
        setAccounts(res.data);
      } catch (err) {
        console.error("Error fetching accounts", err);
      }
    };
    fetchTransactions();
    fetchAccounts();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = transactions;

    // Filter by Search (Description or Category)
    if (searchTerm) {
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by Type (Income/Expense)
    if (filterType !== "all") {
      result = result.filter((t) => t.type === filterType);
    }

    setFilteredData(result);
  }, [searchTerm, filterType, transactions]);

  const exportToCSV = () => {
    // 1. Define CSV headers
    const headers = [
      "Date,Description,Category,Type,Amount,Account, From Account, To Account\n",
    ];

    // 2. Map data to rows with safety checks
    const rows = filteredData
      .map((t) => {
        const date = new Date(t.date).toLocaleDateString();
        const desc = (t.description || "No Description").replace(/,/g, "");
        const category = t.categoryId?.name || t.category || "N/A";

        // Logical mapping for the Account columns
        const mainAccount = t.accountId?.name || "N/A";
        const fromAccount = t.fromAccountId?.name || "N/A"; // Accessing the .name property
        const toAccount = t.toAccountId?.name || "N/A"; // Accessing the .name property

        return `${date},${desc},${category},${t.type},${t.amount},${mainAccount},${fromAccount},${toAccount}`;
      })
      .join("\n");

    // 3. Create the file blob
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    // 4. Trigger download
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `FinTrack_Transactions_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight="800" color="text.primary">
            Transactions
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage and track your financial history
          </Typography>
        </Box>
        <Box display="flex" gap={1.5}>
          <Button
            variant="outlined"
            startIcon={<ArrowDownTrayIcon className="h-5 w-5" />}
            onClick={exportToCSV}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: "bold",
              px: 3,
            }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            disableElevation
            startIcon={<PlusIcon className="h-5 w-5" />}
            onClick={() => navigate("/transactions/add")}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: "bold",
              px: 3,
            }}
          >
            Add New
          </Button>
        </Box>
      </Box>

      {/* Filter Bar */}
      <Card
        variant="outlined"
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by description or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3 },
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            >
              <MenuItem value="all">All Activities</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
              <MenuItem value="transfer">Transfer</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="text"
              color="inherit"
              startIcon={<ArrowPathIcon className="h-4 w-4" />}
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
              }}
              sx={{ fontWeight: "bold", textTransform: "none" }}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Transactions Table */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredData.length === 0 ? (
          <EmptyState
            title={searchTerm ? "No matches found" : "No transactions"}
            message="Your financial activities will appear here."
          />
        ) : (
          // <Box sx={{ overflowX: "auto" }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">
                  Details
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-right">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((t) => {
                // Dynamic symbol logic
                const symbol = currencySymbols[t.accountId?.currency] || "$";

                return (
                  <tr
                    key={t._id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm ">
                      {new Date(t.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Typography
                        variant="body2"
                        fontWeight="700"
                        color="text.primary"
                      >
                        {t.description}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {t.accountId?.name ||
                          (t.type === "transfer" ? "Internal Transfer" : "N/A")}
                      </Typography>
                    </td>
                    <td className="px-6 py-4">
                      <Chip
                        label={t.category}
                        size="small"
                        variant="outlined"
                      />
                    </td>
                    <td className="px-2 py-4">
                      <Chip
                        label={t.type}
                        size="small"
                        color={
                          t.type === "income"
                            ? "success"
                            : t.type === "transfer"
                              ? "info"
                              : "error"
                        }
                        sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                      />
                    </td>
                    <td className={`px-6 py-4 text-right font-bold text-sm`}>
                      <Box
                        sx={{
                          color:
                            t.type === "income"
                              ? "success.main"
                              : t.type === "transfer"
                                ? "info.main"
                                : "error.main",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                        }}
                      >
                        <span>
                          {t.type === "income"
                            ? "+"
                            : t.type === "transfer"
                              ? ""
                              : "-"}{" "}
                          {symbol}
                          {t.amount.toLocaleString()}
                        </span>
                        <Typography
                          variant="caption"
                          sx={{ opacity: 0.7, textTransform: "capitalize" }}
                        >
                          {t.type}
                        </Typography>
                      </Box>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 0.5,
                          ".group:hover &": { opacity: 1 },
                          transition: "opacity 0.2s",
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditClick(t)}
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedId(t._id);
                            setOpenConfirm(true);
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </Box>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      {/* Confirmation Popup */}

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Delete Transaction?</DialogTitle>

        <DialogContent>
          Are you sure you want to delete? This action cannot be undone and will
          remove transaction history.
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>

          <Button onClick={handleDelete} variant="contained" color="error">
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",

            background: "linear-gradient(45deg, #1976d2, #42a5f5)",

            color: "white",

            mb: 2,
          }}
        >
          Edit Transaction
        </DialogTitle>

        <form onSubmit={handleUpdate}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={12} item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Description"
                  value={editFormData?.description || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,

                      description: e.target.value,
                    })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              {editFormData.type === "transfer" ? (
                <>
                  <Grid size={6} item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="From Account"
                      // required

                      value={editFormData.fromAccountId}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,

                          fromAccountId: e.target.value,
                        })
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
                      label="To Account"
                      // required

                      value={editFormData.toAccountId}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,

                          toAccountId: e.target.value,
                        })
                      }
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    >
                      {/* Tip: Filter out the 'From' account so they don't transfer to the same account */}

                      {accounts

                        .filter((acc) => acc._id !== editFormData.fromAccountId)

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
                  <Grid size={6} item xs={12} md={6}>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      label="Select Account"
                      // required

                      value={editFormData.accountId}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,

                          accountId: e.target.value,
                        })
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
                      // required

                      value={editFormData.category}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,

                          category: e.target.value,
                        })
                      }
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    >
                      {(editFormData.type === "income"
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

              <Grid size={6} item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Amount"
                  value={editFormData?.amount || ""}
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
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,

                      amount: e.target.value,
                    })
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
                  value={editFormData.date}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, date: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isUpdating} // Add this
            >
              {isUpdating ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update Changes"
              )}
            </Button>
          </DialogActions>
        </form>
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
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Transactions;
