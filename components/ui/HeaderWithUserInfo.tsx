"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/dark-toggle";

export default function HeaderWithUserInfo() {
  const { user } = useUser();

  return (
    <section className="flex items-center justify-between">
      <section className="mx-6 my-5">
        <ModeToggle />
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
          {user?.publicMetadata?.role === "admin" && (
              <Link href="/admin">
                <Button size="default">Admin Dashboard</Button>
              </Link>
          )}
          <div className="scale-125 flex items-center justify-center">
            <UserButton/>
          </div>

        </section>
      </SignedIn>
    </section>
  );
}
