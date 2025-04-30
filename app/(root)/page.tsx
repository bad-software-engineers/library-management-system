import { Suspense } from "react";
import Home from "./Home"; // move your current code to components/Home.tsx

export default function Page() {
  return (
    <Suspense fallback={<div>Loading home page...</div>}>
      <Home />
    </Suspense>
  );
}
