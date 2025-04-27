"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import BookOverview from "@/components/ui/BookOverview";
import { handleBorrowBook, fetchBookDetails } from "./server";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Page({ params }: any) {
  const { id }: any = use(params);
  const bookId = Number(id);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [borrowed, setBorrowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookDetails, setBookDetails] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const loadBook = async () => {
      const details = await fetchBookDetails(bookId);
      if (!details) {
        router.push("/404");
      } else {
        setBookDetails(details);
      }
    };
    loadBook();
  }, [bookId, router]);

  const handleBorrow = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    const userId = user.id;
    const result = await handleBorrowBook(bookId, userId);
    setLoading(false);

    if (result.success) {
      setBorrowed(true);
    }
  };

  if (!bookDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col items-center w-full">
      <section className="flex mx-4 my-4">
        <Link href="/">
          <Button size="lg">Go Back</Button>
        </Link>
      </section>

      <BookOverview {...bookDetails} onBorrow={handleBorrow} borrowed={borrowed} loading={loading} />
    </div>
  );
}
