"use client";

import { useEffect, useState } from "react";
import BookCard from "@/components/ui/BookCard";
import SearchBar from "@/components/ui/searchBar";
import Link from "next/link";

type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  cover: string;
  isbn: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async (query: string) => {
    setLoading(true);
    const res = await fetch(`/api/search-books?q=${query}`);
    const data = await res.json();
    setBooks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks(""); // Fetch all books initially
  }, []);

  return (
    <div className="h-full flex flex-col items-center w-full">
      <div className="h-[100px] w-full flex flex-col justify-center items-center mx-5">
        <h1 className="text-3xl font-bold">Library Management System</h1>
        <div className="my-5">
          <SearchBar onSearch={fetchBooks} />
        </div>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : books.length > 0 ? (
        <div className="flex flex-wrap justify-around px-10 w-full">
          {books.map((book) => (
          <Link key={book.id} href={`/book/${book.id}`} passHref>
            <BookCard {...book} />
          </Link>
        ))}
        </div>
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
}
