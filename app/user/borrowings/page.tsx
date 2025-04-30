import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { readTransactions } from "@/db/crud/transactions.crud";
import { readBooks } from "@/db/crud/books.crud";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = {
  title: "My Borrowings | Library Management System",
  description: "View your current borrowings",
};

export default async function BorrowingsPage() {
  const session = await auth();
  const userId = session.userId;
  if (!userId) {
    return <div>Unauthorized</div>;
  }

  // Get all transactions
  const transactions = await readTransactions();
  if (!transactions) {
    return <div>No transactions found</div>;
  }

  // Filter for current user's active borrowings
  const activeBorrowings = transactions.filter(
    tx => tx.userId === userId && tx.status === "borrowed"
  );

  // Get unique book IDs
  const bookIds = [...new Set(activeBorrowings.map(tx => tx.physicalBookId))];

  // Fetch book details
  const books = await Promise.all(
    bookIds.map(async (id) => {
      const book = await readBooks(1, 1, "id", "asc", id.toString());
      return book.books[0];
    })
  );

  // Create lookup map
  const bookMap = new Map(books.map(book => [book.id, book]));

  // Enrich borrowings with book details
  const enrichedBorrowings = activeBorrowings.map(tx => {
    const book = bookMap.get(tx.physicalBookId);
    return {
      ...tx,
      bookTitle: book?.title || "Unknown Book",
      bookAuthor: book?.author || "Unknown Author",
    };
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Current Borrowings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Showing {enrichedBorrowings.length} active borrowings
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Book Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Borrowed Date</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrichedBorrowings.map((tx) => (
              <TableRow key={tx.tid}>
                <TableCell>{tx.tid}</TableCell>
                <TableCell>{tx.bookTitle}</TableCell>
                <TableCell>{tx.bookAuthor}</TableCell>
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