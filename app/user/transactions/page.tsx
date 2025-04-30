import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { fetchUserTransactions } from "./server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = {
  title: "My Transactions | Library Management System",
  description: "View your transaction history",
};

export default async function TransactionsPage() {
  const session = await auth();
  const userId = session.userId;
  if (!userId) {
    return <div>Unauthorized</div>;
  }

  const transactions = await fetchUserTransactions();
  const pageSize = 10;
  const paginatedTransactions = transactions.slice(0, pageSize);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Transactions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Showing {paginatedTransactions.length} of {transactions.length} transactions
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Book Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Borrowed Date</TableHead>
              <TableHead>Returned Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((tx) => (
              <TableRow key={tx.tid}>
                <TableCell>{tx.tid}</TableCell>
                <TableCell>{tx.bookTitle}</TableCell>
                <TableCell>{tx.status}</TableCell>
                <TableCell>{tx.borrowedDate}</TableCell>
                <TableCell>{tx.returnedDate || "Not returned yet"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 