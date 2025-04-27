"use server";

import { createTransactions, getUserTransactionStatus } from "@/db/crud/transactions.crud";
import { readSingleBook } from "@/db/crud/books.crud"; // updated import
import { checkAvailablePhysicalBooks } from "@/db/crud/physicalBooks.crud";

export async function handleBorrowBook(bookId: number, userId: string) {
  const { borrowed, requested } = await getUserTransactionStatus(bookId, userId);

  if (borrowed) {
    return { success: false, message: "You have already borrowed this book." };
  }

  if (requested) {
    return { success: false, message: "You have already requested this book." };
  }

  const availableBooks = await checkAvailablePhysicalBooks(bookId);

  if (availableBooks && availableBooks.length > 0) {
    const borrowedDate = new Date().toISOString().split("T")[0];
    const returnDate = new Date(new Date().setDate(new Date().getDate() + 15)).toISOString();

    await createTransactions(bookId, userId, "", "requested", borrowedDate, returnDate);

    return { success: true, message: "Borrow request sent successfully!" };
  } else {
    return { success: false, message: "Book is unavailable." };
  }
}

export async function fetchBookDetails(bookId: number) {
  try {
    const book = await readSingleBook(bookId); // use the new readSingleBook
    return book;
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}
