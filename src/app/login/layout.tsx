import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | World Samma Academy Store",
  description:
    "Sign in to access your account and manage your martial arts gear and training resources.",
  openGraph: {
    title: "Login | World Samma Academy Store",
    description:
      "Join World Samma Academy Store to access exclusive martial arts gear and training resources.",
    url: "/login",
    siteName: "store.worldsamma.org",
    images: [
      {
        url: "/ownyourbrand.jpg",
        width: 1200,
        height: 630,
        alt: "World Samma Academy Store Login",
      },
    ],
    type: "website",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  );
}
