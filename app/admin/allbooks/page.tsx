import { readBooks } from "@/db/crud/books.crud";
import BooksTable from "@/components/ui/BooksTable";

interface PageProps {
  searchParams: { page?: string };
}

export default async function Page({ searchParams }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 10;
  
  const { books, totalPages, totalBooks } = await readBooks(currentPage, pageSize);

  return <BooksTable 
    initialBooks={books} 
    totalPages={totalPages} 
    totalBooks={totalBooks} 
    currentPage={currentPage} 
  />;
}
