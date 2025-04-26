"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ClientRefresher = () => {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh(); // triggers a server-side re-render
    }, 5000); // adjust interval as needed

    return () => clearInterval(interval);
  }, [router]);

  return null; // invisible component
};

export default ClientRefresher;
