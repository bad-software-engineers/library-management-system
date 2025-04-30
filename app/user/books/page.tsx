"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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

type SortField = "id" | "title" | "author" | "isbn" | "availableCopies" | "totalCopies";
type SortOrder = "asc" | "desc";

export default function BooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") ?? "");
  const [loading, setLoading] = useState(true);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams?.get("page") ?? "1"));
  const [sortField, setSortField] = useState<SortField>((searchParams?.get("sort") as SortField) ?? "title");
  const [sortOrder, setSortOrder] = useState<SortOrder>((searchParams?.get("order") as SortOrder) ?? "asc");
  const pageSize = 10;

  useEffect(() => {
    fetchBooks();
  }, [currentPage, sortField, sortOrder, searchQuery]);

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        sort: sortField,
        order: sortOrder,
        search: searchQuery
      });
      const response = await fetch(`/api/books?${params}`);
      const data = await response.json();
      setBooks(data.books || []);
      setTotalBooks(data.total || 0);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    updateUrl(1, sortField, sortOrder, value);
  };

  const updateUrl = (page: number, sort: string, order: string, search: string) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (sort !== "title") params.set("sort", sort);
    if (order !== "asc") params.set("order", order);
    if (search) params.set("search", search);
    router.push(`/user/books${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const totalPages = Math.ceil(totalBooks / pageSize);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Books</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSortField("id");
              setSortOrder("desc");
              setCurrentPage(1);
              updateUrl(1, "id", "desc", searchQuery);
            }}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            Newest First
          </Button>
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading books...</div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer" 
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    Title
                    {sortField === "title" && (
                      sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer" 
                  onClick={() => handleSort("author")}
                >
                  <div className="flex items-center">
                    Author
                    {sortField === "author" && (
                      sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer" 
                  onClick={() => handleSort("isbn")}
                >
                  <div className="flex items-center">
                    ISBN
                    {sortField === "isbn" && (
                      sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer" 
                  onClick={() => handleSort("availableCopies")}
                >
                  <div className="flex items-center">
                    Available Copies
                    {sortField === "availableCopies" && (
                      sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer" 
                  onClick={() => handleSort("totalCopies")}
                >
                  <div className="flex items-center">
                    Total Copies
                    {sortField === "totalCopies" && (
                      sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      book.availableCopies > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {book.availableCopies}
                    </span>
                  </TableCell>
                  <TableCell>{book.totalCopies}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={book.availableCopies === 0}
                    >
                      {book.availableCopies > 0 ? "Borrow" : "Unavailable"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentPage(prev => Math.max(1, prev - 1));
                  updateUrl(currentPage - 1, sortField, sortOrder, searchQuery);
                }}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentPage(prev => Math.min(totalPages, prev + 1));
                  updateUrl(currentPage + 1, sortField, sortOrder, searchQuery);
                }}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 