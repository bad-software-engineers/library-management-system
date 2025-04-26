import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { books } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

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
    return res;
  } catch (error) {
    console.log("Something Went Wrong :", error);
    throw error;
  }
};

export const readBooks = async (page: number = 1, pageSize: number = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const [booksData, totalCount] = await Promise.all([
      db.select().from(books).orderBy(desc(books.id)).limit(pageSize).offset(offset),
      db
        .select({ count: books.id })
        .from(books)
        .then((res) => res.length),
    ]);

    return {
      books: booksData,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      totalBooks: totalCount,
    };
  } catch (error) {
    console.log("Something Went Wrong :", error);
    return {
      books: [],
      totalPages: 0,
      currentPage: page,
      totalBooks: 0,
    };
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

export const fetchLimitedBooks = async (limit: number) => {
  try {
    const booksData = await db.select().from(books).orderBy(desc(books.id)).limit(limit);
    return booksData;
  } catch (error) {
    console.log("Something went wrong while fetching books:", error);
    return [];
  }
};

export async function fetchBookById(id: number) {
  const result = await db.select().from(books).where(eq(books.id, id)).limit(1);

  return result[0] || null;
}
