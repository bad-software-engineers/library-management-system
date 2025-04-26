"use server";

import { readTransactions, updateTransactions } from "@/db/crud/transactions.crud"; // Assuming this is where the updateTransactions function resides
import { useAuth } from "@clerk/nextjs"; // To get adminId from server side

// Accept transaction function
export async function acceptTransaction(tid: number, userId: string | null | undefined) {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Call the database update function
  await updateTransactions(tid, "accepted", userId);
  return { success: true, message: "Transaction accepted successfully" };
}

// Reject transaction function
export async function rejectTransaction(tid: number, userId: string | null | undefined) {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Call the database update function
  await updateTransactions(tid, "rejected", userId);
  return { success: true, message: "Transaction rejected successfully" };
}

// Fetch all transactions (already implemented in your `server.tsx`)
export async function fetchTransactions() {
  return await readTransactions(); // This reads transactions from the DB
}
