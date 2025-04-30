"use client";

import { useEffect, useState } from "react";
import BookCard from "@/components/ui/BookCard";
import SearchBar from "@/components/ui/searchBar";
import Link from "next/link";
import { Pagination } from "@/components/ui/pagination";
import { useSearchParams, useRouter } from "next/navigation";

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

type SearchResult = {
  books: Book[];
  totalPages: number;
  currentPage: number;
  totalBooks: number;
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchResult, setSearchResult] = useState<SearchResult>({
    books: [],
    totalPages: 0,
    currentPage: 1,
    totalBooks: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchBooks = async (query: string, page: number = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search-books?q=${encodeURIComponent(query)}&page=${page}&pageSize=12`);
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setSearchResult(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      setSearchResult({
        books: [],
        totalPages: 0,
        currentPage: page,
        totalBooks: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const query = searchParams.get("q") || "";
    fetchBooks(query, page);
  }, [searchParams]);

  const handleSearch = (query: string) => {
    router.push(`/?q=${encodeURIComponent(query)}&page=1`);
  };

  return (
    <div className="h-full flex flex-col items-center w-full">
      <div className="h-[100px] w-full flex flex-col justify-center items-center mx-5">
        <h1 className="text-3xl font-bold">Library Management System</h1>
        <div className="my-5">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : searchResult.books.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6 w-full max-w-7xl mx-auto">
            {searchResult.books.map((book) => (
              <Link key={book.id} href={`/book/${book.id}`} passHref>
                <BookCard {...book} />
              </Link>
            ))}
          </div>
          <div className="mt-8 mb-4">
            <Pagination currentPage={searchResult.currentPage} totalPages={searchResult.totalPages} baseUrl="/" />
          </div>
        </>
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
}
