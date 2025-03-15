import "/app/globals.css";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
      <SignUp />
    </div>
  );
}
