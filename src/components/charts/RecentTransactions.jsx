import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

const RecentTransactions = ({ transactions, formatValue }) => {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: "action.hover" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="right">
              Amount
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                <TableCell fontWeight="500">{row.description}</TableCell>
                <TableCell>
                  <Chip label={row.category} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.type}
                    size="small"
                    color={
                      row.type === "income"
                        ? "success"
                        : row.type === "transfer"
                          ? "info"
                          : "error"
                    }
                    sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "700",
                    color:
                      row.type === "income"
                        ? "success.main"
                        : row.type === "transfer"
                          ? "info.main"
                          : "error.main",
                  }}
                >
                  {row.type === "income" ? "+" : "-"} {formatValue(row.amount)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                align="center"
                sx={{ py: 3, color: "text.secondary" }}
              >
                No recent transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentTransactions;
