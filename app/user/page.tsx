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

  // Calculate overdue books
  const overdueBooks = userPhysicalBooks.filter(book => {
    if (book.returnDate) {
      const returnDate = new Date(book.returnDate);
      return today > returnDate;
    }
    return false;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">User Information</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="text-lg font-medium">{user.fullName}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="text-lg font-medium">{user.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Library Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Currently Borrowed Books</p>
            <p className="text-lg font-medium">{userPhysicalBooks.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Overdue Books</p>
            <p className="text-lg font-medium">{overdueBooks.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Fines</p>
            <p className="text-lg font-medium text-red-600">${fines}</p>
          </div>
        </div>
      </div>

      {fines > 0 && (
        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <p className="text-red-600 font-medium">Please return overdue books to avoid additional fines.</p>
        </div>
      )}

      {userPhysicalBooks.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Currently Borrowed Books</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userPhysicalBooks.map((book) => {
                  const dueDate = new Date(book.returnDate || "");
                  const daysRemaining = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <tr key={book.pid}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {books.find(b => b.id === book.bookId)?.title || "Unknown Book"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {dueDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          daysRemaining < 0 
                            ? "bg-red-100 text-red-800" 
                            : daysRemaining <= 3 
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}>
                          {daysRemaining < 0 
                            ? `Overdue by ${Math.abs(daysRemaining)} days` 
                            : `${daysRemaining} days remaining`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 