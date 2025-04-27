import { NextResponse } from "next/server";
import { updateBook } from "@/db/crud/books.crud";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const bookId = parseInt(id);
    if (isNaN(bookId)) {
      return NextResponse.json(
        { error: "Invalid book ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, author, genre, isbn, totalCopies, availableCopies, cover } = body;
    
    await updateBook(
      bookId,
      title,
      author,
      genre,
      isbn,
      totalCopies,
      availableCopies,
      cover
    );
    
    return NextResponse.json({ message: "Book updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
} 