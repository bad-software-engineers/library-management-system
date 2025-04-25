import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { books } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const createBooks = async (isbn: string, title: string, author: string, genre: string, totalCopies: number, availableCopies: number, cover: string) => {
  const book: typeof books.$inferInsert = {
    isbn,
    title,
    author,
    genre,
    totalCopies,
    availableCopies,
    cover,
  };
  try {
    const res = await db.insert(books).values(book);
    console.log("createBooks:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const readBooks = async () => {
  try {
    const res = await db.select().from(books);
    console.log("readBooks:", res);

    return res;
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const updateBooks = async (id: number, availableCopies: number) => {
  try {
    const res = await db.update(books).set({ availableCopies }).where(eq(books.id, id));
    console.log("updateBooks:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const deleteBooks = async (id: number) => {
  try {
    const res = await db.delete(books).where(eq(books.id, id));
    console.log("deleteBooks:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};
