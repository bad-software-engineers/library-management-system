import { ImageKitProvider, IKUpload, IKImage } from "imagekitio-next";
import { UploadError } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState, useRef } from "react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

if (!urlEndpoint || !publicKey) {
  throw new Error("Missing ImageKit environment variables.");
}

const authenticator = async () => {
  const res = await fetch("http://localhost:3000/api/auth");
  const data = await res.json();
  return {
    signature: data.signature,
    expire: data.expire,
    token: data.token,
  };
};

const ImageUpload = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload a book cover.");
      return;
    }

    await fetch("http://localhost:3000/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        totalCopies: parseInt(formData.totalCopies),
        availableCopies: parseInt(formData.availableCopies),
        cover: image,
      }),
    });

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
    setUploadKey(Date.now()); // reset the upload
    setUploadDone(false);
  };

  const onSuccess = (res: { filePath: string }) => {
    setImage(res.filePath);
    setUploadDone(true); // ✅ trigger success message
  };

  const onError = (err: UploadError) => {
    console.error("Upload error:", err);
  };

  const onUploadProgress = (event: ProgressEvent<XMLHttpRequestEventTarget>) => {
    if (event.lengthComputable) {
      const percent = (event.loaded / event.total) * 100;
      setProgress(percent);
    }
  };

  return (
    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <input type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} required />
        <input type="text" name="genre" placeholder="Genre" value={formData.genre} onChange={handleChange} required />
        <input type="number" name="totalCopies" placeholder="Total Copies" value={formData.totalCopies} onChange={handleChange} required />
        <input type="number" name="availableCopies" placeholder="Available Copies" value={formData.availableCopies} onChange={handleChange} required />
        <input type="text" name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleChange} required />
        {/* Drag and Drop Upload Box */}
        <div
          className={`p-6 border-2 rounded-lg text-center transition ${dragging ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={() => setDragging(false)}
        >
          <p className="mb-2">Drag & Drop your book cover here, or click to upload</p>
          <IKUpload key={uploadKey} fileName="book-cover.png" onSuccess={onSuccess} onError={onError} onUploadProgress={onUploadProgress} className="cursor-pointer" />
        </div>
        {progress > 0 && progress < 100 && <p>Uploading: {progress.toFixed(0)}%</p>}
        {uploadDone && <p className="text-green-600 font-medium mt-2">✅ Image upload complete!</p>}

        {image && (
          <div className="mt-4">
            <IKImage path={image} height={200} width={150} alt="Book Cover" />
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </ImageKitProvider>
  );
};

export default ImageUpload;
