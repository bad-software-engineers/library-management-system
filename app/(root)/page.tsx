"use client";
import BookCard from "@/components/ui/BookCard";
import BookOverview from "@/components/ui/BookOverview";
import { sampleBooks } from "@/constants";

export default function Home() {
  return (
    <div className=" h-full flex flex-col items-center w-full">
        <BookOverview {...sampleBooks[0]}/>
        <div className="flex flex-wrap justify-around max-w-7xl w-full">
          <BookCard {...sampleBooks[0]}/>
          <BookCard {...sampleBooks[0]}/>
          <BookCard {...sampleBooks[0]}/>
          <BookCard {...sampleBooks[0]}/>
        </div>
    </div>
);
}

