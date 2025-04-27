import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { physicalBooks, transactions } from "../schema";
import { and, eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const createTransactions = async (physicalBookId: number, userId: string, adminId: string, status: string, borrowedDate: string, returnedDate: string) => {
  const transaction: typeof transactions.$inferInsert = {
    physicalBookId,
    userId,
    adminId,
    status,
    borrowedDate,
    returnedDate,
  };
  try {
    const res = await db.insert(transactions).values(transaction);
    console.log("createTransactions:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const readTransactions = async () => {
  try {
    const res = await db.select().from(transactions);
    console.log("readTransactions:", res);

    return res;
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const updateTransactions = async (tid: number, status: string, adminId: string) => {
  try {
    const res = await db
      .update(transactions)
      .set({
        status,
        adminId,
      })
      .where(eq(transactions.tid, tid));

    console.log("updateTransactions:", res);
  } catch (error) {
    console.error("Something Went Wrong:", error);
    throw new Error("Failed to update transaction");
  }
};

export const deleteTransactions = async (tid: number) => {
  try {
    const res = await db.delete(transactions).where(eq(transactions.tid, tid));
    console.log("deleteTransactions:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const getUserTransactionStatus = async (bookId: number, userId: string | undefined) => {
  try {
    const res = await db
      .select({
        status: transactions.status,
      })
      .from(transactions)
      .innerJoin(physicalBooks, eq(transactions.physicalBookId, physicalBooks.pid))
      .where(
        and(
          eq(physicalBooks.bookId, bookId), // match bookId through physicalBooks
          eq(transactions.userId, userId)
        )
      )
      .limit(1); // we only need one match

    if (res.length === 0) {
      return { borrowed: false, requested: false };
    }

    const status = res[0].status;

    if (status === "BORROWED") {
      return { borrowed: true, requested: false };
    }
    if (status === "REQUESTED") {
      return { borrowed: false, requested: true };
    }

    return { borrowed: false, requested: false };
  } catch (error) {
    console.error("getUserTransactionStatus Error:", error);
    return { borrowed: false, requested: false };
  }
};
