import { auth, currentUser } from "@clerk/nextjs/server";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { verifyPending } from "@/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main(userId: string, email: string) {
  const user: typeof verifyPending.$inferInsert = {
    clerkId: userId,
    email: email,
  };

  try {
    await db.insert(verifyPending).values(user);
    console.log("New user created!");
    return "Done";
  } catch (error: any) {
    if (error.message.includes("duplicate")) {
      return "already";
    }
    return "Error";
  }
}

const page = async () => {
  const { redirectToSignIn } = await auth();
  const user = await currentUser();

  if (!user) return redirectToSignIn();

  const { id, primaryEmailAddressId, emailAddresses }: any = user;

  let primaryEmail = emailAddresses[0].emailAddress;

  for (let index = 0; index < emailAddresses.length; index++) {
    const element = emailAddresses[index];
    if (element.id === primaryEmailAddressId) {
      primaryEmail = element.emailAddress;
      break;
    }
  }

  const requested = await main(id, primaryEmail);

  return (
    <div className="flex w-full h-full justify-center items-center">
      {requested === "Done" ? <h1>Requested Successfully</h1> : null}
      {requested === "already" ? <h1>Requested Successfully</h1> : null}
      {requested === "Error" ? (
        <h1>
          Something Went Wrong <br />
          Try Again!
        </h1>
      ) : null}
    </div>
  );
};

export default page;
