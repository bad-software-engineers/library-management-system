import { ImageKitProvider, IKUpload, IKImage } from "imagekitio-next";
import { UploadError } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

if (!urlEndpoint || !publicKey) {
  throw new Error("Missing ImageKit environment variables.");
}
const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    } else {
      throw new Error("Authentication request failed due to an unknown error.");
    }
  }
};

const ImageUpload = () => {
  const [image, setImage] = useState("");

  const onSuccess = (res: { filePath: string }) => {
    console.log(res);
    const path = res.filePath;
    console.log(path);
    setImage(path);
  };

  const onError = (err: UploadError) => {
    console.log("Error", err);
  };

  return (
    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
      <div>
        <IKUpload fileName="test-upload.png" onError={onError} onSuccess={onSuccess} />
        {image !== "" ? <IKImage path={image} height={200} width={150} alt="Book" /> : null}
      </div>
    </ImageKitProvider>
  );
};

export default ImageUpload;
