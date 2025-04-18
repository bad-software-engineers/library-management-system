import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/dark-toggle";
import Link from "next/link";
import { dark } from "@clerk/themes";
import { unstable_ViewTransition as ViewTransition } from "react";
import HeaderWithUserInfo from "@/components/ui/HeaderWithUserInfo";

export const metadata: Metadata = {
  title: "LMS",
  description: "Library Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,

        layout: {
          shimmer: true,
          animations: true,
        },

        variables: {
          colorBackground: "#020618",
        },
      }}
    >
      <ViewTransition>
        <html lang="en" suppressHydrationWarning={true}>
          <body cz-shortcut-listen="true">
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <HeaderWithUserInfo/>
              {children}
            </ThemeProvider>
          </body>
        </html>
      </ViewTransition>
    </ClerkProvider>
  );
}
