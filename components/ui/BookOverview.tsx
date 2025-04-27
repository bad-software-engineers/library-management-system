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
    <section className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start gap-12">
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="relative max-w-[250px]">
            <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint}>
              <IKImage 
                path={cover} 
                alt={title} 
                width={250} 
                height={375}
                className="rounded-lg shadow-lg"
              />
            </ImageKitProvider>
          </div>
        </div>
        
        <div className="w-full md:w-2/3 space-y-6">
          <h1 className="text-5xl font-semibold text-gray-900 dark:text-white">{title}</h1>

          <p className="text-xl text-gray-800 dark:text-gray-100">
            By <span className="font-semibold text-amber-700 dark:text-[#EED1AC]">{author}</span>
          </p>

          <div className="space-y-4">
            <p className="text-xl text-gray-800 dark:text-gray-100">
              ISBN: <span className="font-semibold text-amber-700 dark:text-[#EED1AC]">{isbn}</span>
          </p>
            
            <p className="text-xl text-gray-800 dark:text-gray-100">
              Category: <span className="font-semibold text-amber-700 dark:text-[#EED1AC]">{genre}</span>
          </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <p className="text-xl text-gray-800 dark:text-gray-100">
                Total Books: <span className="font-semibold text-amber-700 dark:text-[#EED1AC]">{totalCopies}</span>
          </p>

              <p className="text-xl text-gray-800 dark:text-gray-100">
                Available Books: <span className="font-semibold text-amber-700 dark:text-[#EED1AC]">{availableCopies}</span>
          </p>
        </div>
      </div>
        </div>
      </div>
    </section>
  );
};

export default BookOverview;
