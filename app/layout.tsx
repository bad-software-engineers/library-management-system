import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`antialiased`}>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-black text-white py-2 px-4 rounded-xl m-2 border-2">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-white text-black py-2 px-4 rounded-xl m-2 border-2">Sign Up</button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
