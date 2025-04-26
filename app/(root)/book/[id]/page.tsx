import { fetchBookById } from "@/db/crud/books.crud";
import BookOverview from "@/components/ui/BookOverview";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page({ params }: { params: { id: string } }) {
  // Ensure params is properly handled
  const { id } = await Promise.resolve(params);
  const bookId = Number(id);
  const bookDetails = await fetchBookById(bookId);

  if (!bookDetails) {
    redirect("/404");
  }

  return (
    <div className="h-full flex flex-col items-center w-full">
      <section className="flex mx-4 my-4">
        <Link href="/">
          <Button size={"lg"}>Home</Button>
        </Link>
      </section>
      <BookOverview
        title={bookDetails.title}
        author={bookDetails.author}
        genre={bookDetails.genre}
        totalCopies={bookDetails.totalCopies}
        availableCopies={bookDetails.availableCopies}
        cover={bookDetails.cover}
        isbn={bookDetails.isbn}
      />
    </div>
  );
}
