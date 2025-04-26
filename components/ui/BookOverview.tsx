"use client";

import { IKImage, ImageKitProvider } from "imagekitio-next";
import Image from "next/image";
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
}: {
  title: string;
  author: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  cover: string;
  isbn: string;
}) => {
  return (
    <section className="flex flex-col-reverse items-center justify-around gap-12 sm:gap-32 xl:flex-row xl:gap-8 mx-10 my-10 w-full">
      <div className="flex flex-col gap-5">
        <h1 className="text-5xl font-semibold text-black dark:text-white md:text-7xl">{title}</h1>

        <div className="mt-7 flex flex-row flex-wrap gap-4 text-xl text-light-100">
          <p>
            By <span className="font-semibold text-[#EED1AC]">{author}</span>
          </p>

          <p>
            Category <span className="font-semibold text-[#EED1AC]">{genre}</span>
          </p>
        </div>

        <div className="flex flex-row flex-wrap gap-4 mt-1">
          <p className="text-xl text-light-100">
            Total Books <span className="ml-2 font-semibold text-[#EED1AC]">{totalCopies}</span>
          </p>

          <p className="text-xl text-light-100">
            Available Books
            <span className="ml-2 font-semibold text-[#EED1AC]">{availableCopies}</span>
          </p>

          <p className="text-xl text-light-100">
            ISBN <span className="ml-2 font-semibold text-[#EED1AC]">{isbn}</span>
          </p>
        </div>
      </div>

      <div className="relative flex bg-white justify-center">
        <div className="relative">
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint}>
            <IKImage path={cover} alt="Book" width={300} height={400} />
          </ImageKitProvider>
        </div>
      </div>
    </section>
  );
};

export default BookOverview;
