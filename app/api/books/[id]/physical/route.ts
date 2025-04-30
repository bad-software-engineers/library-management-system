import { NextRequest, NextResponse } from "next/server";
import { readPhysicalBooks } from "@/db/crud/books.crud";
import type { NextApiRequest } from "next";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    const physicalBooks = await readPhysicalBooks(bookId);
    return NextResponse.json(physicalBooks);
  } catch (error) {
    console.error("Error fetching physical books:", error);
    return NextResponse.json({ error: "Failed to fetch physical books" }, { status: 500 });
  }
}
