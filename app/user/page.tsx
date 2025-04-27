import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { readTransactions } from "@/db/crud/transactions.crud";
import { readBooks } from "@/db/crud/books.crud";
import { readPhysicalBooks } from "@/db/crud/physicalBooks.crud";
import { systemMetadata } from "@/db/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

export default async function UserDashboard() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch user's transactions
  const allTransactions = await readTransactions() || [];
  const userTransactions = allTransactions.filter(t => t.userId === user.id);
  
  // Fetch books for transaction details
  const booksData = await readBooks(1, 1000);
  const books = booksData.books || [];
  const physicalBooks = await readPhysicalBooks() || [];
  
  // Fetch system metadata for fines calculation
  const db = drizzle(process.env.DATABASE_URL!);
  const metadata = await db.select().from(systemMetadata);
  const maxDays = metadata[0]?.maxDays || 15;
  
  // Calculate fines for overdue books
  const today = new Date();
  const userPhysicalBooks = physicalBooks.filter(pb => pb.userId === user.id && pb.borrowed);
  
  // Calculate fines (assuming $1 per day overdue)
  const fines = userPhysicalBooks.reduce((total, book) => {
    if (book.returnDate) {
      const returnDate = new Date(book.returnDate);
      const daysOverdue = Math.max(0, Math.floor((today.getTime() - returnDate.getTime()) / (1000 * 60 * 60 * 24)));
      return total + daysOverdue;
    }
    return total;
  }, 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">User Dashboard</h1>

      {/* User Info Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">User Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="text-xl font-medium">{user.fullName}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="text-xl font-medium">{user.emailAddresses[0]?.emailAddress}</p>
          </div>
          <div>
            <p className="text-gray-600">Currently Borrowed Books</p>
            <p className="text-xl font-medium">{userPhysicalBooks.length}</p>
          </div>
        </div>
      </div>

      {/* Fines Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Fines</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Total Fines</p>
            <p className="text-3xl font-bold text-red-600">${fines}</p>
          </div>
        </div>
        {fines > 0 && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 font-medium">Please return overdue books to avoid additional fines.</p>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
        {userTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Book</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Borrowed Date</th>
                  <th className="py-3 px-4 text-left">Returned Date</th>
                </tr>
              </thead>
              <tbody>
                {userTransactions.map((transaction) => {
                  const physicalBook = physicalBooks.find(pb => pb.pid === transaction.physicalBookId);
                  const book = books.find((b: any) => b.id === physicalBook?.bookId);
                  
                  return (
                    <tr key={transaction.tid} className="border-t">
                      <td className="py-3 px-4">{book?.title || "Unknown Book"}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === "borrowed" ? "bg-blue-100 text-blue-800" : 
                          transaction.status === "returned" ? "bg-green-100 text-green-800" : 
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(transaction.borrowedDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        {transaction.returnedDate 
                          ? new Date(transaction.returnedDate).toLocaleDateString() 
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No transaction history found.</p>
        )}
      </div>
    </div>
  );
} 