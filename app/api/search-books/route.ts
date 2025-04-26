import { fetchBooksByQuery } from "@/db/crud/books.crud";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  const books = await fetchBooksByQuery(query);

  return NextResponse.json(books);
}
