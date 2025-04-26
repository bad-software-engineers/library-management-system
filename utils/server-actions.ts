// app/actions/createBook.ts
"use server";

import { createBooks } from "@/db/crud/books.crud";

export async function createBookAction(isbn: string, title: string, author: string, genre: string, totalCopies: number, availableCopies: number, cover: string) {
  if (!title || !author || !genre || !isbn || !cover) {
    throw new Error("Missing required fields");
  }

  if (isNaN(totalCopies) || isNaN(availableCopies)) {
    throw new Error("Invalid number of copies");
  }

  if (availableCopies > totalCopies) {
    throw new Error("Available copies cannot be greater than total copies");
  }

  const res = await createBooks(isbn, title, author, genre, totalCopies, availableCopies, cover);

  if (!res) {
    throw new Error("Failed to create book");
  }

  return { success: true };
}
