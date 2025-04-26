import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";
import { unstable_ViewTransition as ViewTransition } from "react";
import HeaderWithUserInfo from "@/components/ui/HeaderWithUserInfo";
import { Toaster } from "sonner";

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
              <HeaderWithUserInfo />
              {children}
              <Toaster richColors position="bottom-right" />
            </ThemeProvider>
          </body>
        </html>
      </ViewTransition>
    </ClerkProvider>
  );
}
