import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/user/Header";

export const metadata: Metadata = {
  title: {
    template: '%s | User Dashboard | Library Management System',
    default: 'User Dashboard | Library Management System',
  },
  description: "View your library information and transactions",
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-indigo-100/75">
        <main className="flex flex-col p-4 w-full">
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
} 