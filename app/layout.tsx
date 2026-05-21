import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  IBM_Plex_Serif,
  JetBrains_Mono,
  Mona_Sans,
} from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bookified",
  description:
    "Transform your books into AI interactive conversation. Upload PDFs, and chat with your books using voice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn(
          "h-full",
          " relative font-sans antialiased",
          ibmPlexSerif.variable,
          monaSans.variable,
          "font-mono",
          jetbrainsMono.variable,
        )}
      >
        <body className="min-h-full flex flex-col">
          <Navbar />
          <main>
            {children}
            <Toaster />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
