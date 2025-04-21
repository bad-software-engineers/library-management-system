import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const createUsers = async (clerkId: string, primaryEmail: string, universityId: string) => {
  const user: typeof users.$inferInsert = {
    clerkId,
    primaryEmail,
    universityId,
  };

  try {
    const res = await db.insert(users).values(user);
    console.log("createUsers:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const readUsers = async () => {
  try {
    const res = await db.select().from(users);
    console.log("readUsers:", res);

    return res;
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const updateUsers = async (clerkId: string, newUniversityId: string) => {
  try {
    const res = await db.update(users).set({ universityId: newUniversityId }).where(eq(users.clerkId, clerkId));
    console.log("updateUsers:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const deleteUsers = async (clerkId: string) => {
  try {
    const res = await db.delete(users).where(eq(users.clerkId, clerkId));
    console.log("deleteUsers:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};
