"use client";
import BookCard from "@/components/ui/BookCard";
import BookOverview from "@/components/ui/BookOverview";
import SearchBar from "@/components/ui/searchBar";
import { sampleBooks } from "@/constants";
import Link from "next/link";
import mail from "@/lib/mail";

export default function Home() {
  return (
    <div className=" h-full flex flex-col items-center w-full">
        {/* <BookOverview {...sampleBooks[0]}/> */}
        <div className="h-[100px] w-full flex flex-col justify-center items-center mx-5">
          <h1 className="text-3xl font-bold">Library Management System</h1>
          <div className="my-5">
            <SearchBar/>
          </div>
        </div>
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
