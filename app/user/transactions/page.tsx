"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { readTransactions } from "@/db/crud/transactions.crud";
import { readBooks } from "@/db/crud/books.crud";
import { readPhysicalBooks } from "@/db/crud/physicalBooks.crud";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Transaction {
  tid: number;
  userId: string;
  physicalBookId: number;
  adminId: string;
  status: string;
  borrowedDate: string;
  returnedDate: string | null;
}

interface Book {
  id: number;
  title: string;
  author: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [physicalBooks, setPhysicalBooks] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      if (!user) return;

      const allTransactions = await readTransactions() || [];
      const userTransactions = allTransactions.filter(t => t.userId === user.id);
      setTransactions(userTransactions);

      const booksData = await readBooks(1, 1000);
      setBooks(booksData.books || []);

      const physicalBooksData = await readPhysicalBooks() || [];
      setPhysicalBooks(physicalBooksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === "all") return true;
    if (filter === "borrowed") return transaction.status === "borrowed";
    if (filter === "returned") return transaction.status === "returned";
    return true;
  });

  const getBookTitle = (transaction: Transaction) => {
    const physicalBook = physicalBooks.find(pb => pb.pid === transaction.physicalBookId);
    const book = books.find(b => b.id === physicalBook?.bookId);
    return book?.title || "Unknown Book";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Transaction History</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="borrowed">Borrowed</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading transactions...</div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Borrowed Date</TableHead>
                <TableHead>Returned Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.tid}>
                  <TableCell className="font-medium">
                    {getBookTitle(transaction)}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === "borrowed" ? "bg-blue-100 text-blue-800" : 
                      transaction.status === "returned" ? "bg-green-100 text-green-800" : 
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.borrowedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {transaction.returnedDate 
                      ? new Date(transaction.returnedDate).toLocaleDateString() 
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 