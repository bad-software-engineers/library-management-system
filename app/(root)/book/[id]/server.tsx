"use server";

import { createTransactions, getUserTransactionStatus } from "@/db/crud/transactions.crud";
import { readSingleBook } from "@/db/crud/books.crud";
import { findOneAvailablePhysicalBookId } from "@/db/crud/physicalBooks.crud";

export async function handleBorrowBook(bookId: number, userId: string) {
  try {
    // Check user transaction status
    const { borrowed, requested, totalBorrowed } = await getUserTransactionStatus(bookId, userId);

    if (borrowed) {
      return { success: false, message: "You have already borrowed this book." };
    }

    if (requested) {
      return { success: false, message: "You have already requested this book." };
    }

    if (totalBorrowed >= 4) {
      return { success: false, message: "You have reached the maximum limit of 4 borrowed books." };
    }

    // Find an available physical book ID
    const physicalBookId = await findOneAvailablePhysicalBookId(bookId);

    if (!physicalBookId) {
      return { success: false, message: "Book is unavailable." };
    }

    // Create a transaction for the borrow request
    await createTransactions(physicalBookId, userId, "", "REQUESTED", undefined, undefined);

    return {
      success: true,
      message: "Borrow request sent successfully!",
    };
  } catch (error) {
    console.error("Error in handleBorrowBook:", error);
    return {
      success: false,
      message: "An error occurred while processing your request.",
    };
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

export async function checkUserBookStatus(bookId: number, userId: string) {
  try {
    const { borrowed, requested, totalBorrowed } = await getUserTransactionStatus(bookId, userId);
    return {
      success: true,
      borrowed,
      requested,
      maxBorrowed: totalBorrowed >= 4,
    };
  } catch (error) {
    console.error("Error checking user book status:", error);
    return {
      success: false,
      borrowed: false,
      requested: false,
      maxBorrowed: false,
    };
  }
}
