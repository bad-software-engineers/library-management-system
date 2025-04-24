import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { transactions } from "../schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const createTransactions = async (tid: number, physicalBookId: number, userId: string, adminId: string, status: string, borrowedDate: string, returnedDate: string) => {
  const transaction: typeof transactions.$inferInsert = {
    tid,
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

export const updateTransactions = async (tid: number, status: string) => {
  try {
    const res = await db.update(transactions).set({ status }).where(eq(transactions.tid, tid));
    console.log("updateTransactions:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
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
