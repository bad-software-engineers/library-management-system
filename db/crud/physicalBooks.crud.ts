import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { physicalBooks } from "../schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const createPhysicalBooks = async (bookId: number, borrowed: boolean, returnDate: any, userId: string, currTransactionId: number) => {
  const physicalBook: typeof physicalBooks.$inferInsert = {
    bookId,
    borrowed,
    returnDate,
    userId,
    currTransactionId,
  };
  try {
    const res = await db.insert(physicalBooks).values(physicalBook);
    console.log("createPhysicalBooks:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const readPhysicalBooks = async () => {
  try {
    const res = await db.select().from(physicalBooks);
    console.log("readPhysicalBooks:", res);

    return res;
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const updatePhysicalBooks = async (pid: number, borrowed: boolean) => {
  try {
    const res = await db.update(physicalBooks).set({ borrowed }).where(eq(physicalBooks.pid, pid));
    console.log("updatePhysicalBooks:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const deletePhysicalBooks = async (pid: number) => {
  try {
    const res = await db.delete(physicalBooks).where(eq(physicalBooks.pid, pid));
    console.log("deletePhysicalBooks:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

readPhysicalBooks();
