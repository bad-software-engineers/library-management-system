"use client";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookTableRow } from "@/components/ui/BookTableRow";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageUpload from "@/components/ui/BookUpload";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

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

type SortField = 'id' | 'title' | 'author' | 'genre' | 'isbn' | 'totalCopies' | 'availableCopies';
type SortOrder = 'asc' | 'desc';

export default function BooksTable({ initialBooks, totalPages, totalBooks, currentPage }: BooksTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const pageSize = 10;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedBooks = [...initialBooks].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="flex items-center gap-1"
    >
      {label}
      {sortField === field && (
        sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
      )}
    </Button>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Books</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalBooks)} of {totalBooks} books
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setSortField('id');
              setSortOrder('desc');
            }}
          >
            Newest First
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Add New Book</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Add New Book</DialogTitle>
              </DialogHeader>
              <ImageUpload onSuccess={() => setIsOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cover</TableHead>
            <TableHead>
              <SortButton field="title" label="Title" />
            </TableHead>
            <TableHead>
              <SortButton field="author" label="Author" />
            </TableHead>
            <TableHead>
              <SortButton field="genre" label="Genre" />
            </TableHead>
            <TableHead>
              <SortButton field="isbn" label="ISBN" />
            </TableHead>
            <TableHead>
              <SortButton field="totalCopies" label="Total Copies" />
            </TableHead>
            <TableHead>
              <SortButton field="availableCopies" label="Available Copies" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedBooks?.map((book) => (
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