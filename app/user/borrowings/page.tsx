"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { readTransactions } from "@/db/crud/transactions.crud";
import { readBooks } from "@/db/crud/books.crud";
import { readPhysicalBooks } from "@/db/crud/physicalBooks.crud";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface Transaction {
  tid: number;
  userId: string;
  physicalBookId: number;
  status: string;
  borrowedDate: string;
  returnedDate: string | null;
}

interface Book {
  id: number;
  title: string;
  author: string;
}

export default function BorrowingsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [physicalBooks, setPhysicalBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      if (!user) return;

      const allTransactions = await readTransactions() || [];
      const userTransactions = allTransactions.filter(t => 
        t.userId === user.id && t.status === "borrowed"
      );
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

  const getBookTitle = (transaction: Transaction) => {
    const physicalBook = physicalBooks.find(pb => pb.pid === transaction.physicalBookId);
    const book = books.find(b => b.id === physicalBook?.bookId);
    return book?.title || "Unknown Book";
  };

  const getDaysRemaining = (borrowedDate: string) => {
    const today = new Date();
    const borrowed = new Date(borrowedDate);
    const daysPassed = Math.floor((today.getTime() - borrowed.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = 15 - daysPassed; // Assuming 15 days borrowing period
    return daysRemaining;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Current Borrowings</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span>15 days borrowing period</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading borrowings...</div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Borrowed Date</TableHead>
                <TableHead>Days Remaining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const daysRemaining = getDaysRemaining(transaction.borrowedDate);
                const isOverdue = daysRemaining < 0;

                return (
                  <TableRow key={transaction.tid}>
                    <TableCell className="font-medium">
                      {getBookTitle(transaction)}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.borrowedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        isOverdue 
                          ? "bg-red-100 text-red-800" 
                          : daysRemaining <= 3 
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}>
                        {isOverdue ? `Overdue by ${Math.abs(daysRemaining)} days` : `${daysRemaining} days`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Borrowed
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Return Book
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 