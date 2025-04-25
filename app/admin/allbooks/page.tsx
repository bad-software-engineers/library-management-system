"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { readBooks } from "@/db/crud/books.crud";
import { IKImage, ImageKitProvider } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  cover: string;
  isbn: string;
}

const Page = () => {
  const [books, setBooks] = useState<Book[]>([]);

  // Function to fetch books
  const getBooks = async () => {
    const fetchedBooks = await readBooks();
    if (fetchedBooks) {
      setBooks(fetchedBooks);
    }
  };

  // Fetch books on component mount
  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">All Books</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cover</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Total Copies</TableHead>
            <TableHead>Available Copies</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>
                <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint}>
                  <IKImage path={book.cover} height={60} width={45} alt={book.title} className="object-cover" />
                </ImageKitProvider>
              </TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genre}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>{book.totalCopies}</TableCell>
              <TableCell>{book.availableCopies}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
