import { readBooks } from "@/db/crud/books.crud";
import BooksTable from "@/components/ui/BooksTable";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: PageProps) {
  const page = searchParams?.page;
  const currentPage = typeof page === 'string' ? Number(page) : 1;
  const pageSize = 10;
  
  const { books, totalPages, totalBooks } = await readBooks(currentPage, pageSize);

  return <BooksTable 
    initialBooks={books} 
    totalPages={totalPages} 
    totalBooks={totalBooks} 
    currentPage={currentPage} 
  />;
}
