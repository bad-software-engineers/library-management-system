"use client";

import BooksTable from "./BooksTable";
import { ToastProvider } from "./ToastContext";

interface BooksTableWrapperProps {
  initialBooks: any[];
  totalPages: number;
  totalBooks: number;
  currentPage: number;
}

export default function BooksTableWrapper(props: BooksTableWrapperProps) {
  return (
    <ToastProvider>
      <BooksTable {...props} />
    </ToastProvider>
  );
} 