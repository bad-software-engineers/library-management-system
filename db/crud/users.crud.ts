import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../schema";
import { eq } from "drizzle-orm";

const databaseUrl = "postgresql://library-management-system_owner:npg_OEQAg7KSW2Gu@ep-ancient-heart-a1yazye1-pooler.ap-southeast-1.aws.neon.tech/library-management-system?sslmode=require";

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

const db = drizzle(databaseUrl);

// async function main() {
//   const user: typeof verifyPending.$inferInsert = {
//     clerkId: "Dishant",
//     email: "dishant@example.com",
//   };

//   // Insert User
//   await db.insert(verifyPending).values(user);
//   console.log("New user created!");

//   // Retrieve Users
//   const users = await db.select().from(verifyPending);
//   console.log("Getting all users from the database: ", users);
// }

export const createUsers = async (clerkId: string, primaryEmail: string, universityId: string) => {
  const user: typeof users.$inferInsert = {
    clerkId,
    primaryEmail
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
    // const res = await db.update(users).set({ universityId: newUniversityId }).where(eq(users.clerkId, clerkId));
    // console.log("updateUsers:", res);
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

export const getUserCount = async () => {
  const result = await db.select().from(users);
  return result.length;
};