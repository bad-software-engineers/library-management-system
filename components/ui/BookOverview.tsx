import { IKImage, ImageKitProvider } from 'imagekitio-next'
import React from 'react'

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

const BookOverview = ({title, author, genre, rating, total_copies, available_copies, description, cover} : Book) => {
  return (
    <section className="flex flex-col-reverse items-center justify-around gap-12 sm:gap-32 xl:flex-row xl:gap-8 mx-10 my-10 w-full">
      <div className="flex flex-col gap-5">
        <h1 className="text-5xl font-semibold text-white md:text-7xl">{title}</h1>

        <div className="mt-7 flex flex-row flex-wrap gap-4 text-xl text-light-100">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>

          <p>
            Category{" "}
            <span className="font-semibold text-light-200">{genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            {/* <Image src="/icons/star.svg" alt="star" width={22} height={22} /> */}
            <p>{rating}</p>
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-4 mt-1">
          <p className="text-xl text-light-100">
            Total Books <span>{total_copies}</span>
          </p>

          <p className="text-xl">
            Available Books 
            <span className="ml-2 font-semibold text-primary">
              {available_copies}

            </span>
          </p>
        </div>

        <p className="mt-2 text-justify text-xl text-light-100 max-w-[600px]">
          {description}
        </p>
      </div>

      <div className="relative flex bg-white justify-center">
        <div className="relative">
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint}>
            <IKImage path={cover} width={200} height={300} alt="Book"/>
          </ImageKitProvider>
        </div>
      </div>

    </section>
  )
}

export default BookOverview