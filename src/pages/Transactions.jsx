import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Box, Typography, Button, Card, Chip } from "@mui/material";
import {
  PlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import EmptyState from "../components/common/EmptyState";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await api.get("/transactions");
        setTransactions(res.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

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
            startIcon={<FunnelIcon className="h-4 w-4" />}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Filter
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

      {/* Table Section */}
      <Card variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        {transactions.length === 0 && !loading ? (
          <EmptyState
            title="No transactions yet"
            message="Your transaction history will appear here once you start logging your spending."
          />
        ) : (
          <div className="overflow-x-auto">
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
                {transactions.map((t) => (
                  <tr
                    key={t._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Typography variant="body2" fontWeight="medium">
                        {t.description}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {t.accountName}
                      </Typography>
                    </td>
                    <td className="px-6 py-4">
                      <Chip
                        label={t.category}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.75rem" }}
                      />
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-bold ${
                        t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
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
