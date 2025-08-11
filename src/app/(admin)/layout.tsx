import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | WorldSamma Shop",
    template: "%s | Admin | WorldSamma Shop",
  },
  description: "Admin dashboard for WorldSamma Shop.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
