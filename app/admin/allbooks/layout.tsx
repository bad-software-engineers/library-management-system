import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'All Books',
};

export default function AllBooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 