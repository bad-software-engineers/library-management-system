// app/api/books/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createBooks } from "@/db/crud/books.crud";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received request body:", body);
    
    const { title, author, genre, totalCopies, availableCopies, cover, isbn } = body;

    // Validate required fields
    if (!title || !author || !genre || !isbn || !cover) {
      console.log("Missing required fields:", { title, author, genre, isbn, cover });
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate numbers
    if (isNaN(totalCopies) || isNaN(availableCopies)) {
      console.log("Invalid number of copies:", { totalCopies, availableCopies });
      return NextResponse.json(
        { success: false, message: "Invalid number of copies" },
        { status: 400 }
      );
    }

    // Validate available copies is not greater than total copies
    if (availableCopies > totalCopies) {
      console.log("Available copies greater than total:", { availableCopies, totalCopies });
      return NextResponse.json(
        { success: false, message: "Available copies cannot be greater than total copies" },
        { status: 400 }
      );
    }

    console.log("Creating book with data:", { isbn, title, author, genre, totalCopies, availableCopies, cover });
    const res = await createBooks(isbn, title, author, genre, totalCopies, availableCopies, cover);
    console.log("Book creation response:", res);
    
    if (!res) {
      throw new Error("Failed to create book");
    }

    return NextResponse.json({ success: true, message: "Book created successfully" });
  } catch (error) {
    console.error("Failed to create book:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to create book" },
      { status: 500 }
    );
  }
}
