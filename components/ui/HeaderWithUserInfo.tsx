"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/dark-toggle";
// import { toast } from "./sonner";

export default function HeaderWithUserInfo() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <section className="flex items-center justify-between">
      <section className="mx-6 my-5 flex gap-x-3 items-center justify-center">
        <ModeToggle />
        {pathname !== "/get-verified" && user ? (
          !user?.publicMetadata?.verificationStatus ? (
            <Link href={"/get-verified"}>
              <Button size={"lg"}>Get Verified</Button>
            </Link>
          ) : user.publicMetadata?.verificationStatus === "requested" ? // <Button size="lg" onClick={() => toast.info("You've already requested verification.")}>
          //   Verification Requested
          // </Button>
          null : null
        ) : (
          <SignedIn>
            {/* <Link href={"/"}> */}
            <Button size={"lg"} onClick={() => (window.location.href = "/")}>
              Go Back
            </Button>
            {/* </Link> */}
          </SignedIn>
        )}
      </section>

      <SignedOut>
        <section className="flex gap-x-3 mx-4 my-3">
          <Link href={"/sign-in"}>
            <Button size={"lg"}>Sign In</Button>
          </Link>
          <Link href={"/sign-up"}>
            <Button size={"lg"}>Sign Up</Button>
          </Link>
        </section>
      </SignedOut>

      <SignedIn>
        <section className="mx-6 my-4 flex gap-x-5 items-center justify-center">
          {user?.publicMetadata?.role === "admin" ? (
            <Link href="/admin">
              <Button size="default">Admin Dashboard</Button>
            </Link>
          ) : (
            <Link href="/user">
              <Button size="default">User Dashboard</Button>
            </Link>
          )}
          <div className="scale-125 flex items-center justify-center">
            <UserButton />
          </div>
        </section>
      </SignedIn>
    </section>
  );
}
