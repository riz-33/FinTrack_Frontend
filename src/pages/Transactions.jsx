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
} from "@mui/material";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import EmptyState from "../components/common/EmptyState";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/transactions");
      setTransactions(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = transactions;

    // Filter by Search (Description or Category)
    if (searchTerm) {
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase())
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
    const headers = ["Date,Description,Category,Type,Amount,Account\n"];

    // 2. Map data to rows
    const rows = filteredData.map((t) => {
      return `${new Date(t.date).toLocaleDateString()},${t.description.replace(/,/g, "")},${t.category},${t.type},${t.amount},${t.accountName || "N/A"}\n`;
    });

    // 3. Create the file blob
    const blob = new Blob([headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    // 4. Trigger download
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `FinTrack_Transactions_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Transactions
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Review and manage your latest financial activities.
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
            onClick={exportToCSV}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Export CSV
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/transactions/add")}
            startIcon={<PlusIcon className="h-5 w-5" />}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Add Transaction
          </Button>
        </Box>
      </Box>

      <Card variant="outlined" sx={{ mb: 3, p: 2, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search description or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </InputAdornment>
                ),
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
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="income">Income Only</MenuItem>
              <MenuItem value="expense">Expense Only</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ArrowPathIcon className="h-4 w-4" />}
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Table Section */}
      <Card variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        {filteredData.length === 0 && !loading ? (
          <EmptyState
            title={searchTerm ? "No matches found" : "No transactions yet"}
            message={
              searchTerm
                ? "Try adjusting your search terms."
                : "Start logging your spending."
            }
            actionLabel={searchTerm ? null : "Add Transaction"}
            actionPath={searchTerm ? null : "/transactions/add"}
          />
        ) : (
          <div className="overflow-x-auto">
            {/* ... Render your table using filteredData instead of transactions ... */}
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((t) => (
                  <tr
                    key={t._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* ... table row content (same as before) ... */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Typography variant="body2" fontWeight="medium">
                        {t.description}
                      </Typography>
                    </td>
                    <td className="px-6 py-4">
                      <Chip
                        label={t.category}
                        size="small"
                        variant="outlined"
                      />
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-bold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}
                    >
                      {t.type === "income" ? "+" : "-"} $
                      {t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </Box>
  );
};

export default Transactions;
