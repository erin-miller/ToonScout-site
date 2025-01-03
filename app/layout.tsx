import type { Metadata } from "next";
import { ConnectionProvider } from "./context/ConnectionContext";
import { ToonProvider } from "./context/ToonContext";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

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
        <ToonProvider>
          <ConnectionProvider>{children}</ConnectionProvider>
        </ToonProvider>
        <GoogleAnalytics gaId="G-SNDEYLE0QL" />
      </body>
    </html>
  );
}
