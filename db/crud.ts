import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { verifyPending } from "./schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const user: typeof verifyPending.$inferInsert = {
    clerkId: "Dishant",
    email: "dishant@example.com",
  };

  // Insert User
  await db.insert(verifyPending).values(user);
  console.log("New user created!");

  // Retrieve Users
  const users = await db.select().from(verifyPending);
  console.log("Getting all users from the database: ", users);
}

main();
