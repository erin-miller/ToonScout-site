import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToonScout",
  description:
    "Find and share your current Toontown Rewritten toon in Discord.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-impress text-gray-600">{children}</body>
    </html>
  );
}
