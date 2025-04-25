"use client";

import { ImageKitProvider, IKUpload, IKImage } from "imagekitio-next";
import { UploadError } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { validateISBN, formatISBN } from "@/utils/validation";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

if (!urlEndpoint || !publicKey) {
  throw new Error("Missing ImageKit environment variables.");
}

const authenticator = async () => {
  const res = await fetch("/api/auth");
  const data = await res.json();
  return {
    signature: data.signature,
    expire: data.expire,
    token: data.token,
  };
};

interface BookUploadProps {
  onSuccess?: () => void;
}

const ImageUpload = ({ onSuccess }: BookUploadProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    totalCopies: "",
    availableCopies: "",
    isbn: "",
  });

  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadKey, setUploadKey] = useState(Date.now());
  const [dragging, setDragging] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'isbn') {
      // Remove any non-digit characters except 'X' for ISBN-10
      const cleanValue = value.replace(/[^0-9X]/gi, '');
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!image) {
        toast.error("Please upload a book cover.");
        return;
      }

      if (!validateISBN(formData.isbn)) {
        toast.error("Please enter a valid ISBN (10 or 13 digits).");
        return;
      }

      console.log("Submitting book data:", {
        ...formData,
        totalCopies: parseInt(formData.totalCopies),
        availableCopies: parseInt(formData.availableCopies),
        cover: image,
        isbn: formatISBN(formData.isbn),
      });

      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          totalCopies: parseInt(formData.totalCopies),
          availableCopies: parseInt(formData.availableCopies),
          cover: image,
          isbn: formatISBN(formData.isbn),
        }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to add book");
      }

      toast.success("Book added successfully!");
      router.refresh();
      
      // Reset form
      setFormData({
        title: "",
        author: "",
        genre: "",
        totalCopies: "",
        availableCopies: "",
        isbn: "",
      });
      setImage("");
      setProgress(0);
      setUploadKey(Date.now());
      setUploadDone(false);

      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSuccess = (res: { filePath: string }) => {
    setImage(res.filePath);
    setUploadDone(true);
    toast.success("Image uploaded successfully!");
  };

  const handleImageError = (err: UploadError) => {
    console.error("Upload error:", err);
    toast.error("Failed to upload image. Please try again.");
  };

  const onUploadProgress = (event: ProgressEvent<XMLHttpRequestEventTarget>) => {
    if (event.lengthComputable) {
      const percent = (event.loaded / event.total) * 100;
      setProgress(percent);
    }
  };

  return (
    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="The Great Gatsby"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="F. Scott Fitzgerald"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Fiction, Classic"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="9780743273565"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total Copies</label>
            <input
              type="number"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="10"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Available Copies</label>
            <input
              type="number"
              name="availableCopies"
              value={formData.availableCopies}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="8"
              min="0"
              required
            />
          </div>
        </div>

        <div
          className={`p-6 border-2 rounded-lg text-center transition ${
            dragging ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={() => setDragging(false)}
        >
          <p className="mb-2">Drag & Drop your book cover here, or click to upload</p>
          <IKUpload
            key={uploadKey}
            fileName="book-cover.png"
            onSuccess={handleImageSuccess}
            onError={handleImageError}
            onUploadProgress={onUploadProgress}
            className="cursor-pointer"
          />
        </div>

        {progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {image && (
          <div className="mt-4 flex justify-center">
            <IKImage path={image} height={200} width={150} alt="Book Cover" />
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Book"}
          </button>
        </div>
      </form>
    </ImageKitProvider>
  );
};

export default ImageUpload;
