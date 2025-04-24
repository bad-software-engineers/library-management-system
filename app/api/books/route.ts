// app/api/books/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createBooks } from "@/db/crud/books.crud";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, author, genre, totalCopies, availableCopies, cover, isbn } = body;

  try {
    const res = await createBooks(isbn, title, author, genre, totalCopies, availableCopies, cover);
    console.log(res);
    return NextResponse.json({ success: true, res });
  } catch (error) {
    console.error("Failed to create book:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
