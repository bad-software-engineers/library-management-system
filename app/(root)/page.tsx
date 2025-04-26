import { fetchLimitedBooks } from "@/db/crud/books.crud"; // Import the fetch function
import BookCard from "@/components/ui/BookCard";
import SearchBar from "@/components/ui/searchBar";
import Link from "next/link";

// This is a server component, so we can directly call the server-side function to fetch the books.
export default async function Home() {
  // Fetch the latest 15 books from the database
  const books = await fetchLimitedBooks(15); // Fetch 15 books (you can change this number as needed)

  return (
    <div className="h-full flex flex-col items-center w-full">
      <div className="h-[100px] w-full flex flex-col justify-center items-center mx-5">
        <h1 className="text-3xl font-bold">Library Management System</h1>
        <div className="my-5">
          <SearchBar />
        </div>
      </div>

      <div className="flex flex-wrap justify-around px-10 w-full">
        {books.map((book) => (
          <Link key={book.id} href={`/book/${book.id}`} passHref>
            <BookCard {...book} />
          </Link>
        ))}
      </div>
    </div>
  );
}
