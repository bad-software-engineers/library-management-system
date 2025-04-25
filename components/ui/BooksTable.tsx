"use client";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookTableRow } from "@/components/ui/BookTableRow";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageUpload from "@/components/ui/BookUpload";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";

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

interface BooksTableProps {
  initialBooks: Book[];
  totalPages: number;
  totalBooks: number;
  currentPage: number;
}

export default function BooksTable({ initialBooks, totalPages, totalBooks, currentPage }: BooksTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pageSize = 10;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Books</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalBooks)} of {totalBooks} books
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add New Book</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
            </DialogHeader>
            <ImageUpload onSuccess={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

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
          {initialBooks?.map((book) => (
            <BookTableRow key={book.id} book={book} />
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/admin/allbooks"
        />
      </div>
    </div>
  );
}