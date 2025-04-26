import { fetchBooksByQuery } from "@/db/crud/books.crud";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 12;

  try {
    const result = await fetchBooksByQuery(query, page, pageSize);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in search-books API:", error);
    return NextResponse.json({ 
      books: [], 
      totalPages: 0, 
      currentPage: page, 
      totalBooks: 0 
    }, { status: 500 });
  }
}
