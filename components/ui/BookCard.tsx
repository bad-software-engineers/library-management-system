import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IKImage, ImageKitProvider } from 'imagekitio-next'
import Image from 'next/image';

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;


const BookCard = ({title, author, genre, rating, total_copies, available_copies, description, cover} : Book) => {
  return (
    <section className="text-2xl flex justify-center items-center mt-5">
        <Card>
          <CardHeader className="w-75">
            <CardTitle>{title}</CardTitle>
            <CardDescription>By {author}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint}>
              <IKImage path={cover} height={200} width={150}  alt="Book"/>
            </ImageKitProvider>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 justify-start w-40 ml-0">
            <div className="flex flex-row gap-1">
              <Image src="/icons/star.svg" alt="star" width={22} height={22} />
              <p>{rating} / 5</p>
            </div>
            <div className="italic text-[#EED1AC]">{genre}</div>
          </CardFooter>
        </Card>
    </section>
  )
}

export default BookCard