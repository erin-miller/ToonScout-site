import type { Metadata } from "next";
import { ConnectionProvider } from "./context/ConnectionContext";
import { ToonProvider } from "./context/ToonContext";
import ReactGA from "react-ga";
import "./globals.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "ToonScout",
  description:
    "Find and share your current Toontown Rewritten toon in Discord.",
};

ReactGA.initialize("G-SNDEYLE0QL");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const trackPageview = (url: string) => {
      ReactGA.pageview(url);
    };

    // Track the initial page load
    trackPageview(window.location.pathname);

    // Track subsequent route changes
    router.events.on("routeChangeComplete", trackPageview);
    return () => {
      router.events.off("routeChangeComplete", trackPageview);
    };
  }, [router.events]);

  return (
    <html lang="en" className="transition-all ease-in-out duration-500">
      <body className="font-impress text-gray-800 dark:text-gray-100">
        <ToonProvider>
          <ConnectionProvider>{children}</ConnectionProvider>
        </ToonProvider>
      </body>
    </html>
  );
}
