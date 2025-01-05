import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Providers from "./components/Providers";

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
    <html lang="en" className="transition-all ease-in-out duration-500">
      <body className="font-impress text-gray-800 dark:text-gray-100">
        <Providers>{children}</Providers>
        <GoogleAnalytics gaId="G-SNDEYLE0QL" />
      </body>
    </html>
  );
}
