import Sidebar from "@/components/admin/Sidebar";
import "../globals.css";
import Header from "@/components/admin/Header";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage everything from here if you are admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-indigo-100/75">
          <main className="flex">
            <Sidebar />
            <div className="flex flex-col  p-4 w-full">
              <Header />
              {children}
            </div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
