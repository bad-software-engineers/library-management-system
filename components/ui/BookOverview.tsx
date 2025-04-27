"use client";

import { IKImage, ImageKitProvider } from "imagekitio-next";
import React from "react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!;

const BookOverview = ({
  title,
  author,
  genre,
  totalCopies,
  availableCopies,
  cover,
  isbn,
  onBorrow,
  borrowed,
  loading,
}: {
  title: string;
  author: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  cover: string;
  isbn: string;
  onBorrow: () => void;
  borrowed: boolean;
  loading: boolean;
}) => {
  return (
    <section className="flex flex-col-reverse items-center justify-around gap-12 sm:gap-32 xl:flex-row xl:gap-8 mx-10 my-10 w-full max-w-7xl">
      {/* Left side: Book Info */}
      <div className="flex flex-col gap-5 max-w-[600px] min-w-[300px] w-full">
        <h1 className="text-5xl font-semibold text-black dark:text-white md:text-7xl">{title}</h1>

        <p className="text-xl text-light-100">
          By <span className="font-semibold text-[#EED1AC]">{author}</span>
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <p className="text-xl text-light-100">
            ISBN: <span className="font-semibold text-[#EED1AC]">{isbn}</span>
          </p>

          <p className="text-xl text-light-100">
            Category: <span className="font-semibold text-[#EED1AC]">{genre}</span>
          </p>

          <div className="flex flex-row flex-wrap gap-4 mt-2">
            <p className="text-xl text-light-100">
              Total Books: <span className="font-semibold text-[#EED1AC]">{totalCopies}</span>
            </p>

            <p className="text-xl text-light-100">
              Available Books: <span className="font-semibold text-[#EED1AC]">{availableCopies}</span>
            </p>
          </div>
        </div>

        {/* Borrow Button */}
        <button
          onClick={onBorrow}
          disabled={borrowed || loading}
          className="mt-6 w-[200px] px-6 py-3 bg-[#EED1AC] text-black rounded-xl text-lg hover:bg-[#dcb982] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {borrowed ? "Already Borrowed" : loading ? "Borrowing..." : "Borrow Book"}
        </button>
      </div>

      {/* Right side: Book Cover */}
      <div className="relative flex justify-center max-w-[400px] w-full">
        <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint}>
          <IKImage path={cover} alt="Book" width={300} height={400} />
        </ImageKitProvider>
      </div>
    </section>
  );
};

export default BookOverview;
