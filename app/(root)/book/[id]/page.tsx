"use client";
import { sampleBooks } from "@/constants/index";
import BookOverview from "@/components/ui/BookOverview";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";

const Page = ({ params }: any) => {
  const { id }: any = React.use(params);
  const bookId = Number(id);

  const bookDetails = sampleBooks.find((book) => book.id === bookId);

  if (!bookDetails) {
    redirect("/404");
  }

  return (
    <div className=" h-full flex flex-col items-center w-full">
      <section className="flex mx-4 my-4">
        <Link href="/">
          <Button size={"lg"}>Home</Button>
        </Link>
      </section>
      <BookOverview {...bookDetails} />
    </div>
  );
};

export default Page;
