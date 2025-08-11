import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "WorldSamma Shop",
    template: "%s | WorldSamma Shop",
  },
  description: "Quality martial arts gear for every practitioner.",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
