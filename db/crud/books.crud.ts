import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { books, physicalBooks } from "@/drizzle/schema";
import { eq, desc, sql, and } from "drizzle-orm";

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
    console.log(res);
    return res;
  } catch (error) {
    console.log("Something Went Wrong :", error);
    throw error;
  }
};

export const readBooks = async (page: number = 1, pageSize: number = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const [booksData, [{ count }]] = await Promise.all([db.select().from(books).orderBy(desc(books.id)).limit(pageSize).offset(offset), db.select({ count: sql<number>`count(*)` }).from(books)]);

    const totalCount = Number(count);

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

export const updateBooks = async (id: number, totalCopies: number, availableCopies: number) => {
  try {
    const res = await db.update(books).set({ totalCopies, availableCopies }).where(eq(books.id, id));
    console.log("updateBooks:", res);
    return res;
  } catch (error) {
    console.log("Something Went Wrong :", error);
    throw error;
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

export const deletePhysicalBook = async (pid: number) => {
  try {
    // Check if the book is available (not borrowed)
    const physicalBook = await db.select().from(physicalBooks).where(eq(physicalBooks.pid, pid)).limit(1);

    if (physicalBook.length === 0) {
      throw new Error("Physical book not found");
    }

    if (physicalBook[0].borrowed) {
      throw new Error("Cannot remove a borrowed book");
    }

    // Delete the physical book
    await db.delete(physicalBooks).where(eq(physicalBooks.pid, pid));
    return true;
  } catch (error) {
    console.error("Error removing physical book:", error);
    throw error;
  }
};

export const createPhysicalBooks = async (bookId: number, borrowed: boolean, returnDate: string | null, userId: string, currTransactionId: number) => {
  try {
    const physicalBook = {
      bookId,
      borrowed,
      returnDate,
      userId,
      currTransactionId,
    };
    const [newBook] = await db.insert(physicalBooks).values(physicalBook).returning({
      pid: physicalBooks.pid,
      bookId: physicalBooks.bookId,
      borrowed: physicalBooks.borrowed,
      returnDate: physicalBooks.returnDate,
      userId: physicalBooks.userId,
      currTransactionId: physicalBooks.currTransactionId,
    });

    console.log("Created physical book:", newBook);
    return newBook;
  } catch (error) {
    console.error("Error creating physical book:", error);
    throw error;
  }
};

export const getActivePhysicalBooksCount = async (bookId: number) => {
  try {
    const result = await db
      .select()
      .from(physicalBooks)
      .where(sql`${physicalBooks.bookId} = ${bookId}`);
    return result.length;
  } catch (error) {
    console.error("Error getting physical books count:", error);
    throw error;
  }
};

export const updateBook = async (id: number, title: string, author: string, genre: string, isbn: string, totalCopies: number, availableCopies: number, cover: string) => {
  try {
    const res = await db
      .update(books)
      .set({
        title,
        author,
        genre,
        isbn,
        totalCopies,
        availableCopies,
        cover,
      })
      .where(eq(books.id, id));
    return res;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

export const readPhysicalBooks = async (bookId: number) => {
  try {
    const result = await db.select().from(physicalBooks).where(eq(physicalBooks.bookId, bookId));
    return result;
  } catch (error) {
    console.error("Error reading physical books:", error);
    throw error;
  }
};

export const fetchBooksByQuery = async (query: string, page: number = 1, pageSize: number = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const [searchResults, totalCount] = await Promise.all([
      db
        .select()
        .from(books)
        .where(
          sql`LOWER(title) LIKE LOWER(${"%" + query + "%"}) OR 
              LOWER(author) LIKE LOWER(${"%" + query + "%"}) OR 
              LOWER(isbn) LIKE LOWER(${"%" + query + "%"}) OR
              LOWER(genre) LIKE LOWER(${"%" + query + "%"})`
        )
        .orderBy(desc(books.id))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: books.id })
        .from(books)
        .where(
          sql`LOWER(title) LIKE LOWER(${"%" + query + "%"}) OR 
              LOWER(author) LIKE LOWER(${"%" + query + "%"}) OR 
              LOWER(isbn) LIKE LOWER(${"%" + query + "%"}) OR
              LOWER(genre) LIKE LOWER(${"%" + query + "%"})`
        )
        .then((res) => res.length),
    ]);

    return {
      books: searchResults,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      totalBooks: totalCount,
    };
  } catch (error) {
    console.error("Error searching books:", error);
    return {
      books: [],
      totalPages: 0,
      currentPage: page,
      totalBooks: 0,
    };
  }
};

export const readSingleBook = async (bookId: number) => {
  try {
    // Fetch the main book details
    const book = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId))
      .then((res) => res[0]);

    if (!book) return null;

    // Count available physical copies
    const availableCopies = await db
      .select()
      .from(physicalBooks)
      .where(and(eq(physicalBooks.bookId, bookId), eq(physicalBooks.borrowed, false)))
      .then((res) => res.length);

    return {
      ...book,
      availableCopies,
    };
  } catch (error) {
    console.error("Failed to fetch single book:", error);
    return null;
  }
};
