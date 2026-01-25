import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  PlusIcon,
  ShoppingBagIcon,
  CakeIcon,
  HomeIcon,
  TruckIcon,
  LightBulbIcon,
  HeartIcon,
  EllipsisHorizontalIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import EmptyState from "../components/common/EmptyState";
import { TrashIcon } from "@heroicons/react/24/outline";
import { IconButton, Tooltip } from "@mui/material";

const categoryIcons = {
  Food: <CakeIcon className="h-5 w-5 text-orange-600" />,
  Rent: <HomeIcon className="h-5 w-5 text-purple-600" />,
  Transport: <TruckIcon className="h-5 w-5 text-blue-600" />,
  Shopping: <ShoppingBagIcon className="h-5 w-5 text-pink-600" />,
  Bills: <LightBulbIcon className="h-5 w-5 text-yellow-600" />,
  Health: <HeartIcon className="h-5 w-5 text-red-600" />,
  Others: <EllipsisHorizontalIcon className="h-5 w-5 text-gray-600" />,
};

const Budgets = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
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

  // 1. Dynamic Month State (Defaults to current month)
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        // 2. Pass the selectedMonth to the API
        const res = await api.get("/budgets", {
          params: { month: selectedMonth },
        });
        setBudgets(res.data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBudgets();
  }, [selectedMonth]); // 3. Re-run fetch when month changes

  const handleOpenDelete = (id) => {
    setBudgetToDelete(id); // Set the ID here
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!budgetToDelete) return;

    try {
      await api.delete(`/budgets/${budgetToDelete}`);
      setBudgets((prev) => prev.filter((b) => b._id !== budgetToDelete));
      setOpenDeleteDialog(false);
      showToast("Budget deleted successfully!");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to delete budget",
        "error",
      );
    } finally {
      setBudgetToDelete(null); // Reset after deletion
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header & Controls */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={5}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="800"
            sx={{ letterSpacing: "-0.5px" }}
          >
            Financial Goals
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Review your spending limits for <strong>{selectedMonth}</strong>
          </Typography>
        </Box>

        <Box display="flex" gap={2}>
          {/* Month Selector Field */}
          <TextField
            type="month"
            size="small"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            onClick={() => navigate("/budgets/add")}
            startIcon={<PlusIcon className="h-5 w-5" />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              px: 3,
              boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.39)",
            }}
          >
            Set Budget
          </Button>
        </Box>
      </Box>

      {/* Grid Rendering */}
      {budgets.length === 0 && !loading ? (
        <EmptyState
          title="No budgets for this month"
          message={`You haven't set any spending limits for ${selectedMonth} yet.`}
          actionLabel="Create Budget"
          actionPath="/budgets/add"
        />
      ) : (
        <Grid container spacing={3}>
          {budgets.map((budget) => {
            const percentage = Math.min(
              (budget.spent / budget.limit) * 100,
              100,
            );
            const isOverBudget = budget.spent > budget.limit;
            const remaining = budget.limit - budget.spent;

            return (
              <Grid size={6} item xs={12} md={6} key={budget.category}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                      borderColor: "primary.light",
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
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            bgcolor: "grey.50",
                            borderRadius: 2,
                            width: 48,
                            height: 48,
                          }}
                        >
                          {categoryIcons[budget.category] ||
                            categoryIcons.Others}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {budget.category}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            fontWeight="500"
                          >
                            MONTHLY LIMIT
                          </Typography>
                        </Box>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={
                            isOverBudget
                              ? "Exceeded"
                              : `$${remaining.toLocaleString()} left`
                          }
                          color={isOverBudget ? "error" : "success"}
                          variant="soft"
                          sx={{ fontWeight: "bold", borderRadius: 1.5 }}
                        />

                        <Tooltip title="Delete Budget">
                          <IconButton
                            onClick={() => handleOpenDelete(budget._id)}
                            size="small"
                            sx={{
                              color: "text.secondary",
                              "&:hover": {
                                color: "error.main",
                                bgcolor: "error.light",
                              },
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-end"
                      mb={1}
                    >
                      <Typography variant="h5" fontWeight="800">
                        ${budget.spent.toLocaleString()}
                        <Typography
                          component="span"
                          variant="body2"
                          color="textSecondary"
                          sx={{ ml: 0.5 }}
                        >
                          / ${budget.limit.toLocaleString()}
                        </Typography>
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="700"
                        color={isOverBudget ? "error.main" : "primary.main"}
                      >
                        {percentage.toFixed(0)}%
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: "#f0f2f5",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: isOverBudget ? "#ef4444" : "#3b82f6",
                          borderRadius: 5,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
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
            Are you sure you want to delete this budget?
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
            onClick={handleDelete}
            variant="contained"
            color="error"
            disableElevation
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Delete Budget
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

export default Budgets;
