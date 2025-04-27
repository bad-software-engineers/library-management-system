"use client";

import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { BookTableRow } from "@/components/ui/BookTableRow";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageUpload from "@/components/ui/BookUpload";
import { Pagination } from "@/components/ui/pagination";
import { BookCover } from "@/components/ui/BookCover";
import { useState, useEffect } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Plus, Trash2, Copy, Save } from "lucide-react";
import { removePhysicalBook, addPhysicalBook } from "@/app/admin/allbooks/actions";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IKImage, IKUpload, ImageKitProvider } from "imagekitio-next";
import { useToast } from "@/components/ui/ToastContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface PhysicalBook {
  pid: number;
  bookId: number;
  borrowed: boolean;
  returnDate: null | string;
  userId: string;
  currTransactionId: number;
}

interface BooksTableProps {
  initialBooks: Book[];
  totalPages: number;
  totalBooks: number;
  currentPage: number;
}

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

const authenticator = async () => {
  const res = await fetch("/api/auth");
  const data = await res.json();
  return {
    signature: data.signature,
    expire: data.expire,
    token: data.token,
  };
};

const BooksTable = ({ initialBooks, totalPages, totalBooks, currentPage }: BooksTableProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const books = initialBooks;
  const [sortField, setSortField] = useState<keyof Book>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [physicalBooks, setPhysicalBooks] = useState<PhysicalBook[]>([]);
  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  const handleSort = (field: keyof Book) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedBooks = [...books].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const handleUpdate = async (book: Book) => {
    setSelectedBook(book);
    setIsUpdateDialogOpen(true);
  };

  const fetchPhysicalBooks = async (bookId: number) => {
    try {
      const response = await fetch(`/api/books/${bookId}/physical`);
      if (!response.ok) throw new Error('Failed to fetch physical books');
      const data = await response.json();
      setPhysicalBooks(data);
    } catch (error) {
      console.error('Error fetching physical books:', error);
      showToast('Failed to fetch physical books', 'error');
    }
  };

  const handleDeletePhysicalBook = async (bookId: number) => {
    if (!selectedBook) return;
    
    // Fetch physical books when opening the dialog
    await fetchPhysicalBooks(bookId);
    setIsRemoveDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBook || !selectedPid) {
      showToast('Please select a copy to remove', 'error');
      return;
    }

    const result = await removePhysicalBook(selectedBook.id, selectedBook.totalCopies, selectedBook.availableCopies, selectedPid);
    
    if (result.success && result.totalCopies !== undefined && result.availableCopies !== undefined) {
      const updatedBook: Book = { 
        ...selectedBook, 
        totalCopies: result.totalCopies, 
        availableCopies: result.availableCopies 
      };
      // setBooks(books.map(book => book.id === selectedBook.id ? updatedBook : book));
      setIsRemoveDialogOpen(false);
      setSelectedPid(null);
      showToast("Physical book removed successfully", "success");
    } else {
      showToast(result.error || "Failed to remove physical book", "error");
    }
  };

  const handleAddPhysicalBook = async (bookId: number) => {
    if (!selectedBook) return;

    try {
      const result = await addPhysicalBook(bookId, selectedBook.totalCopies, selectedBook.availableCopies);
      
      if (result.success && result.physicalBookId) {
        const updatedBook: Book = { 
          ...selectedBook, 
          totalCopies: result.totalCopies!, 
          availableCopies: result.availableCopies! 
        };
        // setBooks(books.map(book => book.id === bookId ? updatedBook : book));
        setIsUpdateDialogOpen(false);
        showToast(`New physical copy created successfully! Copy ID: ${result.physicalBookId}`, "success", 6000);
      } else {
        throw new Error(result.error || "Failed to add physical book");
      }
    } catch (error) {
      console.error("Error adding physical book:", error);
      showToast(error instanceof Error ? error.message : "Failed to add physical book", "error");
    }
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    try {
      const response = await fetch(`/api/books/${selectedBook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: selectedBook.title,
          author: selectedBook.author,
          genre: selectedBook.genre,
          isbn: selectedBook.isbn,
          totalCopies: selectedBook.totalCopies,
          availableCopies: selectedBook.availableCopies,
          cover: selectedBook.cover
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update book');
      }

      // setBooks(books.map(book => 
      //   book.id === selectedBook.id ? selectedBook : book
      // ));
      
      setIsUpdateDialogOpen(false);
      showToast("Book updated successfully", "success");
    } catch (error) {
      console.error('Update error:', error);
      showToast(error instanceof Error ? error.message : "Failed to update book", "error");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedBook) return;

    const { name, value } = e.target;
    setSelectedBook({
      ...selectedBook,
      [name]: name === 'totalCopies' || name === 'availableCopies' 
        ? parseInt(value) 
        : value
    });
  };

  const handleImageSuccess = (res: { filePath: string }) => {
    if (!selectedBook) return;
    setSelectedBook({
      ...selectedBook,
      cover: res.filePath
    });
    showToast("Cover image updated successfully!", "success");
  };

  const handleImageError = (err: any) => {
    console.error("Upload error:", err);
    showToast("Failed to upload cover image. Please try again.", "error");
  };

  return (
    <div className="w-full mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Books</h2>
        <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
            </DialogHeader>
            <ImageUpload />
          </DialogContent>
        </Dialog>
          <Button variant="outline" onClick={() => { setSortField("id"); setSortDirection("desc"); }}>
            Newest First
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cover</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("title")}>
                Title
                {sortField === "title" && (
                  sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("author")}>
                Author
                {sortField === "author" && (
                  sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("genre")}>
                Genre
                {sortField === "genre" && (
                  sortDirection === "asc" ? <ArrowUp className="ml-2 h-4" /> : <ArrowDown className="ml-2 h-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("totalCopies")}>
                Total Copies
                {sortField === "totalCopies" && (
                  sortDirection === "asc" ? <ArrowUp className="ml-2 h-4" /> : <ArrowDown className="ml-2 h-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("availableCopies")}>
                Available Copies
                {sortField === "availableCopies" && (
                  sortDirection === "asc" ? <ArrowUp className="ml-2 h-4" /> : <ArrowDown className="ml-2 h-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedBooks.map((book) => (
            <TableRow 
              key={book.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/book/${book.id}`)}
            >
              <TableCell>
                <BookCover cover={book.cover} title={book.title} />
              </TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genre}</TableCell>
              <TableCell>{book.totalCopies}</TableCell>
              <TableCell>{book.availableCopies}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={(e) => {
                  e.stopPropagation();
                  handleUpdate(book);
                }}>
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Book: {selectedBook?.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateBook} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={selectedBook?.title || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  value={selectedBook?.author || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  name="genre"
                  value={selectedBook?.genre || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={selectedBook?.isbn || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalCopies">Total Copies</Label>
                <Input
                  id="totalCopies"
                  name="totalCopies"
                  type="number"
                  min="0"
                  value={selectedBook?.totalCopies || 0}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availableCopies">Available Copies</Label>
                <Input
                  id="availableCopies"
                  name="availableCopies"
                  type="number"
                  min="0"
                  max={selectedBook?.totalCopies || 0}
                  value={selectedBook?.availableCopies || 0}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Book Cover</Label>
                <div className="flex items-start space-x-4">
                  <div className="w-32">
                    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint}>
                      <IKImage
                        path={selectedBook?.cover || ''}
                        alt={selectedBook?.title || 'Book cover'}
                        className="rounded-lg"
                        width={200}
                        height={300}
                      />
                    </ImageKitProvider>
                  </div>
                  <div className="flex-1">
                    <div className="p-4 border-2 border-dashed rounded-lg">
                      <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
                        <p className="text-sm text-gray-500 mb-2">Upload new cover image</p>
                        <IKUpload
                          fileName="book-cover.jpg"
                          onSuccess={handleImageSuccess}
                          onError={handleImageError}
                          className="w-full"
                        />
                      </ImageKitProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => handleAddPhysicalBook(selectedBook!.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Add Copy
                </Button>
                <Button variant="destructive" onClick={() => handleDeletePhysicalBook(selectedBook!.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Copy
                </Button>
              </div>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Physical Copy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Copy to Remove</Label>
              <Select onValueChange={(value: string) => setSelectedPid(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a copy" />
                </SelectTrigger>
                <SelectContent>
                  {physicalBooks.map((book) => (
                    <SelectItem 
                      key={book.pid} 
                      value={book.pid.toString()}
                      disabled={book.borrowed}
                    >
                      Copy ID: {book.pid} {book.borrowed ? '(Currently Borrowed)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmDelete}
                disabled={!selectedPid}
              >
                Remove Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Pagination totalPages={totalPages} currentPage={currentPage} baseUrl="/admin/allbooks" className="flex justify-center mt-4" />
    </div>
  );
};

export default BooksTable;