"use client";

import { IKImage, ImageKitProvider } from "imagekitio-next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!;

export const BooksTable = ({ books }) => {
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
                  <IKImage path={book.cover} height={60} width={45} alt={book.title} />
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
