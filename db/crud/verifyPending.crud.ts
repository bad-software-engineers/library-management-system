import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { verifyPending } from "../schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const createVerifyPending = async (clerkId: string, email: string) => {
  try {
    const user: typeof verifyPending.$inferInsert = {
      clerkId,
      email,
    };

    const res = await db.insert(verifyPending).values(user);
    console.log("create verifyPending: ", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const readVerifyPending = async () => {
  const data = await db.select().from(verifyPending);

  console.log("read verifyPending: ", data);

  return data;
};

export const updateVerifyPending = async (clerkId: string, newclerkId: string, newEmail: string) => {
  try {
    const res = await db.update(verifyPending).set({ clerkId: newclerkId, email: newEmail }).where(eq(verifyPending.clerkId, clerkId));

    console.log("updateVerifyPending: ", res);
  } catch (error) {
    console.log("Something went Wrong :", error);
  }
};

export const deleteVerifyPending = async (clerkId: string) => {
  try {
    const res = await db.delete(verifyPending).where(eq(verifyPending.clerkId, clerkId));
    console.log("deleteVerifyPending :", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};
