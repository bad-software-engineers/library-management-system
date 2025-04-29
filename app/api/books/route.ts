import { NextResponse } from "next/server";
import { readBooks } from "@/db/crud/books.crud";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const sort = searchParams.get("sort") || "title";
    const order = searchParams.get("order") || "asc";
    const search = searchParams.get("search") || "";

    const response = await readBooks(page, pageSize, sort, order, search);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
} 