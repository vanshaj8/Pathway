import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Public_Sans } from "next/font/google";
import "./globals.css";
import "@/styles/trail.css";

const publicSans = Public_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-data",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pathway — Your path to mastery",
  description:
    "Turn goals into repeatable journeys. Track every attempt, compare your past paths, and master any skill.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
