import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api
      .get("/transactions?month=2026-01")
      .then((res) => setTransactions(res.data));
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Transactions</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx._id}>
                <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{tx.categoryId?.name}</TableCell>
                <TableCell>{tx.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Transactions;
