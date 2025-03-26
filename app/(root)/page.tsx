"use client";
import BookCard from "@/components/ui/BookCard";
import BookOverview from "@/components/ui/BookOverview";
import { sampleBooks } from "@/constants";
import Link from "next/link";
import mail from "@/lib/mail";

export default function Home() {
  return (
    <div className=" h-full flex flex-col items-center w-full">
      <BookOverview {...sampleBooks[0]} />
      <div className="flex flex-wrap justify-around px-10 w-full">
        {sampleBooks.map((book) => (
          <Link key={book.id} href={`/book/${book.id}`} passHref>
            <BookCard {...book} />
          </Link>
        ))}
      </div>
    </div>
  );
}
