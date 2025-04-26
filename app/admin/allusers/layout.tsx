import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'All Users',
};

export default function AllUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 