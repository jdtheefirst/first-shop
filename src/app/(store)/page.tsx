// app/(store)/page.tsx
import { permanentRedirect } from "next/navigation";

export default function StorePage() {
  permanentRedirect("/");
}
